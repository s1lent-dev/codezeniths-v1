import { z } from 'zod';

export const TurnstileVerificationInputSchema = z.object({
    token: z.string().min(1, 'Token is required'),
    ip: z.string().optional(),
});

export const TurnstileVerificationOutputSchema = z.object({
    success: z.boolean(),
    'error-codes': z.array(z.string()).optional(),
    challenge_ts: z.string().optional(),
    hostname: z.string().optional(),
    action: z.string().optional(),
    cdata: z.string().optional(),
});

export type TurnstileVerificationInput = z.infer<typeof TurnstileVerificationInputSchema>;
export type TurnstileVerificationOutput = z.infer<typeof TurnstileVerificationOutputSchema>;
