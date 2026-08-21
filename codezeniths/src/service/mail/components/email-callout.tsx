/**
 * @file email-callout.tsx
 * @description Refined, optically balanced callout container for security alerts, warnings, and feature highlights.
 */

import * as React from 'react';
import { Section, Text } from 'react-email';

export interface EmailCalloutProps {
  title?: string;
  children: React.ReactNode;
  isDark?: boolean;
  variant?: 'info' | 'warning' | 'danger' | 'success';
  className?: string;
}

interface VariantStyle {
  bg: string;
  border: string;
  accent: string;
  title: string;
  borderLeftClass: string;
}

const darkVariantStyles: Record<NonNullable<EmailCalloutProps['variant']>, VariantStyle> = {
  info: {
    bg: '#212745',
    border: '#2e3760',
    accent: '#6a7cff',
    title: '#95a3fa',
    borderLeftClass: 'border-l-primary',
  },
  success: {
    bg: '#1b2d41',
    border: '#1f4749',
    accent: '#00ffb2',
    title: '#73daca',
    borderLeftClass: 'border-l-success',
  },
  warning: {
    bg: '#282639',
    border: '#453d39',
    accent: '#e0af68',
    title: '#eabf8a',
    borderLeftClass: 'border-l-warning',
  },
  danger: {
    bg: '#2b233a',
    border: '#4a2638',
    accent: '#ff4655',
    title: '#ff6b7a',
    borderLeftClass: 'border-l-destructive',
  },
};

const lightVariantStyles: Record<NonNullable<EmailCalloutProps['variant']>, VariantStyle> = {
  info: {
    bg: '#f2eeff',
    border: '#ddd8ff',
    accent: '#6a7cff',
    title: '#494f95',
    borderLeftClass: 'border-l-primary',
  },
  success: {
    bg: '#f0fdf4',
    border: '#bbf7d0',
    accent: '#00cc8f',
    title: '#166534',
    borderLeftClass: 'border-l-success',
  },
  warning: {
    bg: '#fffbeb',
    border: '#fde68a',
    accent: '#d97706',
    title: '#92400e',
    borderLeftClass: 'border-l-warning',
  },
  danger: {
    bg: '#fef2f2',
    border: '#fecaca',
    accent: '#ff4655',
    title: '#991b1b',
    borderLeftClass: 'border-l-destructive',
  },
};

export const EmailCallout: React.FC<EmailCalloutProps> = ({
  title,
  children,
  isDark = true,
  variant = 'info',
  className = '',
}) => {
  const styles = isDark ? darkVariantStyles[variant] : lightVariantStyles[variant];
  const textColor = isDark ? 'text-body-dark' : 'text-body-light';

  return (
    <Section
      className={`border border-solid border-l-[3.5px] rounded-xl px-5 py-4.5 my-6 ${styles.borderLeftClass} ${className}`}
      style={{
        backgroundColor: styles.bg,
        borderColor: styles.border,
        borderLeftColor: styles.accent,
        borderLeftWidth: '3.5px',
        borderLeftStyle: 'solid',
      }}
    >
      {title && (
        <Text
          className="text-[13.5px] font-bold leading-[20px] m-0 mb-2.5"
          style={{ color: styles.title }}
        >
          {title}
        </Text>
      )}
      <div className={`text-[13px] leading-[22px] font-normal ${textColor}`}>
        {children}
      </div>
    </Section>
  );
};
