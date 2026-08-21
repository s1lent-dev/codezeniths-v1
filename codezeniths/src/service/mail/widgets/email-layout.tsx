/**
 * @file email-layout.tsx
 * @description Master responsive email layout with dual-theme Tokyo Night styling and Tailwind compilation.
 */

import * as React from 'react';
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Tailwind,
  Font,
} from 'react-email';
import { emailTailwindConfig } from '../config/email-tailwind.config';
import { EmailHeader } from './email-header';
import { EmailFooter } from './email-footer';
import { EmailCardContainer } from './email-card-container';
import { EmailBadge, type EmailBadgeVariant } from '../components/email-badge';
import { EmailHeading } from '../components/email-typography';

export interface EmailLayoutProps {
  title: string;
  previewText?: string;
  categoryBadge?: string;
  badgeVariant?: EmailBadgeVariant;
  theme?: 'dark' | 'light';
  children: React.ReactNode;
}

export const EmailLayout: React.FC<EmailLayoutProps> = ({
  title,
  previewText,
  categoryBadge,
  badgeVariant = 'primary',
  theme = 'dark',
  children,
}) => {
  const isDark = theme !== 'light';

  return (
    <Html lang="en">
      <Tailwind config={emailTailwindConfig}>
        <Head>
          <Font
            fontFamily="New Rocker"
            fallbackFontFamily="cursive"
            webFont={{
              url: 'https://fonts.gstatic.com/s/newrocker/v23/p2dcZfhLpTQqY2P_0Aicd72f1xM.woff2',
              format: 'woff2',
            }}
            fontWeight={400}
            fontStyle="normal"
          />
          <Font
            fontFamily="Andika"
            fallbackFontFamily="sans-serif"
            webFont={{
              url: 'https://fonts.gstatic.com/s/andika/v23/mem_YaGsCfcGR7t-hRmnTg.woff2',
              format: 'woff2',
            }}
            fontWeight={400}
            fontStyle="normal"
          />
        </Head>
        {previewText && <Preview>{previewText}</Preview>}
        <Body
          className={`m-0 py-10 font-sans ${
            isDark ? 'bg-background-dark' : 'bg-background-light'
          }`}
        >
          <Container className="mx-auto w-full max-w-145 px-4">
            <EmailHeader isDark={isDark} />
            <EmailCardContainer isDark={isDark}>
              {categoryBadge && (
                <EmailBadge
                  label={categoryBadge}
                  variant={badgeVariant}
                  isDark={isDark}
                />
              )}
              <EmailHeading isDark={isDark}>{title}</EmailHeading>
              {children}
            </EmailCardContainer>
            <EmailFooter isDark={isDark} />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
