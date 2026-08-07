import { z } from 'zod';

export const SigninSchema = z.object({
    identifier: z.string().min(1, 'Please enter your username or email'),
    password: z.string().optional(),
});

export type SigninFormValues = z.infer<typeof SigninSchema>;
