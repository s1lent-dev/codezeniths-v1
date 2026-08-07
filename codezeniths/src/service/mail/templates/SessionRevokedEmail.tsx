import * as React from 'react';
import { Text } from '@react-email/components';
import { EmailLayout } from './EmailLayout';

export interface SessionRevokedEmailProps {
  name: string;
  deviceName: string;
  location: string;
}

export const SessionRevokedEmail: React.FC<SessionRevokedEmailProps> = ({ name, deviceName, location }) => {
  return (
    <EmailLayout title="Login Session Terminated" previewText="Security notice: Session signed out">
      <Text style={paragraph}>Hello {name},</Text>
      <Text style={paragraph}>
        A session on the device <strong>{deviceName}</strong> ({location}) has been successfully terminated.
      </Text>
    </EmailLayout>
  );
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#555555',
};
