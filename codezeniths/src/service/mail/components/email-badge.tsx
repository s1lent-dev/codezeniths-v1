/**
 * @file email-badge.tsx
 * @description Category pill indicator for React Email using Tailwind classes.
 */

import * as React from 'react';
import { Section } from 'react-email';

export type EmailBadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'purple' | 'teal';

export interface EmailBadgeProps {
  label: string;
  isDark?: boolean;
  variant?: EmailBadgeVariant;
  className?: string;
}

export const EmailBadge: React.FC<EmailBadgeProps> = ({
  label,
  isDark = true,
  variant = 'primary',
  className = '',
}) => {
  let badgeStyles = isDark
    ? 'bg-foreground-dark-shade1 text-primary-shade1 border-foreground-dark-shade3'
    : 'bg-background-light-shade1 text-heading-light border-background-light-shade3';

  if (variant === 'success') {
    badgeStyles = isDark
      ? 'bg-foreground-dark-shade1 text-success border-foreground-dark-shade3'
      : 'bg-background-light-shade1 text-success-shade2 border-background-light-shade3';
  } else if (variant === 'warning') {
    badgeStyles = isDark
      ? 'bg-foreground-dark-shade1 text-warning border-foreground-dark-shade3'
      : 'bg-background-light-shade1 text-warning-shade2 border-background-light-shade3';
  } else if (variant === 'danger') {
    badgeStyles = isDark
      ? 'bg-foreground-dark-shade1 text-destructive border-foreground-dark-shade3'
      : 'bg-background-light-shade1 text-destructive-shade2 border-background-light-shade3';
  } else if (variant === 'purple') {
    badgeStyles = isDark
      ? 'bg-foreground-dark-shade1 text-purple border-foreground-dark-shade3'
      : 'bg-background-light-shade1 text-purple-shade2 border-background-light-shade3';
  } else if (variant === 'teal') {
    badgeStyles = isDark
      ? 'bg-foreground-dark-shade1 text-teal border-foreground-dark-shade3'
      : 'bg-background-light-shade1 text-teal-shade2 border-background-light-shade3';
  }

  return (
    <Section className="mb-4">
      <span
        className={`inline-block border border-solid text-[11px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-md ${badgeStyles} ${className}`}
      >
        {label}
      </span>
    </Section>
  );
};
