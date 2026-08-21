'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import {
    Button,
    ButtonVariant,
    Input,
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@codezeniths/components';
import { Calendar } from '@codezeniths/modules';
import { cn } from '@codezeniths/design/cn';

export interface DatePickerProps {
    value?: Date | string | null;
    onChange?: (date: Date | null) => void;
    placeholder?: string;
    className?: string;
    fromYear?: number;
    toYear?: number;
    variant?: 'default' | 'auth';
    disabled?: boolean | ((date: Date) => boolean);
}

export function DatePicker({
    value,
    onChange,
    placeholder = 'Select date',
    className,
    fromYear = 1940,
    toYear = new Date().getFullYear(),
    variant = 'default',
    disabled,
}: DatePickerProps) {
    const [open, setOpen] = React.useState(false);
    const selectedDate = value ? new Date(value) : undefined;

    const authInputClassName = "!border-0 !border-b border-muted-light/25 dark:border-muted-dark/25 focus:border-primary dark:focus:border-primary transition-colors !rounded-none !px-0 bg-transparent dark:bg-transparent shadow-none focus-visible:ring-0 h-14 text-sm font-normal hover:bg-transparent dark:hover:bg-transparent justify-between w-full flex items-center";

    const defaultInputClassName = "w-full justify-between text-left font-normal border-input hover:bg-accent/50 flex items-center";

    const triggerClassName = variant === 'auth' ? authInputClassName : defaultInputClassName;
    const buttonVariant = variant === 'auth' ? ButtonVariant.GHOST : ButtonVariant.OUTLINE;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant={buttonVariant}
                    className={cn(triggerClassName, className)}
                >
                    <span className={selectedDate ? 'text-sm font-normal text-body-light dark:text-body-dark' : 'text-sm text-muted-light dark:text-muted-dark'}>
                        {selectedDate ? format(selectedDate, 'PPP') : placeholder}
                    </span>
                    <CalendarIcon className="h-4 w-4 text-body-light dark:text-body-dark opacity-70" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0 z-300" align="start">
                <Calendar
                    mode="single"
                    captionLayout="dropdown"
                    startMonth={new Date(fromYear, 0)}
                    endMonth={new Date(toYear, 11)}
                    defaultMonth={selectedDate}
                    selected={selectedDate}
                    onSelect={(date) => {
                        onChange?.(date || null);
                        if (date) {
                            setOpen(false);
                        }
                    }}
                    disabled={disabled ?? ((date) => date > new Date() || date < new Date('1940-01-01'))}
                />
            </PopoverContent>
        </Popover>
    );
}

export interface DateTimePickerProps {
    dateValue?: Date | null;
    timeValue?: string;
    onDateChange?: (date: Date | null) => void;
    onTimeChange?: (time: string) => void;
    className?: string;
    variant?: 'default' | 'auth';
}

export function DateTimePicker({
    dateValue,
    timeValue = '10:30:00',
    onDateChange,
    onTimeChange,
    className,
    variant = 'default',
}: DateTimePickerProps) {
    return (
        <div className={cn('flex flex-row items-center gap-4 w-full', className)}>
            <div className="flex-1">
                <DatePicker
                    value={dateValue}
                    onChange={onDateChange}
                    variant={variant}
                    placeholder="Select date"
                />
            </div>
            <div className="w-36">
                <Input
                    type="time"
                    step="1"
                    value={timeValue}
                    onChange={(e) => onTimeChange?.(e.target.value)}
                    className={cn(
                        variant === 'auth'
                            ? "border-0! border-b! border-muted-light/25 dark:border-muted-dark/25 focus:border-primary dark:focus:border-primary transition-colors rounded-none! px-0! bg-transparent shadow-none h-14 text-sm"
                            : "appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden"
                    )}
                />
            </div>
        </div>
    );
}

export function DatePickerDemo() {
    const [date, setDate] = React.useState<Date | null>(null);

    return (
        <DatePicker value={date} onChange={setDate} placeholder="Pick a date" />
    );
}