'use client';

import { useMemo } from 'react';
import useMediaQuery from './useMediaQuery';
import type {
    BreakpointKey,
    BreakpointValue,
    CurrentBreakpoint,
    CustomBreakpoints,
    ResponsiveState,
    ResponsiveValueMap,
    UseResponsiveOptions,
} from './types';

/**
 * @function useResponsive
 * Provides responsive breakpoint detection optimized for Tailwind CSS.
 * Returns an object with boolean values for different screen sizes and utility functions.
 * Automatically handles Tailwind's default breakpoint system with additional custom breakpoints.
 * @param customBreakpoints Optional custom breakpoints to override defaults.
 * @returns An object containing responsive state and utility functions.
 *
 * @example
 * const { isMobile, isTablet, isDesktop, isLarge, current, isAtLeast, isAtMost } = useResponsive();
 *
 * return (
 *   <div>
 *     <p>Current breakpoint: {current}</p>
 *     {isMobile && <MobileComponent />}
 *     {isTablet && <TabletComponent />}
 *     {isDesktop && <DesktopComponent />}
 *     {isAtLeast('md') && <ResponsiveComponent />}
 *   </div>
 * );
 */

// Tailwind CSS default breakpoints
const DEFAULT_BREAKPOINTS = {
    sm: '640px',    // @media (min-width: 640px)
    md: '768px',    // @media (min-width: 768px)
    lg: '1024px',   // @media (min-width: 1024px)
    xl: '1280px',   // @media (min-width: 1280px)
    '2xl': '1536px', // @media (min-width: 1536px)
} as const;

const useResponsive = (options: UseResponsiveOptions = {}): ResponsiveState => {
    const { customBreakpoints = {} } = options;

    // Merge custom breakpoints with defaults (memoized to prevent re-renders)
    const breakpoints = useMemo(
        () => ({ ...DEFAULT_BREAKPOINTS, ...customBreakpoints }),
        [customBreakpoints],
    );

    // Media queries for each breakpoint
    const isSm = useMediaQuery(`(min-width: ${breakpoints.sm})`);
    const isMd = useMediaQuery(`(min-width: ${breakpoints.md})`);
    const isLg = useMediaQuery(`(min-width: ${breakpoints.lg})`);
    const isXl = useMediaQuery(`(min-width: ${breakpoints.xl})`);
    const is2Xl = useMediaQuery(`(min-width: ${breakpoints['2xl']})`);

    // Derived states
    const isMobile = !isMd; // Below md breakpoint
    const isTablet = isMd && !isLg; // md to lg
    const isDesktop = isLg && !isXl; // lg to xl
    const isLarge = isXl; // xl and above

    // Current breakpoint detection
    const current = useMemo((): ResponsiveState['current'] => {
        if (is2Xl) {
            return '2xl';
        }
        if (isXl) {
            return 'xl';
        }
        if (isLg) {
            return 'lg';
        }
        if (isMd) {
            return 'md';
        }
        if (isSm) {
            return 'sm';
        }
        return 'mobile';
    }, [is2Xl, isXl, isLg, isMd, isSm]);

    // Utility functions
    const isAtLeast = useMemo(() => {
        return (breakpoint: BreakpointKey | string): boolean => {
            const breakpointValue = (breakpoints as Record<string, string>)[breakpoint] ||
                                  customBreakpoints[breakpoint];

            if (!breakpointValue) {
                console.warn(`useResponsive: Unknown breakpoint "${breakpoint}"`);
                return false;
            }

            // Handle special case for mobile
            if (breakpoint === 'mobile') {
                return true; // Always true since mobile is the base
            }

            // Use window.matchMedia for real-time checking
            if (typeof window !== 'undefined') {
                try {
                    return window.matchMedia(`(min-width: ${breakpointValue})`).matches;
                } catch (error) {
                    console.warn('useResponsive: Error checking breakpoint:', error);
                    return false;
                }
            }

            return false;
        };
    }, [breakpoints, customBreakpoints]);

    const isAtMost = useMemo(() => {
        return (breakpoint: BreakpointKey | string): boolean => {
            const breakpointValue = (breakpoints as Record<string, string>)[breakpoint] ||
                                  customBreakpoints[breakpoint];

            if (!breakpointValue) {
                console.warn(`useResponsive: Unknown breakpoint "${breakpoint}"`);
                return false;
            }

            // Handle special case for mobile
            if (breakpoint === 'mobile') {
                return isMobile;
            }

            // Use window.matchMedia for real-time checking with max-width
            if (typeof window !== 'undefined') {
                try {
                    // Convert to number and subtract 1px for max-width
                    const value = parseFloat(breakpointValue);
                    const unit = breakpointValue.replace(value.toString(), '');
                    const maxWidth = `${value - 0.01}${unit}`;
                    return window.matchMedia(`(max-width: ${maxWidth})`).matches;
                } catch (error) {
                    console.warn('useResponsive: Error checking breakpoint:', error);
                    return false;
                }
            }

            return false;
        };
    }, [breakpoints, customBreakpoints, isMobile]);

    const isBetween = useMemo(() => {
        return (min: BreakpointKey | string, max: BreakpointKey | string): boolean => {
            return isAtLeast(min) && isAtMost(max);
        };
    }, [isAtLeast, isAtMost]);

    return {
        // Individual breakpoint flags
        isMobile,
        isTablet,
        isDesktop,
        isLarge,

        // Tailwind breakpoint flags
        isSm,
        isMd,
        isLg,
        isXl,
        is2Xl,

        // Current active breakpoint
        current,

        // Utility functions
        isAtLeast,
        isAtMost,
        isBetween,
    };
};

/**
 * @function useBreakpoint
 * A simplified version of useResponsive that returns only the current breakpoint.
 * Useful when you only need to know the current screen size.
 * @param fallback Fallback breakpoint for SSR (default: 'mobile').
 * @returns The current active breakpoint.
 *
 * @example
 * const breakpoint = useBreakpoint();
 * const columns = {
 *   mobile: 1,
 *   sm: 2,
 *   md: 3,
 *   lg: 4,
 *   xl: 5,
 *   '2xl': 6
 * }[breakpoint];
 */
const useBreakpoint = (
    _fallback: CurrentBreakpoint = 'mobile',
): CurrentBreakpoint => {
    const { current } = useResponsive();
    return current;
};

/**
 * @function useResponsiveValue
 * Returns different values based on the current breakpoint.
 * Provides a convenient way to use responsive values in components.
 * @param values Object mapping breakpoints to values.
 * @param fallback Fallback value if no breakpoint matches.
 * @returns The value for the current breakpoint.
 *
 * @example
 * const columns = useResponsiveValue({
 *   mobile: 1,
 *   sm: 2,
 *   md: 3,
 *   lg: 4,
 * }, 1);
 *
 * const fontSize = useResponsiveValue({
 *   mobile: 'text-sm',
 *   md: 'text-base',
 *   lg: 'text-lg',
 * }, 'text-sm');
 */
const useResponsiveValue = <T>(
    values: ResponsiveValueMap<T>,
    fallback: T,
): T => {
    const { current } = useResponsive();

    // Try to find exact match first
    if (values[current] !== undefined) {
        return values[current] as T;
    }

    // Fallback logic: find the largest breakpoint that's smaller than current
    const breakpointOrder: Array<CurrentBreakpoint> =
        ['mobile', 'sm', 'md', 'lg', 'xl', '2xl'];

    const currentIndex = breakpointOrder.indexOf(current);

    for (let i = currentIndex - 1; i >= 0; i--) {
        const breakpoint = breakpointOrder[i];
        if (breakpoint !== undefined) {
            return values[breakpoint] as T;
        }
    }

    return fallback;
};

export default useResponsive;
export { useBreakpoint, useResponsiveValue };