import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb, verifyIdToken } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function PATCH(req: NextRequest, { params }: { params: { orgId: string, projectId: string, taskId: string } }) {
    const { orgId, projectId, taskId } = params;
    const db = getAdminDb();
    
    const authorization = req.headers.get('Authorization');
    const idToken = authorization?.split('Bearer ')[1];

    if (!db || !idToken) {
        return NextResponse.json({ error: 'Firebase Admin not configured or user not authenticated' }, { status: 500 });
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

        const taskRef = db.doc(`orgs/${orgId}/projects/${projectId}/tasks/${taskId}`);
        
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
