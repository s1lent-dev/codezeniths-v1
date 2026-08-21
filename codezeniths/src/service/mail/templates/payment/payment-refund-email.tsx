/**
 * @file payment-refund-email.tsx
 * @description Confirmation when a payment is refunded to the customer.
 */

import * as React from 'react';
import { EmailLayout } from '../../widgets/email-layout';
import { EmailParagraph, EmailInfoTable, EmailCallout } from '../../components';

export interface PaymentRefundEmailProps {
  name?: string;
  amount?: string;
  paymentIntentId?: string;
  theme?: 'dark' | 'light';
}

export const PaymentRefundEmail: React.FC<PaymentRefundEmailProps> = ({
  name = 'Alex Rivera',
  amount = '$29.99',
  paymentIntentId = 'pi_cz_refund_771920',
  theme = 'dark',
}) => {
  const isDark = theme !== 'light';

  const rows = [
    { label: 'Refund Amount', value: amount, isEmphasized: true },
    ...(paymentIntentId ? [{ label: 'Transaction ID', value: paymentIntentId }] : []),
    { label: 'Processed Date', value: new Date().toLocaleDateString() },
    { label: 'Status', value: 'Refunded (Completed)' },
  ];

  return (
    <EmailLayout
      title="Refund Confirmation"
      previewText={`Your refund of ${amount} from CodeZeniths has been processed.`}
      categoryBadge="Refund Processed"
      badgeVariant="teal"
      theme={theme}
    >
      <EmailParagraph isDark={isDark}>
        Hello <strong className={isDark ? 'text-white' : 'text-body-light'}>{name}</strong>,
      </EmailParagraph>
      <EmailParagraph isDark={isDark}>
        This is confirmation that a refund for your CodeZeniths payment was processed successfully.
      </EmailParagraph>

      <EmailInfoTable title="Refund Details" rows={rows} isDark={isDark} />

      <EmailCallout isDark={isDark} variant="info" title="Estimated Arrival:">
        Depending on your financial institution or card issuer, the refunded funds typically appear on your statement within <strong className={isDark ? 'text-white' : 'text-heading-light'}>5-10 business days</strong>.
      </EmailCallout>
    </EmailLayout>
  );
};

export default PaymentRefundEmail;
