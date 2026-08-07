import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Resend } from 'resend';
import { createMailService } from './mail.service';
import { MailValidationError, MailTemplate } from './mail.types';
import { ENV_CONFIG } from '@/config/config';

const mockSend = vi.fn();
vi.mock('resend', () => {
  return {
    Resend: vi.fn().mockImplementation(() => {
      return {
        emails: {
          send: mockSend,
        },
      };
    }),
  };
});

vi.mock('@/config/config', () => {
  return {
    ENV_CONFIG: {
      RESEND_API_KEY: 're_valid_key_test',
      RESEND_DEFAULT_FROM_EMAIL: 'sender@example.com',
      RESEND_DEFAULT_FROM_NAME: 'Test Sender',
      MAIL_DRY_RUN: false,
      NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
    },
  };
});

describe('Mail Service Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
    (ENV_CONFIG as any).RESEND_API_KEY = 're_valid_key_test';
    (ENV_CONFIG as any).RESEND_DEFAULT_FROM_EMAIL = 'sender@example.com';
    (ENV_CONFIG as any).RESEND_DEFAULT_FROM_NAME = 'Test Sender';
    (ENV_CONFIG as any).MAIL_DRY_RUN = false;
  });

  describe('Initialization', () => {
    it('should initialize Resend client with the correct API key', () => {
      createMailService();
      expect(Resend).toHaveBeenCalledWith(ENV_CONFIG.RESEND_API_KEY);
    });
  });

  describe('One-off Mail Sending', () => {
    it('should successfully send a valid email payload and return message ID', async () => {
      mockSend.mockResolvedValueOnce({
        data: { id: 'resend-msg-123' },
        error: null,
      });

      const service = createMailService();
      const result = await service.sendEmail({
        to: 'recipient@example.com',
        subject: 'Test Subject',
        html: '<p>Hello!</p>',
      });

      expect(result).toEqual({ status: 'sent', messageId: 'resend-msg-123' });
      expect(mockSend).toHaveBeenCalledTimes(1);
      expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({
        to: ['recipient@example.com'],
        from: 'Test Sender <sender@example.com>',
        subject: 'Test Subject',
        html: '<p>Hello!</p>',
      }));
    });

    it('should enforce attachment size limit and throw MailValidationError if exceeded', async () => {
      const service = createMailService();
      const largeContent = 'a'.repeat(15 * 1024 * 1024);

      await expect(
        service.sendEmail({
          to: 'recipient@example.com',
          subject: 'Large File',
          attachments: [
            {
              filename: 'huge.txt',
              content: largeContent,
              type: 'text/plain',
            },
          ],
        })
      ).rejects.toThrow(MailValidationError);

      expect(mockSend).not.toHaveBeenCalled();
    });
  });

  describe('Templated Sending', () => {
    it('should validate, compile, and send HTML templates successfully with valid data', async () => {
      mockSend.mockResolvedValueOnce({
        data: { id: 'resend-tpl-456' },
        error: null,
      });

      const service = createMailService();
      const result = await service.sendTemplatedEmail(
        MailTemplate.WELCOME,
        'welcome@example.com',
        {
          name: 'Alice',
        }
      );

      expect(result).toEqual({ status: 'sent', messageId: 'resend-tpl-456' });
      expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({
        to: ['welcome@example.com'],
        subject: 'Welcome to CodeZeniths!',
        html: expect.stringContaining('Welcome, Alice!'),
      }));
    });
  });

  describe('Dry Run Mode', () => {
    it('should short-circuit and log without calling Resend in dry-run mode', async () => {
      (ENV_CONFIG as any).MAIL_DRY_RUN = true;
      const service = createMailService();

      const result = await service.sendEmail({ to: 'user@example.com', subject: 'Dry Run' });
      
      expect(result.status).toBe('sent');
      expect(result.hasOwnProperty('messageId')).toBe(true);
      expect(mockSend).not.toHaveBeenCalled();
    });
  });
});
