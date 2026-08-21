'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type {
    UseOutsideClickOptions,
    UseOutsideClickReturn,
} from './types';

/**
 * @function useOutsideClick
 * Detects clicks outside of a specified DOM element and triggers a callback.
 * Useful for closing modals, dropdowns, or other UI elements when clicking outside their boundaries.
 * @template T The type of the HTML element (e.g., HTMLDivElement, HTMLElement).
 * @param callback Function to call when a click occurs outside the referenced element.
 * @param options Configuration options for the hook.
 * @param options.enabled Whether the outside click detection is active (default: true).
 * @param options.ignoreRefs Optional array of additional refs to ignore clicks on (e.g., for trigger buttons).
 * @returns An object containing the ref to attach to the target element and a boolean indicating if the last click was outside.
 *
 * @example
 * const { ref, isOutsideClick } = useOutsideClick<HTMLDivElement>(() => console.log('Clicked outside'));
 * return <div ref={ref}>Content</div>;
 */


const useOutsideClick = <T extends HTMLElement>(
    callback: () => void,
    options: UseOutsideClickOptions = {},
): UseOutsideClickReturn<T> => {
    const { enabled = true, ignoreRefs = [] } = options;
    const ref = useRef<T>(null);
    const [isOutsideClick, setIsOutsideClick] = useState(false);

    const handleClick = useCallback(
        (event: MouseEvent) => {
            if (!enabled) {
                return;
            }

            const target = event.target as Node;

            // Check if click is outside the main ref
            const isOutsideMainRef = ref.current && !ref.current.contains(target);

            // Check if click is on any ignored refs
            const isOnIgnoredRef = ignoreRefs.some(
                (ignoreRef) => ignoreRef.current.contains(target),
            );

            if (isOutsideMainRef && !isOnIgnoredRef) {
                setIsOutsideClick(true);
                callback();
            } else {
                setIsOutsideClick(false);
            }
        },
        [callback, enabled, ignoreRefs],
    );

    useEffect(() => {
        if (!enabled) {
            return;
        }

        // Add event listener for clicks
        document.addEventListener('mousedown', handleClick);

        return () => {
            document.removeEventListener('mousedown', handleClick);
        };
    }, [enabled, handleClick]);

    return {
        ref,
        isOutsideClick,
    };
};

export default useOutsideClick;