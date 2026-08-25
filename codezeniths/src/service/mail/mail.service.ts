/**
 * @file mail.service.ts
 * @description Resend Mail Service utilizing React Email templates via a Component Factory.
 */

import { Resend } from 'resend';
import { logger } from '@/service/logging';
import { render } from 'react-email';
import * as React from 'react';
import { ENV_CONFIG } from '@/config/config';
import { EmailComponentFactory } from './templates';
import {
  EmailPayload,
  SendOptions,
  MailResult,
  IMailProvider,
  mailTemplateRegistry,
  MailTemplateRegistry,
  MailTemplateData,
  MailSendError,
  MailValidationError,
  MailTemplate,
} from './mail.types';

let resendClient: Resend | null = null;

function isTransientError(error: unknown): boolean {
  const err = error as Record<string, unknown> | null | undefined;
  const status = err?.status || (err?.statusCode as number | undefined);
  return status === 429 || (typeof status === 'number' && status >= 500 && status < 600);
}

async function withRetry<T>(fn: () => Promise<T>, attempts = 3, delay = 1000): Promise<T> {
  for (let i = 1; i <= attempts; i++) {
    try {
      return await fn();
    } catch (error: unknown) {
      if (i === attempts || !isTransientError(error)) throw error;
      logger.warn(`Transient mail failure. Retrying in ${delay}ms... (Attempt ${i}/${attempts})`);
      await new Promise(r => setTimeout(r, delay));
      delay *= 2;
    }
  }
  throw new Error('Unreachable');
}

export class ResendMailProvider implements IMailProvider {
  async send(payload: EmailPayload): Promise<string> {
    try {
      if (!resendClient) {
        throw new MailSendError('Resend client not initialized');
      }

      const fromEmail = payload.from?.email || ENV_CONFIG.RESEND_DEFAULT_FROM_EMAIL;
      const fromName = payload.from?.name || ENV_CONFIG.RESEND_DEFAULT_FROM_NAME || 'CodeZeniths';
      const fromString = `${fromName} <${fromEmail}>`;

      const attachments = payload.attachments?.map((att) => ({
        content: att.content, // base64 encoded string
        filename: att.filename,
        contentType: att.type,
      }));

      const res = await resendClient.emails.send({
        from: fromString,
        to: Array.isArray(payload.to) ? payload.to : [payload.to],
        subject: payload.subject || '',
        html: payload.html || '',
        text: payload.text || '',
        cc: payload.cc ? (Array.isArray(payload.cc) ? payload.cc : [payload.cc]) : undefined,
        bcc: payload.bcc ? (Array.isArray(payload.bcc) ? payload.bcc : [payload.bcc]) : undefined,
        replyTo: payload.replyTo,
        attachments,
      });

      if (res.error) {
        throw new MailSendError(res.error.message, { details: res.error });
      }

      return res.data?.id || 'unknown-id';
    } catch (error: unknown) {
      throw new MailSendError(error instanceof Error ? error.message : 'Resend failed', { details: error });
    }
  }
}

/**
 * React Email rendering engine.
 */
export class MailTemplateEngine {
  /**
   * Renders a React Email element into its final HTML string dynamically.
   */
  public static async render(
    element: React.ReactElement
  ): Promise<string> {
    try {
      return await render(element);
    } catch (error) {
      throw new Error(`Failed to render React Email element: ${(error as Error).message}`);
    }
  }
}

export function createMailService() {
  if (!resendClient) {
    resendClient = new Resend(ENV_CONFIG.RESEND_API_KEY);
  }

  const provider = new ResendMailProvider();
  const dedupeMap = new Map<string, number>();

  const executeSend = async (payload: EmailPayload, options?: SendOptions): Promise<MailResult> => {
    const to = Array.isArray(payload.to) ? payload.to.join(',') : payload.to;
    const from = payload.from || { email: ENV_CONFIG.RESEND_DEFAULT_FROM_EMAIL, name: ENV_CONFIG.RESEND_DEFAULT_FROM_NAME };
    const resolved = { ...payload, from };

    if (resolved.attachments) {
      for (const att of resolved.attachments) {
        if ((att.content.length * 3) / 4 > 10 * 1024 * 1024) {
          throw new MailValidationError(`Attachment ${att.filename} exceeds 10MB`);
        }
      }
    }

    const dKey = options?.dedupeKey;
    if (dKey) {
      const exp = dedupeMap.get(dKey);
      if (exp && exp > Date.now()) {
        logger.info(`Skipped duplicate email to ${to}`, { dedupeKey: dKey });
        return { status: 'skipped-duplicate', dedupeKey: dKey };
      }
      dedupeMap.set(dKey, Date.now() + 5 * 60 * 1000);
    }

    try {
      if (ENV_CONFIG.MAIL_DRY_RUN) {
        console.log(`[MAIL SERVICE] [DRY RUN] Simulating email send:`, {
          to,
          from: resolved.from,
          subject: payload.subject,
        });
        logger.info(`[DRY RUN] Mail to ${to}`);
        return { status: 'sent', messageId: `dry-run-${Date.now()}` };
      }

      console.log(`[MAIL SERVICE] Invoking Resend API to send email:`, {
        to,
        from: resolved.from,
        subject: payload.subject,
      });

      const messageId = await withRetry(() => provider.send(resolved));
      console.log(`[MAIL SERVICE] Email sent successfully via Resend. Message ID: ${messageId}`);
      return { status: 'sent', messageId };
    } catch (error: unknown) {
      if (dKey) dedupeMap.delete(dKey);
      console.error(`[MAIL SERVICE] Failed to send email to ${to}:`, error);
      logger.error(`Mail send failed to ${to}`, error);
      return { status: 'failed', error: error instanceof Error ? error : new MailSendError(String(error)) };
    }
  };

  return {
    sendEmail: (payload: EmailPayload, options?: SendOptions) => executeSend(payload, options),
    sendTemplatedEmail: async <K extends keyof MailTemplateRegistry>(
      name: K, to: string | string[], data: MailTemplateData<K>, options?: SendOptions
    ): Promise<MailResult> => {
      console.log(`[MAIL SERVICE] Resolving template: ${String(name)} for recipient: ${to}`, { data });
      const entry = mailTemplateRegistry[name];
      if (!entry) throw new MailValidationError(`Template '${name}' not found`);
      
      const val = entry.schema.safeParse(data);
      if (!val.success) {
        console.error(`[MAIL SERVICE] Template data validation failed for ${String(name)}:`, val.error.format());
        throw new MailValidationError(`Invalid data for template '${name}'`, { errors: val.error.format() });
      }
      
      // Resolve component dynamically using the factory and Zod validated payload props
      const EmailComponent = EmailComponentFactory.create(name as MailTemplate, val.data);
      const RenderedEmail = await MailTemplateEngine.render(EmailComponent);
      
      return executeSend({ 
        to, 
        subject: options?.subject || entry.defaultSubject, 
        html: RenderedEmail,
        from: options?.from,
        replyTo: options?.replyTo,
      }, options);
    }
  };
}

let _mailServiceInstance: ReturnType<typeof createMailService> | null = null;

/**
 * Returns the shared singleton mail service, initialising it on first call.
 * Using a lazy getter avoids TDZ issues when the module is imported in test
 * environments where mocks are hoisted after the module-level const would run.
 */
export const mailService = new Proxy({} as ReturnType<typeof createMailService>, {
  get(_target, prop: string) {
    if (!_mailServiceInstance) {
      _mailServiceInstance = createMailService();
    }
    return (_mailServiceInstance as Record<string, unknown>)[prop];
  },
});

