import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authClient, useAuth } from '@/lib/auth/auth';
import { queryKeys } from '../query-keys';
import type { IAuthQueryService } from '../interfaces';
import {
    SignInWithEmailInputSchema,
    SignInWithEmailOutputSchema,
    SignUpWithEmailInputSchema,
    SignUpWithEmailOutputSchema,
    SignInWithUsernameInputSchema,
    SignInWithUsernameOutputSchema,
    ChangeUsernameInputSchema,
    ChangeUsernameOutputSchema,
    SignInWithMagicLinkInputSchema,
    SignInWithMagicLinkOutputSchema,
    SendMagicLinkInputSchema,
    SendMagicLinkOutputSchema,
    SignInWithPhoneNumberInputSchema,
    SignInWithPhoneNumberOutputSchema,
    SignUpWithPhoneNumberInputSchema,
    SignUpWithPhoneNumberOutputSchema,
    SendVerificationOTPInputSchema,
    SendVerificationOTPOutputSchema,
    EnableTwoFactorInputSchema,
    EnableTwoFactorOutputSchema,
    DisableTwoFactorInputSchema,
    DisableTwoFactorOutputSchema,
    VerifyTwoFactorInputSchema,
    VerifyTwoFactorOutputSchema,
    GetBackupCodesInputSchema,
    GetBackupCodesOutputSchema,
    SignInWithEmailOTPInputSchema,
    SignInWithEmailOTPOutputSchema,
    SignUpWithEmailOTPInputSchema,
    SignUpWithEmailOTPOutputSchema,
    SendVerificationEmailInputSchema,
    SendVerificationEmailOutputSchema,
    UpdateUserInputSchema,
    UpdateUserOutputSchema,
    ChangePasswordInputSchema,
    ChangePasswordOutputSchema,
    SetPasswordInputSchema,
    SetPasswordOutputSchema,
    DeleteUserInputSchema,
    DeleteUserOutputSchema,
    ForgetPasswordInputSchema,
    ForgetPasswordOutputSchema,
    ResetPasswordInputSchema,
    ResetPasswordOutputSchema,
    VerifyEmailInputSchema,
    VerifyEmailOutputSchema,
    SignInSocialInputSchema,
    SignInSocialOutputSchema,
    SignInIdTokenInputSchema,
    SignInIdTokenOutputSchema,
    VerifyPhoneNumberInputSchema,
    VerifyPhoneNumberOutputSchema,
    UpdatePhoneNumberInputSchema,
    UpdatePhoneNumberOutputSchema,
    IsUsernameAvailableInputSchema,
    IsUsernameAvailableOutputSchema,
} from '@/schemas/trpc';
import { z } from 'zod';

export class AuthQueryService implements IAuthQueryService {
    getSession() {
        return useAuth();
    }

    signInWithEmail() {
        const queryClient = useQueryClient();
        const client = authClient as any;
        return useMutation({
            mutationFn: async (variables: z.infer<typeof SignInWithEmailInputSchema>) => {
                const validatedInput = SignInWithEmailInputSchema.parse(variables);
                const res = await client.signIn.email(validatedInput);
                if (res.error) throw res.error;
                return SignInWithEmailOutputSchema.parse(res.data);
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: queryKeys.auth.session() });
            },
        });
    }

    signUpWithEmail() {
        const queryClient = useQueryClient();
        const client = authClient as any;
        return useMutation({
            mutationFn: async (variables: z.infer<typeof SignUpWithEmailInputSchema>) => {
                const validatedInput = SignUpWithEmailInputSchema.parse(variables);
                const res = await client.signUp.email(validatedInput);
                if (res.error) throw res.error;
                return SignUpWithEmailOutputSchema.parse(res.data);
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: queryKeys.auth.session() });
            },
        });
    }

    signInWithUsername() {
        const queryClient = useQueryClient();
        const client = authClient as any;
        return useMutation({
            mutationFn: async (variables: z.infer<typeof SignInWithUsernameInputSchema>) => {
                const validatedInput = SignInWithUsernameInputSchema.parse(variables);
                const res = await client.signIn.username(validatedInput);
                if (res.error) throw res.error;
                return SignInWithUsernameOutputSchema.parse(res.data);
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: queryKeys.auth.session() });
            },
        });
    }

    changeUsername() {
        const queryClient = useQueryClient();
        const client = authClient as any;
        return useMutation({
            mutationFn: async (variables: z.infer<typeof ChangeUsernameInputSchema>) => {
                const validatedInput = ChangeUsernameInputSchema.parse(variables);
                const res = await client.updateUser({
                    username: validatedInput.newUsername,
                });
                if (res.error) throw res.error;
                return ChangeUsernameOutputSchema.parse(res.data);
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: queryKeys.auth.session() });
            },
        });
    }

    signInWithMagicLink() {
        const queryClient = useQueryClient();
        const client = authClient as any;
        return useMutation({
            mutationFn: async (variables: z.infer<typeof SignInWithMagicLinkInputSchema>) => {
                const validatedInput = SignInWithMagicLinkInputSchema.parse(variables);
                const res = await client.signIn.magicLink(validatedInput);
                if (res.error) throw res.error;
                return SignInWithMagicLinkOutputSchema.parse(res.data);
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: queryKeys.auth.session() });
            },
        });
    }

    sendMagicLink() {
        const client = authClient as any;
        return useMutation({
            mutationFn: async (variables: z.infer<typeof SendMagicLinkInputSchema>) => {
                const validatedInput = SendMagicLinkInputSchema.parse(variables);
                const res = await client.signIn.magicLink(validatedInput);
                if (res.error) throw res.error;
                return SendMagicLinkOutputSchema.parse(res.data);
            },
        });
    }

    signInWithPhoneNumber() {
        const queryClient = useQueryClient();
        const client = authClient as any;
        return useMutation({
            mutationFn: async (variables: z.infer<typeof SignInWithPhoneNumberInputSchema>) => {
                const validatedInput = SignInWithPhoneNumberInputSchema.parse(variables);
                const res = await client.signIn.phoneNumber(validatedInput);
                if (res.error) throw res.error;
                return SignInWithPhoneNumberOutputSchema.parse(res.data);
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: queryKeys.auth.session() });
            },
        });
    }

    signUpWithPhoneNumber() {
        const queryClient = useQueryClient();
        const client = authClient as any;
        return useMutation({
            mutationFn: async (variables: z.infer<typeof SignUpWithPhoneNumberInputSchema>) => {
                const validatedInput = SignUpWithPhoneNumberInputSchema.parse(variables);
                const res = await client.signUp.phoneNumber(validatedInput);
                if (res.error) throw res.error;
                return SignUpWithPhoneNumberOutputSchema.parse(res.data);
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: queryKeys.auth.session() });
            },
        });
    }

    sendVerificationOTP() {
        const client = authClient as any;
        return useMutation({
            mutationFn: async (variables: z.infer<typeof SendVerificationOTPInputSchema>) => {
                const validatedInput = SendVerificationOTPInputSchema.parse(variables);
                const res = await client.phoneNumber.sendOtp(validatedInput);
                if (res.error) throw res.error;
                return SendVerificationOTPOutputSchema.parse(res.data);
            },
        });
    }

    enableTwoFactor() {
        const queryClient = useQueryClient();
        const client = authClient as any;
        return useMutation({
            mutationFn: async (variables: z.infer<typeof EnableTwoFactorInputSchema>) => {
                const validatedInput = EnableTwoFactorInputSchema.parse(variables);
                const res = await client.twoFactor.enable(validatedInput);
                if (res.error) throw res.error;
                return EnableTwoFactorOutputSchema.parse(res.data);
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: queryKeys.auth.session() });
            },
        });
    }

    disableTwoFactor() {
        const queryClient = useQueryClient();
        const client = authClient as any;
        return useMutation({
            mutationFn: async (variables: z.infer<typeof DisableTwoFactorInputSchema>) => {
                const validatedInput = DisableTwoFactorInputSchema.parse(variables);
                const res = await client.twoFactor.disable(validatedInput);
                if (res.error) throw res.error;
                return DisableTwoFactorOutputSchema.parse(res.data);
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: queryKeys.auth.session() });
            },
        });
    }

    verifyTwoFactor() {
        const queryClient = useQueryClient();
        const client = authClient as any;
        return useMutation({
            mutationFn: async (variables: z.infer<typeof VerifyTwoFactorInputSchema>) => {
                const validatedInput = VerifyTwoFactorInputSchema.parse(variables);
                const res = await client.twoFactor.verifyTotp(validatedInput);
                if (res.error) throw res.error;
                return VerifyTwoFactorOutputSchema.parse(res.data);
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: queryKeys.auth.session() });
            },
        });
    }

    verifyTwoFactorTotp() {
        const queryClient = useQueryClient();
        const client = authClient as any;
        return useMutation({
            mutationFn: async (variables: z.infer<typeof VerifyTwoFactorInputSchema>) => {
                const validatedInput = VerifyTwoFactorInputSchema.parse(variables);
                const res = await client.twoFactor.verifyTotp(validatedInput);
                if (res.error) throw res.error;
                return VerifyTwoFactorOutputSchema.parse(res.data);
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: queryKeys.auth.session() });
            },
        });
    }

    verifyTwoFactorOtp() {
        const queryClient = useQueryClient();
        const client = authClient as any;
        return useMutation({
            mutationFn: async (variables: z.infer<typeof VerifyTwoFactorInputSchema>) => {
                const validatedInput = VerifyTwoFactorInputSchema.parse(variables);
                const res = await client.twoFactor.verifyOtp(validatedInput);
                if (res.error) throw res.error;
                return VerifyTwoFactorOutputSchema.parse(res.data);
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: queryKeys.auth.session() });
            },
        });
    }

    verifyTwoFactorBackupCode() {
        const queryClient = useQueryClient();
        const client = authClient as any;
        return useMutation({
            mutationFn: async (variables: z.infer<typeof VerifyTwoFactorInputSchema>) => {
                const validatedInput = VerifyTwoFactorInputSchema.parse(variables);
                const res = await client.twoFactor.verifyBackupCode(validatedInput);
                if (res.error) throw res.error;
                return VerifyTwoFactorOutputSchema.parse(res.data);
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: queryKeys.auth.session() });
            },
        });
    }

    getBackupCodes() {
        const client = authClient as any;
        return useMutation({
            mutationFn: async (variables: z.infer<typeof GetBackupCodesInputSchema>) => {
                const validatedInput = GetBackupCodesInputSchema.parse(variables);
                const res = await client.twoFactor.generateBackupCodes(validatedInput);
                if (res.error) throw res.error;
                return GetBackupCodesOutputSchema.parse(res.data);
            },
        });
    }

    signInWithEmailOTP() {
        const queryClient = useQueryClient();
        const client = authClient as any;
        return useMutation({
            mutationFn: async (variables: z.infer<typeof SignInWithEmailOTPInputSchema>) => {
                const validatedInput = SignInWithEmailOTPInputSchema.parse(variables);
                const res = await client.signIn.emailOtp(validatedInput);
                if (res.error) throw res.error;
                return SignInWithEmailOTPOutputSchema.parse(res.data);
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: queryKeys.auth.session() });
            },
        });
    }

    signUpWithEmailOTP() {
        const queryClient = useQueryClient();
        const client = authClient as any;
        return useMutation({
            mutationFn: async (variables: z.infer<typeof SignUpWithEmailOTPInputSchema>) => {
                const validatedInput = SignUpWithEmailOTPInputSchema.parse(variables);
                const res = await client.signUp.emailOtp(validatedInput);
                if (res.error) throw res.error;
                return SignUpWithEmailOTPOutputSchema.parse(res.data);
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: queryKeys.auth.session() });
            },
        });
    }

    sendVerificationEmail() {
        const client = authClient as any;
        return useMutation({
            mutationFn: async (variables: z.infer<typeof SendVerificationEmailInputSchema>) => {
                const validatedInput = SendVerificationEmailInputSchema.parse(variables);
                const res = await client.sendVerificationEmail(validatedInput);
                if (res.error) throw res.error;
                return SendVerificationEmailOutputSchema.parse(res.data);
            },
        });
    }

    signOut() {
        const queryClient = useQueryClient();
        const client = authClient as any;
        return useMutation({
            mutationFn: async () => {
                const res = await client.signOut();
                if (res.error) throw res.error;
                return res.data;
            },
            onSuccess: () => {
                queryClient.clear();
            },
        });
    }

    // ─── Interactive Flow Routes ───────────────────────────────────────────────

    updateUser() {
        const queryClient = useQueryClient();
        const client = authClient as any;
        return useMutation({
            mutationFn: async (variables: z.infer<typeof UpdateUserInputSchema>) => {
                const validatedInput = UpdateUserInputSchema.parse(variables);
                const res = await client.updateUser(validatedInput);
                if (res.error) throw res.error;
                return UpdateUserOutputSchema.parse(res.data);
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: queryKeys.auth.session() });
            },
        });
    }

    changePassword() {
        const client = authClient as any;
        return useMutation({
            mutationFn: async (variables: z.infer<typeof ChangePasswordInputSchema>) => {
                const validatedInput = ChangePasswordInputSchema.parse(variables);
                const res = await client.changePassword(validatedInput);
                if (res.error) throw res.error;
                return ChangePasswordOutputSchema.parse(res.data);
            },
        });
    }

    setPassword() {
        const client = authClient as any;
        return useMutation({
            mutationFn: async (variables: z.infer<typeof SetPasswordInputSchema>) => {
                const validatedInput = SetPasswordInputSchema.parse(variables);
                const res = await client.setPassword(validatedInput);
                if (res.error) throw res.error;
                return SetPasswordOutputSchema.parse(res.data);
            },
        });
    }

    deleteUser() {
        const queryClient = useQueryClient();
        const client = authClient as any;
        return useMutation({
            mutationFn: async (variables: z.infer<typeof DeleteUserInputSchema>) => {
                const validatedInput = DeleteUserInputSchema.parse(variables);
                const res = await client.deleteUser(validatedInput);
                if (res.error) throw res.error;
                return DeleteUserOutputSchema.parse(res.data);
            },
            onSuccess: () => {
                queryClient.clear();
            },
        });
    }

    forgetPassword() {
        const client = authClient as any;
        return useMutation({
            mutationFn: async (variables: z.infer<typeof ForgetPasswordInputSchema>) => {
                const validatedInput = ForgetPasswordInputSchema.parse(variables);
                const res = await client.forgetPassword(validatedInput);
                if (res.error) throw res.error;
                return ForgetPasswordOutputSchema.parse(res.data);
            },
        });
    }

    resetPassword() {
        const client = authClient as any;
        return useMutation({
            mutationFn: async (variables: z.infer<typeof ResetPasswordInputSchema>) => {
                const validatedInput = ResetPasswordInputSchema.parse(variables);
                const res = await client.resetPassword(validatedInput);
                if (res.error) throw res.error;
                return ResetPasswordOutputSchema.parse(res.data);
            },
        });
    }

    verifyEmail() {
        const queryClient = useQueryClient();
        const client = authClient as any;
        return useMutation({
            mutationFn: async (variables: z.infer<typeof VerifyEmailInputSchema>) => {
                const validatedInput = VerifyEmailInputSchema.parse(variables);
                const res = await client.verifyEmail(validatedInput);
                if (res.error) throw res.error;
                return VerifyEmailOutputSchema.parse(res.data);
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: queryKeys.auth.session() });
            },
        });
    }

    signInSocial() {
        const client = authClient as any;
        return useMutation({
            mutationFn: async (variables: z.infer<typeof SignInSocialInputSchema>) => {
                const validatedInput = SignInSocialInputSchema.parse(variables);
                const res = await client.signIn.social(validatedInput);
                if (res.error) throw res.error;
                return SignInSocialOutputSchema.parse(res.data || { status: true });
            },
        });
    }

    signInIdToken() {
        const queryClient = useQueryClient();
        const client = authClient as any;
        return useMutation({
            mutationFn: async (variables: z.infer<typeof SignInIdTokenInputSchema>) => {
                const validatedInput = SignInIdTokenInputSchema.parse(variables);
                const res = await client.signIn.idToken(validatedInput);
                if (res.error) throw res.error;
                return SignInIdTokenOutputSchema.parse(res.data);
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: queryKeys.auth.session() });
            },
        });
    }

    verifyPhoneNumber() {
        const queryClient = useQueryClient();
        const client = authClient as any;
        return useMutation({
            mutationFn: async (variables: z.infer<typeof VerifyPhoneNumberInputSchema>) => {
                const validatedInput = VerifyPhoneNumberInputSchema.parse(variables);
                const res = await client.phoneNumber.verify(validatedInput);
                if (res.error) throw res.error;
                return VerifyPhoneNumberOutputSchema.parse(res.data);
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: queryKeys.auth.session() });
            },
        });
    }

    updatePhoneNumber() {
        const queryClient = useQueryClient();
        const client = authClient as any;
        return useMutation({
            mutationFn: async (variables: z.infer<typeof UpdatePhoneNumberInputSchema>) => {
                const validatedInput = UpdatePhoneNumberInputSchema.parse(variables);
                const res = await client.phoneNumber.update(validatedInput);
                if (res.error) throw res.error;
                return UpdatePhoneNumberOutputSchema.parse(res.data);
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: queryKeys.auth.session() });
            },
        });
    }

    isUsernameAvailable(input: z.infer<typeof IsUsernameAvailableInputSchema>) {
        const validatedInput = IsUsernameAvailableInputSchema.parse(input);
        const client = authClient as any;
        return useQuery({
            queryKey: ['usernameAvailability', validatedInput.username],
            queryFn: async () => {
                const res = await client.username.isUsernameAvailable({
                    username: validatedInput.username,
                });
                if (res.error) throw res.error;
                return IsUsernameAvailableOutputSchema.parse(res.data);
            },
            enabled: !!validatedInput.username,
        });
    }
}

export const authQueryService = new AuthQueryService();
