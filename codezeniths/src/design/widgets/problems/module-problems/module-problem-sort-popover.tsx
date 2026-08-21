'use client';

import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import {
    Button,
    ButtonVariant,
    ButtonSize,
    Popover,
    PopoverTrigger,
    PopoverContent,
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@codezeniths/components';
import { ProblemSortingInput } from '@codezeniths/schemas/db/queries/shared/problem-filter.schema';
import { SearchScope } from './scope-selector';

export interface ModuleProblemSortPopoverProps {
    scope: SearchScope;
    sorting: ProblemSortingInput;
    onSortingChange: (sorting: ProblemSortingInput) => void;
}

export const ModuleProblemSortPopover: React.FC<ModuleProblemSortPopoverProps> = ({
    scope,
    sorting,
    onSortingChange,
}) => {
    const [open, setOpen] = React.useState(false);

    const topicSortOptions = React.useMemo(() => ['topicLevel', 'name', 'order'], []);
    const problemSortOptions = React.useMemo(() => ['name', 'difficulty', 'createdAt', 'popularity'], []);

    const currentSortBy = React.useMemo(() => {
        const raw = sorting.sortBy;
        if (scope === 'topic') {
            return raw && topicSortOptions.includes(raw) ? raw : 'topicLevel';
        } else {
            return raw && problemSortOptions.includes(raw) ? raw : 'difficulty';
        }
    }, [scope, sorting.sortBy, topicSortOptions, problemSortOptions]);

    const currentOrder = sorting.order || 'asc';

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant={ButtonVariant.OUTLINE}
                    size={ButtonSize.SM}
                    className="h-9 px-3 gap-2 border-foreground-light-shade3 dark:border-foreground-dark-shade3 text-heading-light dark:text-heading-dark hover:border-primary transition-all shrink-0 cursor-pointer"
                >
                    <ArrowUpDown className="size-4 text-muted-light dark:text-muted-dark" />
                    <span className="hidden sm:inline text-xs font-semibold">Sort</span>
                </Button>
            </PopoverTrigger>

            <PopoverContent
                align="end"
                className="w-64 p-4 space-y-3 rounded-xl border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark shadow-lg font-sans"
            >
                <div className="border-b border-foreground-light-shade3 dark:border-foreground-dark-shade1 pb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-heading-light dark:text-heading-dark flex items-center gap-2">
                        <ArrowUpDown className="size-3.5 text-primary" />
                        {scope === 'topic' ? 'Sort Topics By' : 'Sort Problems By'}
                    </span>
                </div>

                {scope === 'topic' ? (
                    /* Topic Sorting Options */
                    <div className="space-y-3">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-light dark:text-muted-dark">
                                Sort Criterion
                            </label>
                            <Select
                                value={currentSortBy}
                                onValueChange={(val) =>
                                    onSortingChange({
                                        ...sorting,
                                        sortBy: val as any,
                                    })
                                }
                            >
                                <SelectTrigger className="w-full h-9 text-xs cursor-pointer">
                                    <SelectValue placeholder="Select Criterion" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="topicLevel" className="cursor-pointer">Topic Level</SelectItem>
                                    <SelectItem value="name" className="cursor-pointer">Topic Name</SelectItem>
                                    <SelectItem value="order" className="cursor-pointer">Default Sequence</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-light dark:text-muted-dark">
                                Order
                            </label>
                            <Select
                                value={currentOrder}
                                onValueChange={(val) =>
                                    onSortingChange({
                                        ...sorting,
                                        order: val as 'asc' | 'desc',
                                    })
                                }
                            >
                                <SelectTrigger className="w-full h-9 text-xs cursor-pointer">
                                    <SelectValue placeholder="Ascending / Descending" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="asc" className="cursor-pointer">Ascending (A-Z / Low-High)</SelectItem>
                                    <SelectItem value="desc" className="cursor-pointer">Descending (Z-A / High-Low)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                ) : (
                    /* Problem Sorting Options */
                    <div className="space-y-3">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-light dark:text-muted-dark">
                                Sort Criterion
                            </label>
                            <Select
                                value={currentSortBy}
                                onValueChange={(val) =>
                                    onSortingChange({
                                        ...sorting,
                                        sortBy: val as any,
                                    })
                                }
                            >
                                <SelectTrigger className="w-full h-9 text-xs cursor-pointer">
                                    <SelectValue placeholder="Select Criterion" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="name" className="cursor-pointer">Problem Name</SelectItem>
                                    <SelectItem value="difficulty" className="cursor-pointer">Difficulty</SelectItem>
                                    <SelectItem value="createdAt" className="cursor-pointer">Date Created</SelectItem>
                                    <SelectItem value="popularity" className="cursor-pointer">Popularity</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-light dark:text-muted-dark">
                                Order
                            </label>
                            <Select
                                value={currentOrder}
                                onValueChange={(val) =>
                                    onSortingChange({
                                        ...sorting,
                                        order: val as 'asc' | 'desc',
                                    })
                                }
                            >
                                <SelectTrigger className="w-full h-9 text-xs cursor-pointer">
                                    <SelectValue placeholder="Ascending / Descending" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="asc" className="cursor-pointer">Ascending</SelectItem>
                                    <SelectItem value="desc" className="cursor-pointer">Descending</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
};
