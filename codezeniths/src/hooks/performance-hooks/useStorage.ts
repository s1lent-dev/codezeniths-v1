'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

/**
 * Utility function to create a namespaced storage key to avoid collisions.
 * @param prefix - The base prefix for the key (default: 'app').
 * @param keys - Additional key segments to join with colons.
 * @returns A formatted storage key string.
 * @example
 * const userKey = createStorageKey('user', 'preferences');
 * // Results in: 'app:user:preferences'
 */
export const createStorageKey = (prefix: string = 'app', ...keys: Array<string>): string => {
    return `${prefix}:${keys.join(':')}`;
};

/**
 * Internal hook for managing state synchronized with a given Storage object (e.g., localStorage or sessionStorage).
 * Handles serialization/deserialization with JSON, error handling for parse/stringify failures,
 * and supports functional initial values for lazy computation.
 * @template T - The type of the stored value (must be JSON-serializable).
 * @param storage - The Storage instance (localStorage or sessionStorage).
 * @param key - The storage key (use createStorageKey for namespacing).
 * @param initialValue - The initial value or a function to compute it.
 * @returns A tuple of [value, setValue] where setValue updates both state and storage.
 */
const useStorage = <T>(
    storage: Storage | undefined,
    key: string,
    initialValue: T | (() => T),
): readonly [T, Dispatch<SetStateAction<T>>] => {
    // Keep a stable ref for initialValue so object/array literals don't cause infinite re-render loops
    const initialValueRef = useRef(initialValue);
    initialValueRef.current = initialValue;

    const readValueFromStorage = useCallback((): T => {
        if (!storage || typeof window === 'undefined') {
            const init = initialValueRef.current;
            return typeof init === 'function' ? (init as () => T)() : init;
        }
        try {
            const item = storage.getItem(key);
            if (item !== null) {
                return JSON.parse(item) as T;
            }
        } catch (error) {
            console.warn(`Failed to parse stored value for key "${key}":`, error);
        }
        const init = initialValueRef.current;
        return typeof init === 'function' ? (init as () => T)() : init;
    }, [storage, key]);

    const [value, setValueState] = useState<T>(readValueFromStorage);

    // Re-sync value state on client mount or whenever key/storage reference changes
    useEffect(() => {
        setValueState(readValueFromStorage());
    }, [key, storage, readValueFromStorage]);

    // Explicit setter that updates both React state and the underlying storage
    const setStoredValue: Dispatch<SetStateAction<T>> = useCallback(
        (action: SetStateAction<T>) => {
            setValueState((prev) => {
                const nextValue = typeof action === 'function' ? (action as (prevState: T) => T)(prev) : action;
                if (storage && typeof window !== 'undefined') {
                    try {
                        if (nextValue === undefined) {
                            storage.removeItem(key);
                        } else {
                            storage.setItem(key, JSON.stringify(nextValue));
                        }
                    } catch (error) {
                        console.error(`Failed to store value for key "${key}":`, error);
                    }
                }
                return nextValue;
            });
        },
        [storage, key]
    );

    // Re-sync on storage changes from other tabs/windows (cross-tab sync)
    useEffect(() => {
        if (!storage || typeof window === 'undefined') return;
        const handleStorageChange = (event: StorageEvent): void => {
            if (event.key === key && event.storageArea === storage) {
                try {
                    const newItem = event.newValue;
                    if (newItem !== null) {
                        const parsedValue = JSON.parse(newItem) as T;
                        setValueState(parsedValue);
                    } else {
                        setValueState(readValueFromStorage());
                    }
                } catch (error) {
                    console.warn(`Failed to sync storage change for key "${key}":`, error);
                    setValueState(readValueFromStorage());
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [key, storage, readValueFromStorage]);

    return [value, setStoredValue] as const;
};

/**
 * @function useLocalStorage
 * Manages state synchronized with localStorage. Persists across browser sessions and tabs.
 * Use createStorageKey for namespaced keys to avoid collisions.
 * @template T - The type of the stored value (must be JSON-serializable).
 * @param key - The localStorage key.
 * @param initialValue - The initial value or a function to compute it (used if no stored value exists).
 * @returns A tuple of [value, setValue] where setValue updates both state and localStorage.
 *
 * @example
 * const [theme, setTheme] = useLocalStorage<string>('theme', 'light');
 * // Or with functional initial value:
 * const [count, setCount] = useLocalStorage<number>('count', () => Math.floor(Math.random() * 100));
 */
export const useLocalStorage = <T>(
    key: string,
    initialValue: T | (() => T),
): readonly [T, Dispatch<SetStateAction<T>>] => {
    return useStorage<T>(typeof window !== 'undefined' ? window.localStorage : undefined, key, initialValue);
};

/**
 * @function useSessionStorage
 * Manages state synchronized with sessionStorage. Persists only for the current browser session/tab.
 * Use createStorageKey for namespaced keys to avoid collisions.
 * @template T - The type of the stored value (must be JSON-serializable).
 * @param key - The sessionStorage key.
 * @param initialValue - The initial value or a function to compute it (used if no stored value exists).
 * @returns A tuple of [value, setValue] where setValue updates both state and sessionStorage.
 *
 * @example
 * const [tempQuery, setTempQuery] = useSessionStorage<string>('searchQuery', '');
 * // Or with functional initial value:
 * const [sessionId, setSessionId] = useSessionStorage<string>('sessionId', () => crypto.randomUUID());
 */
export const useSessionStorage = <T>(
    key: string,
    initialValue: T | (() => T),
): readonly [T, Dispatch<SetStateAction<T>>] => {
    return useStorage<T>(typeof window !== 'undefined' ? window.sessionStorage : undefined, key, initialValue);
};