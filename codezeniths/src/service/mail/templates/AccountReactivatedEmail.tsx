import * as React from 'react';
import { Text } from '@react-email/components';
import { EmailLayout } from './EmailLayout';

export interface AccountReactivatedEmailProps {
  name: string;
}

export const AccountReactivatedEmail: React.FC<AccountReactivatedEmailProps> = ({ name }) => {
  return (
    <EmailLayout title="Account Reactivated!" previewText="Welcome back to CodeZeniths">
      <Text style={paragraph}>Hello {name},</Text>
      <Text style={paragraph}>
        Welcome back! Your CodeZeniths account has been successfully reactivated.
      </Text>
    </EmailLayout>
  );
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#555555',
};
