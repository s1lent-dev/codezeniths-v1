import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMailService, BoundedDedupeMap, MAX_DEDUPE_ENTRIES } from '../mail.service';
import { ENV_CONFIG } from '@/config/config';

const mockSend = vi.fn();
vi.mock('resend', () => {
  return {
    Resend: vi.fn().mockImplementation(function (this: any) {
      this.emails = {
        send: mockSend,
      };
      return this;
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

describe('Mail Dedupe Lifecycle & Memory Management', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  describe('BoundedDedupeMap Unit Tests', () => {
    it('should export MAX_DEDUPE_ENTRIES with a value of 5000', () => {
      expect(MAX_DEDUPE_ENTRIES).toBe(5000);
    });

    it('should record keys and detect non-expired duplicates', () => {
      const map = new BoundedDedupeMap();
      map.recordDedupe('key-1', 60_000);

      expect(map.has('key-1')).toBe(true);
      expect(map.isDuplicate('key-1')).toBe(true);
      expect(map.size).toBe(1);
    });

    it('should return false for unregistered keys', () => {
      const map = new BoundedDedupeMap();
      expect(map.isDuplicate('non-existent')).toBe(false);
    });

    it('should actively delete expired entries from memory when checked via isDuplicate', () => {
      vi.useFakeTimers();
      const map = new BoundedDedupeMap();

      map.recordDedupe('expired-key', 5_000);
      expect(map.has('expired-key')).toBe(true);
      expect(map.size).toBe(1);

      // Advance time past the 5s TTL
      vi.advanceTimersByTime(5_001);

      // Checking an expired key should return false AND delete it from the underlying map
      const isDup = map.isDuplicate('expired-key');
      expect(isDup).toBe(false);
      expect(map.has('expired-key')).toBe(false);
      expect(map.size).toBe(0);
    });

    it('should prune expired entries when reaching capacity limit (5000)', () => {
      vi.useFakeTimers();
      const map = new BoundedDedupeMap();

      // Populate 5,000 entries that expire in 1000ms
      for (let i = 0; i < 5000; i++) {
        map.recordDedupe(`exp-${i}`, 1000);
      }
      expect(map.size).toBe(5000);

      // Advance time so all 5000 entries are expired
      vi.advanceTimersByTime(1001);

      // Inserting 1 more entry should prune all expired entries and insert new one
      map.recordDedupe('new-key', 60_000);

      expect(map.size).toBe(1);
      expect(map.has('new-key')).toBe(true);
      expect(map.has('exp-0')).toBe(false);
    });

    it('should evict the oldest 500 entries (FIFO) if still at capacity limit after pruning', () => {
      const map = new BoundedDedupeMap();

      // Insert 5000 unexpired entries
      for (let i = 0; i < 5000; i++) {
        map.recordDedupe(`key-${i}`, 600_000);
      }
      expect(map.size).toBe(5000);

      // Inserting the 5,001st key triggers FIFO eviction of the oldest 500 entries
      map.recordDedupe('overflow-key', 600_000);

      // Size should be 5000 - 500 + 1 = 4501
      expect(map.size).toBe(4501);
      expect(map.size).toBeLessThanOrEqual(5000);

      // First 500 entries (key-0 through key-499) must be evicted
      for (let i = 0; i < 500; i++) {
        expect(map.has(`key-${i}`)).toBe(false);
      }

      // Newer entries (e.g. key-500 through key-4999) must still exist
      expect(map.has('key-500')).toBe(true);
      expect(map.has('key-4999')).toBe(true);
      expect(map.has('overflow-key')).toBe(true);
    });

    it('should keep map size strictly bounded <= 5000 under high insertion volume', () => {
      const map = new BoundedDedupeMap();

      // Insert 12,000 unexpired entries
      for (let i = 0; i < 12_000; i++) {
        map.recordDedupe(`bulk-${i}`, 600_000);
        expect(map.size).toBeLessThanOrEqual(5000);
      }

      expect(map.size).toBeLessThanOrEqual(5000);
    });
  });

  describe('Mail Service Integration', () => {
    it('should skip duplicate email sends when dedupeKey is active', async () => {
      mockSend.mockResolvedValue({ data: { id: 'msg-1' }, error: null });
      const service = createMailService();

      const res1 = await service.sendEmail(
        { to: 'user@example.com', subject: 'Dedupe Test' },
        { dedupeKey: 'dedupe-email-1' }
      );
      const res2 = await service.sendEmail(
        { to: 'user@example.com', subject: 'Dedupe Test' },
        { dedupeKey: 'dedupe-email-1' }
      );

      expect(res1).toEqual({ status: 'sent', messageId: 'msg-1' });
      expect(res2).toEqual({ status: 'skipped-duplicate', dedupeKey: 'dedupe-email-1' });
      expect(mockSend).toHaveBeenCalledTimes(1);
    });

    it('should actively evict expired dedupeKey and permit re-send after TTL', async () => {
      vi.useFakeTimers();
      mockSend.mockResolvedValue({ data: { id: 'msg-resend' }, error: null });
      const service = createMailService();

      const res1 = await service.sendEmail(
        { to: 'user@example.com', subject: 'Dedupe Test' },
        { dedupeKey: 'ttl-key' }
      );
      expect(res1.status).toBe('sent');
      expect(mockSend).toHaveBeenCalledTimes(1);

      // Advance time past default 5 minute TTL
      vi.advanceTimersByTime(5 * 60 * 1000 + 1000);

      // Second send should evict the expired key and proceed to send
      const res2 = await service.sendEmail(
        { to: 'user@example.com', subject: 'Dedupe Test' },
        { dedupeKey: 'ttl-key' }
      );

      expect(res2.status).toBe('sent');
      expect(mockSend).toHaveBeenCalledTimes(2);
    });

    it('should evict dedupeKey if email sending fails', async () => {
      mockSend.mockRejectedValue(new Error('Resend permanent failure'));
      const service = createMailService();

      const res = await service.sendEmail(
        { to: 'user@example.com', subject: 'Fail Test' },
        { dedupeKey: 'fail-key' }
      );

      expect(res.status).toBe('failed');
      expect(service.dedupeMap.has('fail-key')).toBe(false);
    });

    it('should keep service dedupeMap strictly bounded <= 5000 under high traffic', async () => {
      mockSend.mockResolvedValue({ data: { id: 'msg-id' }, error: null });
      const service = createMailService();

      // Preload service dedupeMap with 5000 entries
      for (let i = 0; i < 5000; i++) {
        service.dedupeMap.recordDedupe(`traffic-${i}`, 600_000);
      }
      expect(service.dedupeMap.size).toBe(5000);

      // Sending another mail with new dedupeKey triggers eviction
      const res = await service.sendEmail(
        { to: 'user@example.com', subject: 'Traffic Test' },
        { dedupeKey: 'traffic-overflow' }
      );

      expect(res.status).toBe('sent');
      expect(service.dedupeMap.size).toBeLessThanOrEqual(5000);
      expect(service.dedupeMap.has('traffic-0')).toBe(false);
      expect(service.dedupeMap.has('traffic-overflow')).toBe(true);
    });
  });
});
