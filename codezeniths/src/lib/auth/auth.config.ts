import crypto from "node:crypto";
import { betterAuth } from "better-auth";
import { bearer, username, customSession } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "@codezeniths/lib/db/prisma.client";
import { createJoseUtils } from "./auth.jwt";
import type { AuthConfig } from "./auth.types";
import { authProducer } from "@/lib/mq";
import { redisService, defaultRedisClient } from "@/lib/redis";
import { storageService } from "@/service/storage";
import { createAuthRedisStorage } from "./auth.redis";
import { ENV_CONFIG } from "@codezeniths/config/config";
import { formatUserProfile } from "@/utils/user.formatter";

// Plugins imports
import { emailOTP } from "better-auth/plugins/email-otp";
import { magicLink } from "better-auth/plugins/magic-link";
import { twoFactor } from "better-auth/plugins/two-factor";
import { phoneNumber } from "better-auth/plugins/phone-number";
import { captcha } from "better-auth/plugins";

export function createAuth(config: AuthConfig) {
  const database = prismaAdapter(prisma, {
    provider: "postgresql",
  });
  const jose = config.jose ? createJoseUtils(config.jose) : null;
  const socialProviders: Record<
    string,
    {
      clientId: string;
      clientSecret: string;
      prompt?:
        | "select_account"
        | "consent"
        | "login"
        | "none"
        | "select_account consent";
      accessType?: "online" | "offline";
    }
  > = {};

  // GitHub Configuration
  if (config.github?.clientId && config.github.clientSecret) {
    socialProviders["github"] = {
      clientId: config.github.clientId,
      clientSecret: config.github.clientSecret,
      // Enforces GitHub's login/password prompt explicitly
      prompt: "login",
    };
  }

  // Google Configuration
  if (config.google?.clientId && config.google.clientSecret) {
    socialProviders["google"] = {
      clientId: config.google.clientId,
      clientSecret: config.google.clientSecret,
      // Forces the Google account chooser screen
      prompt: "select_account",
      // CamelCase is strictly required by Better Auth's API options layout
      accessType: "offline",
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
        enabled: true,
        maxAge: 5 * 60, // 5 minutes cache for standard page reads
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
      sendResetPassword: async (data: {
        user: any;
        url: string;
        token: string;
      }) => {
        const baseUrl = ENV_CONFIG.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        let formattedUrl = data.url;
        try {
          const parsedUrl = new URL(data.url, baseUrl);
          const targetBase = new URL(baseUrl);
          parsedUrl.protocol = targetBase.protocol;
          parsedUrl.host = targetBase.host;
          formattedUrl = parsedUrl.toString();
        } catch {
          formattedUrl = `${baseUrl}/reset-password?token=${data.token}`;
        }

        await authProducer.sendResetPasswordEmail({
          userId: data.user.id,
          email: data.user.email,
          url: formattedUrl,
          code: data.token,
        });
      },
    },

    emailVerification: {
      sendOnSignUp: false, // Set to false so verification email is not sent automatically on signup
      sendVerificationEmail: async (data: {
        user: any;
        url: string;
        token: string;
      }) => {
        await authProducer.sendVerifyEmail({
          userId: data.user.id,
          email: data.user.email,
          token: data.token,
          url: data.url,
        });
      },
    },

    databaseHooks: {
      user: {
        create: {
          before: async (data, ctx) => {
            try {
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

              // 1. Extract firstName & lastName from name if missing
              if (modifiedData.name) {
                const nameParts = modifiedData.name.trim().split(/\s+/);
                if (!modifiedData.firstName) {
                  modifiedData.firstName = nameParts[0] || modifiedData.name;
                }
                if (!modifiedData.lastName) {
                  modifiedData.lastName =
                    nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
                }
              }

              // 2. Handle username:
              // - For manual credential signup: preserve the user's chosen username as-is (do not append random numbers).
              // - For OAuth (Google, GitHub) or passwordless signups: generate a unique username from name/email + random numbers.
              const manualUsername = (
                modifiedData.username ||
                body?.username ||
                (data as any).username ||
                ""
              ).trim();

              if (manualUsername.length > 0) {
                modifiedData.username = manualUsername;
                modifiedData.displayUsername = manualUsername;
                await redisService.bloom
                  .add("usernames", manualUsername)
                  .catch(() => {});
              } else {
                const rawBase = (
                  modifiedData.name ||
                  modifiedData.email?.split("@")[0] ||
                  "user"
                )
                  .toLowerCase()
                  .replace(/[^a-z0-9]/g, "-")
                  .replace(/-+/g, "-")
                  .replace(/^-|-$/g, "");
                const baseSlug =
                  rawBase.length >= 3 ? rawBase : `${rawBase || "user"}-dev`;

                let generatedUsername = "";
                for (let attempt = 0; attempt < 10; attempt++) {
                  const randomSuffix = Math.floor(
                    1000 + Math.random() * 9000,
                  ).toString();
                  const candidate = `${baseSlug}-${randomSuffix}`;

                  // Check Bloom Filter
                  const isTakenInBloom = await redisService.bloom
                    .exists("usernames", candidate)
                    .catch(() => false);
                  if (isTakenInBloom) continue;

                  // Check Database
                  const existingUser = await prisma.user
                    .findUnique({
                      where: { username: candidate },
                      select: { id: true },
                    })
                    .catch(() => null);

                  if (!existingUser) {
                    generatedUsername = candidate;
                    await redisService.bloom
                      .add("usernames", candidate)
                      .catch(() => {});
                    break;
                  }
                }

                if (!generatedUsername) {
                  generatedUsername = `${baseSlug}-${Date.now().toString().slice(-6)}`;
                }

                modifiedData.username = generatedUsername;
                modifiedData.displayUsername = generatedUsername;
              }

              return { data: modifiedData };
            } catch (err) {
              console.error("ERROR IN DATABASE HOOK user.create.before:", err);
              throw err;
            }
          },
          after: async (user, ctx) => {
            // Always send welcome email
            await authProducer.sendWelcomeEmail({
              userId: user.id,
              email: user.email,
              name: user.name,
            });

            // For passwordless/OAuth signups, automatically generate a credential password
            const path: string = (ctx as any)?.path ?? "";
            const isEmailPasswordSignup = path.includes("sign-up/email");

            if (!isEmailPasswordSignup) {
              try {
                const { hashPassword } = await import("better-auth/crypto");
                const rawPassword = crypto
                  .randomBytes(16)
                  .toString("base64url");
                const hashedPassword = await hashPassword(rawPassword);

                // Create the credential Account row so user can always sign in with email/username + password
                await prisma.account.create({
                  data: {
                    id: crypto.randomUUID(),
                    accountId: user.id,
                    providerId: "credential",
                    userId: user.id,
                    password: hashedPassword,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  },
                });

                // Deliver raw password & assigned username via MQ
                const isPhoneOtp =
                  path.includes("phone-number/verify") || !!user.phoneNumber;
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
                    username:
                      (user.username as string) ||
                      (user.displayUsername as string) ||
                      "",
                    password: rawPassword,
                  });
                }
              } catch (err) {
                console.error(
                  "[AUTH] Failed to auto-generate credential password:",
                  err,
                );
              }
            }

            // 3. OAuth PFP Transfer: If user.image is external HTTP(S) URL, download and upload to Cloudflare R2
            if (
              user.image &&
              (user.image.startsWith("http://") ||
                user.image.startsWith("https://"))
            ) {
              try {
                const imageRes = await fetch(user.image);
                if (imageRes.ok) {
                  const arrayBuffer = await imageRes.arrayBuffer();
                  const imageBuffer = Buffer.from(arrayBuffer);
                  const contentType =
                    imageRes.headers.get("content-type") || "image/png";
                  let ext = "png";
                  if (
                    contentType.includes("jpeg") ||
                    contentType.includes("jpg")
                  )
                    ext = "jpg";
                  else if (contentType.includes("webp")) ext = "webp";

                  const r2Key = `media/${user.id}/${crypto.randomUUID()}.${ext}`;
                  const uploadResult = await storageService.upload(
                    r2Key,
                    imageBuffer,
                    { contentType },
                  );
                  if (uploadResult.status !== "failed") {
                    await prisma.user.update({
                      where: { id: user.id },
                      data: { image: r2Key },
                    });
                  }
                }
              } catch (r2Err) {
                console.error(
                  "[AUTH] Failed to transfer OAuth avatar to Cloudflare R2:",
                  r2Err,
                );
              }
            }
          },
        },
      },
    },

    accountLinking: {
      enabled: true,
      trustedProviders: ["github", "google"],
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
              displayUsername: "username",
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
          },
        },
      }),
      emailOTP({
        sendVerificationOTP: async (data: {
          email: string;
          otp: string;
          type:
            | "sign-in"
            | "email-verification"
            | "forget-password"
            | "change-email";
        }) => {
          const user = await prisma.user.findUnique({
            where: { email: data.email },
          });
          const userId = user?.id || "00000000-0000-7000-8000-000000000000";

          if (data.type === "forget-password") {
            const baseUrl = ENV_CONFIG.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
            const resetUrl = `${baseUrl}/reset-password?token=${encodeURIComponent(data.otp)}&email=${encodeURIComponent(data.email)}`;

            await authProducer.sendResetPasswordEmail({
              userId,
              email: data.email,
              url: resetUrl,
              code: data.otp,
            });
          } else {
            await authProducer.sendOtpEmail({
              userId,
              email: data.email,
              code: data.otp,
            });
          }
        },
      }),
      magicLink({
        sendMagicLink: async (data: {
          email: string;
          url: string;
          token: string;
          metadata?: Record<string, any>;
        }) => {
          const user = await prisma.user.findUnique({
            where: { email: data.email },
          });
          const userId = user?.id || "00000000-0000-7000-8000-000000000000";

          if (user?.phoneNumber && data.metadata?.delivery === "sms") {
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
        },
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
        sendOTP: async (data: { phoneNumber: string; code: string }) => {
          const user = await prisma.user.findFirst({
            where: {
              phoneNumber: data.phoneNumber,
            },
          });
          const userId = user?.id || "00000000-0000-7000-8000-000000000000";

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
              phoneNumber: data.phoneNumber,
            },
          });
          const userId = user?.id || "00000000-0000-7000-8000-000000000000";

          await authProducer.sendOtpSms({
            userId,
            phoneNumber: data.phoneNumber,
            code: data.code,
          });
        },
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
          type: "string",
          defaultValue: "user",
          input: false,
        },
        resume: {
          type: "string",
          required: false,
        },
        firstName: {
          type: "string",
          required: false,
        },
        lastName: {
          type: "string",
          required: false,
        },
        dob: {
          type: "date",
          required: false,
        },
        about: {
          type: "string",
          required: false,
        },
        location: {
          type: "string",
          required: false,
        },
        isActive: {
          type: "boolean",
          defaultValue: true,
          input: false,
        },
        gender: {
          type: "string",
          required: false,
        },
        isOnboardingComplete: {
          type: "boolean",
          defaultValue: false,
          input: false,
        },
        onBoardingStep: {
          type: "number",
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
        headers.set(key, Array.isArray(val) ? val.join(", ") : val);
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
