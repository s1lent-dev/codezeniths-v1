import { useCallback, useEffect, useState } from 'react';
import type {
    ColorScheme,
    UseMediaQueryOptions,
} from './types';

/**
 * @function useMediaQuery
 * Tracks the state of a CSS media query and responds to changes in real-time.
 * Optimized for performance with proper cleanup and SSR compatibility.
 * Works seamlessly with Tailwind CSS breakpoints and custom media queries.
 * @param query The media query string to monitor (e.g., '(min-width: 768px)').
 * @param options Configuration options for the hook.
 * @param options.defaultValue Default value to use during SSR or when window is unavailable (default: false).
 * @param options.initializeWithValue Whether to initialize with the actual media query value immediately (default: true).
 * @returns A boolean indicating whether the media query currently matches.
 *
 * @example
 * // Basic usage with Tailwind breakpoints
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1024px)');
 * const isDesktop = useMediaQuery('(min-width: 1024px)');
 *
 * // With custom configuration
 * const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)', {
 *   defaultValue: false,
 *   initializeWithValue: false
 * });
 *
 * return (
 *   <div className={`p-4 ${isMobile ? 'text-sm' : 'text-base'}`}>
 *     <p>Current screen: {isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'}</p>
 *   </div>
 * );
 */

const useMediaQuery = (
    query: string,
    options: UseMediaQueryOptions = {},
): boolean => {
    const { defaultValue = false, initializeWithValue = true } = options;

    const [matches, setMatches] = useState<boolean>(() => {
        if (!initializeWithValue) {
            return defaultValue;
        }

        // SSR safety check
        if (typeof window === 'undefined') {
            return defaultValue;
        }

        // Immediately evaluate the media query
        try {
            const mediaQuery = window.matchMedia(query);
            return mediaQuery.matches;
        } catch (error) {
            console.warn('useMediaQuery: Invalid media query:', query, error);
            return defaultValue;
        }
    });

    const handleChange = useCallback((event: MediaQueryListEvent) => {
        setMatches(event.matches);
    }, []);

    useEffect(() => {
        // SSR safety check
        if (typeof window === 'undefined') {
            return;
        }

        let mediaQuery: MediaQueryList;

        try {
            mediaQuery = window.matchMedia(query);
        } catch (error) {
            console.warn('useMediaQuery: Invalid media query:', query, error);
            return;
        }

        // Set initial value if not already initialized
        if (!initializeWithValue) {
            setMatches(mediaQuery.matches);
        }

        // Use modern addEventListener API (supported in all modern browsers)
        mediaQuery.addEventListener('change', handleChange);

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };

    }, [query, handleChange, initializeWithValue]);

    return matches;
};

/**
 * @function usePreferredColorScheme
 * Detects the user's preferred color scheme (light/dark) based on system preferences.
 * A specialized version of useMediaQuery for color scheme detection.
 * @returns 'light' | 'dark' | null (null if preference cannot be determined).
 *
 * @example
 * const colorScheme = usePreferredColorScheme();
 * return (
 *   <div className={colorScheme === 'dark' ? 'dark' : 'light'}>
 *     <p>Preferred theme: {colorScheme || 'unknown'}</p>
 *   </div>
 * );
 */
const usePreferredColorScheme = (): ColorScheme => {
    const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
    const prefersLight = useMediaQuery('(prefers-color-scheme: light)');

    if (prefersDark) {
        return 'dark';
    }
    if (prefersLight)  {
        return 'light';
    }
    return null;
};

/**
 * @function useReducedMotion
 * Detects if the user prefers reduced motion for accessibility.
 * Useful for conditionally disabling animations and transitions.
 * @returns A boolean indicating if reduced motion is preferred.
 *
 * @example
 * const prefersReducedMotion = useReducedMotion();
 * return (
 *   <div
 *     className={`transition-all ${prefersReducedMotion ? 'duration-0' : 'duration-300'}`}
 *   >
 *     Content with conditional animations
 *   </div>
 * );
 */
const useReducedMotion = (): boolean => {
    return useMediaQuery('(prefers-reduced-motion: reduce)');
};

export default useMediaQuery;
export { usePreferredColorScheme, useReducedMotion };