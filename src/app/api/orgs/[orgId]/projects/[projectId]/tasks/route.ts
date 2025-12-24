import { NextRequest, NextResponse } from 'next/server';
import { adminDb, verifyIdToken } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(req: NextRequest, { params }: { params: { orgId: string, projectId: string } }) {
    const { orgId, projectId } = params;

    if (!adminDb) {
        return NextResponse.json({ error: 'Firebase Admin not configured' }, { status: 500 });
    }
    
    const authorization = req.headers.get('Authorization');
    const idToken = authorization?.split('Bearer ')[1];

    if (!idToken) {
        return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }
    
    const decodedToken = await verifyIdToken(idToken);
    if (!decodedToken) {
        return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    try {
        const { title, description, priority, acceptanceCriteria, status, blocked, blockedReason } = await req.json();

        if (!title || !priority || !status) {
            return NextResponse.json({ error: 'Missing required fields: title, priority, status' }, { status: 400 });
        }
        
        // TODO: Check user role (must be admin or member based on security rules)

        const tasksRef = adminDb.collection(`orgs/${orgId}/projects/${projectId}/tasks`);
        const newTask = {
            title,
            description: description || '',
            priority,
            status,
            acceptanceCriteria: acceptanceCriteria || [],
            blocked: blocked || false,
            blockedReason: blockedReason || '',
            source: 'human',
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
            createdByUid: decodedToken.uid,
        };

        const docRef = await tasksRef.add(newTask);

        return NextResponse.json({ id: docRef.id, ...newTask }, { status: 201 });

    } catch (error: any) {
        console.error(`Error creating task for project ${projectId} in org ${orgId}:`, error);
        return NextResponse.json({ error: error.message || 'An unexpected error occurred.' }, { status: 500 });
    }
}
