/**
 * @file email-card-container.tsx
 * @description Master elevated 580px responsive card container for React Email.
 */

import * as React from 'react';
import { Section, Hr, Text } from 'react-email';

export interface EmailCardContainerProps {
  isDark?: boolean;
  children: React.ReactNode;
}

export const EmailCardContainer: React.FC<EmailCardContainerProps> = ({
  isDark = true,
  children,
}) => {
  const cardClasses = isDark
    ? 'bg-foreground-dark border-foreground-dark-shade3 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]'
    : 'bg-white border-foreground-light-shade3 shadow-[0_10px_25px_-5px_rgba(99,102,241,0.08)]';

  const mutedClass = isDark ? 'text-muted-dark' : 'text-muted-light';
  const bodyClass = isDark ? 'text-body-dark' : 'text-body-light';
  const hrBorderColor = isDark ? '#2b2f4c' : '#e1def7';

  return (
    <Section className={`border border-solid rounded-xl p-9 ${cardClasses}`}>
      {children}

      {/* Sign-off Separator */}
      <Hr
        className={`my-7 border-0 border-t border-solid ${
          isDark ? 'border-foreground-dark-shade3' : 'border-foreground-light-shade3'
        }`}
        style={{
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: hrBorderColor,
          borderBottomWidth: '0px',
          borderLeftWidth: '0px',
          borderRightWidth: '0px',
          margin: '28px 0',
          opacity: 0.5,
        }}
      />
      <Text className={`text-[13px] leading-5 m-0 ${mutedClass}`}>
        Happy Coding,<br />
        <strong className={bodyClass}>The CodeZeniths Engineering Team</strong>
      </Text>
    </Section>
  );
};
