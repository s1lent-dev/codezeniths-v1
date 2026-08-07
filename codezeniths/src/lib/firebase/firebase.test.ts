import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FcmAdminService } from './admin';
import { FcmTemplate, FcmValidationError } from './types';
import { ENV_CONFIG } from '@/config/config';

describe('FcmAdminService (FID-based Send API)', () => {
  let service: FcmAdminService;
  let sendMock: any;

  beforeEach(() => {
    vi.clearAllMocks();

    // Disable FCM dry run mode for unit test suite to trigger provider send methods
    (ENV_CONFIG as any).FCM_DRY_RUN = false;

    sendMock = vi.fn().mockResolvedValue({
      status: 'sent',
      success: true,
      responseId: 'msg_fcm_123',
      successCount: 1,
      failureCount: 0,
    });

    const mockProvider = {
      send: sendMock,
    };

    // Reset the static singleton cache for isolation
    (FcmAdminService as any).instance = undefined;
    service = FcmAdminService.getInstance(mockProvider);
  });

  it('should successfully send flat notifications to a single fid', async () => {
    const payload = {
      fids: ['fid_device_mock'],
      title: 'Login Warning',
      body: 'You logged in.',
    };

    const result = await service.sendNotification(payload);

    expect(result).toEqual({
      status: 'sent',
      success: true,
      responseId: 'msg_fcm_123',
      successCount: 1,
      failureCount: 0,
    });
    expect(sendMock).toHaveBeenCalledWith(payload);
  });

  it('should respect FCM_DRY_RUN status when enabled', async () => {
    (ENV_CONFIG as any).FCM_DRY_RUN = true;

    const payload = {
      fids: ['fid_device_mock'],
      title: 'Login Warning',
      body: 'You logged in.',
    };

    const result = await service.sendNotification(payload);

    expect(result).toEqual({
      status: 'skipped-dry-run',
      success: true,
    });
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('should fail if fids list is empty', async () => {
    const payload = {
      fids: [],
      title: 'No FID',
      body: 'Body',
    };

    await expect(service.sendNotification(payload)).rejects.toThrow(FcmValidationError);
  });

  it('should surface invalidFids from a multicast send so callers can prune DeviceToken rows', async () => {
    sendMock.mockResolvedValueOnce({
      status: 'sent',
      success: true,
      successCount: 2,
      failureCount: 1,
      invalidFids: ['fid_dead_device'],
    });

    const payload = {
      fids: ['fid_live_1', 'fid_live_2', 'fid_dead_device'],
      title: 'Streak reminder',
      body: 'Keep it going!',
    };

    const result = await service.sendNotification(payload);

    expect(result.success).toBe(true);
    if (result.status === 'sent') {
      expect(result.invalidFids).toEqual(['fid_dead_device']);
    }
  });

  it('should compile and validate templated notifications correctly', async () => {
    const fids = ['fid_user_device_99'];
    const data = { timestamp: '04:00 AM' };

    const result = await service.sendTemplatedNotification(
      FcmTemplate.USER_LOGIN,
      fids,
      data
    );

    expect(result.success).toBe(true);
    expect(sendMock).toHaveBeenCalledWith({
      fids,
      title: 'New Login Detected',
      body: 'You successfully logged into your account at 04:00 AM.',
      link: undefined,
      data: undefined,
    });
  });

  it('should compile multi-variable templates with link configurations', async () => {
    const fids = ['fid_device_abc'];
    const data = {
      deviceName: 'Chrome Browser',
      timestamp: 'June 24, 04:00 AM',
    };

    await service.sendTemplatedNotification(
      FcmTemplate.NEW_DEVICE,
      fids,
      data,
      { link: 'https://security.codezeniths.com/alerts' }
    );

    expect(sendMock).toHaveBeenCalledWith({
      fids,
      title: 'New Device Sign-in Alert',
      body: 'A new sign-in was detected on device Chrome Browser at June 24, 04:00 AM.',
      link: 'https://security.codezeniths.com/alerts',
      data: undefined,
    });
  });

  it('should fail typecheck schemas if parameters do not match', async () => {
    const fids = ['fid_device_failed'];
    const invalidData = { days: 'three_days' } as any;

    await expect(
      service.sendTemplatedNotification(
        FcmTemplate.STREAK_REMINDER,
        fids,
        invalidData
      )
    ).rejects.toThrow(FcmValidationError);
  });
});