import * as React from 'react';
import { Text } from '@react-email/components';
import { EmailLayout } from './EmailLayout';

export interface WelcomeEmailProps {
  name: string;
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({ name }) => {
  return (
    <EmailLayout title="Welcome to CodeZeniths!" previewText="Thank you for joining us">
      <Text style={paragraph}>Hello {name},</Text>
      <Text style={paragraph}>
        Thank you for signing up for CodeZeniths. We are excited to have you on board!
      </Text>
    </EmailLayout>
  );
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#555555',
};
