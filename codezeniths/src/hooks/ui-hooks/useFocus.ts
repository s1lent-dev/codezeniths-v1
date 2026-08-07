import { useCallback, useEffect, useRef, useState } from 'react';
import type {
    UseFocusOptions,
    UseFocusReturn,
} from './types';

/**
 * @function useFocus
 * Manages focus state for a DOM element, providing methods to programmatically focus or blur.
 * @template T The type of the HTML element (e.g., HTMLInputElement, HTMLButtonElement).
 * @param autoFocus Whether to automatically focus the element on mount (default: false).
 * @param onFocus Optional callback invoked when the element gains focus.
 * @param onBlur Optional callback invoked when the element loses focus.
 * @returns An object containing the element ref and methods to control focus.
 *
 * @example
 * const { ref, focus, blur, isFocused } = useFocus<HTMLInputElement>({ autoFocus: true });
 * return <input ref={ref} placeholder="Auto-focused input" />;
 */


const useFocus = <T extends HTMLElement>({
    autoFocus = false,
    onFocus,
    onBlur,
}: UseFocusOptions = {}): UseFocusReturn<T> => {
    const elementRef = useRef<T>(null);
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = useCallback(() => {
        setIsFocused(true);
        if (onFocus) {
            onFocus();
        }
    }, [onFocus]);

    const handleBlur = useCallback(() => {
        setIsFocused(false);
        if (onBlur) {
            onBlur();
        }
    }, [onBlur]);

    const focus = useCallback(() => {
        if (elementRef.current) {
            elementRef.current.focus();
        }
    }, []);

    const blur = useCallback(() => {
        if (elementRef.current) {
            elementRef.current.blur();
        }
    }, []);

    useEffect(() => {
        const element = elementRef.current;
        if (element) {
            if (autoFocus) {
                element.focus();
            }
            element.addEventListener('focus', handleFocus);
            element.addEventListener('blur', handleBlur);

            return () => {
                element.removeEventListener('focus', handleFocus);
                element.removeEventListener('blur', handleBlur);
            };
        }
    }, [autoFocus, handleFocus, handleBlur]);

    return {
        ref: elementRef,
        focus,
        blur,
        isFocused,
    };
};

export default useFocus;