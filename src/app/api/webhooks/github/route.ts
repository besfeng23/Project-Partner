import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const orgId = searchParams.get('orgId');
    const projectId = searchParams.get('projectId');
    
    if (!orgId || !projectId) {
        return NextResponse.json({ error: 'Missing orgId or projectId in query parameters' }, { status: 400 });
    }

    try {
        const projectRef = adminDb.doc(`orgs/${orgId}/projects/${projectId}`);
        const projectDoc = await projectRef.get();

        if (!projectDoc.exists) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }
        
        const githubSecret = projectDoc.data()?.connectors?.githubWebhookSecret;
        const body = await req.text();
        
        if (githubSecret) {
            const signature = req.headers.get('x-hub-signature-256');
            if (!signature) {
                return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
            }

            const hmac = crypto.createHmac('sha256', githubSecret);
            const digest = `sha256=${hmac.update(body).digest('hex')}`;

            if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))) {
                return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
            }
        }
        
        const payload = JSON.parse(body);
        
        const batch = adminDb.batch();

        batch.update(projectRef, {
            'health.lastWebhookAt': FieldValue.serverTimestamp(),
        });

        const auditRef = adminDb.collection(`orgs/${orgId}/projects/${projectId}/audit`).doc();
        batch.set(auditRef, {
            eventType: 'github_webhook',
            payload: {
                event: req.headers.get('x-github-event'),
                payload,
            },
            createdAt: FieldValue.serverTimestamp(),
        });

        await batch.commit();
        
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('GitHub Webhook Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
