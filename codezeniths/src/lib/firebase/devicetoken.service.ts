import { z } from 'zod';
import { prisma } from '@codezeniths/lib/db/prisma.client';
import { fcmAdminService } from './admin';
import { FcmTemplateData, FcmTemplateRegistry, FcmTemplate } from './types';
import { deviceTokenUpsertSchema, type DeviceTokenUpsertInput } from '@/schemas/trpc/notification.schema';
export { deviceTokenUpsertSchema, type DeviceTokenUpsertInput };

/**
 * Owns the DeviceToken table: registering FIDs against a user, removing
 * them on logout, and pruning ones FCM reports as dead after a send.
 *
 * `fid` is globally unique — NOT scoped to a user — because a FID
 * identifies one browser/app install, not one account. If a different
 * user logs into the same browser, the upsert below reassigns that row
 * to them rather than creating a duplicate, so the previous user stops
 * receiving pushes on a device they're no longer using.
 */
export class DeviceTokenService {
  async upsert(userId: string, input: DeviceTokenUpsertInput) {
    const { fid, platform, userAgent } = deviceTokenUpsertSchema.parse(input);

    return prisma.deviceToken.upsert({
      where: { fid },
      update: {
        userId,
        platform,
        userAgent,
        lastUsedAt: new Date(),
      },
      create: {
        userId,
        fid,
        platform,
        userAgent,
      },
    });
  }

  /**
   * Call this on logout so a shared/work device stops receiving pushes for
   * an account the user is no longer signed into on this browser.
   */
  async remove(fid: string) {
    return prisma.deviceToken.deleteMany({ where: { fid } });
  }

  async listActiveFidsForUser(userId: string): Promise<string[]> {
    const rows = await prisma.deviceToken.findMany({
      where: { userId },
      select: { fid: true },
    });
    return rows.map((r) => r.fid);
  }

  /**
   * Deletes FIDs that FCM reported as dead in a send response. Wire this
   * into every send path — see `sendToUser` below for the pattern.
   */
  async pruneInvalidFids(fids: string[]) {
    if (fids.length === 0) return;
    await prisma.deviceToken.deleteMany({ where: { fid: { in: fids } } });
  }

  /**
   * Convenience wrapper: sends to every active device for a user and prunes
   * any FIDs the send reports as dead, so the two never drift apart.
   */
  async sendTemplatedToUser<K extends keyof FcmTemplateRegistry>(
    userId: string,
    template: K,
    data: FcmTemplateData<K>,
    options?: { link?: string; data?: Record<string, string> }
  ) {
    const fids = await this.listActiveFidsForUser(userId);
    if (fids.length === 0) return null;

    const result = await fcmAdminService.sendTemplatedNotification(template, fids, data, options);

    if (result.status === 'sent' && result.invalidFids?.length) {
      await this.pruneInvalidFids(result.invalidFids);
    }

    return result;
  }
}

export const deviceTokenService = new DeviceTokenService();

// Re-export so callers importing from this file don't also need ./types
export { FcmTemplate };