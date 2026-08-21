/**
 * @file email-info-table.tsx
 * @description Key-value metadata table for invoices, device logins, and subscription details with Tailwind classes.
 */

import * as React from 'react';
import { Section, Text, Row, Column } from 'react-email';

export interface InfoTableRow {
  label: string;
  value: React.ReactNode;
  isEmphasized?: boolean;
}

export interface EmailInfoTableProps {
  rows: InfoTableRow[];
  isDark?: boolean;
  title?: string;
  className?: string;
}

export const EmailInfoTable: React.FC<EmailInfoTableProps> = ({
  rows,
  isDark = true,
  title,
  className = '',
}) => {
  const containerClass = isDark
    ? 'bg-foreground-dark-shade1 border-foreground-dark-shade3'
    : 'bg-background-light-shade1 border-background-light-shade3';

  const borderClass = isDark ? 'border-foreground-dark-shade3' : 'border-foreground-light-shade3';

  return (
    <Section className={`border border-solid rounded-lg my-5 p-4 ${containerClass} ${className}`}>
      {title && (
        <Text
          className={`text-[13px] font-bold uppercase tracking-[0.05em] m-0 mb-3 ${
            isDark ? 'text-heading-dark' : 'text-heading-light'
          }`}
        >
          {title}
        </Text>
      )}
      {rows.map((row, index) => (
        <Row
          key={index}
          className={`py-2 ${index < rows.length - 1 ? `border-b border-solid ${borderClass}` : ''}`}
        >
          <Column className="w-[40%] align-top">
            <Text
              className={`text-[13px] m-0 ${
                isDark ? 'text-muted-dark' : 'text-muted-light'
              }`}
            >
              {row.label}
            </Text>
          </Column>
          <Column className="w-[60%] text-right align-top">
            <Text
              className={`text-[13px] m-0 ${
                row.isEmphasized
                  ? 'font-bold text-primary'
                  : isDark
                  ? 'font-medium text-body-dark'
                  : 'font-medium text-body-light'
              }`}
            >
              {row.value}
            </Text>
          </Column>
        </Row>
      ))}
    </Section>
  );
};
