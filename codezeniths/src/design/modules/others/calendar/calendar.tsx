'use client';

import * as React from 'react';
import {
    DayPicker,
    getDefaultClassNames,
} from 'react-day-picker';
import { CheckIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, CheckCircle2 } from 'lucide-react';
import {
    Button,
    ButtonSize,
    ButtonVariant,
    buttonVariants,
    ScrollArea,
} from '@codezeniths/components';
import { cn } from '@codezeniths/design/cn';
import type { DayButton, Locale } from 'react-day-picker';

function CalendarDropdown({
    value,
    onChange,
    options = [],
    'aria-label': ariaLabel,
}: {
    value?: number | string;
    onChange?: React.ChangeEventHandler<HTMLSelectElement> | ((e: { target: { value: string } }) => void);
    options?: Array<{ value: number; label: string; disabled?: boolean }>;
    'aria-label'?: string;
}) {
    const [isOpen, setIsOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const selectedOption = options?.find((opt) => opt.value === Number(value)) || options?.[0];

    // Close on click outside
    React.useEffect(() => {
        if (!isOpen) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const handleSelect = (val: number) => {
        if (onChange) {
            onChange({ target: { value: String(val) } } as any);
        }
        setIsOpen(false);
    };

    return (
        <div ref={containerRef} className="relative inline-block text-left">
            {/* Trigger Button: Clean background, no shade3 on trigger itself */}
            <button
                type="button"
                aria-label={ariaLabel}
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen((prev) => !prev);
                }}
                className="h-7 px-2 text-xs font-semibold bg-transparent hover:bg-foreground-light-shade3/50 dark:hover:bg-foreground-dark-shade3/50 text-body-light dark:text-body-dark rounded-md gap-1 flex items-center justify-between cursor-pointer transition-colors"
            >
                <span>{selectedOption?.label}</span>
                <ChevronDownIcon className="w-3.5 h-3.5 opacity-70" />
            </button>

            {/* Dropdown List: Uses bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 and ScrollArea */}
            {isOpen && (
                <div
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-1 z-50 p-1.5 bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 border border-secondary/30 shadow-xl rounded-xl min-w-36"
                    onClick={(e) => e.stopPropagation()}
                >
                    <ScrollArea className="h-48 w-36 p-1">
                        <div className="flex flex-col gap-0.5 pr-3">
                            {options?.map((opt) => {
                                const isSelected = opt.value === Number(value);
                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        disabled={opt.disabled}
                                        onClick={() => handleSelect(opt.value)}
                                        className={cn(
                                            'w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center justify-between cursor-pointer',
                                            isSelected
                                                ? 'bg-primary text-foreground-dark dark:text-foreground-light font-semibold'
                                                : 'text-body-light dark:text-body-dark hover:bg-foreground-light-shade2 dark:hover:bg-foreground-dark-shade2',
                                            opt.disabled && 'opacity-40 cursor-not-allowed',
                                        )}
                                    >
                                        <span>{opt.label}</span>
                                        {isSelected && <CheckIcon className="w-3.5 h-3.5" />}
                                    </button>
                                );
                            })}
                        </div>
                    </ScrollArea>
                </div>
            )}
        </div>
    );
}

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    captionLayout = 'label',
    buttonVariant = ButtonVariant.GHOST,
    locale,
    formatters,
    components,
    ...props
}: React.ComponentProps<typeof DayPicker> & {
    buttonVariant?: React.ComponentProps<typeof Button>['variant']
}) {
    const defaultClassNames = getDefaultClassNames();

    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn(
                'group/calendar bg-foreground-light dark:bg-foreground-dark p-2 [--cell-radius:var(--radius-md)] [--cell-size:--spacing(7)] in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent',
                String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
                String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
                className,
            )}
            captionLayout={captionLayout}
            locale={locale}
            formatters={{
                formatMonthDropdown: (date) =>
                    date.toLocaleString(locale?.code, { month: 'short' }),
                ...formatters,
            }}
            classNames={{
                root: cn('w-fit', defaultClassNames.root),
                months: cn(
                    'relative flex flex-col gap-4 md:flex-row',
                    defaultClassNames.months,
                ),
                month: cn('flex w-full flex-col gap-4 text-body-light dark:text-body-dark', defaultClassNames.month),
                nav: cn(
                    'absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1',
                    defaultClassNames.nav,
                ),
                button_previous: cn(
                    buttonVariants({ variant: buttonVariant }),
                    'size-(--cell-size) p-0 select-none aria-disabled:opacity-50',
                    defaultClassNames.button_previous,
                ),
                button_next: cn(
                    buttonVariants({ variant: buttonVariant }),
                    'size-(--cell-size) p-0 select-none aria-disabled:opacity-50',
                    defaultClassNames.button_next,
                ),
                month_caption: cn(
                    'flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)',
                    defaultClassNames.month_caption,
                ),
                dropdowns: cn(
                    'flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium',
                    defaultClassNames.dropdowns,
                ),
                dropdown_root: cn(
                    'cn-calendar-dropdown-root relative rounded-(--cell-radius)',
                    defaultClassNames.dropdown_root,
                ),
                dropdown: cn(
                    'relative opacity-100',
                    defaultClassNames.dropdown,
                ),
                caption_label: cn(
                    'font-medium select-none',
                    captionLayout === 'label'
                        ? 'cn-calendar-caption text-sm'
                        : 'cn-calendar-caption-label flex items-center gap-1 rounded-(--cell-radius) text-sm [&>svg]:size-3.5 [&>svg]:text-muted-foreground',
                    defaultClassNames.caption_label,
                ),
                month_grid: cn('w-full border-collapse', defaultClassNames.month_grid),
                weekdays: cn('flex', defaultClassNames.weekdays),
                weekday: cn(
                    'flex-1 rounded-(--cell-radius) text-[0.8rem] font-normal text-muted-light dark:text-muted-dark select-none',
                    defaultClassNames.weekday,
                ),
                week: cn('mt-2 flex w-full', defaultClassNames.week),
                week_number_header: cn(
                    'w-(--cell-size) select-none',
                    defaultClassNames.week_number_header,
                ),
                week_number: cn(
                    'text-[0.8rem] text-muted-light dark:text-muted-dark select-none',
                    defaultClassNames.week_number,
                ),
                day: cn(
                    'group/day relative aspect-square h-full w-full rounded-(--cell-radius) p-0 text-center select-none [&:last-child[data-selected=true]_button]:rounded-r-(--cell-radius)',
                    props.showWeekNumber
                        ? '[&:nth-child(2)[data-selected=true]_button]:rounded-l-(--cell-radius)'
                        : '[&:first-child[data-selected=true]_button]:rounded-l-(--cell-radius)',
                    defaultClassNames.day,
                ),
                range_start: cn(
                    'relative isolate z-0 rounded-l-(--cell-radius) bg-muted after:absolute after:inset-y-0 after:right-0 after:w-4 after:bg-muted',
                    defaultClassNames.range_start,
                ),
                range_middle: cn('rounded-none', defaultClassNames.range_middle),
                range_end: cn(
                    'relative isolate z-0 rounded-r-(--cell-radius) bg-muted after:absolute after:inset-y-0 after:left-0 after:w-4 after:bg-muted',
                    defaultClassNames.range_end,
                ),
                today: cn(
                    'rounded-(--cell-radius) bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 text-body-light dark:text-body-dark data-[selected=true]:rounded-none',
                    defaultClassNames.today,
                ),
                outside: cn(
                    'text-muted-light/40 dark:text-muted-dark/40 aria-selected:text-muted-light/40 dark:aria-selected:text-muted-dark/40 pointer-events-none opacity-50',
                    defaultClassNames.outside,
                ),
                disabled: cn(
                    'text-muted-light dark:text-muted-dark opacity-50 pointer-events-none',
                    defaultClassNames.disabled,
                ),
                hidden: cn('invisible', defaultClassNames.hidden),
                ...classNames,
            }}
            components={{
                Dropdown: CalendarDropdown as any,
                Root: ({ className, rootRef, ...props }) => {
                    return (
                        <div
                            data-slot="calendar"
                            ref={rootRef}
                            className={cn(className)}
                            {...props}
                        />
                    );
                },
                Chevron: ({ className, orientation, ...props }) => {
                    if (orientation === 'left') {
                        return (
                            <ChevronLeftIcon className={cn('cn-rtl-flip size-4', className)} {...props} />
                        );
                    }

                    if (orientation === 'right') {
                        return (
                            <ChevronRightIcon className={cn('cn-rtl-flip size-4', className)} {...props} />
                        );
                    }

                    return (
                        <ChevronDownIcon className={cn('size-4', className)} {...props} />
                    );
                },
                DayButton: ({ ...props }) => (
                    <CalendarDayButton locale={locale} {...props} />
                ),
                WeekNumber: ({ children, ...props }) => {
                    return (
                        <td {...props}>
                            <div className="flex size-(--cell-size) items-center justify-center text-center">
                                {children}
                            </div>
                        </td>
                    );
                },
                ...components,
            }}
            {...props}
        />
    );
}

function CalendarDayButton({
    className,
    day,
    modifiers,
    locale,
    ...props
}: React.ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }) {
    const defaultClassNames = getDefaultClassNames();

    const ref = React.useRef<HTMLButtonElement>(null);
    React.useEffect(() => {
        if (modifiers.focused) { ref.current?.focus(); }
    }, [modifiers.focused]);

    return (
        <Button
            ref={ref}
            variant={ButtonVariant.GHOST}
            size={ButtonSize.DEFAULT}
            data-day={day.date.toLocaleDateString(locale?.code)}
            data-selected-single={
                modifiers.selected &&
                !modifiers.range_start &&
                !modifiers.range_end &&
                !modifiers.range_middle
            }
            data-range-start={modifiers.range_start}
            data-range-end={modifiers.range_end}
            data-range-middle={modifiers.range_middle}
            className={cn(
                'relative isolate z-10 flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 border-0 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-[3px] group-data-[focused=true]/day:ring-ring/50 data-[range-end=true]:rounded-(--cell-radius) data-[range-end=true]:rounded-r-(--cell-radius) data-[range-end=true]:bg-primary data-[range-end=true]:text-foreground-dark dark:data-[range-end=true]:text-foreground-light data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-muted data-[range-middle=true]:text-foreground data-[range-start=true]:rounded-(--cell-radius) data-[range-start=true]:rounded-l-(--cell-radius) data-[range-start=true]:bg-primary data-[range-start=true]:text-foreground-dark dark:data-[range-start=true]:text-foreground-light data-[selected-single=true]:bg-primary data-[selected-single=true]:text-foreground-dark dark:data-[selected-single=true]:text-foreground-light dark:hover:text-foreground [&>span]:text-xs [&>span]:opacity-70',
                defaultClassNames.day,
                className,
            )}
            {...props}
        />
    );
}

export { Calendar, CalendarDayButton };
