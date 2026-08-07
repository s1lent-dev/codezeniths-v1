import * as React from 'react';
import { Text } from '@react-email/components';
import { EmailLayout } from './EmailLayout';

export interface NewDeviceEmailProps {
  name: string;
  deviceName: string;
  location: string;
  time: string;
}

export const NewDeviceEmail: React.FC<NewDeviceEmailProps> = ({ name, deviceName, location, time }) => {
  return (
    <EmailLayout title="New Device Login Detected" previewText="Security Alert: New Sign-in">
      <Text style={paragraph}>Hello {name},</Text>
      <Text style={paragraph}>
        We noticed a new login to your account using the following details:
      </Text>
      <Text style={details}>
        <strong>Device:</strong> {deviceName}<br />
        <strong>Location:</strong> {location}<br />
        <strong>Time:</strong> {time}
      </Text>
      <Text style={paragraph}>
        If this was not you, please change your password and revoke your session immediately.
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
