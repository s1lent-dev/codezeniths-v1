'use client';

import React from 'react';
import {
    Typography,
    TypographyVariant,
    TypographyWeight,
    Button,
    ButtonVariant,
    ButtonSize,
    Badge,
} from '@codezeniths/components';
import { Card } from '@codezeniths/modules';
import { History, Download, FileText, CheckCircle2 } from 'lucide-react';
import { InvoiceItem } from './useBillingSettings';

interface InvoicesHistoryTableProps {
    invoices: InvoiceItem[];
    onDownloadInvoice: (invoiceNumber: string) => void;
}

export const InvoicesHistoryTable: React.FC<InvoicesHistoryTableProps> = ({
    invoices,
    onDownloadInvoice,
}) => {
    return (
        <Card className="w-full p-6 sm:p-8 rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 ring-0 bg-foreground-light dark:bg-foreground-dark shadow-xs space-y-7">
            {/* Section Header */}
            <div className="flex items-center gap-3">
                <div className="p-3 rounded-sm bg-primary/10 text-primary shrink-0">
                    <History className="size-6" />
                </div>
                <div>
                    <Typography
                        as="h3"
                        variant={TypographyVariant.H5}
                        weight={TypographyWeight.SEMIBOLD}
                        className="text-sm sm:text-base font-semibold text-heading-light dark:text-heading-dark"
                    >
                        Invoices & Billing Receipts
                    </Typography>
                    <Typography
                        as="p"
                        variant={TypographyVariant.MUTED}
                        className="text-xs text-muted-light dark:text-muted-dark mt-0.5"
                    >
                        View your historical subscription billing statements and download tax-compliant PDF invoices
                    </Typography>
                </div>
            </div>

            {/* Invoices List / Table */}
            <div className="space-y-3 pt-6">
                {invoices.map((inv) => (
                    <div
                        key={inv.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4.5 rounded-md bg-foreground-light-shade1/60 dark:bg-foreground-dark-shade1/40 border border-foreground-light-shade3 dark:border-foreground-dark-shade1"
                    >
                        <div className="flex items-center gap-3.5 min-w-0">
                            <div className="p-2.5 rounded-sm bg-primary/10 text-primary shrink-0">
                                <FileText className="size-5" />
                            </div>

                            <div className="flex flex-col min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-heading-light dark:text-heading-dark truncate">
                                        {inv.invoiceNumber}
                                    </span>
                                    <Badge variant="success" className="px-2 py-0.2 text-[10px] h-4.5 rounded-xs font-semibold">
                                        Paid
                                    </Badge>
                                </div>
                                <span className="text-xs text-muted-light dark:text-muted-dark mt-0.5">
                                    {inv.description} • {inv.date}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 self-start sm:self-center shrink-0">
                            <span className="text-sm font-bold text-heading-light dark:text-heading-dark">
                                {inv.amount}
                            </span>

                            <Button
                                type="button"
                                variant={ButtonVariant.OUTLINE}
                                size={ButtonSize.SM}
                                onClick={() => onDownloadInvoice(inv.invoiceNumber)}
                                leftIcon={<Download className="size-3 text-primary" />}
                                className="text-xs rounded-sm border-none bg-primary/10 hover:bg-primary/15 text-primary px-3 py-1.5"
                            >
                                Download PDF
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};
