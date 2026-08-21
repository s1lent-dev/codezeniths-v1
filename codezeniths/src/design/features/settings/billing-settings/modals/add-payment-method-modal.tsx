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
} from '@codezeniths/components';
import { CreditCard, Loader2, Lock } from 'lucide-react';
import { PaymentMethodItem } from '../useBillingSettings';

interface AddPaymentMethodModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddCard: (card: Omit<PaymentMethodItem, 'id' | 'isDefault'>) => void;
}

export const AddPaymentMethodModal: React.FC<AddPaymentMethodModalProps> = ({
    isOpen,
    onClose,
    onAddCard,
}) => {
    const [cardholderName, setCardholderName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryMonth, setExpiryMonth] = useState('');
    const [expiryYear, setExpiryYear] = useState('');
    const [cvc, setCvc] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!cardNumber || !expiryMonth || !expiryYear || !cardholderName) return;

        setIsSubmitting(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 800));
            const last4 = cardNumber.replace(/\s+/g, '').slice(-4) || '1234';
            const brand = cardNumber.startsWith('5') ? 'mastercard' : cardNumber.startsWith('3') ? 'amex' : 'visa';

            onAddCard({
                brand: brand as 'visa' | 'mastercard' | 'amex',
                last4,
                expiryMonth: expiryMonth.padStart(2, '0'),
                expiryYear: expiryYear.slice(-2),
                cardholderName,
            });
            // Reset form
            setCardholderName('');
            setCardNumber('');
            setExpiryMonth('');
            setExpiryYear('');
            setCvc('');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md p-6 bg-foreground-light dark:bg-foreground-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade1 z-100">
                <DialogHeader className="space-y-2">
                    <div className="size-10 rounded-sm bg-primary/10 text-primary flex items-center justify-center">
                        <CreditCard className="size-5" />
                    </div>
                    <DialogTitle className="text-base font-bold text-heading-light dark:text-heading-dark">
                        Add Payment Method
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-light dark:text-muted-dark">
                        Enter your credit card credentials. Payment information is securely encrypted.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    {/* Cardholder Name */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-heading-light dark:text-heading-dark">
                            Cardholder Name
                        </Label>
                        <Input
                            value={cardholderName}
                            onChange={(e) => setCardholderName(e.target.value)}
                            placeholder="John Doe"
                            required
                            className="text-xs text-foreground-dark-shade3 dark:text-foreground-light-shade3 rounded-sm"
                        />
                    </div>

                    {/* Card Number */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-heading-light dark:text-heading-dark">
                            Card Number
                        </Label>
                        <Input
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="4242 •••• •••• 4242"
                            maxLength={19}
                            required
                            className="text-xs text-foreground-dark-shade3 dark:text-foreground-light-shade3 rounded-sm"
                        />
                    </div>

                    {/* Expiry & CVC */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-heading-light dark:text-heading-dark">
                                Month
                            </Label>
                            <Input
                                value={expiryMonth}
                                onChange={(e) => setExpiryMonth(e.target.value)}
                                placeholder="MM (08)"
                                maxLength={2}
                                required
                                className="text-xs text-foreground-dark-shade3 dark:text-foreground-light-shade3 rounded-sm"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-heading-light dark:text-heading-dark">
                                Year
                            </Label>
                            <Input
                                value={expiryYear}
                                onChange={(e) => setExpiryYear(e.target.value)}
                                placeholder="YY (28)"
                                maxLength={4}
                                required
                                className="text-xs text-foreground-dark-shade3 dark:text-foreground-light-shade3 rounded-sm"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-heading-light dark:text-heading-dark">
                                CVC
                            </Label>
                            <Input
                                value={cvc}
                                onChange={(e) => setCvc(e.target.value)}
                                placeholder="123"
                                maxLength={4}
                                required
                                className="text-xs text-foreground-dark-shade3 dark:text-foreground-light-shade3 rounded-sm"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1 text-[11px] text-muted-light dark:text-muted-dark">
                        <Lock className="size-3 text-emerald-500" />
                        <span>End-to-end 256-bit SSL encrypted tokenization</span>
                    </div>

                    <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-6">
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
                            leftIcon={isSubmitting ? <Loader2 className="size-3.5 animate-spin" /> : <CreditCard className="size-3.5" />}
                            className="text-xs font-medium rounded-sm border-none bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                            {isSubmitting ? 'Saving Card...' : 'Save Payment Method'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
