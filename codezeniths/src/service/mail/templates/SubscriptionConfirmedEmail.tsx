import * as React from 'react';
import { Text } from '@react-email/components';
import { EmailLayout } from './EmailLayout';

export interface SubscriptionConfirmedEmailProps {
  name: string;
  planName: string;
  price: string;
  nextBillingDate: string;
}

export const SubscriptionConfirmedEmail: React.FC<SubscriptionConfirmedEmailProps> = ({ name, planName, price, nextBillingDate }) => {
  return (
    <EmailLayout title="Subscription Confirmed!" previewText="Thank you for subscribing">
      <Text style={paragraph}>Hello {name},</Text>
      <Text style={paragraph}>
        Thank you for subscribing to the <strong>{planName}</strong> plan. Here are your purchase details:
      </Text>
      <Text style={details}>
        <strong>Plan:</strong> {planName}<br />
        <strong>Amount:</strong> {price}<br />
        <strong>Next Invoice:</strong> {nextBillingDate}
      </Text>
      <Text style={paragraph}>
        Your premium features are now active!
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
