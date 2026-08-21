/**
 * @file welcome-email.tsx
 * @description Welcome email sent upon new user registration.
 */

import * as React from 'react';
import { EmailLayout } from '../../widgets/email-layout';
import { EmailParagraph, EmailButton, EmailCallout } from '../../components';

export interface WelcomeEmailProps {
  name?: string;
  theme?: 'dark' | 'light';
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({
  name = 'Alex Rivera',
  theme = 'dark',
}) => {
  const isDark = theme !== 'light';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://codezeniths.com';

  return (
    <EmailLayout
      title={`Welcome to CodeZeniths, ${name}! 🚀`}
      previewText="Your journey to mastering DSA and System Design begins here."
      categoryBadge="Welcome"
      badgeVariant="primary"
      theme={theme}
    >
      <EmailParagraph isDark={isDark}>
        Hello <strong className={isDark ? 'text-white' : 'text-body-light'}>{name}</strong>,
      </EmailParagraph>
      <EmailParagraph isDark={isDark}>
        Welcome to CodeZeniths — the next-generation developer platform engineered for algorithmic mastery, interview preparation, and full-stack software excellence.
      </EmailParagraph>

      <EmailCallout isDark={isDark} variant="info" title="What's waiting for you:">
        <table role="presentation" cellPadding="0" cellSpacing="0" className="w-full">
          <tbody>
            <tr>
              <td className="py-1 align-top text-primary font-bold pr-2">•</td>
              <td className="py-1 align-top">
                <strong className={isDark ? 'text-white' : 'text-heading-light'}>Curated Problemsets:</strong> Industry-standard DSA problems categorized by topic and difficulty.
              </td>
            </tr>
            <tr>
              <td className="py-1 align-top text-primary font-bold pr-2">•</td>
              <td className="py-1 align-top">
                <strong className={isDark ? 'text-white' : 'text-heading-light'}>Interactive Playground:</strong> High-performance multi-language code execution.
              </td>
            </tr>
            <tr>
              <td className="py-1 align-top text-primary font-bold pr-2">•</td>
              <td className="py-1 align-top">
                <strong className={isDark ? 'text-white' : 'text-heading-light'}>Structured Roadmaps:</strong> Step-by-step tracks from foundational algorithms to advanced systems.
              </td>
            </tr>
          </tbody>
        </table>
      </EmailCallout>

      <EmailButton href={`${appUrl}/problemset`} isDark={isDark} variant="primary">
        Start Solving Problems
      </EmailButton>

      <EmailParagraph isDark={isDark}>
        If you have any questions or need help setting up your development workspace, simply visit our documentation or reach out to community support.
      </EmailParagraph>
    </EmailLayout>
  );
};

export default WelcomeEmail;
