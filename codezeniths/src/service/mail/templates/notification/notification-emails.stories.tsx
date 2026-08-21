import type { Meta, StoryObj } from '@storybook/nextjs';
import { AdminBroadcastEmail } from './index';

const meta: Meta = {
  title: 'Emails/Announcements',
  parameters: {
    layout: 'centered',
  },
};

export default meta;

// 1. Admin Broadcast
export const AdminBroadcastDark: StoryObj = {
  render: () => (
    <AdminBroadcastEmail
      title="System Design Track & Cloud Compiler 2.0 Released 🚀"
      message="We are thrilled to announce that our new Distributed Systems Track is now live! Explore 40+ new interactive architecture scenarios and test your concurrent services with live load simulation."
      name="Alex Rivera"
      actionUrl="https://codezeniths.com/roadmaps"
      actionText="Explore System Design Track"
      theme="dark"
    />
  ),
};

export const AdminBroadcastLight: StoryObj = {
  render: () => (
    <AdminBroadcastEmail
      title="System Design Track & Cloud Compiler 2.0 Released 🚀"
      message="We are thrilled to announce that our new Distributed Systems Track is now live! Explore 40+ new interactive architecture scenarios and test your concurrent services with live load simulation."
      name="Alex Rivera"
      actionUrl="https://codezeniths.com/roadmaps"
      actionText="Explore System Design Track"
      theme="light"
    />
  ),
};
