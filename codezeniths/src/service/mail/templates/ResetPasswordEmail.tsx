import * as React from 'react';
import { Text, Link } from '@react-email/components';
import { EmailLayout } from './EmailLayout';

export interface ResetPasswordEmailProps {
  name: string;
  resetUrl: string;
  expiryMinutes: number;
}

export const ResetPasswordEmail: React.FC<ResetPasswordEmailProps> = ({ name, resetUrl, expiryMinutes }) => {
  return (
    <EmailLayout title="Reset Your Password" previewText="Password reset request">
      <Text style={paragraph}>Hello {name},</Text>
      <Text style={paragraph}>
        You requested to reset your password. Click the link below to create a new password:
      </Text>
      <Text style={paragraph}>
        <Link href={resetUrl} style={button}>Reset Password</Link>
      </Text>
      <Text style={paragraph}>
        This link will expire in {expiryMinutes} minutes. If you did not request this, please secure your account.
      </Text>
    </EmailLayout>
  );
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#555555',
};

const button = {
  backgroundColor: '#ff0000',
  color: '#ffffff',
  padding: '10px 20px',
  textDecoration: 'none',
  borderRadius: '5px',
  display: 'inline-block',
  fontWeight: 'bold',
};
