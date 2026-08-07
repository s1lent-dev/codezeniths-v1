import { useCallback, useState } from 'react';
import type {
    UseToggleActions,
    UseToggleReturn,
} from './types';

/**
 * @function useToggle
 * Manages a boolean state value with convenient toggle functionality.
 * Provides methods to toggle, set true, set false, and reset to the initial value.
 * Useful for modal states, visibility toggles, feature flags, and other boolean UI state.
 * @param initialValue The initial boolean value (default: false).
 * @returns An array containing the current state and an object with toggle functions.
 *
 * @example
 * const [isOpen, { toggle, setTrue, setFalse, reset }] = useToggle(false);
 * return (
 *   <div>
 *     <p>Modal is {isOpen ? 'open' : 'closed'}</p>
 *     <button onClick={toggle}>Toggle Modal</button>
 *     <button onClick={setTrue}>Open Modal</button>
 *     <button onClick={setFalse}>Close Modal</button>
 *   </div>
 * );
 */

const useToggle = (initialValue: boolean = false): UseToggleReturn => {
    const [state, setState] = useState<boolean>(initialValue);

    const toggle = useCallback(() => {
        setState(prev => !prev);
    }, []);

    const setTrue = useCallback(() => {
        setState(true);
    }, []);

    const setFalse = useCallback(() => {
        setState(false);
    }, []);

    const setValue = useCallback((value: boolean) => {
        setState(value);
    }, []);

    const reset = useCallback(() => {
        setState(initialValue);
    }, [initialValue]);

    const actions: UseToggleActions = {
        toggle,
        setTrue,
        setFalse,
        setValue,
        reset,
    };

    return [state, actions];
};

export default useToggle;