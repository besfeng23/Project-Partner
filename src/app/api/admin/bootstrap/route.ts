import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb, getAdminAuth, verifyIdToken } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

const ORG_ID = 'default';

export async function POST(req: NextRequest) {
    const adminDb = getAdminDb();
    const adminAuth = getAdminAuth();

    try {
        const authorization = req.headers.get('Authorization');
        if (!authorization?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
        }
        const idToken = authorization.split('Bearer ')[1];
        
        const decodedToken = await verifyIdToken(idToken);
        const uid = decodedToken.uid;
        
        const orgRef = adminDb.doc(`orgs/${ORG_ID}`);
        const memberRef = adminDb.doc(`orgs/${ORG_ID}/members/${uid}`);
        
        const batch = adminDb.batch();
        let role = 'admin';

        // 1. Ensure the default organization exists
        batch.set(orgRef, { name: 'Default Organization', createdAt: FieldValue.serverTimestamp() }, { merge: true });

        // 2. Ensure the user is a member of the organization
        const memberDoc = await memberRef.get();
        if (!memberDoc.exists) {
            batch.set(memberRef, {
                role: 'admin', // First user is always admin
                createdAt: FieldValue.serverTimestamp(),
            });
        } else {
            role = memberDoc.data()?.role || 'viewer';
        }

        await batch.commit();

        return NextResponse.json({ ok: true, orgId: ORG_ID, role: role });

    } catch (error: any) {
        console.error('API Error in /api/admin/bootstrap:', error);
        if (error.message === 'Invalid or expired token.') {
            return NextResponse.json({ error: error.message }, { status: 401 });
        }
        return NextResponse.json({ error: error.message || 'An unexpected error occurred.' }, { status: 500 });
    }
}
