import * as React from 'react';
import { Text } from '@react-email/components';
import { EmailLayout } from './EmailLayout';

export interface OtpEmailProps {
  name: string;
  code: string;
  expiryMinutes: number;
}

export const OtpEmail: React.FC<OtpEmailProps> = ({ name, code, expiryMinutes }) => {
  return (
    <EmailLayout title="Your One-Time Password" previewText="Verification OTP Code">
      <Text style={paragraph}>Hello {name},</Text>
      <Text style={paragraph}>
        Your one-time password (OTP) code is:
      </Text>
      <Text style={otpCode}>{code}</Text>
      <Text style={paragraph}>
        This code will expire in {expiryMinutes} minutes. If you did not request this code, you can safely ignore this email.
      </Text>
    </EmailLayout>
  );
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#555555',
};

const otpCode = {
  fontSize: '28px',
  fontWeight: 'bold',
  letterSpacing: '3px',
  color: '#0070f3',
  margin: '20px 0',
  textAlign: 'center' as const,
};
