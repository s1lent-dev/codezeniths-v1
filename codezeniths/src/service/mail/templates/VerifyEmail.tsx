import * as React from 'react';
import { Text, Link } from '@react-email/components';
import { EmailLayout } from './EmailLayout';

export interface VerifyEmailProps {
  name: string;
  verifyUrl: string;
  token: string;
}

export const VerifyEmail: React.FC<VerifyEmailProps> = ({ name, verifyUrl, token }) => {
  return (
    <EmailLayout title="Verify Your Email Address" previewText="Verification request">
      <Text style={paragraph}>Hello {name},</Text>
      <Text style={paragraph}>
        Please verify your email address by clicking the link below:
      </Text>
      <Text style={paragraph}>
        <Link href={verifyUrl} style={button}>Verify Email</Link>
      </Text>
      <Text style={paragraph}>
        Or enter this verification token: <strong>{token}</strong>
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
  backgroundColor: '#0070f3',
  color: '#ffffff',
  padding: '10px 20px',
  textDecoration: 'none',
  borderRadius: '5px',
  display: 'inline-block',
  fontWeight: 'bold',
};
