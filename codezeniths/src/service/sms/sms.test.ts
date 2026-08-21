import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Vonage } from '@vonage/server-sdk';
import { createSmsService } from './sms.service';
import { SmsValidationError, SmsTemplate } from './sms.types';
import { ENV_CONFIG } from '@/config/config';

const mockSend = vi.fn();
vi.mock('@vonage/server-sdk', () => {
  return {
    Vonage: vi.fn().mockImplementation(function (this: any) {
      this.messages = {
        send: mockSend,
      };
    }),
  };
});

vi.mock('@/config/config', () => {
  return {
    ENV_CONFIG: {
      VONAGE_API_KEY: 'vonage_api_key_test',
      VONAGE_API_SECRET: 'vonage_api_secret_test',
      VONAGE_DEFAULT_FROM_NUMBER: 'CodeZeniths',
      SMS_DRY_RUN: false,
    },
  };
});

describe('SMS Service Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
    (ENV_CONFIG as any).VONAGE_API_KEY = 'vonage_api_key_test';
    (ENV_CONFIG as any).VONAGE_API_SECRET = 'vonage_api_secret_test';
    (ENV_CONFIG as any).VONAGE_DEFAULT_FROM_NUMBER = 'CodeZeniths';
    (ENV_CONFIG as any).SMS_DRY_RUN = false;
  });

  describe('Initialization & Configuration', () => {
    it('should throw SmsValidationError on invalid config missing credentials', () => {
      (ENV_CONFIG as any).VONAGE_API_KEY = undefined;
      (ENV_CONFIG as any).VONAGE_API_SECRET = undefined;

      expect(() => createSmsService()).toThrow(SmsValidationError);
    });

    it('should initialize using Vonage API Key and Secret', () => {
      createSmsService();
      expect(Vonage).toHaveBeenCalledWith({
        apiKey: 'vonage_api_key_test',
        apiSecret: 'vonage_api_secret_test',
      });
    });
  });

  describe('Phone Validation & Normalization', () => {
    it('should successfully format valid numbers to E.164 and send', async () => {
      mockSend.mockResolvedValueOnce({
        messageUUID: 'VN123',
      });

      const service = createSmsService();
      const result = await service.sendSms({
        to: '206 456-7891',
        body: 'Hello World',
      });

      expect(result).toEqual({ status: 'sent', messageSid: 'VN123' });
      expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({
        to: '+12064567891',
        text: 'Hello World',
        from: 'CodeZeniths',
        channel: 'sms',
      }));
    });

    it('should throw validation error when recipient phone is invalid', async () => {
      const service = createSmsService();

      await expect(
        service.sendSms({
          to: 'not-a-phone-number',
          body: 'Test content',
        })
      ).rejects.toThrow(SmsValidationError);

      expect(mockSend).not.toHaveBeenCalled();
    });
  });

  describe('Templated SMS', () => {
    it('should validate dynamic data and interpolate matching template variables', async () => {
      mockSend.mockResolvedValueOnce({
        messageUUID: 'VNtpl',
      });

      const service = createSmsService();
      const result = await service.sendTemplatedSms(SmsTemplate.OTP, '+12064567891', {
        code: '987654',
        expiryMinutes: 10,
      });

      expect(result).toEqual({ status: 'sent', messageSid: 'VNtpl' });
      expect(mockSend).toHaveBeenCalledWith({
        to: '+12064567891',
        text: 'Your CodeZeniths OTP is 987654. It expires in 10 minutes.',
        from: 'CodeZeniths',
        channel: 'sms',
        messageType: 'text',
      });
    });
  });

  describe('Deduplication & Dry Run', () => {
    it('should skip duplicate SMS sends matching dedupeKey', async () => {
      mockSend.mockResolvedValue({
        messageUUID: 'VNdedupe',
      });

      const service = createSmsService();
      const options = { dedupeKey: 'sms-key-1' };

      const res1 = await service.sendSms({ to: '+12064567891', body: 'Msg 1' }, options);
      const res2 = await service.sendSms({ to: '+12064567891', body: 'Msg 2' }, options);

      expect(res1).toEqual({ status: 'sent', messageSid: 'VNdedupe' });
      expect(res2).toEqual({ status: 'skipped-duplicate', dedupeKey: 'sms-key-1' });
      expect(mockSend).toHaveBeenCalledTimes(1);
    });

    it('should short-circuit SMS dispatch in dry-run mode', async () => {
      (ENV_CONFIG as any).SMS_DRY_RUN = true;
      const service = createSmsService();

      const result = await service.sendSms({ to: '+12064567891', body: 'Test dry-run' });

      expect(result.status).toBe('sent');
      expect(result.hasOwnProperty('messageSid')).toBe(true);
      expect(mockSend).not.toHaveBeenCalled();
    });
  });
});
