/**
 * @file subscription-renewed-email.tsx
 * @description Notification when a recurring subscription successfully renews.
 */

import * as React from 'react';
import { EmailLayout } from '../../widgets/email-layout';
import { EmailParagraph, EmailInfoTable, EmailButton, EmailCallout } from '../../components';

export interface SubscriptionRenewedEmailProps {
  name?: string;
  planName?: string;
  amount?: string;
  nextBillingDate?: string;
  theme?: 'dark' | 'light';
}

export const SubscriptionRenewedEmail: React.FC<SubscriptionRenewedEmailProps> = ({
  name = 'Alex Rivera',
  planName = 'Premium Plan (Monthly)',
  amount = '$29.99',
  nextBillingDate = 'Sep 19, 2026',
  theme = 'dark',
}) => {
  const isDark = theme !== 'light';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://codezeniths.com';

  const rows = [
    { label: 'Plan', value: planName, isEmphasized: true },
    { label: 'Billed Amount', value: amount },
    ...(nextBillingDate ? [{ label: 'Next Renewal Date', value: nextBillingDate }] : []),
    { label: 'Status', value: 'Active / Renewed' },
  ];

  return (
    <EmailLayout
      title="Subscription Renewed Successfully"
      previewText={`Your CodeZeniths ${planName} subscription was renewed.`}
      categoryBadge="Billing"
      badgeVariant="success"
      theme={theme}
    >
      <EmailParagraph isDark={isDark}>
        Hello <strong className={isDark ? 'text-white' : 'text-body-light'}>{name}</strong>,
      </EmailParagraph>
      <EmailParagraph isDark={isDark}>
        This is a confirmation that your recurring subscription to <strong>{planName}</strong> was renewed successfully.
      </EmailParagraph>

      <EmailInfoTable title="Renewal Details" rows={rows} isDark={isDark} />

      <EmailCallout isDark={isDark} variant="info">
        You can manage your payment methods, view invoices, or update your subscription plan at any time from your billing settings.
      </EmailCallout>

      <EmailButton href={`${appUrl}/settings`} isDark={isDark} variant="secondary">
        Manage Billing & Invoices
      </EmailButton>
    </EmailLayout>
  );
};

export default SubscriptionRenewedEmail;
