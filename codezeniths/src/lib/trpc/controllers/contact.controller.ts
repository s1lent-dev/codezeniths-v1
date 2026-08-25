import { TRPCContext } from '../trpc/trpc.context';
import {
    SendContactMessageTRPCInput,
    SendContactMessageTRPCOutput,
} from '@/schemas/trpc';
import { IContactController } from './interfaces/contact.controller.interface';
import { notificationProducer } from '@/lib/mq';
import { prisma } from '@/lib/db/prisma.client';
import { logger } from '@/service/logging';

export class ContactController implements IContactController {
    async sendMessage(args: {
        ctx: TRPCContext;
        input: SendContactMessageTRPCInput;
    }): Promise<SendContactMessageTRPCOutput> {
        const { ctx, input } = args;
        const { name, email, subject, phone, message, clientTheme } = input;

        try {
            let selectedTheme: 'dark' | 'light' = clientTheme || 'dark';
            let activeUserId: string | undefined = undefined;

            // Check if user has an active session
            if (ctx.session?.user?.id) {
                activeUserId = ctx.session.user.id;
                try {
                    const userPref = await prisma.userPreference.findUnique({
                        where: { userId: activeUserId },
                        select: { theme: true },
                    });
                    if (userPref?.theme === 'dark' || userPref?.theme === 'light') {
                        selectedTheme = userPref.theme;
                    }
                } catch (e) {
                    logger.warn('[ContactController] Failed to query user theme preference, using fallback', { error: e });
                }
            }

            const submittedAt = new Date().toLocaleString('en-US', {
                timeZone: 'UTC',
                dateStyle: 'medium',
                timeStyle: 'short',
            });

            // Dispatch message via RabbitMQ
            await notificationProducer.sendContactMessage({
                name,
                email,
                subject,
                phone: phone || undefined,
                message,
                userId: activeUserId,
                theme: selectedTheme,
                submittedAt,
            });

            logger.info('[ContactController] Contact message enqueued for delivery', { email, subject, theme: selectedTheme });

            return {
                success: true,
                message: 'Your message has been sent successfully. We will get back to you shortly!',
            };
        } catch (error: any) {
            logger.error('[ContactController] Failed to process contact message', { error });
            throw new Error(error?.message || 'Failed to submit contact message. Please try again later.');
        }
    }
}

export const contactController = new ContactController();
