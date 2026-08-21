/**
 * @file subscription-cancelled-email.tsx
 * @description Confirmation when user cancels their subscription.
 */

import * as React from 'react';
import { EmailLayout } from '../../widgets/email-layout';
import { EmailParagraph, EmailInfoTable, EmailButton, EmailCallout } from '../../components';

export interface SubscriptionCancelledEmailProps {
  name?: string;
  planName?: string;
  expiryDate?: string;
  theme?: 'dark' | 'light';
}

export const SubscriptionCancelledEmail: React.FC<SubscriptionCancelledEmailProps> = ({
  name = 'Alex Rivera',
  planName = 'Premium Plan',
  expiryDate = 'Sep 19, 2026',
  theme = 'dark',
}) => {
  const isDark = theme !== 'light';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://codezeniths.com';

  const rows = [
    { label: 'Cancelled Plan', value: planName, isEmphasized: true },
    { label: 'Access Valid Through', value: expiryDate },
    { label: 'Status', value: 'Pending Expiration' },
  ];

  return (
    <EmailLayout
      title="Subscription Cancellation Notice"
      previewText={`Your CodeZeniths ${planName} subscription has been cancelled.`}
      categoryBadge="Subscription"
      badgeVariant="warning"
      theme={theme}
    >
      <EmailParagraph isDark={isDark}>
        Hello <strong className={isDark ? 'text-white' : 'text-body-light'}>{name}</strong>,
      </EmailParagraph>
      <EmailParagraph isDark={isDark}>
        Your subscription to <strong>{planName}</strong> has been cancelled as requested. You will retain full premium access until the end of your current billing period.
      </EmailParagraph>

      <EmailInfoTable title="Cancellation Details" rows={rows} isDark={isDark} />

      <EmailCallout isDark={isDark} variant="warning">
        After <strong>{expiryDate}</strong>, your account will revert to the standard Free tier. All your saved code, problem statistics, and badges will remain intact.
      </EmailCallout>

      <EmailButton href={`${appUrl}/pricing`} isDark={isDark} variant="primary">
        Renew My Subscription
      </EmailButton>
    </EmailLayout>
  );
};

export default SubscriptionCancelledEmail;
