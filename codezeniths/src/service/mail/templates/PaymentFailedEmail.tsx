import * as React from 'react';
import { Text, Link } from '@react-email/components';
import { EmailLayout } from './EmailLayout';

export interface PaymentFailedEmailProps {
  name: string;
  planName: string;
  amount: string;
  retryLink: string;
}

export const PaymentFailedEmail: React.FC<PaymentFailedEmailProps> = ({ name, planName, amount, retryLink }) => {
  return (
    <EmailLayout title="Payment Failed" previewText="Important billing notice">
      <Text style={paragraph}>Hello {name},</Text>
      <Text style={paragraph}>
        We were unable to process your payment of <strong>{amount}</strong> for the plan <strong>{planName}</strong>.
      </Text>
      <Text style={paragraph}>
        Please click the link below to resolve your billing issues and avoid service disruption:
      </Text>
      <Text style={paragraph}>
        <Link href={retryLink} style={button}>Update Billing Info</Link>
      </Text>
    </EmailLayout>
  );
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#555555',
};

const button = {
  backgroundColor: '#ff0000',
  color: '#ffffff',
  padding: '10px 20px',
  textDecoration: 'none',
  borderRadius: '5px',
  display: 'inline-block',
  fontWeight: 'bold',
};
