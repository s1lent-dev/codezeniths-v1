/**
 * @file weekly-digest-email.tsx
 * @description Weekly progress digest with activity recap and recommended problemsets.
 */

import * as React from 'react';
import { EmailLayout } from '../../widgets/email-layout';
import { EmailParagraph, EmailButton, EmailCallout } from '../../components';

export interface WeeklyDigestEmailProps {
  name?: string;
  summaryUrl?: string;
  theme?: 'dark' | 'light';
}

export const WeeklyDigestEmail: React.FC<WeeklyDigestEmailProps> = ({
  name = 'Alex Rivera',
  summaryUrl,
  theme = 'dark',
}) => {
  const isDark = theme !== 'light';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://codezeniths.com';
  const targetUrl = summaryUrl || `${appUrl}/profile`;

  return (
    <EmailLayout
      title="Your Weekly CodeZeniths Digest 📊"
      previewText="Check out your coding achievements and recommended problems for the week."
      categoryBadge="Weekly Digest"
      badgeVariant="purple"
      theme={theme}
    >
      <EmailParagraph isDark={isDark}>
        Hello <strong className={isDark ? 'text-white' : 'text-body-light'}>{name}</strong>,
      </EmailParagraph>
      <EmailParagraph isDark={isDark}>
        Here is your weekly summary from CodeZeniths. We've compiled your learning metrics, problem-solving activity, and curated new challenges tailored to your skill tree.
      </EmailParagraph>

      <EmailCallout isDark={isDark} variant="info" title="✨ Weekly Focus Areas:">
        <table role="presentation" cellPadding="0" cellSpacing="0" className="w-full">
          <tbody>
            <tr>
              <td className="py-1 align-top text-primary font-bold pr-2">•</td>
              <td className="py-1 align-top">
                Review your problem breakdown across Dynamic Programming, Graphs, and Trees.
              </td>
            </tr>
            <tr>
              <td className="py-1 align-top text-primary font-bold pr-2">•</td>
              <td className="py-1 align-top">
                Take on the weekly community contest challenge.
              </td>
            </tr>
            <tr>
              <td className="py-1 align-top text-primary font-bold pr-2">•</td>
              <td className="py-1 align-top">
                Maintain your daily check-in streak to climb the global leaderboard.
              </td>
            </tr>
          </tbody>
        </table>
      </EmailCallout>

      <EmailButton href={targetUrl} isDark={isDark} variant="primary">
        View My Activity Recap
      </EmailButton>
    </EmailLayout>
  );
};

export default WeeklyDigestEmail;
