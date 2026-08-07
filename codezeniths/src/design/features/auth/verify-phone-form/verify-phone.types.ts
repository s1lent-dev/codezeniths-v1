import { z } from 'zod';
import { isValidPhoneNumber } from 'libphonenumber-js';

export const verifyPhoneSchema = z.object({
    countryCode: z.string(),
    phoneNumber: z.string().optional().or(z.literal('')),
    otp: z.string().optional()
}).superRefine((data, ctx) => {
    if (!data.phoneNumber || data.phoneNumber.trim() === '') {
        return;
    }
    const fullNumber = `${data.countryCode}${data.phoneNumber}`.replace(/\s+/g, '');
    if (fullNumber.length > 4 && !isValidPhoneNumber(fullNumber)) {
        ctx.addIssue({
            code: 'custom',
            message: 'Please enter a valid phone number',
            path: ['phoneNumber'],
        });
    }
});

export type VerifyPhoneFormValues = z.infer<typeof verifyPhoneSchema>;
