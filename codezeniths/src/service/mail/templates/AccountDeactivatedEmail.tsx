import * as React from 'react';
import { Text } from '@react-email/components';
import { EmailLayout } from './EmailLayout';

export interface AccountDeactivatedEmailProps {
  name: string;
}

export const AccountDeactivatedEmail: React.FC<AccountDeactivatedEmailProps> = ({ name }) => {
  return (
    <EmailLayout title="Account Deactivated" previewText="We're sorry to see you go">
      <Text style={paragraph}>Hello {name},</Text>
      <Text style={paragraph}>
        Your CodeZeniths account has been deactivated. Your data will be scheduled for permanent deletion according to our retention policy unless you reactivate it by signing back in within 30 days.
      </Text>
    </EmailLayout>
  );
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#555555',
};
