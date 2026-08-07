import * as React from 'react';
import { Text, Link } from '@react-email/components';
import { EmailLayout } from './EmailLayout';

export interface MagicLinkEmailProps {
  name: string;
  loginUrl: string;
}

export const MagicLinkEmail: React.FC<MagicLinkEmailProps> = ({ name, loginUrl }) => {
  return (
    <EmailLayout title="Your Magic Sign-In Link" previewText="Secure one-click sign-in">
      <Text style={paragraph}>Hello {name},</Text>
      <Text style={paragraph}>
        Click the link below to sign into your account securely:
      </Text>
      <Text style={paragraph}>
        <Link href={loginUrl} style={button}>Sign In</Link>
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
