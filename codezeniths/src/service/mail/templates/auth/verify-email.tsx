/**
 * @file verify-email.tsx
 * @description Email verification template with secure link.
 */

import * as React from 'react';
import { EmailLayout } from '../../widgets/email-layout';
import { EmailParagraph, EmailButton, EmailCallout } from '../../components';

export interface VerifyEmailProps {
  name?: string;
  verifyUrl?: string;
  token?: string;
  theme?: 'dark' | 'light';
}

export const VerifyEmail: React.FC<VerifyEmailProps> = ({
  name = 'Alex Rivera',
  verifyUrl = 'https://codezeniths.com/verify-email?token=cz_ver_99281a',
  token = 'cz_ver_99281a',
  theme = 'dark',
}) => {
  const isDark = theme !== 'light';

  return (
    <EmailLayout
      title="Verify Your Email Address"
      previewText="Confirm your email to activate your CodeZeniths account."
      categoryBadge="Account Security"
      badgeVariant="teal"
      theme={theme}
    >
      <EmailParagraph isDark={isDark}>
        Hello <strong className={isDark ? 'text-white' : 'text-body-light'}>{name}</strong>,
      </EmailParagraph>
      <EmailParagraph isDark={isDark}>
        Thank you for joining CodeZeniths. Please click the button below to verify your email address and unlock all platform features.
      </EmailParagraph>

      <EmailButton href={verifyUrl} isDark={isDark} variant="primary">
        Verify My Account
      </EmailButton>

      <EmailCallout isDark={isDark} variant="warning" title="Link Expiration Notice:">
        This verification link is valid for <strong className={isDark ? 'text-white' : 'text-heading-light'}>24 hours</strong>. If you did not create a CodeZeniths account, please disregard this email.
      </EmailCallout>
    </EmailLayout>
  );
};

export default VerifyEmail;
