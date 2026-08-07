import { z } from 'zod';

// ─── Base Entities ─────────────────────────────────────────────────────────────

export const AuthUserSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    emailVerified: z.boolean(),
    name: z.string(),
    image: z.string().nullable().optional(),
    resume: z.string().nullable().optional(),
    username: z.string().nullable().optional(),
    phoneNumber: z.string().nullable().optional(),
    phoneNumberVerified: z.boolean().nullable().optional(),
    isOnboardingComplete: z.boolean().default(false),
    onBoardingStep: z.number().default(0),
    role: z.string().optional(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export const AuthSessionSchema = z.object({
    id: z.string(),
    userId: z.string(),
    expiresAt: z.coerce.date(),
    token: z.string(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    ipAddress: z.string().nullable().optional(),
    userAgent: z.string().nullable().optional(),
});

export const SessionWithUserSchema = z.object({
    session: AuthSessionSchema,
    user: AuthUserSchema,
});

// ─── getSession ────────────────────────────────────────────────────────────────

export const GetSessionOutputSchema = z.object({
    session: AuthSessionSchema,
    user: AuthUserSchema,
}).nullable();

// ─── credentials ───────────────────────────────────────────────────────────────

export const SignInWithEmailInputSchema = z.object({
    email: z.string().email(),
    password: z.string(),
    rememberMe: z.boolean().optional(),
    callbackURL: z.string().optional(),
});

export const SignInWithEmailOutputSchema = SessionWithUserSchema;

export const SignUpWithEmailInputSchema = z.object({
    email: z.string().email(),
    password: z.string(),
    name: z.string(),
    image: z.string().url().optional(),
});

export const SignUpWithEmailOutputSchema = SessionWithUserSchema;

// ─── username ──────────────────────────────────────────────────────────────────

export const SignInWithUsernameInputSchema = z.object({
    username: z.string(),
    password: z.string(),
    rememberMe: z.boolean().optional(),
    callbackURL: z.string().optional(),
});

export const SignInWithUsernameOutputSchema = SessionWithUserSchema;

export const ChangeUsernameInputSchema = z.object({
    newUsername: z.string().min(3).max(30),
});

export const ChangeUsernameOutputSchema = z.object({
    user: AuthUserSchema,
});

// ─── magic-link ────────────────────────────────────────────────────────────────

export const SignInWithMagicLinkInputSchema = z.object({
    email: z.string().email(),
    callbackURL: z.string().optional(),
});

export const SignInWithMagicLinkOutputSchema = z.object({
    status: z.boolean(),
});

export const SendMagicLinkInputSchema = z.object({
    email: z.string().email(),
    callbackURL: z.string().optional(),
});

export const SendMagicLinkOutputSchema = z.object({
    status: z.boolean(),
});

// ─── phone-number ──────────────────────────────────────────────────────────────

export const SignInWithPhoneNumberInputSchema = z.object({
    phoneNumber: z.string(),
    password: z.string().optional(),
});

export const SignInWithPhoneNumberOutputSchema = SessionWithUserSchema;

export const SignUpWithPhoneNumberInputSchema = z.object({
    phoneNumber: z.string(),
    password: z.string().optional(),
    name: z.string(),
});

export const SignUpWithPhoneNumberOutputSchema = SessionWithUserSchema;

export const SendVerificationOTPInputSchema = z.object({
    phoneNumber: z.string(),
});

export const SendVerificationOTPOutputSchema = z.object({
    status: z.boolean(),
}).optional();

// ─── two-factor ────────────────────────────────────────────────────────────────

export const EnableTwoFactorInputSchema = z.object({
    password: z.string().optional(),
});

export const EnableTwoFactorOutputSchema = z.object({
    secret: z.string().optional(),
    qrCode: z.string().optional(),
    backupCodes: z.array(z.string()).optional(),
    totpSecret: z.string().optional(),
});

export const DisableTwoFactorInputSchema = z.object({
    password: z.string().optional(),
});

export const DisableTwoFactorOutputSchema = z.object({
    status: z.boolean(),
}).optional();

export const VerifyTwoFactorInputSchema = z.object({
    code: z.string(),
});

export const VerifyTwoFactorOutputSchema = SessionWithUserSchema;

export const GetBackupCodesInputSchema = z.object({
    password: z.string().optional(),
});

export const GetBackupCodesOutputSchema = z.object({
    backupCodes: z.array(z.string()),
});

// ─── email-otp ─────────────────────────────────────────────────────────────────

export const SignInWithEmailOTPInputSchema = z.object({
    email: z.string().email(),
    otp: z.string(),
});

export const SignInWithEmailOTPOutputSchema = SessionWithUserSchema;

export const SignUpWithEmailOTPInputSchema = z.object({
    email: z.string().email(),
    name: z.string(),
    password: z.string(),
    otp: z.string(),
});

export const SignUpWithEmailOTPOutputSchema = SessionWithUserSchema;

export const SendVerificationEmailInputSchema = z.object({
    email: z.string().email(),
});

export const SendVerificationEmailOutputSchema = z.object({
    status: z.boolean(),
}).optional();

// ─── update-user & account ─────────────────────────────────────────────────────

export const UpdateUserInputSchema = z.object({
    name: z.string().optional(),
    image: z.string().url().optional(),
    resume: z.string().url().optional(),
    username: z.string().optional(),
});

export const UpdateUserOutputSchema = z.object({
    user: AuthUserSchema,
});

export const ChangePasswordInputSchema = z.object({
    currentPassword: z.string(),
    newPassword: z.string(),
});

export const ChangePasswordOutputSchema = z.object({
    status: z.boolean(),
}).optional();

export const SetPasswordInputSchema = z.object({
    password: z.string(),
});

export const SetPasswordOutputSchema = z.object({
    status: z.boolean(),
}).optional();

export const DeleteUserInputSchema = z.object({
    password: z.string().optional(),
});

export const DeleteUserOutputSchema = z.object({
    status: z.boolean(),
}).optional();

export const ForgetPasswordInputSchema = z.object({
    email: z.string().email(),
    redirectTo: z.string(),
});

export const ForgetPasswordOutputSchema = z.object({
    status: z.boolean(),
}).optional();

export const ResetPasswordInputSchema = z.object({
    password: z.string(),
    token: z.string(),
});

export const ResetPasswordOutputSchema = z.object({
    status: z.boolean(),
}).optional();

export const VerifyEmailInputSchema = z.object({
    token: z.string(),
});

export const VerifyEmailOutputSchema = z.object({
    status: z.boolean(),
}).optional();

// ─── social & id-token ─────────────────────────────────────────────────────────

export const SignInSocialInputSchema = z.object({
    provider: z.enum(['google', 'github', 'discord', 'facebook', 'apple']),
    callbackURL: z.string().optional(),
});

export const SignInSocialOutputSchema = z.object({
    url: z.string().url().optional(),
    status: z.boolean().optional(),
});

export const SignInIdTokenInputSchema = z.object({
    provider: z.enum(['google', 'apple', 'play-games']),
    idToken: z.string(),
    nonce: z.string().optional(),
});

export const SignInIdTokenOutputSchema = SessionWithUserSchema;

export const VerifyPhoneNumberInputSchema = z.object({
    phoneNumber: z.string(),
    code: z.string(),
});

export const VerifyPhoneNumberOutputSchema = SessionWithUserSchema;

export const UpdatePhoneNumberInputSchema = z.object({
    phoneNumber: z.string(),
});

export const UpdatePhoneNumberOutputSchema = z.object({
    user: AuthUserSchema,
});

export const IsUsernameAvailableInputSchema = z.object({
    username: z.string(),
});

export const IsUsernameAvailableOutputSchema = z.object({
    available: z.boolean(),
});
