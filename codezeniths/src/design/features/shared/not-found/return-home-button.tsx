'use client';

import React from 'react';
import { Button, ButtonEffect, ButtonVariant, ButtonSize } from '@codezeniths/components';
import { useAuth } from '@codezeniths/lib/auth/auth';
import { useRouter } from 'next/navigation';

export const ReturnHomeButton = () => {
    const [isNavigating, setIsNavigating] = React.useState(false);
    const { isAuthenticated, isLoading, user } = useAuth();
    const router = useRouter();
    
    const href = isAuthenticated 
        ? (user?.isOnboardingComplete ? '/problemset' : '/complete-profile') 
        : '/';

    const handleNavigation = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsNavigating(true);
        // We use a slight timeout to allow the React state to render the spinner before blocking the thread with navigation/WebGL cleanup.
        setTimeout(() => {
            router.push(href);
        }, 50);
    };

    return (
        <Button 
            effect={ButtonEffect.SHIMMER} 
            variant={ButtonVariant.DEFAULT} 
            size={ButtonSize.LG}
            onClick={handleNavigation}
            disabled={isNavigating || isLoading}
            isLoading={isNavigating}
        >
            {isNavigating ? 'Returning...' : 'Return Home'}
        </Button>
    );
};
