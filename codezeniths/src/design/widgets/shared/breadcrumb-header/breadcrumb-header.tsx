'use client';

import React from 'react';
import Link from 'next/link';
import { Home } from 'lucide-react';
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@codezeniths/design/components/navigation/breadcrumb';
import { BreadcrumbHeaderSkeleton } from './breadcrumb-header-skeleton';
import { cn } from '@codezeniths/design/cn';

export interface BreadcrumbItemData {
    label?: string;
    href?: string;
    icon?: React.ReactNode;
    isCurrentPage?: boolean;
}

export interface BreadcrumbHeaderProps {
    items: BreadcrumbItemData[];
    isLoading?: boolean;
    className?: string;
}

export const BreadcrumbHeader: React.FC<BreadcrumbHeaderProps> = ({
    items,
    isLoading = false,
    className,
}) => {
    if (isLoading) {
        return <BreadcrumbHeaderSkeleton itemCount={items.length || 3} className={className} />;
    }

    return (
        <div
            className={cn(
                'w-full rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark px-5 py-3 sm:px-6 sm:py-3.5 shadow-xs font-sans',
                className
            )}
        >
            <Breadcrumb className="w-full">
                <BreadcrumbList className="text-sm sm:text-base font-medium">
                    {/* Home Default Link if first item is not home icon */}
                    {(!items[0]?.icon && (!items[0]?.href || items[0].href !== '/')) && (
                        <>
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link
                                        href="/"
                                        className="inline-flex items-center gap-1.5 text-heading-light dark:text-heading-dark hover:text-primary dark:hover:text-primary transition-colors"
                                    >
                                        <Home className="size-4.5" />
                                    </Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                        </>
                    )}

                    {items.map((item, index) => {
                        const isLast = index === items.length - 1 || item.isCurrentPage;
                        return (
                            <React.Fragment key={index}>
                                <BreadcrumbItem>
                                    {isLast ? (
                                        <BreadcrumbPage className="font-medium text-[15px] text-heading-light dark:text-heading-dark">
                                            {item.label}
                                        </BreadcrumbPage>
                                    ) : (
                                        <BreadcrumbLink asChild>
                                            <Link
                                                href={item.href || '#'}
                                                className="hover:text-primary dark:hover:text-primary text-[15px] transition-colors font-medium inline-flex items-center gap-1.5"
                                            >
                                                {item.icon || item.label}
                                            </Link>
                                        </BreadcrumbLink>
                                    )}
                                </BreadcrumbItem>
                                {!isLast && <BreadcrumbSeparator />}
                            </React.Fragment>
                        );
                    })}
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    );
};
