import * as React from 'react';
import { Text } from '@react-email/components';
import { EmailLayout } from './EmailLayout';

export interface AdminBroadcastEmailProps {
  title: string;
  message: string;
}

export const AdminBroadcastEmail: React.FC<AdminBroadcastEmailProps> = ({ title, message }) => {
  return (
    <EmailLayout title={title} previewText="Announcement from CodeZeniths">
      <Text style={paragraph}>{message}</Text>
    </EmailLayout>
  );
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#555555',
};
