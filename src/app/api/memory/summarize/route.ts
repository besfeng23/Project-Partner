import { NextRequest, NextResponse } from 'next/server';
import { aiSummarizesProjectChat } from '@/ai/flows/ai-summarizes-project-chat';
import { getAdminAuth, getAdminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(req: NextRequest) {
    const adminDb = getAdminDb();
    const adminAuth = getAdminAuth();

    if (!adminDb || !adminAuth) {
        return NextResponse.json({ error: 'Firebase Admin not configured' }, { status: 500 });
    }

    try {
        const { orgId, projectId, threadId } = await req.json();

        if (!orgId || !projectId || !threadId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const authorization = req.headers.get('Authorization');
        if (!authorization?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const idToken = authorization.split('Bearer ')[1];
        
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        const uid = decodedToken.uid;
        
        // This check is not secure and should be replaced with Firestore security rules
        // For now, we'll assume if they have a valid token, they have access.
        // In a real app, you would check `orgs/{orgId}/members/{uid}`

        // Fetch messages that haven't been written to memory
        const messagesToSummarizeSnap = await adminDb
            .collection(`orgs/${orgId}/projects/${projectId}/chatThreads/${threadId}/messages`)
            .where('writtenToMemory', '==', false)
            .orderBy('createdAt')
            .get();

        if (messagesToSummarizeSnap.empty) {
            return NextResponse.json({ message: 'No new messages to summarize.' });
        }

        const messages = messagesToSummarizeSnap.docs.map(doc => ({
            messageId: doc.id,
            content: doc.data().content,
        }));

        const result = await aiSummarizesProjectChat({
            orgId,
            projectId,
            threadId,
            messages
        });

        // Persist summary and update messages
        const batch = adminDb.batch();

        const summaryRef = adminDb.collection(`orgs/${orgId}/projects/${projectId}/memorySummaries`).doc();
        batch.set(summaryRef, {
            summaryText: result.summaryText,
            sourceMessageIds: result.messageIds,
            scope: 'thread',
            createdAt: FieldValue.serverTimestamp(),
        });
        
        result.messageIds.forEach(messageId => {
            const msgRef = adminDb.doc(`orgs/${orgId}/projects/${projectId}/chatThreads/${threadId}/messages/${messageId}`);
            batch.update(msgRef, { writtenToMemory: true });
        });
        
        await batch.commit();

        // Audit event
        await adminDb.collection(`orgs/${orgId}/projects/${projectId}/audit`).add({
            eventType: 'memory_summarize',
            payload: { userId: uid, threadId, summarizedMessageCount: result.messageIds.length },
            createdAt: FieldValue.serverTimestamp(),
        });

        return NextResponse.json({ success: true, summaryId: summaryRef.id });

    } catch (error: any) {
        console.error('API Error in /api/memory/summarize:', error);
        if (error.code === 'auth/id-token-expired' || error.code === 'auth/argument-error') {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }
        return NextResponse.json({ error: error.message || 'An unexpected error occurred.' }, { status: 500 });
    }
}
