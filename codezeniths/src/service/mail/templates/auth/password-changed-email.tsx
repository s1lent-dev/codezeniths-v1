/**
 * @file password-changed-email.tsx
 * @description Security confirmation when password is changed.
 */

import * as React from 'react';
import { EmailLayout } from '../../widgets/email-layout';
import { EmailParagraph, EmailCallout, EmailButton } from '../../components';

export interface PasswordChangedEmailProps {
  name?: string;
  theme?: 'dark' | 'light';
}

export const PasswordChangedEmail: React.FC<PasswordChangedEmailProps> = ({
  name = 'Alex Rivera',
  theme = 'dark',
}) => {
  const isDark = theme !== 'light';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://codezeniths.com';

  return (
    <EmailLayout
      title="Your Password Has Been Changed"
      previewText="Security confirmation of your CodeZeniths password change."
      categoryBadge="Account Security"
      badgeVariant="success"
      theme={theme}
    >
      <EmailParagraph isDark={isDark}>
        Hello <strong className={isDark ? 'text-white' : 'text-body-light'}>{name}</strong>,
      </EmailParagraph>
      <EmailParagraph isDark={isDark}>
        This is confirmation that the password for your CodeZeniths account was successfully updated.
      </EmailParagraph>

      <EmailCallout isDark={isDark} variant="danger">
        If you did <strong>not</strong> make this change, your account may be compromised. Please reset your password and revoke active sessions immediately.
      </EmailCallout>

      <EmailButton href={`${appUrl}/settings`} isDark={isDark} variant="danger">
        Secure My Account
      </EmailButton>
    </EmailLayout>
  );
};

export default PasswordChangedEmail;
