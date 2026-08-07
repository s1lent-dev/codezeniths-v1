import * as React from 'react';
import { Text } from '@react-email/components';
import { EmailLayout } from './EmailLayout';

export interface SubscriptionCancelledEmailProps {
  name: string;
  planName: string;
  expiryDate: string;
}

export const SubscriptionCancelledEmail: React.FC<SubscriptionCancelledEmailProps> = ({ name, planName, expiryDate }) => {
  return (
    <EmailLayout title="Subscription Cancelled" previewText="Notice of subscription status change">
      <Text style={paragraph}>Hello {name},</Text>
      <Text style={paragraph}>
        Your subscription to the <strong>{planName}</strong> plan has been cancelled. Your access will remain active until <strong>{expiryDate}</strong>.
      </Text>
    </EmailLayout>
  );
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#555555',
};
