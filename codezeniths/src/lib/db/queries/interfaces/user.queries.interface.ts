import { z } from 'zod';
import {
    GetUserProfileInputSchema,
    GetUserProfileOutputSchema,
    GetUserSocialsInputSchema,
    GetUserSocialsOutputSchema,
    GetUserProgressInputSchema,
    GetUserProgressOutputSchema,
    GetUserPreferencesInputSchema,
    GetUserPreferencesOutputSchema,
    GetUserActivityInputSchema,
    GetUserActivityOutputSchema,
    UpdateUserProfileInputSchema,
    UpdateUserProfileOutputSchema,
    UpdateUserRoleInputSchema,
    UpdateUserRoleOutputSchema,
    UpsertUserSocialsInputSchema,
    UpsertUserSocialsOutputSchema,
    UpdateUserImageInputSchema,
    UpdateUserImageOutputSchema,
    UpdateUserResumeInputSchema,
    UpdateUserResumeOutputSchema,
    CheckUserNameAvailabilityInputSchema,
    CheckUserNameAvailabilityOutputSchema,
    CheckEmailAvailabilityInputSchema,
    CheckEmailAvailabilityOutputSchema,
    CheckPhoneAvailabilityInputSchema,
    CheckPhoneAvailabilityOutputSchema,
} from '@codezeniths/schemas/db';

export interface IUserQueries {
    getUserProfile: (
        payload: z.infer<typeof GetUserProfileInputSchema>
    ) => Promise<z.infer<typeof GetUserProfileOutputSchema>>;

    getUserSocials: (
        payload: z.infer<typeof GetUserSocialsInputSchema>
    ) => Promise<z.infer<typeof GetUserSocialsOutputSchema>>;

    getUserProgress: (
        payload: z.infer<typeof GetUserProgressInputSchema>
    ) => Promise<z.infer<typeof GetUserProgressOutputSchema>>;

    getUserPreferences: (
        payload: z.infer<typeof GetUserPreferencesInputSchema>
    ) => Promise<z.infer<typeof GetUserPreferencesOutputSchema>>;

    getUserActivity: (
        payload: z.infer<typeof GetUserActivityInputSchema>
    ) => Promise<z.infer<typeof GetUserActivityOutputSchema>>;

    updateUserProfile: (
        payload: z.infer<typeof UpdateUserProfileInputSchema>
    ) => Promise<z.infer<typeof UpdateUserProfileOutputSchema>>;

    updateUserImage: (
        payload: z.infer<typeof UpdateUserImageInputSchema>
    ) => Promise<z.infer<typeof UpdateUserImageOutputSchema>>;

    updateUserResume: (
        payload: z.infer<typeof UpdateUserResumeInputSchema>
    ) => Promise<z.infer<typeof UpdateUserResumeOutputSchema>>;

    updateUserRole: (
        payload: z.infer<typeof UpdateUserRoleInputSchema>
    ) => Promise<z.infer<typeof UpdateUserRoleOutputSchema>>;

    upsertUserSocials: (
        payload: z.infer<typeof UpsertUserSocialsInputSchema>
    ) => Promise<z.infer<typeof UpsertUserSocialsOutputSchema>>;

    checkUserNameAvailability: (
        payload: z.infer<typeof CheckUserNameAvailabilityInputSchema>
    ) => Promise<z.infer<typeof CheckUserNameAvailabilityOutputSchema>>;

    checkEmailAvailability: (
        payload: z.infer<typeof CheckEmailAvailabilityInputSchema>
    ) => Promise<z.infer<typeof CheckEmailAvailabilityOutputSchema>>;
    checkPhoneAvailability: (
        payload: z.infer<typeof CheckPhoneAvailabilityInputSchema>
    ) => Promise<z.infer<typeof CheckPhoneAvailabilityOutputSchema>>;
}
