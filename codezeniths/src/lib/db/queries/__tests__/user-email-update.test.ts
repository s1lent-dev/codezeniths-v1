import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockTx, mockPrisma } = vi.hoisted(() => {
    const mockTx = {
        account: {
            updateMany: vi.fn(),
            deleteMany: vi.fn(),
        },
        user: {
            update: vi.fn(),
        },
    };

    const mockPrisma = {
        user: {
            findFirst: vi.fn(),
        },
        $transaction: vi.fn(),
    };

    return { mockTx, mockPrisma };
});

vi.mock('@codezeniths/lib/db/prisma.client', () => ({
    prisma: mockPrisma,
}));

vi.mock('@/lib/db/prisma.client', () => ({
    prisma: mockPrisma,
}));

vi.mock('@codezeniths/lib/redis', () => ({
    redisService: {},
}));

vi.mock('@/lib/mq', () => ({
    socialProducer: {},
}));

import { userQueries, updateUserEmail } from '../user.queries';

describe('updateUserEmail (Data Integrity)', () => {
    const testUserId = 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d';
    const newEmail = 'updated.user@example.com';

    beforeEach(() => {
        vi.clearAllMocks();
        mockPrisma.user.findFirst.mockResolvedValue(null);
        mockPrisma.$transaction.mockImplementation(async (callback: (tx: typeof mockTx) => Promise<any>) => {
            return callback(mockTx);
        });
        mockTx.account.updateMany.mockResolvedValue({ count: 1 });
        mockTx.account.deleteMany.mockResolvedValue({ count: 0 });
        mockTx.user.update.mockResolvedValue({
            id: testUserId,
            email: newEmail,
            emailVerified: false,
        });
    });

    it('should preserve credential account by calling updateMany instead of deleteMany', async () => {
        const result = await updateUserEmail(testUserId, newEmail);

        // Verify tx.account.updateMany is called to update credential accountId
        expect(mockTx.account.updateMany).toHaveBeenCalledTimes(1);
        expect(mockTx.account.updateMany).toHaveBeenCalledWith({
            where: {
                userId: testUserId,
                providerId: 'credential',
            },
            data: {
                accountId: newEmail,
            },
        });

        // Verify tx.account.deleteMany is NEVER called (preventing destructive password wiping)
        expect(mockTx.account.deleteMany).not.toHaveBeenCalled();

        // Verify tx.user.update updates email and resets emailVerified to false
        expect(mockTx.user.update).toHaveBeenCalledTimes(1);
        expect(mockTx.user.update).toHaveBeenCalledWith({
            where: { id: testUserId },
            data: {
                email: newEmail,
                emailVerified: false,
            },
            select: { id: true, email: true, emailVerified: true },
        });

        expect(result).toEqual({
            id: testUserId,
            email: newEmail,
            emailVerified: false,
        });
    });

    it('should work via userQueries.updateEmail payload object', async () => {
        const result = await userQueries.updateEmail({ id: testUserId, email: newEmail });

        expect(mockTx.account.updateMany).toHaveBeenCalledWith({
            where: {
                userId: testUserId,
                providerId: 'credential',
            },
            data: {
                accountId: newEmail,
            },
        });
        expect(mockTx.account.deleteMany).not.toHaveBeenCalled();
        expect(result).toEqual({
            id: testUserId,
            email: newEmail,
            emailVerified: false,
        });
    });

    it('should reject if the new email is already in use by another user', async () => {
        mockPrisma.user.findFirst.mockResolvedValue({
            id: 'other-user-id',
            email: newEmail,
        });

        await expect(updateUserEmail(testUserId, newEmail)).rejects.toThrow(
            /already in use/i
        );

        expect(mockPrisma.$transaction).not.toHaveBeenCalled();
        expect(mockTx.account.updateMany).not.toHaveBeenCalled();
    });
});
