'use client';
// Field.stories.tsx
import { Input, Label } from '@codezeniths/components';
import { Checkbox } from '../checkbox/checkbox';
import { RadioGroup, RadioGroupItem } from '../radio/radio';
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel, FieldLegend, FieldSet } from './field';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta = {
    title: 'Components/Inputs/Field',
    component: Field,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

// ───────────────────────────────────────────────

export const Default: Story = {
    render: () => (
        <div className="w-72">
            <Field>
                <FieldLabel htmlFor="field-1" className='text-body-light dark:text-body-dark text-p pl-xs-2'>Username</FieldLabel>
                <Input id="field-1" placeholder="Enter username" />
            </Field>
        </div>
    ),
};

// ───────────────────────────────────────────────

export const WithDescription: Story = {
    render: () => (
        <div className="w-72">
            <Field>
                <FieldLabel htmlFor="field-2">Email</FieldLabel>
                <Input id="field-2" type="email" placeholder="Enter email" />
                <FieldDescription>
                    We&apos;ll never share your email with anyone else.
                </FieldDescription>
            </Field>
        </div>
    ),
};

// ───────────────────────────────────────────────

export const WithError: Story = {
    render: () => (
        <div className="w-72">
            <Field>
                <FieldLabel htmlFor="field-3">Password</FieldLabel>
                <Input id="field-3" type="password" placeholder="Enter password" />
                <FieldError errors={[{ message: 'Password must be at least 8 characters' }]} />
            </Field>
        </div>
    ),
};

// ───────────────────────────────────────────────

export const Complete: Story = {
    render: () => (
        <div className="w-72">
            <Field>
                <FieldLabel htmlFor="field-4">Username</FieldLabel>
                <Input id="field-4" placeholder="Enter username" />
                <FieldDescription>
                    Choose a unique username for your account.
                </FieldDescription>
                <FieldError errors={[{ message: 'This username is already taken' }]} />
            </Field>
        </div>
    ),
    name: 'Complete Field (Label + Input + Description + Error)',
};

// ───────────────────────────────────────────────

export const Horizontal: Story = {
    render: () => (
        <div className="w-72">
            <Field orientation="horizontal">
                <FieldLabel htmlFor="field-5">Username</FieldLabel>
                <Input id="field-5" placeholder="Enter username" />
            </Field>
        </div>
    ),
    name: 'Horizontal Orientation',
};

// ───────────────────────────────────────────────

export const WithCheckbox: Story = {
    render: () => (
        <div className="w-72">
            <Field>
                <FieldLabel>
                    <div className="flex items-center gap-md-1">
                        <Checkbox id="terms-field" />
                        <span>Accept terms and conditions</span>
                    </div>
                </FieldLabel>
                <FieldDescription>
                    Please read our terms before continuing.
                </FieldDescription>
            </Field>
        </div>
    ),
    name: 'With Checkbox',
};

// ───────────────────────────────────────────────

export const WithRadioGroup: Story = {
    render: () => (
        <div className="w-72">
            <Field>
                <FieldLabel>Notification Preference</FieldLabel>
                <FieldContent>
                    <RadioGroup defaultValue="email">
                        <div className="flex items-center gap-md-1">
                            <RadioGroupItem value="email" id="r-email" />
                            <Label htmlFor="r-email">Email</Label>
                        </div>
                        <div className="flex items-center gap-md-1">
                            <RadioGroupItem value="sms" id="r-sms" />
                            <Label htmlFor="r-sms">SMS</Label>
                        </div>
                        <div className="flex items-center gap-md-1">
                            <RadioGroupItem value="none" id="r-none" />
                            <Label htmlFor="r-none">None</Label>
                        </div>
                    </RadioGroup>
                </FieldContent>
            </Field>
        </div>
    ),
    name: 'With Radio Group',
};

// ───────────────────────────────────────────────

export const FieldSetExample: Story = {
    render: () => (
        <div className="w-72">
            <FieldSet>
                <FieldLegend>Personal Information</FieldLegend>
                <Field>
                    <FieldLabel htmlFor="fs-first">First Name</FieldLabel>
                    <Input id="fs-first" placeholder="John" />
                </Field>
                <Field>
                    <FieldLabel htmlFor="fs-last">Last Name</FieldLabel>
                    <Input id="fs-last" placeholder="Doe" />
                </Field>
            </FieldSet>
        </div>
    ),
    name: 'With FieldSet',
};

// ───────────────────────────────────────────────

export const Disabled: Story = {
    render: () => (
        <div className="w-72">
            <Field>
                <FieldLabel htmlFor="field-disabled">Disabled Field</FieldLabel>
                <Input id="field-disabled" placeholder="Cannot edit" disabled />
                <FieldDescription>
                    This field is disabled.
                </FieldDescription>
            </Field>
        </div>
    ),
};

// ───────────────────────────────────────────────

export const InvalidState: Story = {
    render: () => (
        <div className="w-72">
            <Field>
                <FieldLabel htmlFor="field-invalid">Required Field</FieldLabel>
                <Input id="field-invalid" aria-invalid placeholder="This field is required" />
                <FieldError>
                    This field is required and cannot be empty.
                </FieldError>
            </Field>
        </div>
    ),
    name: 'Invalid State',
};
