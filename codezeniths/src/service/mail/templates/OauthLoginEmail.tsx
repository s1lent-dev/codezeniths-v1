import * as React from 'react';
import { Text } from '@react-email/components';
import { EmailLayout } from './EmailLayout';

export interface OauthLoginEmailProps {
  name: string;
  provider: string;
}

export const OauthLoginEmail: React.FC<OauthLoginEmailProps> = ({ name, provider }) => {
  return (
    <EmailLayout title="Social Account Login Successful" previewText="Successful sign-in details">
      <Text style={paragraph}>Hello {name},</Text>
      <Text style={paragraph}>
        You successfully logged in using your {provider} credentials.
      </Text>
    </EmailLayout>
  );
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#555555',
};
