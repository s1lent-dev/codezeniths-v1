/**
 * @file mail.types.ts
 * @description Type definitions, interfaces, registries, and schemas for the Mail Service.
 * 
 * Usage:
 * Register new React components by adding them to the `mailTemplateRegistry` object below.
 */

import { z } from 'zod';
import { AppError } from '@/service/error/error';
import { ErrorCode } from '@/service/error/error.types';

// ==========================================
// MAIL TEMPLATE ENUMS
// ==========================================

export enum MailTemplate {
  WELCOME = 'welcome',
  VERIFY = 'verify',
  OTP = 'otp',
  MAGIC_LINK = 'magic_link',
  RESET_PASSWORD = 'reset_password',
  NEW_DEVICE = 'new_device',
  OAUTH_LOGIN = 'oauth_login',
  PASSWORD_CHANGED = 'password_changed',
  SESSION_REVOKED = 'session_revoked',
  ACCOUNT_DEACTIVATED = 'account_deactivated',
  ACCOUNT_REACTIVATED = 'account_reactivated',
  WEEKLY_DIGEST = 'weekly_digest',
  STREAK_MILESTONE = 'streak_milestone',
  SUBSCRIPTION_CONFIRMED = 'subscription_confirmed',
  SUBSCRIPTION_CANCELLED = 'subscription_cancelled',
  PAYMENT_FAILED = 'payment_failed',
  PAYMENT_RECEIPT = 'payment_receipt',
  ADMIN_BROADCAST = 'admin_broadcast',
  PASSWORDLESS_CREDENTIALS = 'passwordless_credentials',
}

// ==========================================
// PAYLOADS & CONFIGS
// ==========================================

export interface EmailPayload {
  to: string | string[];
  from?: { email: string; name?: string };
  subject?: string;
  html?: string;
  text?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
  attachments?: Array<{
    content: string; // Base64 encoded string
    filename: string;
    type?: string;
    disposition?: string;
    contentId?: string;
  }>;
  categories?: string[];
  sendAt?: number; // Unix timestamp
  trackingSettings?: {
    clickTracking?: boolean;
    openTracking?: boolean;
  };
}

export interface SendOptions {
  dedupeKey?: string;
}

export type MailResult =
  | { status: 'sent'; messageId: string }
  | { status: 'skipped-duplicate'; dedupeKey: string }
  | { status: 'failed'; error: Error };

// ==========================================
// ADAPTER INTERFACE
// ==========================================

export interface IMailProvider {
  /**
   * Dispatches an email message using the underlying SendGrid SDK.
   * Returns the message-id on success.
   */
  send(payload: EmailPayload, sandboxMode?: boolean): Promise<string>;
}

// ==========================================
// TYPED LOCAL METADATA REGISTRY
// ==========================================

export const mailTemplateRegistry = {
  [MailTemplate.WELCOME]: {
    schema: z.object({
      name: z.string(),
    }),
    defaultSubject: 'Welcome to CodeZeniths!',
  },
  [MailTemplate.VERIFY]: {
    schema: z.object({
      name: z.string(),
      verifyUrl: z.string().url(),
      token: z.string(),
    }),
    defaultSubject: 'Verify Your Email Address',
  },
  [MailTemplate.OTP]: {
    schema: z.object({
      name: z.string(),
      code: z.string(),
      expiryMinutes: z.number(),
    }),
    defaultSubject: 'Your One-Time Password (OTP)',
  },
  [MailTemplate.MAGIC_LINK]: {
    schema: z.object({
      name: z.string(),
      loginUrl: z.string().url(),
    }),
    defaultSubject: 'Your Magic Sign-In Link',
  },
  [MailTemplate.RESET_PASSWORD]: {
    schema: z.object({
      name: z.string(),
      resetUrl: z.string().url(),
      expiryMinutes: z.number(),
    }),
    defaultSubject: 'Reset Your Password',
  },
  [MailTemplate.NEW_DEVICE]: {
    schema: z.object({
      name: z.string(),
      deviceName: z.string(),
      location: z.string(),
      time: z.string(),
    }),
    defaultSubject: 'New Device Login Detected',
  },
  [MailTemplate.OAUTH_LOGIN]: {
    schema: z.object({
      name: z.string(),
      provider: z.string(),
    }),
    defaultSubject: 'Successful OAuth Login',
  },
  [MailTemplate.PASSWORD_CHANGED]: {
    schema: z.object({
      name: z.string(),
    }),
    defaultSubject: 'Your Password Has Been Changed',
  },
  [MailTemplate.SESSION_REVOKED]: {
    schema: z.object({
      name: z.string(),
      deviceName: z.string(),
      location: z.string(),
    }),
    defaultSubject: 'Login Session Revoked',
  },
  [MailTemplate.ACCOUNT_DEACTIVATED]: {
    schema: z.object({
      name: z.string(),
    }),
    defaultSubject: 'Your Account Has Been Deactivated',
  },
  [MailTemplate.ACCOUNT_REACTIVATED]: {
    schema: z.object({
      name: z.string(),
    }),
    defaultSubject: 'Your Account Has Been Reactivated',
  },
  [MailTemplate.WEEKLY_DIGEST]: {
    schema: z.object({
      name: z.string(),
      summaryUrl: z.string().url(),
    }),
    defaultSubject: 'Your Weekly Coding Digest',
  },
  [MailTemplate.STREAK_MILESTONE]: {
    schema: z.object({
      name: z.string(),
      streakCount: z.number(),
    }),
    defaultSubject: 'Congratulations on Your Streak Milestone!',
  },
  [MailTemplate.SUBSCRIPTION_CONFIRMED]: {
    schema: z.object({
      name: z.string(),
      planName: z.string(),
      price: z.string(),
      nextBillingDate: z.string(),
    }),
    defaultSubject: 'Subscription Confirmed!',
  },
  [MailTemplate.SUBSCRIPTION_CANCELLED]: {
    schema: z.object({
      name: z.string(),
      planName: z.string(),
      expiryDate: z.string(),
    }),
    defaultSubject: 'Subscription Cancelled',
  },
  [MailTemplate.PAYMENT_FAILED]: {
    schema: z.object({
      name: z.string(),
      planName: z.string(),
      amount: z.string(),
      retryLink: z.string().url(),
    }),
    defaultSubject: 'Action Required: Payment Failed',
  },
  [MailTemplate.PAYMENT_RECEIPT]: {
    schema: z.object({
      name: z.string(),
      receiptId: z.string(),
      amount: z.string(),
      date: z.string(),
    }),
    defaultSubject: 'Receipt for Your Payment',
  },
  [MailTemplate.ADMIN_BROADCAST]: {
    schema: z.object({
      title: z.string(),
      message: z.string(),
    }),
    defaultSubject: 'Announcement from Admin',
  },
  [MailTemplate.PASSWORDLESS_CREDENTIALS]: {
    schema: z.object({
      name: z.string(),
      password: z.string(),
    }),
    defaultSubject: 'Your CodeZeniths Account Password',
  },
} satisfies Record<
  MailTemplate,
  {
    schema: z.ZodType;
    defaultSubject: string;
  }
>;

export type MailTemplateRegistry = typeof mailTemplateRegistry;
export type MailTemplateData<K extends keyof MailTemplateRegistry> = z.infer<MailTemplateRegistry[K]['schema']>;

// ==========================================
// ERROR EXTENSIONS
// ==========================================

export class MailError extends AppError {
  constructor(
    message: string,
    code: ErrorCode = ErrorCode.INTERNAL_SERVER_ERROR,
    metadata: Record<string, unknown> = {}
  ) {
    super(message, code, undefined, metadata, true);
  }
}

export class MailSendError extends MailError {
  constructor(message: string, metadata: Record<string, unknown> = {}) {
    super(message, ErrorCode.MICROSERVICE_ERROR, metadata);
  }
}

export class MailValidationError extends MailError {
  constructor(message: string, metadata: Record<string, unknown> = {}) {
    super(message, ErrorCode.VALIDATION_ERROR, metadata);
  }
}
