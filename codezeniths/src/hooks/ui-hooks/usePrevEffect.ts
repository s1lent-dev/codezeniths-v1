import { useEffect, useRef } from 'react';
import type { DependencyList } from 'react';

/**
 * @function usePrevEffect
 * Runs an effect callback with access to the previous dependency values before the current effect runs.
 * Similar to `useEffect`, but provides the previous dependencies to the callback for comparison or cleanup.
 * Useful for scenarios where you need to compare current and previous states or perform cleanup based on prior values.
 * @param callback Function to run with current and previous dependency values. Receives current dependencies and previous dependencies (or undefined on first render).
 * @param dependencies Dependency array, similar to `useEffect`. The effect runs when these dependencies change.
 * @returns void
 *
 * @example
 * usePrevEffect((currentDeps, prevDeps) => {
 *   console.log('Current value:', currentDeps[0]);
 *   console.log('Previous value:', prevDeps ? prevDeps[0] : 'None');
 * }, [value]);
 */

type EffectCallback = (currentDeps: DependencyList, prevDeps?: DependencyList) => void | (() => void);

const usePrevEffect = (callback: EffectCallback, dependencies: DependencyList): void => {
    const prevDepsRef = useRef<DependencyList | undefined>(undefined);

    useEffect(() => {
        const cleanup = callback(dependencies, prevDepsRef.current);

        // Store current dependencies as previous for the next render
        prevDepsRef.current = dependencies;

        // Return cleanup function if provided
        return cleanup;
    }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps
};

export default usePrevEffect;