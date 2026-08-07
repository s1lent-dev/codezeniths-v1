import * as React from 'react';
import { Text } from '@react-email/components';
import { EmailLayout } from './EmailLayout';

export interface PaymentReceiptEmailProps {
  name: string;
  receiptId: string;
  amount: string;
  date: string;
}

export const PaymentReceiptEmail: React.FC<PaymentReceiptEmailProps> = ({ name, receiptId, amount, date }) => {
  return (
    <EmailLayout title="Payment Receipt" previewText="Thank you for your payment">
      <Text style={paragraph}>Hello {name},</Text>
      <Text style={paragraph}>
        Thanks for your payment! Here are your receipt details:
      </Text>
      <Text style={details}>
        <strong>Receipt ID:</strong> {receiptId}<br />
        <strong>Amount Paid:</strong> {amount}<br />
        <strong>Date:</strong> {date}
      </Text>
    </EmailLayout>
  );
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#555555',
};

const details = {
  backgroundColor: '#f4f4f4',
  padding: '15px',
  borderRadius: '5px',
  margin: '15px 0',
  lineHeight: '24px',
};
