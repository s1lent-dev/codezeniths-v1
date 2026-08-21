/**
 * @file email-typography.tsx
 * @description Typography primitives for React Email with Tailwind utility classes.
 */

import * as React from 'react';
import { Text, Heading } from 'react-email';

export interface EmailHeadingProps {
  children: React.ReactNode;
  isDark?: boolean;
  className?: string;
}

export const EmailHeading: React.FC<EmailHeadingProps> = ({
  children,
  isDark = true,
  className = '',
}) => {
  return (
    <Heading
      as="h1"
      className={`text-[22px] font-bold leading-[28px] tracking-[-0.01em] m-0 mb-4 ${
        isDark ? 'text-heading-dark' : 'text-heading-light'
      } ${className}`}
    >
      {children}
    </Heading>
  );
};

export interface EmailParagraphProps {
  children: React.ReactNode;
  isDark?: boolean;
  className?: string;
}

export const EmailParagraph: React.FC<EmailParagraphProps> = ({
  children,
  isDark = true,
  className = '',
}) => {
  return (
    <Text
      className={`text-[15px] leading-[24px] font-normal m-0 mb-4 ${
        isDark ? 'text-body-dark' : 'text-body-light'
      } ${className}`}
    >
      {children}
    </Text>
  );
};

export interface EmailMutedTextProps {
  children: React.ReactNode;
  isDark?: boolean;
  className?: string;
}

export const EmailMutedText: React.FC<EmailMutedTextProps> = ({
  children,
  isDark = true,
  className = '',
}) => {
  return (
    <Text
      className={`text-[12px] leading-[18px] font-normal m-0 ${
        isDark ? 'text-muted-dark' : 'text-muted-light'
      } ${className}`}
    >
      {children}
    </Text>
  );
};
