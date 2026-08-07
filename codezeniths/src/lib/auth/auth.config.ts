import crypto from 'node:crypto';
import { betterAuth } from 'better-auth';
import { bearer, username, customSession } from 'better-auth/plugins';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from "better-auth/next-js";
import { prisma } from '@codezeniths/lib/db/prisma.client';
import { createJoseUtils } from './auth.jwt';
import type { AuthConfig } from './auth.types';
import { authProducer } from '@/lib/mq';
import { defaultRedisClient } from '@/lib/redis';
import { createAuthRedisStorage } from './auth.redis';
import { ENV_CONFIG } from '@codezeniths/config/config';
import { formatUserProfile } from '@/utils/user.formatter';

// Plugins imports
import { emailOTP } from "better-auth/plugins/email-otp";
import { magicLink } from "better-auth/plugins/magic-link";
import { twoFactor } from "better-auth/plugins/two-factor";
import { phoneNumber } from "better-auth/plugins/phone-number";
import { captcha } from "better-auth/plugins";


export function createAuth(config: AuthConfig) {
    const database = prismaAdapter(prisma, {
        provider: 'postgresql',
    });
    const jose = config.jose ? createJoseUtils(config.jose) : null;
    const socialProviders: Record<
        string,
        {
            clientId: string;
            clientSecret: string;
            authorizationQueryParams?: Record<string, string>;
        }
    > = {};
    if (config.github?.clientId && config.github.clientSecret) {
        socialProviders['github'] = {
            clientId: config.github.clientId,
            clientSecret: config.github.clientSecret,
        };
    }
    if (config.google?.clientId && config.google.clientSecret) {
        socialProviders['google'] = {
            clientId: config.google.clientId,
            clientSecret: config.google.clientSecret,
            authorizationQueryParams: {
                prompt: "select_account",
            },
        };
    }

    const redisStorage = createAuthRedisStorage(defaultRedisClient);

    const auth = betterAuth({
        database,
        baseURL: config.baseURL,
        secret: config.secret,
        trustedOrigins: config.trustedOrigins ?? [],

        session: {
            expiresIn: config.session?.expiresIn ?? 60 * 60 * 24 * 7, 
            updateAge: config.session?.updateAge ?? 60 * 60 * 24, 
            cookieCache: {
                enabled: false,
            },
        },

        advanced: {
            database: {
                generateId: false,
            },
        },
   
        emailAndPassword: {
            enabled: true,
            requireEmailVerification: false,
            minPasswordLength: 8,
            maxPasswordLength: 128,
            sendResetPassword: async (data: { user: any; url: string; token: string }) => {
                await authProducer.sendResetPasswordEmail({
                    userId: data.user.id,
                    email: data.user.email,
                    url: data.url
                });
            },
        },

        emailVerification: {
            sendOnSignUp: true, // Set to true if verification email should be sent automatically on signup
            sendVerificationEmail: async (data: { user: any; url: string; token: string }) => {
                await authProducer.sendVerifyEmail({
                    userId: data.user.id,
                    email: data.user.email,
                    token: data.token
                });
            },
        },

        databaseHooks: {
            user: {
                create: {
                    before: async (data, ctx) => {
                        try {
                            // ctx.body has the raw request body (name/email/username from the verify call).
                            // We override the temp values that signUpOnVerification generates.
                            const body = (ctx as any)?.body;
                            const modifiedData = { ...data };
                            if (body) {
                                if (body.name) modifiedData.name = body.name;
                                if (body.email) modifiedData.email = body.email;
                                if (body.username) modifiedData.username = body.username;
                            }
                            
                            if (modifiedData.phoneNumber) {
                                modifiedData.phoneNumberVerified = false;
                            } else {
                                modifiedData.phoneNumberVerified = null;
                            }
                            
                            return { data: modifiedData };
                        } catch (err) {
                            console.error('ERROR IN DATABASE HOOK user.create.before:', err);
                            throw err;
                        }
                    },
                    after: async (user, ctx) => {
                        // Always send welcome email
                        await authProducer.sendWelcomeEmail({
                            userId: user.id,
                            email: user.email,
                            name: user.name
                        });

                        // For passwordless signups, automatically generate a credential password
                        const path: string = (ctx as any)?.path ?? '';
                        const isEmailPasswordSignup = path.includes('sign-up/email');

                        if (!isEmailPasswordSignup) {
                            try {
                                const { hashPassword } = await import('better-auth/crypto');
                                const rawPassword = crypto.randomBytes(16).toString('base64url');
                                const hashedPassword = await hashPassword(rawPassword);

                                // Create the credential Account row so user can always sign in with email/password
                                await prisma.account.create({
                                    data: {
                                        id: crypto.randomUUID(),
                                        accountId: user.id,
                                        providerId: 'credential',
                                        userId: user.id,
                                        password: hashedPassword,
                                        createdAt: new Date(),
                                        updatedAt: new Date(),
                                    },
                                });

                                // Deliver the raw password: SMS for phone OTP, email for everything else
                                const isPhoneOtp = path.includes('phone-number/verify') || !!user.phoneNumber;
                                if (isPhoneOtp && user.phoneNumber) {
                                    await authProducer.sendPasswordlessCredentialsSms({
                                        userId: user.id,
                                        phoneNumber: user.phoneNumber as string,
                                        password: rawPassword,
                                    });
                                } else {
                                    await authProducer.sendPasswordlessCredentialsEmail({
                                        userId: user.id,
                                        email: user.email,
                                        name: user.name,
                                        password: rawPassword,
                                    });
                                }
                            } catch (err) {
                                // Log but don't fail user creation
                                console.error('[AUTH] Failed to auto-generate credential password:', err);
                            }
                        }
                    }
                }
            }
        },

        accountLinking: {
            enabled: true,
            trustedProviders: ['github', 'google'],
        },

        socialProviders,

        plugins: [
            bearer(),
            username({
                minUsernameLength: 3,
                maxUsernameLength: 30,
                schema: {
                    user: {
                        fields: {
                            displayUsername: 'username',
                        },
                    },
                },
            }),
            customSession(async ({ user, session }) => {
                const formattedUser = await formatUserProfile(user);
                return {
                    user: formattedUser || user,
                    session,
                };
            }),
            twoFactor({
                otpOptions: {
                    sendOTP: async (data: { user: any; otp: string }) => {
                        if (data.user.phoneNumber) {
                            await authProducer.sendOtpSms({
                                userId: data.user.id,
                                phoneNumber: data.user.phoneNumber as string,
                                code: data.otp,
                            });
                        } else {
                            await authProducer.sendOtpEmail({
                                userId: data.user.id,
                                email: data.user.email,
                                code: data.otp,
                            });
                        }
                    }
                }
            }),
            emailOTP({

                sendVerificationOTP: async (data: {
                    email: string;
                    otp: string;
                    type: "sign-in" | "email-verification" | "forget-password" | "change-email";
                }) => {
                    const user = await prisma.user.findUnique({ where: { email: data.email } });
                    const userId = user?.id || '00000000-0000-7000-8000-000000000000';
                    
                    await authProducer.sendOtpEmail({
                        userId,
                        email: data.email,
                        code: data.otp,
                    });
                }
            }),
            magicLink({
                sendMagicLink: async (data: {
                    email: string;
                    url: string;
                    token: string;
                    metadata?: Record<string, any>;
                }) => {
                    const user = await prisma.user.findUnique({ where: { email: data.email } });
                    const userId = user?.id || '00000000-0000-7000-8000-000000000000';

                    
                    if (user?.phoneNumber && data.metadata?.delivery === 'sms') {
                        await authProducer.sendMagicLinkSms({
                            userId,
                            phoneNumber: user.phoneNumber,
                            url: data.url,
                        });
                    } else {
                        await authProducer.sendMagicLinkEmail({
                            userId,
                            email: data.email,
                            url: data.url,
                        });
                    }
                }
            }),
            phoneNumber({
                // signUpOnVerification: {
                //     // getTempEmail/getTempName are called AFTER additionalFields but their return
                //     // value OVERRIDES the body. So we read from ctx.body here to preserve user input.
                //     getTempEmail: (phoneNumber: string, ctx?: any) =>
                //         (ctx as any)?.body?.email ?? `${phoneNumber.replace('+', '')}@gmail.com`,
                //     getTempName: (phoneNumber: string, ctx?: any) =>
                //         (ctx as any)?.body?.name ?? phoneNumber,
                // },
                sendOTP: async (data: {
                    phoneNumber: string;
                    code: string;
                }) => {
                    const user = await prisma.user.findFirst({
                        where: {
                            phoneNumber: data.phoneNumber
                        }
                    });
                    const userId = user?.id || '00000000-0000-7000-8000-000000000000';
                    
                    await authProducer.sendOtpSms({
                        userId,
                        phoneNumber: data.phoneNumber,
                        code: data.code,
                    });
                },
                sendPasswordResetOTP: async (data: {
                    phoneNumber: string;
                    code: string;
                }) => {
                    const user = await prisma.user.findFirst({
                        where: {
                            phoneNumber: data.phoneNumber
                        }
                    });
                    const userId = user?.id || '00000000-0000-7000-8000-000000000000';
                    
                    await authProducer.sendOtpSms({
                        userId,
                        phoneNumber: data.phoneNumber,
                        code: data.code,
                    });
                }
            }),
            captcha({
                provider: "cloudflare-turnstile",
                secretKey: ENV_CONFIG.TURNSTILE_SECRET_KEY,
            }),
            nextCookies(),
        ],
        user: {
            additionalFields: {
                role: {
                    type: 'string',
                    defaultValue: 'user',
                    input: false, 
                },
                resume: {
                    type: 'string',
                    required: false,
                },
                firstName: {
                    type: 'string',
                    required: false,
                },
                lastName: {
                    type: 'string',
                    required: false,
                },
                dob: {
                    type: 'date',
                    required: false,
                },
                about: {
                    type: 'string',
                    required: false,
                },
                location: {
                    type: 'string',
                    required: false,
                },
                isActive: {
                    type: 'boolean',
                    defaultValue: true,
                    input: false,
                },
                gender: {
                    type: 'string',
                    required: false,
                },
                isOnboardingComplete: {
                    type: 'boolean',
                    defaultValue: false,
                    input: false,
                },
                onBoardingStep: {
                    type: 'number',
                    defaultValue: 0,
                    input: false,
                },
            },
        },
    });

    async function resolveSession(headers: Headers) {
        try {
            return await auth.api.getSession({ headers });
        } catch {
            return null;
        }
    }

    async function resolveSessionFromRawHeaders(
        rawHeaders: Record<string, string | Array<string> | undefined>,
    ) {
        const headers = new Headers();
        for (const [key, val] of Object.entries(rawHeaders)) {
            if (val !== undefined) {
                headers.set(key, Array.isArray(val) ? val.join(', ') : val);
            }
        }
        return resolveSession(headers);
    }

    return {
        auth,
        jose,
        resolveSession,
        resolveSessionFromRawHeaders,
    };
}

export type AuthInstance = ReturnType<typeof createAuth>;
