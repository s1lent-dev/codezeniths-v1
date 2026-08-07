import * as React from 'react';
import { Text, Link } from '@react-email/components';
import { EmailLayout } from './EmailLayout';

export interface WeeklyDigestEmailProps {
  name: string;
  summaryUrl: string;
}

export const WeeklyDigestEmail: React.FC<WeeklyDigestEmailProps> = ({ name, summaryUrl }) => {
  return (
    <EmailLayout title="Your Weekly Coding Digest" previewText="Catch up on your weekly activity">
      <Text style={paragraph}>Hello {name},</Text>
      <Text style={paragraph}>
        Here is your personalized summary of updates and stats from CodeZeniths this week.
      </Text>
      <Text style={paragraph}>
        <Link href={summaryUrl} style={button}>View Weekly Summary</Link>
      </Text>
    </EmailLayout>
  );
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#555555',
};

const button = {
  backgroundColor: '#0070f3',
  color: '#ffffff',
  padding: '10px 20px',
  textDecoration: 'none',
  borderRadius: '5px',
  display: 'inline-block',
  fontWeight: 'bold',
};
