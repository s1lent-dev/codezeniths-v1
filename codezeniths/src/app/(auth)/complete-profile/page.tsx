import { CompleteProfile } from '@/design/features/auth/complete-profile-form';
import React, { Suspense } from 'react';

export const metadata = {
    title: 'Complete Profile | CodeZeniths',
    description: 'Complete your profile setup to personalize your CodeZeniths learning experience.',
};

export default function CompleteProfilePage() {
    return (
        <Suspense fallback={null}>
            <CompleteProfile />
        </Suspense>
    );
}
