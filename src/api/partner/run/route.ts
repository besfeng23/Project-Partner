import { NextRequest, NextResponse } from 'next/server';
import { suggestNextAction } from '@/ai/flows/ai-suggests-next-action';
import { type SuggestNextActionOutput } from '@/ai/schemas';
import { adminDb, adminAuth } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

async function getProjectData(orgId: string, projectId: string, threadId: string) {
    const projectPath = `orgs/${orgId}/projects/${projectId}`;
    
    const [
        summariesSnap,
        constraintsSnap,
        tasksSnap,
        decisionsSnap,
        artifactsSnap,
        messagesSnap
    ] = await Promise.all([
        adminDb.collection(`${projectPath}/memorySummaries`).orderBy('createdAt', 'desc').limit(5).get(),
        adminDb.collection(`${projectPath}/constraints`).orderBy('createdAt', 'desc').limit(20).get(),
        adminDb.collection(`${projectPath}/tasks`).orderBy('priority').limit(50).get(),
        adminDb.collection(`${projectPath}/decisions`).orderBy('createdAt', 'desc').limit(20).get(),
        adminDb.collection(`${projectPath}/artifacts`).orderBy('createdAt', 'desc').limit(20).get(),
        adminDb.collection(`${projectPath}/chatThreads/${threadId}/messages`).orderBy('createdAt', 'desc').limit(10).get()
    ]);
    
    const latestSummaries = summariesSnap.docs.map(doc => doc.data().summaryText).join('\n---\n');
    const constraints = constraintsSnap.docs.map(doc => doc.data().text).join('\n');
    const tasks = tasksSnap.docs.map(doc => JSON.stringify(doc.data())).join('\n');
    const decisions = decisionsSnap.docs.map(doc => JSON.stringify(doc.data())).join('\n');
    const artifacts = artifactsSnap.docs.map(doc => JSON.stringify(doc.data())).join('\n');
    const recentChatMessages = messagesSnap.docs.reverse().map(doc => `${doc.data().role}: ${doc.data().content}`).join('\n');
    
    return { latestSummaries, constraints, tasks, decisions, artifacts, recentChatMessages };
}

async function persistAiOutput(orgId: string, projectId: string, result: SuggestNextActionOutput, source: 'ai' | 'human') {
    const batch = adminDb.batch();
    const projectPath = `orgs/${orgId}/projects/${projectId}`;

    result.tasksToCreate?.forEach(task => {
        const newTaskRef = adminDb.collection(`${projectPath}/tasks`).doc();
        batch.set(newTaskRef, {
            ...task,
            status: 'backlog',
            source,
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
        });
    });

    result.decisionsToLog?.forEach(decision => {
        const newDecisionRef = adminDb.collection(`${projectPath}/decisions`).doc();
        batch.set(newDecisionRef, {
            ...decision,
            source,
            createdAt: FieldValue.serverTimestamp(),
        });
    });

    result.constraintsToAdd?.forEach(constraint => {
        const newConstraintRef = adminDb.collection(`${projectPath}/constraints`).doc();
        batch.set(newConstraintRef, {
            ...constraint,
            source,
            createdAt: FieldValue.serverTimestamp(),
        });
    });

    if (batch.isEmpty) return;
    await batch.commit();
}


export async function POST(req: NextRequest) {
    try {
        const { orgId, projectId, threadId, mode, userMessage } = await req.json();

        if (!orgId || !projectId || !threadId || !mode || !userMessage) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const authorization = req.headers.get('Authorization');
        if (!authorization?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const idToken = authorization.split('Bearer ')[1];
        
        let decodedToken;
        try {
          decodedToken = await adminAuth.verifyIdToken(idToken);
        } catch (error) {
           return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }
        
        const uid = decodedToken.uid;
        
        const userDoc = await adminDb.doc(`orgs/${orgId}/users/${uid}`).get();
        if (!userDoc.exists || !['admin', 'member'].includes(userDoc.data()?.role)) {
             return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Add user message to chat
        await adminDb.collection(`orgs/${orgId}/projects/${projectId}/chatThreads/${threadId}/messages`).add({
            role: 'user',
            content: userMessage,
            createdAt: FieldValue.serverTimestamp(),
            writtenToMemory: false,
        });

        const projectData = await getProjectData(orgId, projectId, threadId);

        const aiInput = {
            orgId,
            projectId,
            threadId,
            mode,
            userMessage,
            ...projectData,
        };

        const result = await suggestNextAction(aiInput);

        await persistAiOutput(orgId, projectId, result, 'ai');

        // Add AI message to chat
        const aiMessageRef = adminDb.collection(`orgs/${orgId}/projects/${projectId}/chatThreads/${threadId}/messages`).doc();
        await aiMessageRef.set({
            role: 'assistant',
            content: result.shortReply,
            createdAt: FieldValue.serverTimestamp(),
            writtenToMemory: false,
        });

        // Audit event
        await adminDb.collection(`orgs/${orgId}/projects/${projectId}/audit`).add({
            eventType: 'ai_partner_run',
            payload: { userId: uid, mode, userMessage },
            createdAt: FieldValue.serverTimestamp(),
        });

        // Update project health
        await adminDb.doc(`orgs/${orgId}/projects/${projectId}`).update({
            'health.lastAiRunAt': FieldValue.serverTimestamp(),
        });

        return NextResponse.json({ ...result, id: aiMessageRef.id, createdAt: new Date().toISOString() });
    } catch (error: any) {
        console.error('API Error in /api/partner/run:', error);
        return NextResponse.json({ error: error.message || 'An unexpected error occurred.' }, { status: 500 });
    }
}
