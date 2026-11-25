import { Signin } from '@/design/features/auth/signin-form';
import React, { Suspense } from 'react';

export default function SignInPage() {
    return (
        <Suspense fallback={null}>
            <Signin />
        </Suspense>
    );
}
