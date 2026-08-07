import { z } from 'zod';
import { AppError } from '@/service/error/error';
import { ErrorCode } from '@/service/error/error.types';

// ==========================================
// FCM TEMPLATE ENUMS
// ==========================================

export enum FcmTemplate {
  USER_LOGIN = 'user_login',
  NEW_DEVICE = 'new_device',
  STREAK_REMINDER = 'streak_reminder',
  PROBLEM_SOLVED = 'problem_solved',
  MODULE_MASTERED = 'module_mastered',
  NEW_CONTENT = 'new_content',
  PAYMENT_SUCCESS = 'payment_success',
  PAYMENT_FAILED = 'payment_failed',
  ADMIN_ANNOUNCEMENT = 'admin_announcement',
}

// ==========================================
// PAYLOADS & CONFIGS
//
// NOTE: As of firebase-admin v14.1.0, the FCM Send API targets Firebase
// Installation IDs (FIDs) via `fid` / `fids` instead of the deprecated
// `token` / `tokens` fields. A FID identifies one app *instance* (one
// browser install, one native app install) — never assume it maps 1:1 to
// a user; a user can and will have many FIDs across devices.
// ==========================================

export interface FcmPayload {
  /** Firebase Installation IDs to target. 1 = single send, 2+ = multicast. */
  fids: string[];
  title: string;
  body: string;
  link?: string;
  data?: Record<string, string>;
  image?: string;
  badge?: string;
  icon?: string;
  tag?: string;
  renotify?: boolean;
  actions?: Array<{ action: string; title: string; icon?: string }>;
}

export type FcmResult =
  | {
      status: 'sent';
      success: true;
      responseId?: string;
      successCount?: number;
      failureCount?: number;
      /**
       * FIDs that Firebase reported as dead (unregistered/invalid) in this
       * send attempt. Callers MUST delete these from DeviceToken so we stop
       * paying the cost of sending to installs that will never receive it.
       */
      invalidFids?: string[];
    }
  | { status: 'skipped-dry-run'; success: true }
  | { status: 'failed'; error: Error; success: false };

export interface IFcmProvider {
  send(payload: FcmPayload): Promise<FcmResult>;
}

// ==========================================
// TYPED TEMPLATE REGISTRY
// ==========================================

export const fcmTemplateRegistry = {
  [FcmTemplate.USER_LOGIN]: {
    schema: z.object({
      timestamp: z.string(),
    }),
    title: 'New Login Detected',
    body: 'You successfully logged into your account at {{timestamp}}.',
  },
  [FcmTemplate.NEW_DEVICE]: {
    schema: z.object({
      deviceName: z.string(),
      timestamp: z.string(),
    }),
    title: 'New Device Sign-in Alert',
    body: 'A new sign-in was detected on device {{deviceName}} at {{timestamp}}.',
  },
  [FcmTemplate.STREAK_REMINDER]: {
    schema: z.object({
      days: z.number().int().nonnegative(),
    }),
    title: "Don't Break Your Streak! 🔥",
    body: 'You are on an active {{days}}-day streak. Solve a problem today to keep it going!',
  },
  [FcmTemplate.PROBLEM_SOLVED]: {
    schema: z.object({
      problemName: z.string(),
    }),
    title: 'Problem Solved! 🎉',
    body: 'Congratulations! You solved: "{{problemName}}". Keep up the amazing work!',
  },
  [FcmTemplate.MODULE_MASTERED]: {
    schema: z.object({
      moduleName: z.string(),
    }),
    title: 'Module Mastered! 🏆',
    body: 'Outstanding! You have mastered the entire {{moduleName}} module.',
  },
  [FcmTemplate.NEW_CONTENT]: {
    schema: z.object({
      title: z.string(),
      contentType: z.string(),
    }),
    title: 'New Content Available 📚',
    body: 'A new {{contentType}} has been published: "{{title}}". Check it out now!',
  },
  [FcmTemplate.PAYMENT_SUCCESS]: {
    schema: z.object({
      amount: z.string(),
    }),
    title: 'Payment Confirmed! 💳',
    body: 'We have received your payment of {{amount}}. Thank you for your support!',
  },
  [FcmTemplate.PAYMENT_FAILED]: {
    schema: z.object({
      amount: z.string(),
      reason: z.string(),
    }),
    title: 'Payment Action Required ⚠️',
    body: 'Your payment of {{amount}} failed due to: {{reason}}. Please retry to prevent subscription suspension.',
  },
  [FcmTemplate.ADMIN_ANNOUNCEMENT]: {
    schema: z.object({
      title: z.string(),
      message: z.string(),
    }),
    title: '{{title}}',
    body: '{{message}}',
  },
} satisfies Record<FcmTemplate, { schema: z.ZodType; title: string; body: string }>;

export type FcmTemplateRegistry = typeof fcmTemplateRegistry;
export type FcmTemplateData<K extends keyof FcmTemplateRegistry> = z.infer<FcmTemplateRegistry[K]['schema']>;

// ==========================================
// ERROR EXTENSIONS
// ==========================================

export class FcmError extends AppError {
  constructor(
    message: string,
    code: ErrorCode = ErrorCode.INTERNAL_SERVER_ERROR,
    metadata: Record<string, unknown> = {}
  ) {
    super(message, code, undefined, metadata, true);
  }
}

export class FcmSendError extends FcmError {
  constructor(message: string, metadata: Record<string, unknown> = {}) {
    super(message, ErrorCode.MICROSERVICE_ERROR, metadata);
  }
}

export class FcmValidationError extends FcmError {
  constructor(message: string, metadata: Record<string, unknown> = {}) {
    super(message, ErrorCode.VALIDATION_ERROR, metadata);
  }
}