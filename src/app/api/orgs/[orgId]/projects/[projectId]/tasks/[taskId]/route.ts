import { NextRequest, NextResponse } from 'next/server';
import { adminDb, verifyIdToken } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function PATCH(req: NextRequest, { params }: { params: { orgId: string, projectId: string, taskId: string } }) {
    const { orgId, projectId, taskId } = params;
    
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
        const updates = await req.json();

        // Prevent changing immutable fields
        delete updates.id;
        delete updates.createdAt;
        delete updates.createdByUid;
        delete updates.source;

        const taskRef = adminDb.doc(`orgs/${orgId}/projects/${projectId}/tasks/${taskId}`);
        
        const validUpdates = {
            ...updates,
            updatedAt: FieldValue.serverTimestamp()
        };

        await taskRef.update(validUpdates);

        return NextResponse.json({ message: 'Task updated successfully', id: taskId, updates: validUpdates });

    } catch (error: any) {
        console.error(`Error updating task ${taskId} for project ${projectId}:`, error);
        return NextResponse.json({ error: error.message || 'An unexpected error occurred.' }, { status: 500 });
    }
}
