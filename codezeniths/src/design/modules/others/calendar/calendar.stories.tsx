'use client';
// calendar.stories.tsx
import { useState } from 'react';
import { ButtonVariant } from '@codezeniths/components';
import { Calendar } from './calendar';
import type { Meta, StoryObj } from '@storybook/nextjs';
import type { DateRange } from 'react-day-picker';

const meta = {
    title: 'Modules/Others/Calendar',
    component: Calendar,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

// ───────────────────────────────────────────────

export const Default: Story = {
    render: () => <Calendar mode="single" />,
};

// ───────────────────────────────────────────────

const WithSelectedDateComponent = () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return <Calendar mode="single" selected={date} onSelect={setDate} />;
};

export const WithSelectedDate: Story = {
    render: () => <WithSelectedDateComponent />,
    name: 'With Selected Date',
};

// ───────────────────────────────────────────────

export const WithoutOutsideDays: Story = {
    render: () => <Calendar mode="single" showOutsideDays={false} />,
    name: 'Without Outside Days',
};

// ───────────────────────────────────────────────

const DropdownCaptionComponent = () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return (
        <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            captionLayout="dropdown"
            startMonth={new Date(2020, 0)}
            endMonth={new Date(2030, 11)}
        />
    );
};

export const DropdownCaption: Story = {
    render: () => <DropdownCaptionComponent />,
    name: 'Dropdown Caption (Month & Year)',
};

// ───────────────────────────────────────────────

const RangeSelectionComponent = () => {
    const [range, setRange] = useState<DateRange | undefined>();
    return <Calendar mode="range" selected={range} onSelect={setRange} />;
};

export const RangeSelection: Story = {
    render: () => <RangeSelectionComponent />,
    name: 'Range Selection',
};

// ───────────────────────────────────────────────

const MultipleMonthsComponent = () => {
    const [range, setRange] = useState<DateRange | undefined>();
    return (
        <Calendar
            mode="range"
            selected={range}
            onSelect={setRange}
            numberOfMonths={2}
        />
    );
};

export const MultipleMonths: Story = {
    render: () => <MultipleMonthsComponent />,
    name: 'Multiple Months',
};

// ───────────────────────────────────────────────

const WithWeekNumbersComponent = () => {
    const [date, setDate] = useState<Date | undefined>();
    return <Calendar mode="single" selected={date} onSelect={setDate} showWeekNumber />;
};

export const WithWeekNumbers: Story = {
    render: () => <WithWeekNumbersComponent />,
    name: 'With Week Numbers',
};

// ───────────────────────────────────────────────

const WithDisabledDatesComponent = () => {
    const [date, setDate] = useState<Date | undefined>();
    return (
        <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            disabled={[
                { dayOfWeek: [0, 6] }, // disable weekends
                { before: new Date() }, // disable past dates
            ]}
        />
    );
};

export const WithDisabledDates: Story = {
    render: () => <WithDisabledDatesComponent />,
    name: 'With Disabled Dates',
};

// ───────────────────────────────────────────────

const OutlineButtonVariantComponent = () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return (
        <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            buttonVariant={ButtonVariant.OUTLINE}
        />
    );
};

export const OutlineButtonVariant: Story = {
    render: () => <OutlineButtonVariantComponent />,
    name: 'Outline Button Variant',
};

// ───────────────────────────────────────────────

const MultipleSelectionComponent = () => {
    const [dates, setDates] = useState<Array<Date> | undefined>();
    return <Calendar mode="multiple" selected={dates} onSelect={setDates} />;
};

export const MultipleSelection: Story = {
    render: () => <MultipleSelectionComponent />,
    name: 'Multiple Selection',
};