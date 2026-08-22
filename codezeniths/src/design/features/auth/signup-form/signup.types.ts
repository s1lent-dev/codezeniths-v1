import { z } from 'zod';
import { passwordRegex } from './signup.utils';
import { validatePhoneNumber } from '@/utils/phone.utils';

export const SignupSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    countryCode: z.string().optional(),
    phone: z.string().optional(),
    password: z.string().regex(passwordRegex, 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
}).superRefine((data, ctx) => {
    if (data.phone && data.phone.trim().length > 0) {
        const validation = validatePhoneNumber({
            countryCode: data.countryCode || '+1',
            nationalNumber: data.phone,
            isRequired: false,
        });
        if (!validation.isValid) {
            ctx.addIssue({
                code: 'custom',
                message: validation.error || "Please enter a valid phone number for the selected country code",
                path: ["phone"],
            });
        }
    }
});

export type SignupFormValues = z.infer<typeof SignupSchema>;
export type PasswordStrength = 'none' | 'weak' | 'fair' | 'good' | 'strong';

export interface PasswordRequirements {
    length: boolean;
    casing: boolean;
    number: boolean;
    symbol: boolean;
}
