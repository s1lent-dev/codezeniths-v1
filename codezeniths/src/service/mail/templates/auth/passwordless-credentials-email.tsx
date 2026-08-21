/**
 * @file passwordless-credentials-email.tsx
 * @description Delivery of generated credentials for passwordless onboarding.
 */

import * as React from 'react';
import { EmailLayout } from '../../widgets/email-layout';
import { EmailParagraph, EmailInfoTable, EmailButton, EmailCallout } from '../../components';

export interface PasswordlessCredentialsEmailProps {
  name?: string;
  password?: string;
  username?: string;
  theme?: 'dark' | 'light';
}

export const PasswordlessCredentialsEmail: React.FC<PasswordlessCredentialsEmailProps> = ({
  name = 'Alex Rivera',
  password = 'cz_sec_9938!@#',
  username = 'alex_zenith',
  theme = 'dark',
}) => {
  const isDark = theme !== 'light';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://codezeniths.com';

  const rows = [
    { label: 'Username', value: username || name, isEmphasized: true },
    { label: 'Temporary Password', value: password, isEmphasized: true },
  ];

  return (
    <EmailLayout
      title="Your CodeZeniths Account Credentials"
      previewText="Your temporary login credentials for CodeZeniths."
      categoryBadge="Account Setup"
      badgeVariant="primary"
      theme={theme}
    >
      <EmailParagraph isDark={isDark}>
        Hello <strong className={isDark ? 'text-white' : 'text-body-light'}>{name}</strong>,
      </EmailParagraph>
      <EmailParagraph isDark={isDark}>
        Your CodeZeniths account has been created. Here are your temporary access credentials:
      </EmailParagraph>

      <EmailInfoTable title="Access Credentials" rows={rows} isDark={isDark} />

      <EmailCallout isDark={isDark} variant="warning">
        For your security, please sign in and change your password immediately in your account settings.
      </EmailCallout>

      <EmailButton href={`${appUrl}/sign-in`} isDark={isDark} variant="primary">
        Sign In Now
      </EmailButton>
    </EmailLayout>
  );
};

export default PasswordlessCredentialsEmail;
