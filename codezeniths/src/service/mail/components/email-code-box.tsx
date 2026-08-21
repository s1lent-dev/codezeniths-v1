/**
 * @file email-code-box.tsx
 * @description Monospace verification code / OTP / credential container using Tailwind classes.
 */

import * as React from 'react';
import { Section, Text } from 'react-email';

export interface EmailCodeBoxProps {
  code: string;
  isDark?: boolean;
  subtext?: string;
  className?: string;
}

export const EmailCodeBox: React.FC<EmailCodeBoxProps> = ({
  code,
  isDark = true,
  subtext,
  className = '',
}) => {
  const containerClass = isDark
    ? 'bg-foreground-dark-shade1 border-foreground-dark-shade3'
    : 'bg-background-light-shade1 border-background-light-shade3';

  return (
    <Section
      className={`border border-solid rounded-lg p-5 my-6 text-center ${containerClass} ${className}`}
    >
      <Text className="font-mono text-[28px] font-bold tracking-[6px] text-primary m-0 select-all">
        {code}
      </Text>
      {subtext && (
        <Text
          className={`text-[12px] m-0 mt-2 ${
            isDark ? 'text-muted-dark' : 'text-muted-light'
          }`}
        >
          {subtext}
        </Text>
      )}
    </Section>
  );
};
