'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CheckCircle2 } from 'lucide-react';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
    FloatingLabelInput,
    FloatingLabelTextarea,
    FloatingOutlineWrapper,
    Typography,
    TypographyVariant,
} from '@codezeniths/components';
import { DatePicker } from '@codezeniths/modules';
import { LocationInput, UploadInput } from '@codezeniths/widgets';
import { Step0Values } from '../useCompleteProfileForm';
import { GENDER_OPTIONS } from '../complete-profile.utils';
import { COUNTRY_OPTIONS, DEFAULT_COUNTRY_CODE } from '@/utils/phone.utils';

export const COUNTRY_CODE_OPTIONS = COUNTRY_OPTIONS;

interface Step1Props {
    form: UseFormReturn<Step0Values>;
    hasExistingPhoneNumber?: boolean;
    isUploadingImage: boolean;
    onAvatarUpload: (file: File) => void;
    onAvatarRemove: () => void;
    phoneCheck?: { available: boolean; isVerified?: boolean };
    isCheckingPhone?: boolean;
}

export const Step1PersonalDetails: React.FC<Step1Props> = ({
    form,
    hasExistingPhoneNumber,
    isUploadingImage,
    onAvatarUpload,
    onAvatarRemove,
    phoneCheck,
    isCheckingPhone,
}) => {
    const { register, watch, setValue, formState: { errors } } = form;

    const currentImage = watch('image');
    const currentDob = watch('dob');
    const currentGender = watch('gender');
    const currentLocation = watch('location');
    const currentCountryCode = watch('countryCode') || '+1';
    const currentPhone = watch('phone');
    const hasPhoneError = Boolean(errors.phone);

    return (
        <div className="space-y-6 sm:space-y-8 w-full p-1 xs:p-2 sm:p-6">
            {/* Upload PFP Section at top */}
            <div className="w-full">
                <UploadInput
                    value={currentImage}
                    onChange={(file, previewUrl) => {
                        if (previewUrl) {
                            setValue('image', previewUrl, { shouldValidate: true, shouldDirty: true });
                        } else {
                            setValue('image', null, { shouldValidate: true, shouldDirty: true });
                        }
                    }}
                    onUpload={onAvatarUpload}
                    onRemove={onAvatarRemove}
                    isUploading={isUploadingImage}
                    avatarSize="xl"
                    shape="circle"
                    title="Profile Picture"
                    description="Upload a photo for your avatar (PNG, JPG, or WEBP up to 5MB)"
                    uploadButtonText="Upload Photo"
                    changeButtonText="Change Photo"
                    removeButtonText="Remove"
                />
            </div>

            {/* Row 1: First Name & Last Name Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-4 sm:gap-y-6 md:gap-y-8">
                <div className="space-y-1">
                    <FloatingLabelInput
                        id="firstName"
                        label="First Name"
                        required
                        error={Boolean(errors.firstName)}
                        {...register('firstName')}
                    />
                    {errors.firstName && (
                        <p className="text-xs text-destructive pt-0.5">{errors.firstName.message}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <FloatingLabelInput
                        id="lastName"
                        label="Last Name"
                        required
                        error={Boolean(errors.lastName)}
                        {...register('lastName')}
                    />
                    {errors.lastName && (
                        <p className="text-xs text-destructive pt-0.5">{errors.lastName.message}</p>
                    )}
                </div>
            </div>

            {/* Row 2: Date of Birth & Gender Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-4 sm:gap-y-6 md:gap-y-8">
                <div className="space-y-1">
                    <FloatingOutlineWrapper
                        label="Date of Birth"
                        hasValue={Boolean(currentDob)}
                    >
                        <DatePicker
                            variant="auth"
                            value={currentDob}
                            placeholder=" "
                            fromYear={1940}
                            toYear={new Date().getFullYear()}
                            onChange={(date) => setValue('dob', date, { shouldValidate: true })}
                            className="border-0! shadow-none! h-full! w-full! bg-transparent! p-0!"
                        />
                    </FloatingOutlineWrapper>
                </div>

                <div className="space-y-1">
                    <FloatingOutlineWrapper
                        label="Gender"
                        hasValue={Boolean(currentGender)}
                    >
                        <Select
                            value={currentGender || ''}
                            onValueChange={(val) => setValue('gender', val as any, { shouldValidate: true })}
                        >
                            <SelectTrigger className="w-full! h-full! justify-between items-center border-0! px-0! bg-transparent! shadow-none text-sm font-normal focus:ring-0 cursor-pointer">
                                <SelectValue placeholder="" />
                            </SelectTrigger>
                            <SelectContent position="popper" className="w-full min-w-50">
                                {GENDER_OPTIONS.map((option) => (
                                    <SelectItem key={option.value} value={option.value} className='cursor-pointer'>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FloatingOutlineWrapper>
                </div>
            </div>

            {/* Row 3: Location (Full Width) */}
            <div className="w-full space-y-1">
                <FloatingOutlineWrapper
                    label="Location"
                    required
                    hasValue={Boolean(currentLocation)}
                    error={Boolean(errors.location)}
                >
                    <LocationInput
                        id="location"
                        value={currentLocation || ''}
                        onChange={(val: string) => setValue('location', val, { shouldValidate: true, shouldDirty: true })}
                        error={!!errors.location}
                        placeholder=""
                        className="border-0! border-b-0! h-full! py-0!"
                    />
                </FloatingOutlineWrapper>
                {errors.location && (
                    <p className="text-xs text-destructive pt-0.5">{errors.location.message}</p>
                )}
            </div>

            {/* Row 4: About / Bio Field */}
            <div className="w-full space-y-1">
                <FloatingLabelTextarea
                    id="about"
                    label="About / Bio (Optional)"
                    rows={3}
                    error={Boolean(errors.about)}
                    {...register('about')}
                />
                {errors.about && (
                    <p className="text-xs text-destructive pt-0.5">{errors.about.message}</p>
                )}
            </div>

            {/* Row 5: Phone Number (Optional) with Floating Styling & Live Availability Check */}
            {!hasExistingPhoneNumber && (
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-x-4 sm:gap-x-8 gap-y-4 sm:gap-y-6 w-full">
                    {/* Country Code (1 col) */}
                    <div className="sm:col-span-1 space-y-1">
                        <FloatingOutlineWrapper
                            label="Country"
                            hasValue={Boolean(currentCountryCode)}
                        >
                            <Select
                                value={currentCountryCode}
                                onValueChange={(val) => setValue('countryCode', val, { shouldValidate: true, shouldDirty: true })}
                            >
                                <SelectTrigger className="w-full! h-full! justify-between items-center border-0! px-0! bg-transparent! shadow-none text-sm font-normal focus:ring-0 cursor-pointer">
                                    <SelectValue placeholder="" />
                                </SelectTrigger>
                                <SelectContent position="popper" className="w-full min-w-40">
                                    {COUNTRY_CODE_OPTIONS.map((option) => (
                                        <SelectItem key={`${option.code}-${option.value}`} value={option.value} className="cursor-pointer">
                                            {option.label}
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
                                label="Phone Number (Optional)"
                                value={currentPhone || ''}
                                onChange={(e) => {
                                    const raw = e.target.value.replace(/[^\d\s-]/g, '');
                                    setValue('phone', raw, { shouldValidate: true, shouldDirty: true });
                                }}
                                error={hasPhoneError}
                                className={isCheckingPhone || (currentPhone && phoneCheck?.available && !hasPhoneError) ? 'pr-28' : ''}
                            />
                            {isCheckingPhone && (
                                <Typography variant={TypographyVariant.CAPTION} className="text-warning dark:text-warning absolute right-3 top-1/2 -translate-y-1/2 font-medium">
                                    checking...
                                </Typography>
                            )}
                            {!isCheckingPhone && currentPhone && currentPhone.length > 0 && phoneCheck?.available && !hasPhoneError && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                                    <Typography variant={TypographyVariant.CAPTION} className="text-success dark:text-success font-medium">
                                        Available
                                    </Typography>
                                    <CheckCircle2 size={18} className="text-success animate-in zoom-in duration-300" />
                                </div>
                            )}
                            <div className="absolute left-0 -top-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 text-foreground-dark dark:text-foreground-light text-xs px-3 py-2 rounded-md shadow-lg z-20 whitespace-normal sm:whitespace-nowrap w-max max-w-full">
                                It&apos;s optional, but if you want to verify with a phone number in the future, you must add it here.
                            </div>
                        </div>
                        {hasPhoneError && (
                            <p className="text-xs text-destructive pt-0.5">{errors.phone?.message as string}</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
