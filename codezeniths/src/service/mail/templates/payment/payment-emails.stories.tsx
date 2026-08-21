import type { Meta, StoryObj } from '@storybook/nextjs';
import {
  SubscriptionConfirmedEmail,
  SubscriptionRenewedEmail,
  SubscriptionCancelledEmail,
  SubscriptionExpiredEmail,
  PaymentReceiptEmail,
  PaymentFailedEmail,
  PaymentRefundEmail,
} from './index';

const meta: Meta = {
  title: 'Emails/Billing & Payments',
  parameters: {
    layout: 'centered',
  },
};

export default meta;

// 1. Subscription Confirmed
export const SubscriptionConfirmedDark: StoryObj = {
  render: () => (
    <SubscriptionConfirmedEmail
      name="Alex Rivera"
      planName="Premium Plan (Annual)"
      price="$199.99 / year"
      nextBillingDate="Aug 19, 2027"
      theme="dark"
    />
  ),
};

export const SubscriptionConfirmedLight: StoryObj = {
  render: () => (
    <SubscriptionConfirmedEmail
      name="Alex Rivera"
      planName="Premium Plan (Annual)"
      price="$199.99 / year"
      nextBillingDate="Aug 19, 2027"
      theme="light"
    />
  ),
};

// 2. Subscription Renewed
export const SubscriptionRenewedDark: StoryObj = {
  render: () => (
    <SubscriptionRenewedEmail
      name="Alex Rivera"
      planName="Premium Plan (Monthly)"
      amount="$29.99"
      nextBillingDate="Sep 19, 2026"
      theme="dark"
    />
  ),
};

export const SubscriptionRenewedLight: StoryObj = {
  render: () => (
    <SubscriptionRenewedEmail
      name="Alex Rivera"
      planName="Premium Plan (Monthly)"
      amount="$29.99"
      nextBillingDate="Sep 19, 2026"
      theme="light"
    />
  ),
};

// 3. Subscription Cancelled
export const SubscriptionCancelledDark: StoryObj = {
  render: () => (
    <SubscriptionCancelledEmail
      name="Alex Rivera"
      planName="Premium Plan"
      expiryDate="Sep 19, 2026"
      theme="dark"
    />
  ),
};

export const SubscriptionCancelledLight: StoryObj = {
  render: () => (
    <SubscriptionCancelledEmail
      name="Alex Rivera"
      planName="Premium Plan"
      expiryDate="Sep 19, 2026"
      theme="light"
    />
  ),
};

// 4. Subscription Expired
export const SubscriptionExpiredDark: StoryObj = {
  render: () => (
    <SubscriptionExpiredEmail
      name="Alex Rivera"
      planName="Premium Plan"
      theme="dark"
    />
  ),
};

export const SubscriptionExpiredLight: StoryObj = {
  render: () => (
    <SubscriptionExpiredEmail
      name="Alex Rivera"
      planName="Premium Plan"
      theme="light"
    />
  ),
};

// 5. Payment Receipt
export const PaymentReceiptDark: StoryObj = {
  render: () => (
    <PaymentReceiptEmail
      name="Alex Rivera"
      receiptId="inv_cz_8829104"
      amount="$29.99"
      date="Aug 19, 2026"
      theme="dark"
    />
  ),
};

export const PaymentReceiptLight: StoryObj = {
  render: () => (
    <PaymentReceiptEmail
      name="Alex Rivera"
      receiptId="inv_cz_8829104"
      amount="$29.99"
      date="Aug 19, 2026"
      theme="light"
    />
  ),
};

// 6. Payment Failed
export const PaymentFailedDark: StoryObj = {
  render: () => (
    <PaymentFailedEmail
      name="Alex Rivera"
      planName="Premium Plan"
      amount="$29.99"
      retryLink="https://codezeniths.com/settings"
      theme="dark"
    />
  ),
};

export const PaymentFailedLight: StoryObj = {
  render: () => (
    <PaymentFailedEmail
      name="Alex Rivera"
      planName="Premium Plan"
      amount="$29.99"
      retryLink="https://codezeniths.com/settings"
      theme="light"
    />
  ),
};

// 7. Payment Refund
export const PaymentRefundDark: StoryObj = {
  render: () => (
    <PaymentRefundEmail
      name="Alex Rivera"
      amount="$29.99"
      paymentIntentId="pi_cz_refund_771920"
      theme="dark"
    />
  ),
};

export const PaymentRefundLight: StoryObj = {
  render: () => (
    <PaymentRefundEmail
      name="Alex Rivera"
      amount="$29.99"
      paymentIntentId="pi_cz_refund_771920"
      theme="light"
    />
  ),
};
