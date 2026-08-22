/**
 * @file sms.service.ts
 * @description Vonage SMS Service utilizing the template registry and Messages API.
 */

import { Vonage } from '@vonage/server-sdk';
import { Channels } from '@vonage/messages';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { logger } from '@/service/logging';
import { ENV_CONFIG } from '@/config/config';
import {
  SmsPayload,
  SendOptions,
  SmsResult,
  ISmsProvider,
  smsTemplateRegistry,
  SmsTemplateRegistry,
  SmsTemplateData,
  SmsSendError,
  SmsValidationError,
  SmsTemplate,
} from './sms.types';

let vonageClient: Vonage | null = null;

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
      logger.warn(`Transient SMS failure. Retrying in ${delay}ms... (Attempt ${i}/${attempts})`);
      await new Promise(r => setTimeout(r, delay));
      delay *= 2;
    }
  }
  throw new Error('Unreachable');
}

function validateAndFormatPhone(phone: string): string {
  let p = parsePhoneNumberFromString(phone) || parsePhoneNumberFromString(phone, 'US');
  if (!p || !p.isValid()) {
    if (!phone.startsWith('+')) {
      p = parsePhoneNumberFromString('+' + phone);
    }
  }
  if (!p || !p.isValid()) {
    throw new SmsValidationError(`Invalid phone number: '${phone}'`, { phone });
  }
  return p.number;
}

function calculateSegments(body: string): { segments: number; length: number; encoding: string } {
  const isGsm7 = /^[A-Za-z0-9@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !\"#¤%&'()*+,-./:;<=>?¡ÄÖÑÜ§¿äöñüà\^{}\\[~\]|€]*$/.test(body);
  const length = body.length;
  let segments = 1;
  if (isGsm7) {
    if (length > 160) segments = Math.ceil(length / 153);
    return { segments, length, encoding: 'GSM-7' };
  } else {
    if (length > 70) segments = Math.ceil(length / 67);
    return { segments, length, encoding: 'UCS-2' };
  }
}

export class VonageSmsProvider implements ISmsProvider {
  async send(payload: SmsPayload): Promise<string> {
    try {
      if (!vonageClient) throw new SmsSendError('Vonage client not initialized');
      
      const from = payload.from || ENV_CONFIG.VONAGE_DEFAULT_FROM_NUMBER || 'CodeZeniths';

      // Send SMS using the modern Vonage Messages API
      const response = await vonageClient.messages.send({
        messageType: 'text',
        channel: Channels.SMS,
        to: payload.to,
        from,
        text: payload.body,
      });

      return response.messageUUID || 'unknown-uuid';
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Vonage messages API failed';
      throw new SmsSendError(message, { details: error });
    }
  }
}

export function createSmsService() {
  if (!vonageClient) {
    const apiKey = ENV_CONFIG.VONAGE_API_KEY;
    const apiSecret = ENV_CONFIG.VONAGE_API_SECRET;

    if (!apiKey || !apiSecret) {
      if (!ENV_CONFIG.SMS_DRY_RUN) {
        throw new SmsValidationError('Missing Vonage credentials. Both VONAGE_API_KEY and VONAGE_API_SECRET must be set.');
      }
      logger.warn('[sms:service] Vonage credentials not configured; operating in SMS_DRY_RUN mode.');
    } else {
      vonageClient = new Vonage({
        apiKey,
        apiSecret,
      });
    }
  }

  const provider = new VonageSmsProvider();
  const dedupeMap = new Map<string, number>();

  const executeSend = async (payload: SmsPayload, options?: SendOptions): Promise<SmsResult> => {
    const to = validateAndFormatPhone(payload.to);
    const from = payload.from || ENV_CONFIG.VONAGE_DEFAULT_FROM_NUMBER || 'CodeZeniths';

    const resolved = { to, body: payload.body, from };

    const seg = calculateSegments(resolved.body);
    logger.info(`SMS segments: ${seg.segments} (${seg.encoding})`);

    const dKey = options?.dedupeKey;
    if (dKey) {
      const exp = dedupeMap.get(dKey);
      if (exp && exp > Date.now()) {
        logger.info(`Skipped duplicate SMS to ${to}`, { dedupeKey: dKey });
        return { status: 'skipped-duplicate', dedupeKey: dKey };
      }
      dedupeMap.set(dKey, Date.now() + 5 * 60 * 1000);
    }

    try {
      if (ENV_CONFIG.SMS_DRY_RUN) {
        logger.info(`[DRY RUN] SMS to ${to}: ${resolved.body}`);
        return { status: 'sent', messageSid: `dry-run-${Date.now()}` };
      }

      const messageSid = await withRetry(() => provider.send(resolved));
      return { status: 'sent', messageSid };
    } catch (error: unknown) {
      if (dKey) dedupeMap.delete(dKey);
      logger.error(`SMS send failed to ${to}`, error);
      return { status: 'failed', error: error instanceof Error ? error : new SmsSendError(String(error)) };
    }
  };

  return {
    sendSms: (payload: SmsPayload, options?: SendOptions) => executeSend(payload, options),
    sendTemplatedSms: async <K extends keyof SmsTemplateRegistry>(
      name: K, to: string, data: SmsTemplateData<K>, options?: SendOptions
    ): Promise<SmsResult> => {
      const entry = smsTemplateRegistry[name];
      if (!entry) throw new SmsValidationError(`Template '${name}' not found`);
      
      const val = entry.schema.safeParse(data);
      if (!val.success) throw new SmsValidationError(`Invalid data for template '${name}'`, { errors: val.error.format() });
      
      // Interpolate double curly braces variables
      let body = entry.text;
      for (const [k, v] of Object.entries(val.data)) {
        body = body.replace(new RegExp(`{{\\s*${k}\\s*}}`, 'g'), String(v));
      }
      
      return executeSend({ to, body }, options);
    }
  };
}

let _smsServiceInstance: ReturnType<typeof createSmsService> | null = null;

/**
 * Returns the shared singleton SMS service, initialising it on first call.
 * Using a lazy getter avoids TDZ issues when the module is imported in test
 * environments where mocks are hoisted after the module-level const would run.
 */
export const smsService = new Proxy({} as ReturnType<typeof createSmsService>, {
  get(_target, prop: string) {
    if (!_smsServiceInstance) {
      _smsServiceInstance = createSmsService();
    }
    return (_smsServiceInstance as Record<string, unknown>)[prop];
  },
});

