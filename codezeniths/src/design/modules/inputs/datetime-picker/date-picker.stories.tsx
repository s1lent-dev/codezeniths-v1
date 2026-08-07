'use client';
// datetime-picker.stories.tsx
import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button, ButtonVariant, Popover, PopoverContent, PopoverTrigger } from '@codezeniths/components';
import { Calendar } from '@codezeniths/modules';
import { DatePickerDemo } from './datetime-picker';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta = {
    title: 'Modules/Inputs/DatePicker',
    component: DatePickerDemo,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof DatePickerDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

// ───────────────────────────────────────────────

export const Default: Story = {
    render: () => <DatePickerDemo />,
};

// ───────────────────────────────────────────────

const WithPreselectedDateComponent = () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date('2025-06-01'));

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={ButtonVariant.OUTLINE}
                    data-empty={!date}
                    className="w-[280px] justify-start text-left font-normal data-[empty=true]:text-muted-light dark:data-[empty=true]:text-muted-dark"
                >
                    <CalendarIcon />
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} />
            </PopoverContent>
        </Popover>
    );
};

export const WithPreselectedDate: Story = {
    render: () => <WithPreselectedDateComponent />,
    name: 'With Preselected Date',
};

// ───────────────────────────────────────────────

const WithDisabledPastDatesComponent = () => {
    const [date, setDate] = React.useState<Date | undefined>();

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={ButtonVariant.OUTLINE}
                    data-empty={!date}
                    className="w-[280px] justify-start text-left font-normal data-[empty=true]:text-muted-light dark:data-[empty=true]:text-muted-dark"
                >
                    <CalendarIcon />
                    {date ? format(date, 'PPP') : <span>Pick a future date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={{ before: new Date() }}
                />
            </PopoverContent>
        </Popover>
    );
};

export const WithDisabledPastDates: Story = {
    render: () => <WithDisabledPastDatesComponent />,
    name: 'With Disabled Past Dates',
};

// ───────────────────────────────────────────────

const WithDisabledFutureDatesComponent = () => {
    const [date, setDate] = React.useState<Date | undefined>();

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={ButtonVariant.OUTLINE}
                    data-empty={!date}
                    className="w-[280px] justify-start text-left font-normal data-[empty=true]:text-muted-light dark:data-[empty=true]:text-muted-dark"
                >
                    <CalendarIcon />
                    {date ? format(date, 'PPP') : <span>Pick a past date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={{ after: new Date() }}
                />
            </PopoverContent>
        </Popover>
    );
};

export const WithDisabledFutureDates: Story = {
    render: () => <WithDisabledFutureDatesComponent />,
    name: 'With Disabled Future Dates',
};

// ───────────────────────────────────────────────

const WithDropdownCaptionComponent = () => {
    const [date, setDate] = React.useState<Date | undefined>();

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={ButtonVariant.OUTLINE}
                    data-empty={!date}
                    className="w-[280px] justify-start text-left font-normal data-[empty=true]:text-muted-light dark:data-[empty=true]:text-muted-dark"
                >
                    <CalendarIcon />
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    captionLayout="dropdown"
                    startMonth={new Date(2020, 0)}
                    endMonth={new Date(2030, 11)}
                />
            </PopoverContent>
        </Popover>
    );
};

export const WithDropdownCaption: Story = {
    render: () => <WithDropdownCaptionComponent />,
    name: 'With Dropdown Caption',
};

// ───────────────────────────────────────────────

const WithFormattedDisplayComponent = () => {
    const [date, setDate] = React.useState<Date | undefined>();

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={ButtonVariant.OUTLINE}
                    data-empty={!date}
                    className="w-[280px] justify-start text-left font-normal data-[empty=true]:text-muted-light dark:data-[empty=true]:text-muted-dark"
                >
                    <CalendarIcon />
                    {date ? format(date, 'dd/MM/yyyy') : <span>Pick a date (dd/MM/yyyy)</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} />
            </PopoverContent>
        </Popover>
    );
};

export const WithFormattedDisplay: Story = {
    render: () => <WithFormattedDisplayComponent />,
    name: 'With Custom Format (dd/MM/yyyy)',
};