/**
 * @file email-button.tsx
 * @description Tailwind-powered CTA button component for React Email.
 */

import * as React from 'react';
import { Button, Section } from 'react-email';

export interface EmailButtonProps {
  href: string;
  children: React.ReactNode;
  isDark?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export const EmailButton: React.FC<EmailButtonProps> = ({
  href,
  children,
  isDark = true,
  variant = 'primary',
  align = 'center',
  className = '',
}) => {
  let btnClasses = 'bg-primary text-white hover:bg-primary-shade1';

  if (variant === 'secondary') {
    btnClasses = isDark
      ? 'bg-foreground-dark-shade1 text-body-dark border border-solid border-foreground-dark-shade3'
      : 'bg-background-light-shade1 text-body-light border border-solid border-foreground-light-shade3';
  } else if (variant === 'danger') {
    btnClasses = 'bg-destructive text-white';
  }

  const alignClass = align === 'left' ? 'text-left' : align === 'right' ? 'text-right' : 'text-center';

  return (
    <Section className={`my-6 ${alignClass}`}>
      <Button
        href={href}
        className={`inline-block px-6 py-3 rounded-lg text-[14px] font-semibold no-underline text-center shadow-md cursor-pointer ${btnClasses} ${className}`}
      >
        {children}
      </Button>
    </Section>
  );
};
