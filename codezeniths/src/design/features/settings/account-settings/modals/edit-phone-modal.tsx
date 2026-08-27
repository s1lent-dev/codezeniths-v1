'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    useToast,
} from '@codezeniths/modules';
import {
    Button,
    ButtonVariant,
    ButtonSize,
    FloatingLabelInput,
    FloatingOutlineWrapper,
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
    Typography,
    TypographyVariant,
} from '@codezeniths/components';
import { userQueryService } from '@/lib/tanstack/services/user.query-service';
import { CheckCircle2, AlertCircle, Loader2, Phone, Info } from 'lucide-react';
import {
    COUNTRY_OPTIONS,
    DEFAULT_COUNTRY_CODE,
    splitE164,
    validatePhoneNumber,
} from '@/utils/phone.utils';

const phoneFormSchema = z.object({
    countryCode: z.string().min(1, 'Please select a country code'),
    phone: z.string().min(1, 'Please enter a phone number'),
}).superRefine((data, ctx) => {
    const validation = validatePhoneNumber({
        countryCode: data.countryCode,
        nationalNumber: data.phone,
        isRequired: true,
    });
    if (!validation.isValid) {
        ctx.addIssue({
            code: 'custom',
            message: validation.error || 'Please enter a valid phone number for the selected country',
            path: ['phone'],
        });
    }
});

type PhoneFormValues = z.infer<typeof phoneFormSchema>;

interface EditPhoneModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentPhoneNumber?: string | null;
    onSuccess?: () => void;
}

export const EditPhoneModal: React.FC<EditPhoneModalProps> = ({
    isOpen,
    onClose,
    currentPhoneNumber,
    onSuccess,
}) => {
    const toast = useToast();
    const updatePhoneMutation = userQueryService.updatePhoneNumber();

    // Parse initial country code and phone digits if present
    const parseInitialPhone = (phoneStr?: string | null) => {
        const split = splitE164(phoneStr, DEFAULT_COUNTRY_CODE);
        return { countryCode: split.countryCode, phone: split.nationalNumber };
    };

    const initial = parseInitialPhone(currentPhoneNumber);

    const form = useForm<PhoneFormValues>({
        resolver: zodResolver(phoneFormSchema),
        defaultValues: {
            countryCode: initial.countryCode,
            phone: initial.phone,
        },
        mode: 'onChange',
    });

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors, isSubmitting, isValid },
    } = form;

    const watchedPhone = watch('phone');
    const watchedCountryCode = watch('countryCode') || DEFAULT_COUNTRY_CODE;
    const [debouncedPhone, setDebouncedPhone] = useState('');
    const [isSelectOpen, setIsSelectOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedPhone(watchedPhone?.trim() || '');
        }, 400);
        return () => clearTimeout(timer);
    }, [watchedPhone]);

    useEffect(() => {
        if (isOpen) {
            const parsed = parseInitialPhone(currentPhoneNumber);
            reset(parsed);
            setDebouncedPhone(parsed.phone);
            setIsSelectOpen(false);
        }
    }, [isOpen, currentPhoneNumber, reset]);

    const phoneValidation = validatePhoneNumber({
        countryCode: watchedCountryCode,
        nationalNumber: debouncedPhone,
        isRequired: true,
    });
    const normalizedNumber = phoneValidation.isValid ? (phoneValidation.normalizedE164 || '') : '';
    const isSameAsCurrent = Boolean(normalizedNumber && normalizedNumber === (currentPhoneNumber || ''));
    const shouldCheck = Boolean(normalizedNumber && !isSameAsCurrent);

    const { data: availability, isFetching: isCheckingAvailability } =
        userQueryService.checkPhoneAvailability(
            { phone: normalizedNumber },
            { enabled: shouldCheck, staleTime: 0 }
        );

    const isPhoneTaken = shouldCheck && availability !== undefined && !availability.available;

    const onSubmit = async (values: PhoneFormValues) => {
        const validation = validatePhoneNumber({
            countryCode: values.countryCode,
            nationalNumber: values.phone,
            isRequired: true,
        });

        if (!validation.isValid || !validation.normalizedE164) {
            toast.error('Invalid phone number', validation.error || 'Please enter a valid phone number.');
            return;
        }

        const fullPhone = validation.normalizedE164;
        if (fullPhone === currentPhoneNumber) {
            onClose();
            return;
        }

        if (isPhoneTaken) {
            toast.error('Phone number unavailable', 'Please choose a different phone number.');
            return;
        }

        try {
            await updatePhoneMutation.mutateAsync({
                phoneNumber: fullPhone,
            });
            toast.success('Phone number updated', `Your phone number has been updated to ${fullPhone}.`);
            onSuccess?.();
            onClose();
        } catch (error: any) {
            toast.error('Failed to update phone number', error.message || 'Please try a different phone number.');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
            <DialogContent
                onPointerDownOutside={(e) => {
                    e.preventDefault();
                }}
                onInteractOutside={(e) => {
                    e.preventDefault();
                }}
                className="sm:max-w-md bg-foreground-light dark:bg-foreground-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade1 rounded-md p-0 overflow-hidden shadow-xl gap-0 z-100"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-0">
                    <div className="p-6 space-y-4">
                        <DialogHeader className="space-y-1.5 pb-0">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-sm bg-primary/10 text-primary shrink-0">
                                    <Phone className="size-6" />
                                </div>
                                <div>
                                    <DialogTitle className="text-base font-semibold text-heading-light dark:text-heading-dark">
                                        Change Phone Number
                                    </DialogTitle>
                                    <DialogDescription className="text-xs text-muted-light dark:text-muted-dark mt-0.5">
                                        Update the phone number linked to your account for SMS alerts and security.
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="space-y-2 pt-6">
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                {/* Country Code (1 col) */}
                                <div className="sm:col-span-1 space-y-1">
                                    <FloatingOutlineWrapper
                                        label="Country"
                                        hasValue={Boolean(watchedCountryCode)}
                                    >
                                        <Select
                                            open={isSelectOpen}
                                            onOpenChange={setIsSelectOpen}
                                            value={watchedCountryCode}
                                            onValueChange={(val) => {
                                                setValue('countryCode', val, { shouldValidate: true, shouldDirty: true });
                                                setIsSelectOpen(false);
                                            }}
                                        >
                                            <SelectTrigger className="w-full! h-full! justify-between items-center border-0! px-0! bg-transparent! shadow-none text-sm font-normal focus:ring-0 cursor-pointer">
                                                <SelectValue placeholder="" />
                                            </SelectTrigger>
                                            <SelectContent position="popper" className="w-full min-w-40 z-250 max-h-60">
                                                {COUNTRY_OPTIONS.map((c) => (
                                                    <SelectItem key={`${c.code}-${c.value}`} value={c.value} className="cursor-pointer text-xs">
                                                        {c.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FloatingOutlineWrapper>
                                </div>

                                {/* Phone Number Input with Floating Label (3 cols) */}
                                <div className="sm:col-span-3 space-y-1">
                                    <div className="relative group w-full">
                                        <FloatingLabelInput
                                            id="phone"
                                            type="tel"
                                            label="Phone Number"
                                            value={watchedPhone || ''}
                                            onChange={(e) => {
                                                const raw = e.target.value.replace(/[^\d\s-]/g, '');
                                                setValue('phone', raw, { shouldValidate: true, shouldDirty: true });
                                            }}
                                            error={Boolean(errors.phone) || isPhoneTaken}
                                            className={isCheckingAvailability || (shouldCheck && availability?.available && !errors.phone) ? 'pr-28' : ''}
                                        />
                                        {isCheckingAvailability && (
                                            <Typography variant={TypographyVariant.CAPTION} className="text-warning dark:text-warning absolute right-3 top-1/2 -translate-y-1/2 font-medium">
                                                checking...
                                            </Typography>
                                        )}
                                        {!isCheckingAvailability && shouldCheck && availability?.available && !errors.phone && (
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                                                <Typography variant={TypographyVariant.CAPTION} className="text-success dark:text-success font-medium">
                                                    Available
                                                </Typography>
                                                <CheckCircle2 className="size-4 text-success animate-in zoom-in duration-300" />
                                            </div>
                                        )}
                                    </div>
                                    {errors.phone && (
                                        <p className="text-xs text-destructive pt-0.5">{errors.phone.message}</p>
                                    )}
                                    {isPhoneTaken && !errors.phone && (
                                        <p className="text-xs text-destructive pt-0.5">This number is already registered</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Notice */}
                        <div className="flex items-start gap-2.5 p-3.5 rounded-md bg-info/10 border border-info/20 text-info-foreground dark:text-info text-xs leading-relaxed">
                            <Info className="size-4 shrink-0 mt-0.5" />
                            <p className="text-muted-light dark:text-muted-dark">
                                Updating your phone number will require SMS re-verification to confirm ownership.
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="px-6 py-4 bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 border-t border-foreground-light-shade3 dark:border-foreground-dark-shade1 flex flex-row items-center justify-end gap-2.5 m-0 rounded-b-md rounded-t-none">
                        <Button
                            type="button"
                            variant={ButtonVariant.GHOST}
                            size={ButtonSize.SM}
                            onClick={onClose}
                            className="text-xs rounded-sm"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant={ButtonVariant.DEFAULT}
                            size={ButtonSize.SM}
                            disabled={!isValid || isSubmitting || updatePhoneMutation.isPending || isCheckingAvailability || isPhoneTaken}
                            isLoading={updatePhoneMutation.isPending || isSubmitting}
                            loadingText="Updating..."
                            className="text-xs font-medium rounded-sm border-none bg-primary hover:bg-primary/90 text-foreground-dark-shade3 dark:text-foreground-light-shade3 min-w-28 px-4 py-2"
                        >
                            Update Phone
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
