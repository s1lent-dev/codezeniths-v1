import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TRPCError } from '@trpc/server';

const { mockPrisma, mockRedisService, mockStorageService } = vi.hoisted(() => {
    const mockPrisma = {
        user: {
            findFirst: vi.fn(),
            findUnique: vi.fn(),
            count: vi.fn(),
        },
        userFollow: {
            count: vi.fn(),
            findUnique: vi.fn(),
        },
        userGlobalStats: {
            findUnique: vi.fn(),
            count: vi.fn(),
        },
        $transaction: vi.fn(),
    };

    const mockRedisService = {
        sortedList: {
            getRevRank: vi.fn(),
        },
        client: {
            set: vi.fn(),
            del: vi.fn(),
        },
        cache: {
            createStore: vi.fn().mockReturnValue({
                get: vi.fn().mockResolvedValue(null),
                set: vi.fn().mockResolvedValue(true),
            }),
        },
        lock: {
            acquire: vi.fn().mockResolvedValue('lock-token'),
            release: vi.fn().mockResolvedValue(true),
        },
    };

    const mockStorageService = {
        download: vi.fn(),
        getPresignedDownloadUrl: vi.fn(),
        exists: vi.fn(),
    };

    return { mockPrisma, mockRedisService, mockStorageService };
});

vi.mock('@codezeniths/lib/db/prisma.client', () => ({
    prisma: mockPrisma,
}));

vi.mock('@/lib/db/prisma.client', () => ({
    prisma: mockPrisma,
}));

vi.mock('@codezeniths/lib/redis', () => ({
    redisService: mockRedisService,
}));

vi.mock('@/lib/redis', () => ({
    redisService: mockRedisService,
}));

vi.mock('@/service/storage', () => ({
    storageService: mockStorageService,
}));

vi.mock('@codezeniths/service/storage', () => ({
    storageService: mockStorageService,
}));

vi.mock('@/lib/mq', () => ({
    socialProducer: { emit: vi.fn() },
    searchProducer: { emit: vi.fn() },
}));

vi.mock('@/lib/mq/producers/auth.producer', () => ({
    authProducer: { emit: vi.fn() },
}));

vi.mock('@codezeniths/service/resume-extractor', () => ({
    extractTextFromPdf: vi.fn(),
    extractSkillsWithAI: vi.fn(),
    matchSkillsWithDatabase: vi.fn(),
}));

vi.mock('@/service/logging', () => ({
    logger: {
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
        debug: vi.fn(),
    },
}));

vi.mock('@codezeniths/service/logging', () => ({
    logger: {
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
        debug: vi.fn(),
    },
}));

import { UserController } from '../user.controller';
import { userQueries } from '@/lib/db/queries/user.queries';
import { TRPCContext } from '../../trpc/trpc.context';

describe('User Authorization & Privacy Guards', () => {
    let controller: UserController;

    const userAId = '018f3a5b-0001-7000-8000-000000000001';
    const userBId = '018f3a5b-0002-7000-8000-000000000002';

    beforeEach(() => {
        vi.clearAllMocks();
        controller = new UserController();
    });

    const createMockCtx = (userId?: string, queryOverrides: any = {}): TRPCContext => {
        return {
            user: userId
                ? {
                      id: userId,
                      email: `${userId}@example.com`,
                      name: `User ${userId}`,
                      role: 'user',
                      emailVerified: true,
                      createdAt: new Date(),
                      updatedAt: new Date(),
                  }
                : null,
            session: null,
            queries: {
                user: {
                    getUserProfile: vi.fn().mockResolvedValue({
                        id: userId,
                        name: 'Test User',
                        image: null,
                        resume: null,
                        emailVerified: true,
                        phoneNumberVerified: false,
                    }),
                    getUserPreferences: vi.fn().mockResolvedValue({
                        profileVisibility: 'public',
                    }),
                    getUserSocials: vi.fn().mockResolvedValue({}),
                    getUserProfileDetails: vi.fn(),
                    ...queryOverrides,
                },
            },
            controllers: {} as any,
            headers: new Headers(),
            prisma: mockPrisma as any,
        } as unknown as TRPCContext;
    };

    describe('getUserSettings IDOR Guard', () => {
        it('throws FORBIDDEN when User A requests User B settings (via getSettings)', async () => {
            const ctx = createMockCtx(userAId);

            await expect(
                controller.getSettings({
                    ctx,
                    input: { userId: userBId },
                })
            ).rejects.toThrowError(
                expect.objectContaining({
                    code: 'FORBIDDEN',
                    message: 'You are not authorized to view settings for another account',
                })
            );
        });

        it('throws FORBIDDEN when User A requests User B settings (via getUserSettings)', async () => {
            const ctx = createMockCtx(userAId);

            await expect(
                controller.getUserSettings({
                    ctx,
                    input: { userId: userBId },
                })
            ).rejects.toThrowError(
                expect.objectContaining({
                    code: 'FORBIDDEN',
                    message: 'You are not authorized to view settings for another account',
                })
            );
        });

        it('allows caller to view their own settings when input.userId matches ctx.user.id', async () => {
            const ctx = createMockCtx(userAId);

            const result = await controller.getSettings({
                ctx,
                input: { userId: userAId },
            });

            expect(result).toBeDefined();
            expect(result.preferences).toBeDefined();
        });

        it('defaults to ctx.user.id when input.userId is omitted', async () => {
            const ctx = createMockCtx(userAId);

            const result = await controller.getSettings({
                ctx,
                input: {},
            });

            expect(result).toBeDefined();
            expect(result.preferences).toBeDefined();
        });

        it('throws UNAUTHORIZED when no user is logged in', async () => {
            const ctx = createMockCtx(undefined);

            await expect(
                controller.getSettings({
                    ctx,
                    input: {},
                })
            ).rejects.toThrowError(
                expect.objectContaining({
                    code: 'UNAUTHORIZED',
                })
            );
        });
    });

    describe('extractResumeSkills IDOR Guard', () => {
        it('throws FORBIDDEN when User A provides an R2 storage key belonging to User B (media prefix)', async () => {
            const ctx = createMockCtx(userAId);

            await expect(
                controller.extractResumeSkills({
                    ctx,
                    input: {
                        resumeKey: `media/${userBId}/resume.pdf`,
                    },
                })
            ).rejects.toThrowError(
                expect.objectContaining({
                    code: 'FORBIDDEN',
                    message: 'You are not authorized to process documents belonging to another user',
                })
            );
        });

        it('throws FORBIDDEN when User A provides an R2 storage key belonging to User B (resumes prefix)', async () => {
            const ctx = createMockCtx(userAId);

            await expect(
                controller.extractResumeSkills({
                    ctx,
                    input: {
                        resumeKey: `resumes/${userBId}/my-resume.pdf`,
                    },
                })
            ).rejects.toThrowError(
                expect.objectContaining({
                    code: 'FORBIDDEN',
                    message: 'You are not authorized to process documents belonging to another user',
                })
            );
        });

        it('throws UNAUTHORIZED when caller is unauthenticated', async () => {
            const ctx = createMockCtx(undefined);

            await expect(
                controller.extractResumeSkills({
                    ctx,
                    input: {
                        resumeKey: `media/${userAId}/resume.pdf`,
                    },
                })
            ).rejects.toThrowError(
                expect.objectContaining({
                    code: 'UNAUTHORIZED',
                })
            );
        });
    });

    describe('getUserProfileDetails PII Masking', () => {
        const mockTargetUser = {
            id: userBId,
            name: 'Alice Public',
            firstName: 'Alice',
            lastName: 'Smith',
            username: 'alicesmith',
            email: 'alice@private.com',
            emailVerified: true,
            phoneNumber: '+1234567890',
            phoneNumberVerified: true,
            image: 'media/alice/avatar.png',
            resume: 'media/alice/resume.pdf',
            dob: new Date('1995-05-15'),
            about: 'Software Engineer',
            location: 'San Francisco, CA',
            gender: 'female',
            userType: 'working_professional',
            experienceLevel: 'mid_career',
            createdAt: new Date('2024-01-01'),
            socialLinks: {
                github: 'https://github.com/alice',
                linkedin: 'https://linkedin.com/in/alice',
                twitter: null,
                website: null,
            },
            preferences: {
                profileVisibility: 'public',
            },
            userSkills: [],
        };

        beforeEach(() => {
            mockPrisma.user.findFirst.mockResolvedValue(mockTargetUser);
            mockPrisma.userFollow.count.mockResolvedValue(10);
            mockPrisma.userFollow.findUnique.mockResolvedValue(null);
            mockPrisma.userGlobalStats.findUnique.mockResolvedValue({ score: 50 });
            mockPrisma.userGlobalStats.count.mockResolvedValue(2);
            mockRedisService.sortedList.getRevRank.mockResolvedValue(1);
        });

        it('masks email, phoneNumber, dob, and resume when viewer is not the profile owner', async () => {
            const profile = await userQueries.getUserProfileDetails({
                userId: userBId,
                viewerId: userAId, // User A viewing User B's public profile
            });

            expect(profile).toBeDefined();
            // Sensitive PII must not be exposed to non-owners
            expect(profile.email).toBeUndefined();
            expect(profile.phoneNumber).toBeUndefined();
            expect(profile.dob).toBeUndefined();
            expect(profile.resume).toBeUndefined();

            // Public persona attributes must remain visible
            expect(profile.id).toBe(userBId);
            expect(profile.name).toBe('Alice Public');
            expect(profile.username).toBe('alicesmith');
            expect(profile.about).toBe('Software Engineer');
            expect(profile.image).toBe('media/alice/avatar.png');
            expect(profile.isOwnProfile).toBe(false);
        });

        it('masks email, phoneNumber, dob, and resume when viewer is an unauthenticated guest', async () => {
            const profile = await userQueries.getUserProfileDetails({
                userId: userBId,
                viewerId: undefined, // Unauthenticated guest
            });

            expect(profile).toBeDefined();
            expect(profile.email).toBeUndefined();
            expect(profile.phoneNumber).toBeUndefined();
            expect(profile.dob).toBeUndefined();
            expect(profile.resume).toBeUndefined();
            expect(profile.isOwnProfile).toBe(false);
        });

        it('preserves email, phoneNumber, dob, and resume when viewer IS the profile owner', async () => {
            const profile = await userQueries.getUserProfileDetails({
                userId: userBId,
                viewerId: userBId, // User B viewing their own profile
            });

            expect(profile).toBeDefined();
            // Owner sees their own full details
            expect(profile.email).toBe('alice@private.com');
            expect(profile.phoneNumber).toBe('+1234567890');
            expect(profile.dob).toEqual(new Date('1995-05-15'));
            expect(profile.resume).toBe('media/alice/resume.pdf');
            expect(profile.isOwnProfile).toBe(true);
        });
    });
});
