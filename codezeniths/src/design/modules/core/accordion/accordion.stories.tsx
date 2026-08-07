'use client';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from './accordion';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta = {
    title: 'Modules/Core/Accordion',
    component: Accordion,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        backgrounds: {
            default: 'light',
            values: [
                { name: 'light', value: '#edeef7' },
                { name: 'dark', value: '#181C31' },
                { name: 'maroon', value: '#400' },
            ],
        },
        controls: {
            expanded: true,
        },
    },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        type: 'single',
        collapsible: true,
    },
    render: () => (
        <Accordion type="single" collapsible className="w-full max-w-md">
            <AccordionItem value="item-1">
                <AccordionTrigger>Is it free to use?</AccordionTrigger>
                <AccordionContent>
                    Yes, this component is completely free and open-source.
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
                <AccordionTrigger>Can I customize it?</AccordionTrigger>
                <AccordionContent>
                    Yes — you can override styles with className or change the icons.
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
                <AccordionTrigger>Is it accessible?</AccordionTrigger>
                <AccordionContent>
                    Yes, it follows Radix UI accessibility standards.
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    ),
};