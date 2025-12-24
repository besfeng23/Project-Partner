import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const orgId = searchParams.get('orgId');
    const projectId = searchParams.get('projectId');
    
    if (!orgId || !projectId) {
        return NextResponse.json({ error: 'Missing orgId or projectId in query parameters' }, { status: 400 });
    }

    try {
        const payload = await req.json();
        
        // Vercel project ID can be in payload or meta, depending on event
        const vercelProjectIdFromPayload = payload.projectId || payload.payload?.deployment?.meta?.vercelProjectId;

        if (!vercelProjectIdFromPayload) {
             return NextResponse.json({ error: 'Vercel Project ID not found in webhook payload.' }, { status: 400 });
        }
            
        const projectRef = adminDb.doc(`orgs/${orgId}/projects/${projectId}`);
        const projectDoc = await projectRef.get();

        if (!projectDoc.exists || projectDoc.data()?.connectors?.vercelProjectId !== vercelProjectIdFromPayload) {
             return NextResponse.json({ error: 'Project not found or Vercel project ID does not match.' }, { status: 404 });
        }
        
        // We are interested in successful deployment events
        const isSuccessEvent = payload.type === 'deployment.succeeded' || payload.type === 'deployment-ready';

        const batch = adminDb.batch();

        if (isSuccessEvent) {
             batch.update(projectRef, {
                'health.lastDeployAt': FieldValue.serverTimestamp(),
                'health.lastDeployUrl': `https://${payload.payload.deployment.url}`,
            });
        }
        
        batch.update(projectRef, {
            'health.lastWebhookAt': FieldValue.serverTimestamp(),
        });

        const auditRef = adminDb.collection(`orgs/${orgId}/projects/${projectId}/audit`).doc();
        batch.set(auditRef, {
            eventType: 'vercel_webhook',
            payload,
            createdAt: FieldValue.serverTimestamp(),
        });

        await batch.commit();
        
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Vercel Webhook Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
