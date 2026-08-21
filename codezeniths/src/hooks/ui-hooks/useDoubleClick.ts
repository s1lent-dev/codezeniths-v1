'use client';

import { useCallback, useRef } from 'react';
import type { MouseEvent , MouseEventHandler} from 'react';
import type {
    UseDoubleClickOptions,
} from './types';

/**
 * @function useDoubleClick
 * Creates a click handler that distinguishes between single and double clicks.
 * @param singleClick Optional callback for single click events.
 * @param doubleClick Callback for double click events.
 * @param delay Time in milliseconds to wait for a potential double click (default: 250ms).
 * @returns A mouse event handler to attach to an element (e.g., onClick).
 *
 * @example
 * const handleClick = useDoubleClick({
 *   singleClick: () => console.log('Single click'),
 *   doubleClick: () => console.log('Double click'),
 *   delay: 300,
 * });
 * return <button onClick={handleClick}>Click me</button>;
 */


const useDoubleClick = ({
    singleClick,
    doubleClick,
    delay = 250,
}: UseDoubleClickOptions): MouseEventHandler<HTMLElement> => {
    const clickTimeout = useRef<NodeJS.Timeout | null>(null);
    const clickCount = useRef(0);

    const handleClick = useCallback((event: MouseEvent<HTMLElement>) => {
        event.preventDefault();
        clickCount.current += 1;

        if (clickTimeout.current) {
            clearTimeout(clickTimeout.current);
        }

        if (clickCount.current === 1) {
            clickTimeout.current = setTimeout(() => {
                if (singleClick) {
                    singleClick();
                }
                clickCount.current = 0;
            }, delay);
        } else if (clickCount.current === 2) {
            doubleClick();
            clickCount.current = 0;
        }
    }, [singleClick, doubleClick, delay]);

    return handleClick;
};

export default useDoubleClick;