'use client';

import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { PhoneInput } from './phone-input';

const meta = {
    title: 'Modules/Inputs/PhoneInput',
    component: PhoneInput,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        countryCode: { control: 'text' },
        placeholder: { control: 'text' },
    },
} satisfies Meta<typeof PhoneInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        placeholder: 'Enter phone number',
        countryCode: '+1',
    },
    render: function Render(args: any) {
        const [code, setCode] = useState(args.countryCode || '+1');
        const [phone, setPhone] = useState('');
        
        return (
            <div className="w-[400px] p-6 bg-foreground-light dark:bg-foreground-dark rounded-xl">
                <PhoneInput 
                    {...args}
                    countryCode={code}
                    onCountryCodeChange={setCode}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
                <div className="mt-4 text-sm text-muted-light dark:text-muted-dark">
                    Result: {code} {phone}
                </div>
            </div>
        );
    }
};
