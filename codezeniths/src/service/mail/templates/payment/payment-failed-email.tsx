/**
 * @file payment-failed-email.tsx
 * @description Urgent notice when a recurring payment fails.
 */

import * as React from 'react';
import { EmailLayout } from '../../widgets/email-layout';
import { EmailParagraph, EmailInfoTable, EmailButton, EmailCallout } from '../../components';

export interface PaymentFailedEmailProps {
  name?: string;
  planName?: string;
  amount?: string;
  retryLink?: string;
  theme?: 'dark' | 'light';
}

export const PaymentFailedEmail: React.FC<PaymentFailedEmailProps> = ({
  name = 'Alex Rivera',
  planName = 'Premium Plan',
  amount = '$29.99',
  retryLink,
  theme = 'dark',
}) => {
  const isDark = theme !== 'light';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://codezeniths.com';
  const targetUrl = retryLink || `${appUrl}/settings`;

  const rows = [
    { label: 'Attempted Plan', value: planName },
    { label: 'Amount Due', value: amount, isEmphasized: true },
    { label: 'Status', value: 'Payment Failed' },
  ];

  return (
    <EmailLayout
      title="Action Required: Payment Failed ⚠️"
      previewText={`We couldn't process your payment of ${amount} for CodeZeniths.`}
      categoryBadge="Billing Alert"
      badgeVariant="danger"
      theme={theme}
    >
      <EmailParagraph isDark={isDark}>
        Hello <strong className={isDark ? 'text-white' : 'text-body-light'}>{name}</strong>,
      </EmailParagraph>
      <EmailParagraph isDark={isDark}>
        We were unable to process the recurring payment for your CodeZeniths subscription.
      </EmailParagraph>

      <EmailInfoTable title="Failed Charge Details" rows={rows} isDark={isDark} />

      <EmailCallout isDark={isDark} variant="danger" title="Service Grace Period:">
        To avoid service interruption or loss of premium cloud features, please update your payment method within the next <strong className={isDark ? 'text-white' : 'text-heading-light'}>3 days</strong>.
      </EmailCallout>

      <EmailButton href={targetUrl} isDark={isDark} variant="danger">
        Update Payment Method & Retry
      </EmailButton>
    </EmailLayout>
  );
};

export default PaymentFailedEmail;
