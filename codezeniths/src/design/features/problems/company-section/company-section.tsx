'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@codezeniths/design/cn';

export interface CompanyBadgeItem {
    id: string;
    name: string;
    count: number;
    slug: string;
}

const DEFAULT_COMPANIES: CompanyBadgeItem[] = [
    { id: '1', name: 'Google', count: 450, slug: 'google' },
    { id: '2', name: 'Meta', count: 450, slug: 'meta' },
    { id: '3', name: 'Microsoft', count: 450, slug: 'microsoft' },
    { id: '4', name: 'Amazon', count: 450, slug: 'amazon' },
    { id: '5', name: 'Apple', count: 450, slug: 'apple' },
    { id: '6', name: 'Salesforce', count: 450, slug: 'salesforce' },
    { id: '7', name: 'Uber', count: 450, slug: 'uber' },
    { id: '8', name: 'Netflix', count: 450, slug: 'netflix' },
    { id: '9', name: 'Citadel', count: 450, slug: 'citadel' },
    { id: '10', name: 'Nvidia', count: 450, slug: 'nvidia' },
    { id: '11', name: 'Mastercard', count: 450, slug: 'mastercard' },
    { id: '12', name: 'Jp Morgan', count: 450, slug: 'jp-morgan' },
    { id: '13', name: 'Morgan Stanley', count: 450, slug: 'morgan-stanley' },
    { id: '14', name: 'Visa', count: 450, slug: 'visa' },
];

export interface CompanySectionProps {
    className?: string;
    onSelectCompany?: (slug: string) => void;
}

export const CompanySection: React.FC<CompanySectionProps> = ({ className, onSelectCompany }) => {
    return (
        <div className={cn('w-full rounded-lg bg-foreground-light dark:bg-foreground-dark p-6 space-y-4 text-heading-light dark:text-heading-dark shadow-md font-sans', className)}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-base font-bold tracking-tight text-heading-light dark:text-heading-dark">
                    Trending Companies
                </h3>
                <div className="flex items-center gap-1.5 text-muted-light dark:text-muted-dark">
                    <button type="button" className="p-1 hover:text-primary transition-colors cursor-pointer" aria-label="Previous companies">
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button type="button" className="p-1 hover:text-primary transition-colors cursor-pointer" aria-label="Next companies">
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Badges Grid */}
            <div className="flex flex-wrap gap-2.5">
                {DEFAULT_COMPANIES.map((company) => (
                    <button
                        key={company.id}
                        type="button"
                        onClick={() => onSelectCompany?.(company.slug)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background-light dark:bg-background-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade3 text-body-light dark:text-body-dark hover:border-primary/50 hover:text-heading-light dark:hover:text-heading-dark transition-all cursor-pointer text-xs font-medium"
                    >
                        <span>{company.name}</span>
                        <span className="px-1.5 py-0.5 rounded-full bg-primary/10 dark:bg-primary/20 text-foreground-dark-shade3/75 dark:text-foreground-light-shade3 text-[10px] font-bold">
                            {company.count}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};
