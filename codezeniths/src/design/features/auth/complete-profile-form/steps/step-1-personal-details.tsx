'use client';

import React, { useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Calendar as CalendarIcon, Upload, User as UserIcon, MapPin, Phone } from 'lucide-react';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
    FloatingLabelInput,
    FloatingLabelTextarea,
    FloatingOutlineWrapper,
} from '@codezeniths/components';
import { Calendar, DatePicker } from '@codezeniths/modules';
import { LocationInput, UploadInput } from '@codezeniths/widgets';
import { Step0Values } from '../useCompleteProfileForm';
import { GENDER_OPTIONS } from '../complete-profile.utils';

interface Step1Props {
    form: UseFormReturn<Step0Values>;
    hasExistingPhoneNumber?: boolean;
    isUploadingImage: boolean;
    onAvatarUpload: (file: File) => void;
    onAvatarRemove: () => void;
}

export const Step1PersonalDetails: React.FC<Step1Props> = ({
    form,
    hasExistingPhoneNumber,
    isUploadingImage,
    onAvatarUpload,
    onAvatarRemove,
}) => {
    const { register, watch, setValue, formState: { errors } } = form;

    const currentImage = watch('image');
    const currentDob = watch('dob');
    const currentGender = watch('gender');
    const currentLocation = watch('location');

    return (
        <div className="space-y-8 w-full p-6">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
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

            {/* Row 5: Phone Number (Optional) */}
            {!hasExistingPhoneNumber && (
                <div className="w-full space-y-1">
                    <FloatingLabelInput
                        id="phoneNumber"
                        label="Phone Number (Optional)"
                        {...register('phoneNumber')}
                    />
                </div>
            )}
        </div>
    );
};
