import { z } from 'zod';

export const verifyEmailSchema = z.object({
    email: z.string().optional().or(z.literal('')),
    otp: z.string().optional()
}).superRefine((data, ctx) => {
    if (!data.email || data.email.trim() === '') {
        return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        ctx.addIssue({
            code: 'custom',
            message: 'Please enter a valid email address',
            path: ['email'],
        });
    }
});

export type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>;
