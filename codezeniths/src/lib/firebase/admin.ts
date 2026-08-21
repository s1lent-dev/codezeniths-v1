import { initializeApp, getApps, cert, App, ServiceAccount } from 'firebase-admin/app';
import {
  getMessaging,
  Messaging,
  FidMessage,
  FidMulticastMessage,
  SendResponse,
} from 'firebase-admin/messaging';
import { ENV_CONFIG } from '@/config/config';
import { logger } from '@/service/logging';
import {
  FcmPayload,
  FcmResult,
  IFcmProvider,
  fcmTemplateRegistry,
  FcmTemplateRegistry,
  FcmTemplateData,
  FcmValidationError,
  FcmSendError,
} from './types';

/**
 * Firebase error codes seen for dead app-instances (uninstalled app,
 * revoked push permission, cleared site data, etc). This SDK path (fid/fids
 * on the Send API, firebase-admin >= 14.1.0) is only weeks old at the time
 * of writing and Google hasn't published an exhaustive FID-specific error
 * code list yet — this is a best-effort match against the token-era codes
 * plus generic "not registered"/"invalid argument" substrings. Watch your
 * logs (`logger.warn` below prints the raw code) and tighten this list once
 * you've observed real failures in production.
 */
const DEAD_FID_ERROR_PATTERNS = [
  'not-registered',
  'invalid-argument',
  'registration-token-not-registered',
  'unregistered',
];

function isDeadFidError(code: string | undefined): boolean {
  if (!code) return false;
  return DEAD_FID_ERROR_PATTERNS.some((pattern) => code.includes(pattern));
}

export class FirebaseAdminProvider implements IFcmProvider {
  private messagingInstance: Messaging | null = null;
  private appInstance: App | null = null;

  constructor() {
    this.initFirebase();
  }

  private initFirebase(): void {
    try {
      const apps = getApps();
      if (apps.length === 0) {
        const serviceAccount: ServiceAccount = {
          projectId: ENV_CONFIG.FCM_ADMIN_PROJECT_ID,
          clientEmail: ENV_CONFIG.FCM_ADMIN_CLIENT_EMAIL,
          privateKey: ENV_CONFIG.FCM_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
        };

        this.appInstance = initializeApp({
          credential: cert(serviceAccount),
        });
      } else {
        this.appInstance = apps[0];
      }

      this.messagingInstance = getMessaging(this.appInstance);
    } catch (error: unknown) {
      console.error('Failed to initialize Firebase Admin SDK in provider:', error);
    }
  }

  async send(payload: FcmPayload): Promise<FcmResult> {
    if (!this.messagingInstance) {
      return {
        status: 'failed',
        success: false,
        error: new FcmSendError('FCM Admin Messaging service not initialized'),
      };
    }

    try {
      const { title, body, fids, link, data, image, badge, icon, tag, renotify, actions } = payload;

      const enhancedData: Record<string, string> = {
        ...data,
        ...(link ? { link } : {}),
      };

      if (actions) {
        enhancedData.actions = JSON.stringify(actions);
      }
      if (badge) enhancedData.badge = badge;
      if (tag) enhancedData.tag = tag;
      if (renotify !== undefined) enhancedData.renotify = String(renotify);
      if (image) enhancedData.image = image;

      const webpushConfig = {
        fcmOptions: {
          link: link || ENV_CONFIG.NEXT_PUBLIC_APP_URL,
        },
        notification: {
          icon: icon || '/icon.svg',
          ...(image && { image }),
        },
      };

      if (fids.length === 1) {
        const msg: FidMessage = {
          fid: fids[0],
          notification: { title, body, ...(image && { imageUrl: image }) },
          data: enhancedData,
          webpush: webpushConfig,
        };

        try {
          const responseId = await this.messagingInstance.send(msg);
          return {
            status: 'sent',
            success: true,
            responseId,
            successCount: 1,
            failureCount: 0,
          };
        } catch (sendError: unknown) {
          const code = this.extractErrorCode(sendError);
          if (isDeadFidError(code)) {
            logger.warn(`[FCM] Dead FID detected on single send (code: ${code ?? 'unknown'})`);
            return {
              status: 'sent',
              success: true,
              successCount: 0,
              failureCount: 1,
              invalidFids: [fids[0]],
            };
          }
          throw sendError;
        }
      }

      const multicastMsg: FidMulticastMessage = {
        fids,
        notification: { title, body, ...(image && { imageUrl: image }) },
        data: enhancedData,
        webpush: webpushConfig,
      };

      const res = await this.messagingInstance.sendEachForMulticast(multicastMsg);

      const invalidFids = res.responses
        .map((r: SendResponse, i: number) => ({ r, fid: fids[i] }))
        .filter(({ r }) => !r.success && isDeadFidError(r.error?.code))
        .map(({ fid }) => fid);

      if (invalidFids.length > 0) {
        logger.warn(`[FCM] ${invalidFids.length} dead FID(s) detected in multicast send`);
      }

      return {
        status: 'sent',
        success: true,
        successCount: res.successCount,
        failureCount: res.failureCount,
        ...(invalidFids.length > 0 ? { invalidFids } : {}),
      };
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      return {
        status: 'failed',
        success: false,
        error: new FcmSendError(err.message, { originalError: err }),
      };
    }
  }

  private extractErrorCode(error: unknown): string | undefined {
    if (error && typeof error === 'object' && 'code' in error) {
      return String((error as { code: unknown }).code);
    }
    return undefined;
  }
}

export class FcmAdminService {
  private static instance: FcmAdminService;
  private readonly provider: IFcmProvider;

  private constructor(provider?: IFcmProvider) {
    this.provider = provider ?? new FirebaseAdminProvider();
  }

  public static getInstance(provider?: IFcmProvider): FcmAdminService {
    if (!FcmAdminService.instance) {
      FcmAdminService.instance = new FcmAdminService(provider);
    }
    return FcmAdminService.instance;
  }

  /**
   * Dispatches a push notification to target Firebase Installation IDs.
   * Respects FCM_DRY_RUN config and logs message actions if enabled.
   *
   * Callers are responsible for deleting any `invalidFids` returned in the
   * result from the DeviceToken table — this service does not touch the
   * database itself, to keep it decoupled from Prisma.
   */
  async sendNotification(payload: FcmPayload): Promise<FcmResult> {
    if (!payload.fids || payload.fids.length === 0) {
      throw new FcmValidationError('At least one Firebase Installation ID (FID) is required to send notifications');
    }

    try {
      if (ENV_CONFIG.FCM_DRY_RUN) {
        logger.info(`[FCM DRY RUN] Sending Push to ${payload.fids.length} devices. Title: "${payload.title}" | Body: "${payload.body}" | Link: "${payload.link || ''}"`);
        return { status: 'skipped-dry-run', success: true };
      }

      logger.info(`[FCM] Sending Push to ${payload.fids.length} devices. Title: "${payload.title}" | Body: "${payload.body}" | Link: "${payload.link || ''}"`);

      return await this.provider.send(payload);
    } catch (error: unknown) {
      logger.error('FCM sendNotification failed:', error);
      return {
        status: 'failed',
        success: false,
        error: error instanceof Error ? error : new Error(String(error)),
      };
    }
  }

  /**
   * Compiles and triggers a template-based push notification.
   * Validates parameters against template registry schemas, interpolates variables, and sends.
   */
  async sendTemplatedNotification<K extends keyof FcmTemplateRegistry>(
    name: K,
    fids: string[],
    data: FcmTemplateData<K>,
    options?: { link?: string; data?: Record<string, string> }
  ): Promise<FcmResult> {
    const entry = fcmTemplateRegistry[name];
    if (!entry) {
      throw new FcmValidationError(`Push notification template '${name}' not found in registry`);
    }

    const parseResult = entry.schema.safeParse(data);
    if (!parseResult.success) {
      throw new FcmValidationError(`Invalid data fields for push template '${name}'`, {
        errors: parseResult.error.format(),
      });
    }

    let title = entry.title;
    let body = entry.body;

    // Interpolate double curly braces template variables
    for (const [key, val] of Object.entries(parseResult.data)) {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      title = title.replace(regex, String(val));
      body = body.replace(regex, String(val));
    }

    return this.sendNotification({
      fids,
      title,
      body,
      link: options?.link,
      data: options?.data,
    });
  }
}

export const fcmAdminService = FcmAdminService.getInstance();