import React, { Suspense } from 'react';
import { VerifyEmail } from '@/design/features/auth/verify-email-form';

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={null}>
            <VerifyEmail />
        </Suspense>
    );
}
