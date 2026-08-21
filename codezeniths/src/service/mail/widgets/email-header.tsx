/**
 * @file email-header.tsx
 * @description CodeZeniths brand header rendering unified vector logo (logo_dark / logo_light).
 */

import * as React from 'react';
import { Section, Link } from 'react-email';
import { EmailLogo } from '../components/email-logo';

export interface EmailHeaderProps {
  isDark?: boolean;
}

export const EmailHeader: React.FC<EmailHeaderProps> = ({ isDark = true }) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://codezeniths.com';

  return (
    <Section className="pb-6 text-center">
      <Link href={appUrl} className="no-underline inline-block">
        <EmailLogo isDark={isDark} width={220} height={31} />
      </Link>
    </Section>
  );
};
