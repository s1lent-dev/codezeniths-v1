/**
 * @file payment-receipt-email.tsx
 * @description Payment receipt and invoice confirmation template.
 */

import * as React from 'react';
import { EmailLayout } from '../../widgets/email-layout';
import { EmailParagraph, EmailInfoTable, EmailButton } from '../../components';

export interface PaymentReceiptEmailProps {
  name?: string;
  receiptId?: string;
  amount?: string;
  date?: string;
  theme?: 'dark' | 'light';
}

export const PaymentReceiptEmail: React.FC<PaymentReceiptEmailProps> = ({
  name = 'Alex Rivera',
  receiptId = 'inv_cz_8829104',
  amount = '$29.99',
  date = 'Aug 19, 2026',
  theme = 'dark',
}) => {
  const isDark = theme !== 'light';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://codezeniths.com';

  const rows = [
    { label: 'Receipt / Invoice ID', value: receiptId },
    { label: 'Payment Date', value: date },
    { label: 'Amount Paid', value: amount, isEmphasized: true },
    { label: 'Payment Status', value: 'Paid (Success)' },
  ];

  return (
    <EmailLayout
      title="Payment Receipt & Invoice Confirmation"
      previewText={`Your payment of ${amount} to CodeZeniths was successful.`}
      categoryBadge="Invoice"
      badgeVariant="success"
      theme={theme}
    >
      <EmailParagraph isDark={isDark}>
        Hello <strong className={isDark ? 'text-white' : 'text-body-light'}>{name}</strong>,
      </EmailParagraph>
      <EmailParagraph isDark={isDark}>
        Thank you for your payment. Here is the receipt for your recent transaction:
      </EmailParagraph>

      <EmailInfoTable title="Payment Summary" rows={rows} isDark={isDark} />

      <EmailButton href={`${appUrl}/settings`} isDark={isDark} variant="secondary">
        Download Official PDF Invoice
      </EmailButton>
    </EmailLayout>
  );
};

export default PaymentReceiptEmail;
