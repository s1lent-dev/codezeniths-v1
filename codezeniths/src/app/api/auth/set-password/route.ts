import { NextResponse } from 'next/server';
import { resolveSession } from '@/lib/auth/auth.service';
import { prisma } from '@/lib/db/prisma.client';
import { hashPassword } from 'better-auth/crypto';
import crypto from 'node:crypto';

export async function GET(request: Request) {
    const session = await resolveSession(request.headers);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const account = await prisma.account.findFirst({
        where: {
            userId: session.user.id,
            providerId: 'credential',
        },
    });
    return NextResponse.json({ hasPassword: !!account });
}

export async function POST(request: Request) {
    const session = await resolveSession(request.headers);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const body = await request.json();
        const { password } = body;
        if (!password || password.length < 8) {
            return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
        }

        const existingAccount = await prisma.account.findFirst({
            where: {
                userId: session.user.id,
                providerId: 'credential',
            },
        });

        if (existingAccount) {
            return NextResponse.json({ error: 'Password is already set' }, { status: 400 });
        }

        const hashedPassword = await hashPassword(password);
        await prisma.account.create({
            data: {
                id: crypto.randomUUID(),
                accountId: session.user.id,
                providerId: 'credential',
                userId: session.user.id,
                password: hashedPassword,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
    }
}
