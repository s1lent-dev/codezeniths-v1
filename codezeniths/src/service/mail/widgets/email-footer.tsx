/**
 * @file email-footer.tsx
 * @description CodeZeniths email footer with navigation links, notification preferences, and legal notice.
 */

import * as React from 'react';
import { Section, Row, Column, Link, Text } from 'react-email';

export interface EmailFooterProps {
  isDark?: boolean;
}

export const EmailFooter: React.FC<EmailFooterProps> = ({ isDark = true }) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://codezeniths.com';
  const mutedClass = isDark ? 'text-muted-dark' : 'text-muted-light';
  const separatorClass = isDark ? 'text-foreground-dark-shade3' : 'text-foreground-light-shade3';

  return (
    <Section className="text-center pt-6">
      {/* Navigation Links */}
      <Row className="mb-3">
        <Column className="text-center">
          <Link
            href={`${appUrl}/problemset`}
            className={`${mutedClass} text-[12px] no-underline mx-2`}
          >
            Problemset
          </Link>
          <span className={separatorClass}>•</span>
          <Link
            href={`${appUrl}/playground`}
            className={`${mutedClass} text-[12px] no-underline mx-2`}
          >
            Playground
          </Link>
          <span className={separatorClass}>•</span>
          <Link
            href={`${appUrl}/roadmaps`}
            className={`${mutedClass} text-[12px] no-underline mx-2`}
          >
            Roadmaps
          </Link>
          <span className={separatorClass}>•</span>
          <Link
            href={`${appUrl}/settings`}
            className={`${mutedClass} text-[12px] no-underline mx-2`}
          >
            Notification Settings
          </Link>
        </Column>
      </Row>

      {/* Automated Email Disclosure */}
      <Text className={`${mutedClass} text-[11px] leading-[16px] m-0 mb-1.5`}>
        This is an automated system email from CodeZeniths. If you didn't initiate this action, please{' '}
        <Link href={`${appUrl}/support`} className="text-primary underline">
          contact support
        </Link>
        .
      </Text>

      {/* Copyright */}
      <Text className={`${mutedClass} text-[11px] m-0`}>
        © {new Date().getFullYear()} CodeZeniths Inc. All rights reserved.
      </Text>
    </Section>
  );
};
