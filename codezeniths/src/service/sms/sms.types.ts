/**
 * @file sms.types.ts
 * @description Type definitions, interfaces, registries, and schemas for the SMS Service.
 * 
 * Usage:
 * Register new SMS templates by adding them to the `smsTemplateRegistry` object below.
 */

import { z } from 'zod';
import { AppError } from '@/service/error/error';
import { ErrorCode } from '@/service/error/error.types';

// ==========================================
// SMS TEMPLATE ENUMS
// ==========================================

export enum SmsTemplate {
  OTP = 'otp',
  MAGIC_LINK = 'magic_link',
  NEW_DEVICE = 'new_device',
  PAYMENT_FAILED = 'payment_failed',
  SUBSCRIPTION_RENEWAL = 'subscription_renewal',
  ACCOUNT_LOCKED = 'account_locked',
  PASSWORDLESS_CREDENTIALS = 'passwordless_credentials',
}

// ==========================================
// PAYLOADS & CONFIGS
// ==========================================

export interface SmsPayload {
  to: string; // Recipient phone number (normalized to E.164)
  body: string; // SMS text body
  from?: string; // Optional sender phone number or Messaging Service SID override
}

export interface SendOptions {
  dedupeKey?: string;
}

export type SmsResult =
  | { status: 'sent'; messageSid: string }
  | { status: 'skipped-duplicate'; dedupeKey: string }
  | { status: 'failed'; error: Error };

// ==========================================
// ADAPTER INTERFACE
// ==========================================

export interface ISmsProvider {
  /**
   * Sends an SMS using the underlying Twilio SDK.
   * Returns the Twilio message SID on success.
   */
  send(payload: SmsPayload): Promise<string>;
}

// ==========================================
// TYPED TEMPLATE REGISTRY
// ==========================================

export const smsTemplateRegistry = {
  [SmsTemplate.OTP]: {
    schema: z.object({
      code: z.string().length(6),
      expiryMinutes: z.number(),
    }),
    text: 'Your CodeZeniths OTP is {{code}}. It expires in {{expiryMinutes}} minutes.',
  },
  [SmsTemplate.MAGIC_LINK]: {
    schema: z.object({
      name: z.string(),
      loginUrl: z.string().url(),
    }),
    text: 'Hello {{name}}, click here to log in securely to CodeZeniths: {{loginUrl}}',
  },
  [SmsTemplate.NEW_DEVICE]: {
    schema: z.object({
      name: z.string(),
      deviceName: z.string(),
      time: z.string(),
    }),
    text: 'Security Alert: New sign-in detected on {{deviceName}} at {{time}} for user {{name}}.',
  },
  [SmsTemplate.PAYMENT_FAILED]: {
    schema: z.object({
      name: z.string(),
      amount: z.string(),
      planName: z.string(),
      retryLink: z.string().url(),
    }),
    text: 'Notice: Payment of {{amount}} for {{planName}} failed. Update billing to avoid service disruption: {{retryLink}}',
  },
  [SmsTemplate.SUBSCRIPTION_RENEWAL]: {
    schema: z.object({
      name: z.string(),
      planName: z.string(),
      amount: z.string(),
      renewDate: z.string(),
    }),
    text: 'Your subscription for {{planName}} will renew on {{renewDate}} for {{amount}}. Thanks for being with CodeZeniths.',
  },
  [SmsTemplate.ACCOUNT_LOCKED]: {
    schema: z.object({
      name: z.string(),
      unlockLink: z.string().url(),
    }),
    text: 'Security notice: Account locked due to multiple failed login attempts. Reset details here: {{unlockLink}}',
  },
  [SmsTemplate.PASSWORDLESS_CREDENTIALS]: {
    schema: z.object({
      password: z.string(),
    }),
    text: 'Welcome to CodeZeniths! Your temporary password is: {{password}}. Change it at codezeniths.com/settings/security',
  },
} satisfies Record<SmsTemplate, { schema: z.ZodType; text: string }>;

export type SmsTemplateRegistry = typeof smsTemplateRegistry;
export type SmsTemplateData<K extends keyof SmsTemplateRegistry> = z.infer<SmsTemplateRegistry[K]['schema']>;

// ==========================================
// ERROR EXTENSIONS
// ==========================================

export class SmsError extends AppError {
  constructor(
    message: string,
    code: ErrorCode = ErrorCode.INTERNAL_SERVER_ERROR,
    metadata: Record<string, unknown> = {}
  ) {
    super(message, code, undefined, metadata, true);
  }
}

export class SmsSendError extends SmsError {
  constructor(message: string, metadata: Record<string, unknown> = {}) {
    super(message, ErrorCode.MICROSERVICE_ERROR, metadata);
  }
}

export class SmsValidationError extends SmsError {
  constructor(message: string, metadata: Record<string, unknown> = {}) {
    super(message, ErrorCode.VALIDATION_ERROR, metadata);
  }
}
