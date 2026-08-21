/**
 * @file preview-data.ts
 * @description Dummy / mockup data dictionary for all 22 CodeZeniths email templates.
 */

import { MailTemplate } from '../mail.types';

export const EMAIL_PREVIEW_MOCK_DATA: Record<MailTemplate, Record<string, any>> = {
  [MailTemplate.WELCOME]: {
    name: 'Alex Rivera',
  },
  [MailTemplate.VERIFY]: {
    name: 'Alex Rivera',
    verifyUrl: 'https://codezeniths.com/verify-email?token=cz_ver_99281a',
    token: 'cz_ver_99281a',
  },
  [MailTemplate.OTP]: {
    name: 'Alex Rivera',
    code: '849201',
    expiryMinutes: 10,
  },
  [MailTemplate.MAGIC_LINK]: {
    name: 'Alex Rivera',
    loginUrl: 'https://codezeniths.com/magic-login?token=mag_776104bc',
  },
  [MailTemplate.RESET_PASSWORD]: {
    name: 'Alex Rivera',
    code: '849201',
    resetUrl: 'http://localhost:3000/reset-password?token=rst_552199ac',
    expiryMinutes: 60,
  },
  [MailTemplate.NEW_DEVICE]: {
    name: 'Alex Rivera',
    deviceName: 'MacBook Pro 16" (macOS 15.2, Chrome 124)',
    location: 'San Francisco, CA, USA (IP: 192.0.2.1)',
    time: 'Aug 19, 2026, 01:05 AM',
  },
  [MailTemplate.OAUTH_LOGIN]: {
    name: 'Alex Rivera',
    provider: 'GitHub',
  },
  [MailTemplate.PASSWORD_CHANGED]: {
    name: 'Alex Rivera',
  },
  [MailTemplate.SESSION_REVOKED]: {
    name: 'Alex Rivera',
    deviceName: 'iPhone 15 Pro (Safari Mobile)',
    location: 'New York, NY, USA (IP: 198.51.100.24)',
  },
  [MailTemplate.ACCOUNT_DEACTIVATED]: {
    name: 'Alex Rivera',
  },
  [MailTemplate.ACCOUNT_REACTIVATED]: {
    name: 'Alex Rivera',
  },
  [MailTemplate.PASSWORDLESS_CREDENTIALS]: {
    name: 'Alex Rivera',
    username: 'alex_zenith',
    password: 'cz_sec_9938!@#',
  },
  [MailTemplate.STREAK_MILESTONE]: {
    name: 'Alex Rivera',
    streakCount: 50,
  },
  [MailTemplate.WEEKLY_DIGEST]: {
    name: 'Alex Rivera',
    summaryUrl: 'https://codezeniths.com/profile/alex_zenith',
  },
  [MailTemplate.SUBSCRIPTION_CONFIRMED]: {
    name: 'Alex Rivera',
    planName: 'Premium Plan (Annual)',
    price: '$199.99 / year',
    nextBillingDate: 'Aug 19, 2027',
  },
  [MailTemplate.SUBSCRIPTION_RENEWED]: {
    name: 'Alex Rivera',
    planName: 'Premium Plan (Monthly)',
    amount: '$29.99',
    nextBillingDate: 'Sep 19, 2026',
  },
  [MailTemplate.SUBSCRIPTION_CANCELLED]: {
    name: 'Alex Rivera',
    planName: 'Premium Plan',
    expiryDate: 'Sep 19, 2026',
  },
  [MailTemplate.SUBSCRIPTION_EXPIRED]: {
    name: 'Alex Rivera',
    planName: 'Premium Plan',
  },
  [MailTemplate.PAYMENT_RECEIPT]: {
    name: 'Alex Rivera',
    receiptId: 'inv_cz_8829104',
    amount: '$29.99',
    date: 'Aug 19, 2026',
  },
  [MailTemplate.PAYMENT_FAILED]: {
    name: 'Alex Rivera',
    planName: 'Premium Plan',
    amount: '$29.99',
    retryLink: 'https://codezeniths.com/settings',
  },
  [MailTemplate.PAYMENT_REFUND]: {
    name: 'Alex Rivera',
    amount: '$29.99',
    paymentIntentId: 'pi_cz_refund_771920',
  },
  [MailTemplate.ADMIN_BROADCAST]: {
    title: 'System Design Track & Cloud Compiler 2.0 Released 🚀',
    message:
      'We are thrilled to announce that our new Distributed Systems Track is now live! Explore 40+ new interactive architecture scenarios and test your concurrent services with live load simulation.',
    name: 'Alex Rivera',
    actionUrl: 'https://codezeniths.com/roadmaps',
    actionText: 'Explore System Design Track',
  },
};
