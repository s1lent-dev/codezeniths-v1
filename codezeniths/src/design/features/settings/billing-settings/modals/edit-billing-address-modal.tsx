'use client';

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@codezeniths/modules';
import {
    Button,
    ButtonVariant,
    ButtonSize,
    Input,
    Label,
    ScrollArea,
} from '@codezeniths/components';
import { Receipt, Loader2 } from 'lucide-react';
import { BillingAddressDetails } from '../useBillingSettings';

interface EditBillingAddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentDetails: BillingAddressDetails;
    onSaveDetails: (details: BillingAddressDetails) => void;
}

export const EditBillingAddressModal: React.FC<EditBillingAddressModalProps> = ({
    isOpen,
    onClose,
    currentDetails,
    onSaveDetails,
}) => {
    const [formValues, setFormValues] = useState<BillingAddressDetails>(currentDetails);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (field: keyof BillingAddressDetails, value: string) => {
        setFormValues((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 600));
            onSaveDetails(formValues);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-lg p-6 bg-foreground-light dark:bg-foreground-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade1 max-h-[85vh] h-140 flex flex-col z-100 overflow-hidden">
                <DialogHeader className="space-y-2 shrink-0 pb-1">
                    <div className="size-10 rounded-sm bg-primary/10 text-primary flex items-center justify-center">
                        <Receipt className="size-5" />
                    </div>
                    <div className="space-y-1">
                        <DialogTitle className="text-base font-bold text-heading-light dark:text-heading-dark">
                            Edit Billing Information & Tax ID
                        </DialogTitle>
                        <DialogDescription className="text-xs text-muted-light dark:text-muted-dark">
                            Update the legal address and entity details displayed on your invoices.
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 mt-3 justify-between">
                    <ScrollArea type="always" className="flex-1 w-full min-h-0 pr-4">
                        <div className="space-y-8 py-2">
                            {/* Row 1: Full Legal Name & Company */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-6">
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-semibold text-body-light dark:text-body-dark block">
                                        Full Legal Name
                                    </Label>
                                    <Input
                                        value={formValues.fullName}
                                        onChange={(e) => handleChange('fullName', e.target.value)}
                                        required
                                        className="text-xs text-foreground-dark-shade3 dark:text-foreground-light-shade3 rounded-sm"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[11px] font-semibold text-body-light dark:text-body-dark block">
                                        Company / Entity Name
                                    </Label>
                                    <Input
                                        value={formValues.companyName}
                                        onChange={(e) => handleChange('companyName', e.target.value)}
                                        placeholder="Optional"
                                        className="text-xs text-foreground-dark-shade3 dark:text-foreground-light-shade3 rounded-sm"
                                    />
                                </div>
                            </div>

                            {/* Row 2: Tax / VAT ID & Billing Email */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-6">
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-semibold text-body-light dark:text-body-dark block">
                                        Tax / VAT ID Number
                                    </Label>
                                    <Input
                                        value={formValues.taxId}
                                        onChange={(e) => handleChange('taxId', e.target.value)}
                                        placeholder="e.g. US-948271039"
                                        className="text-xs text-foreground-dark-shade3 dark:text-foreground-light-shade3 rounded-sm"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[11px] font-semibold text-body-light dark:text-body-dark block">
                                        Billing Email Address
                                    </Label>
                                    <Input
                                        type="email"
                                        value={formValues.billingEmail}
                                        onChange={(e) => handleChange('billingEmail', e.target.value)}
                                        required
                                        className="text-xs text-foreground-dark-shade3 dark:text-foreground-light-shade3 rounded-sm"
                                    />
                                </div>
                            </div>

                            {/* Row 3: Street Address */}
                            <div className="space-y-2">
                                <Label className="text-[11px] font-semibold text-body-light dark:text-body-dark block">
                                    Street Address
                                </Label>
                                <Input
                                    value={formValues.addressLine1}
                                    onChange={(e) => handleChange('addressLine1', e.target.value)}
                                    required
                                    className="text-xs text-foreground-dark-shade3 dark:text-foreground-light-shade3 rounded-sm"
                                />
                            </div>

                            {/* Row 4: City, State, Postal Code */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-6">
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-semibold text-body-light dark:text-body-dark block">
                                        City
                                    </Label>
                                    <Input
                                        value={formValues.city}
                                        onChange={(e) => handleChange('city', e.target.value)}
                                        required
                                        className="text-xs text-foreground-dark-shade3 dark:text-foreground-light-shade3 rounded-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-semibold text-body-light dark:text-body-dark block">
                                        State / Region
                                    </Label>
                                    <Input
                                        value={formValues.state}
                                        onChange={(e) => handleChange('state', e.target.value)}
                                        required
                                        className="text-xs text-foreground-dark-shade3 dark:text-foreground-light-shade3 rounded-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-semibold text-body-light dark:text-body-dark block">
                                        Postal Code
                                    </Label>
                                    <Input
                                        value={formValues.postalCode}
                                        onChange={(e) => handleChange('postalCode', e.target.value)}
                                        required
                                        className="text-xs text-foreground-dark-shade3 dark:text-foreground-light-shade3 rounded-sm"
                                    />
                                </div>
                            </div>

                            {/* Row 5: Country */}
                            <div className="space-y-2 pb-1">
                                <Label className="text-[11px] font-semibold text-body-light dark:text-body-dark block">
                                    Country
                                </Label>
                                <Input
                                    value={formValues.country}
                                    onChange={(e) => handleChange('country', e.target.value)}
                                    required
                                    className="text-xs text-foreground-dark-shade3 dark:text-foreground-light-shade3 rounded-sm"
                                />
                            </div>
                        </div>
                    </ScrollArea>

                    <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-6 shrink-0">
                        <Button
                            type="button"
                            variant={ButtonVariant.OUTLINE}
                            size={ButtonSize.SM}
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="text-xs rounded-sm border-none bg-primary/10 hover:bg-primary/15 text-heading-light dark:text-heading-dark"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant={ButtonVariant.DEFAULT}
                            size={ButtonSize.SM}
                            disabled={isSubmitting}
                            leftIcon={isSubmitting ? <Loader2 className="size-3.5 animate-spin" /> : null}
                            className="text-xs font-medium rounded-sm border-none bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                            {isSubmitting ? 'Saving...' : 'Save Billing Details'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
