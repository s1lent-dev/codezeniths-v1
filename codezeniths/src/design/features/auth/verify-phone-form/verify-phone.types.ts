import { z } from 'zod';
import { validatePhoneNumber } from '@/utils/phone.utils';

export const verifyPhoneSchema = z.object({
    countryCode: z.string().min(1, 'Please select a country code'),
    phoneNumber: z.string().min(1, 'Phone number is required'),
    otp: z.string().optional(),
}).superRefine((data, ctx) => {
    const validation = validatePhoneNumber({
        countryCode: data.countryCode,
        nationalNumber: data.phoneNumber,
        isRequired: true,
    });
    if (!validation.isValid) {
        ctx.addIssue({
            code: 'custom',
            message: validation.error || 'Please enter a valid phone number',
            path: ['phoneNumber'],
        });
    }
});

export type VerifyPhoneFormValues = z.infer<typeof verifyPhoneSchema>;

