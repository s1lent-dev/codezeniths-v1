import * as React from 'react';
import { Text } from '@react-email/components';
import { EmailLayout } from './EmailLayout';

export interface PasswordlessCredentialsEmailProps {
  name: string;
  password: string;
}

export const PasswordlessCredentialsEmail: React.FC<PasswordlessCredentialsEmailProps> = ({ name, password }) => {
  return (
    <EmailLayout title="Your CodeZeniths Account Password" previewText="Account Credentials">
      <Text style={paragraph}>Hello {name},</Text>
      <Text style={paragraph}>
        We have generated a secure password for your CodeZeniths account so you can log in using your email or username in the future.
      </Text>
      <Text style={paragraph}>
        Your temporary password is:
      </Text>
      <Text style={codeBlock}>{password}</Text>
      <Text style={paragraph}>
        We recommend changing this password immediately in your account settings under <strong>Security</strong>.
      </Text>
    </EmailLayout>
  );
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#555555',
};

const codeBlock = {
  backgroundColor: '#f4f4f5',
  border: '1px solid #e4e4e7',
  borderRadius: '4px',
  padding: '12px',
  fontFamily: 'monospace',
  fontSize: '18px',
  textAlign: 'center' as const,
  color: '#18181b',
  fontWeight: 'bold',
  letterSpacing: '1px',
  margin: '16px 0',
};
