'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// Global Event Emitter for Programmatic Navigation
type NavigationListener = (status: 'start' | 'complete') => void;
const listeners = new Set<NavigationListener>();

export function startNavigationProgress() {
    listeners.forEach((listener) => listener('start'));
}

export function completeNavigationProgress() {
    listeners.forEach((listener) => listener('complete'));
}

export const NavigationProgressBar: React.FC = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [progress, setProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    const trickleIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const finishTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const clearTimers = useCallback(() => {
        if (trickleIntervalRef.current) {
            clearInterval(trickleIntervalRef.current);
            trickleIntervalRef.current = null;
        }
        if (finishTimeoutRef.current) {
            clearTimeout(finishTimeoutRef.current);
            finishTimeoutRef.current = null;
        }
    }, []);

    const startProgress = useCallback(() => {
        clearTimers();
        setIsVisible(true);
        setProgress(20);

        trickleIntervalRef.current = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 90) return prev;
                const step = (90 - prev) * 0.1;
                return Math.min(prev + Math.max(step, 1.5), 90);
            });
        }, 150);
    }, [clearTimers]);

    const completeProgress = useCallback(() => {
        clearTimers();
        setProgress(100);

        finishTimeoutRef.current = setTimeout(() => {
            setIsVisible(false);
            setProgress(0);
        }, 300);
    }, [clearTimers]);

    // Listen to route changes
    useEffect(() => {
        completeProgress();
    }, [pathname, searchParams, completeProgress]);

    // Listen to global listener events
    useEffect(() => {
        const handleStatus = (status: 'start' | 'complete') => {
            if (status === 'start') {
                startProgress();
            } else {
                completeProgress();
            }
        };

        listeners.add(handleStatus);
        return () => {
            listeners.delete(handleStatus);
            clearTimers();
        };
    }, [startProgress, completeProgress, clearTimers]);

    // Global Click Interceptor for <a href="..."> Navigation Links
    useEffect(() => {
        const handleGlobalClick = (event: MouseEvent) => {
            if (event.defaultPrevented) return;
            if (event.button !== 0) return; // Only primary mouse button
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

            const anchor = (event.target as HTMLElement)?.closest('a');
            if (!anchor) return;

            const href = anchor.getAttribute('href');
            if (!href) return;

            // Ignore external links, anchors, or new tab links
            if (anchor.target && anchor.target !== '_self') return;
            if (anchor.hasAttribute('download')) return;
            if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

            try {
                const targetUrl = new URL(anchor.href, window.location.href);
                const currentUrl = new URL(window.location.href);

                if (targetUrl.origin !== currentUrl.origin) return;

                // If navigating to a different pathname or search query, trigger 0ms progress immediately
                if (
                    targetUrl.pathname !== currentUrl.pathname ||
                    targetUrl.search !== currentUrl.search
                ) {
                    startProgress();
                }
            } catch {
                // Invalid URL, ignore
            }
        };

        document.addEventListener('click', handleGlobalClick, { capture: true });
        return () => {
            document.removeEventListener('click', handleGlobalClick, { capture: true });
        };
    }, [startProgress]);

    if (!isVisible && progress === 0) return null;

    return (
        <div
            className="fixed top-0 left-0 right-0 pointer-events-none z-[99999]"
            style={{
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 300ms ease-out',
            }}
        >
            <div
                className="h-[3px] bg-linear-to-r from-primary via-purple-500 to-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.8),0_0_5px_rgba(168,85,247,0.6)]"
                style={{
                    width: `${progress}%`,
                    transition: progress === 100 ? 'width 150ms ease-out' : 'width 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                }}
            />
        </div>
    );
};
