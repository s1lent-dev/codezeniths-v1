import { z } from 'zod';

export const SendContactMessageTRPCInputSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().email('Please enter a valid email address'),
    subject: z.string().min(3, 'Subject must be at least 3 characters').max(200),
    phone: z.string().optional(),
    message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
    clientTheme: z.enum(['dark', 'light']).optional().default('dark'),
});

export const SendContactMessageTRPCOutputSchema = z.object({
    success: z.boolean(),
    message: z.string(),
});

export type SendContactMessageTRPCInput = z.infer<typeof SendContactMessageTRPCInputSchema>;
export type SendContactMessageTRPCOutput = z.infer<typeof SendContactMessageTRPCOutputSchema>;
