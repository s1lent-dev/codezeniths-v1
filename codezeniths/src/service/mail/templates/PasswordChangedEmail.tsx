import * as React from 'react';
import { Text } from '@react-email/components';
import { EmailLayout } from './EmailLayout';

export interface PasswordChangedEmailProps {
  name: string;
}

export const PasswordChangedEmail: React.FC<PasswordChangedEmailProps> = ({ name }) => {
  return (
    <EmailLayout title="Your Password Was Changed" previewText="Security notice: Password updated">
      <Text style={paragraph}>Hello {name},</Text>
      <Text style={paragraph}>
        This is a confirmation that the password for your CodeZeniths account was successfully changed.
      </Text>
      <Text style={paragraph}>
        If you did not make this change, please contact support immediately.
      </Text>
    </EmailLayout>
  );
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#555555',
};
