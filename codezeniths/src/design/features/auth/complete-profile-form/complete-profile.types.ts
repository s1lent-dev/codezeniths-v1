import { z } from 'zod';
import { UseFormReturn } from 'react-hook-form';
import { completeProfileSchema } from './complete-profile.utils';

export interface LocationItem {
    label: string;
    value: string;
    country: string;
}

export type CompleteProfileFormValues = z.infer<typeof completeProfileSchema>;

export interface StepProps {
    form: UseFormReturn<CompleteProfileFormValues>;
    hasExistingPhoneNumber?: boolean;
}
