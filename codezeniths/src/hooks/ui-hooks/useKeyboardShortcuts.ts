import { useEffect, useMemo } from 'react';
import type { KeyboardEvent } from 'react';
import type {
    KeyboardShortcutHandler,
    KeyboardShortcuts,
    UseKeyboardShortcutsOptions,
} from './types';

/**
 * @function useKeyboardShortcuts
 * Dynamically registers keyboard shortcuts with optional modifiers and attaches handlers to them.
 * Shortcuts can include keys like 'ArrowUp', 'ArrowDown', 'Enter', 'Escape', and combinations with modifiers like 'ctrl+s', 'shift+ArrowDown'.
 * The hook normalizes shortcut strings for consistent matching, handling case insensitivity and modifier order.
 * @param shortcuts An object where keys are shortcut strings (e.g., 'ArrowUp', 'ctrl+shift+a') and values are handler functions.
 * @param options Configuration options for the hook.
 * @param options.targetRef Optional ref to the HTMLElement to attach the listener to; defaults to document.
 * @param options.preventDefault Whether to prevent default browser behavior for matched shortcuts (default: true).
 * @param options.enabled Whether the shortcuts are active (default: true).
 * @returns void
 *
 * @example
 * useKeyboardShortcuts({
 *   'ArrowUp': (event) => console.log('Navigating up'),
 *   'ArrowDown': (event) => console.log('Navigating down'),
 *   'Enter': (event) => console.log('Submitting'),
 *   'Escape': (event) => console.log('Cancelling'),
 *   'ctrl+s': (event) => console.log('Saving'),
 *   'shift+ArrowLeft': (event) => console.log('Selecting left'),
 * }, { preventDefault: true });
 */


function normalizeShortcut(shortcut: string): string {
    const parts = shortcut.toLowerCase().split('+');
    const modifiers: Array<string> = [];
    let key = '';

    for (const part of parts) {
        if (['ctrl', 'meta', 'alt', 'shift'].includes(part)) {
            modifiers.push(part);
        } else {
            key = part;
        }
    }

    modifiers.sort();
    return [...modifiers, key].join('+');
}

const useKeyboardShortcuts = (
    shortcuts: KeyboardShortcuts,
    options: UseKeyboardShortcutsOptions = {},
): void => {
    const {
        targetRef,
        preventDefault = true,
        enabled = true,
    } = options;

    const normalizedShortcuts = useMemo(() => {
        const norm: Record<string, KeyboardShortcutHandler> = {};
        for (const [key, handler] of Object.entries(shortcuts)) {
            norm[normalizeShortcut(key)] = handler;
        }
        return norm;
    }, [shortcuts]);


    useEffect(() => {
        if (!enabled) {
            return;
        }

        const target: Document | HTMLElement = targetRef?.current || document;

        // Handle native DOM KeyboardEvent and process it similar to React's handler
        const listener = (nativeEvent: Event) => {
            const keyboardEvent = nativeEvent as unknown as KeyboardEvent;

            // Extract modifier keys
            const pressedModifiers: Array<string> = [];
            if (keyboardEvent.ctrlKey) {
                pressedModifiers.push('ctrl');
            }
            if (keyboardEvent.metaKey) {
                pressedModifiers.push('meta');
            }
            if (keyboardEvent.altKey) {
                pressedModifiers.push('alt');
            }
            if (keyboardEvent.shiftKey) {
                pressedModifiers.push('shift');
            }

            pressedModifiers.sort();

            const key = keyboardEvent.key.toLowerCase();
            const combo = [...pressedModifiers, key].join('+');

            const handler = normalizedShortcuts[combo];
            if (handler) {
                if (preventDefault) {
                    keyboardEvent.preventDefault();
                }
                // Create a minimal React-like event for the handler
                const reactEvent = {
                    ...keyboardEvent,
                    currentTarget: keyboardEvent.target as HTMLElement,
                    target: keyboardEvent.target as HTMLElement,
                    nativeEvent: keyboardEvent as unknown as KeyboardEvent,
                    preventDefault: () => keyboardEvent.preventDefault(),
                    stopPropagation: () => keyboardEvent.stopPropagation(),
                    isPropagationStopped: () => keyboardEvent.defaultPrevented,
                    persist: () => {},
                    isDefaultPrevented: () => keyboardEvent.defaultPrevented,
                } as unknown as KeyboardEvent<HTMLElement>;

                handler(reactEvent);
            }
        };

        target.addEventListener('keydown', listener);

        return () => {
            target.removeEventListener('keydown', listener);
        };
    }, [enabled, normalizedShortcuts, preventDefault, targetRef]);
};

export default useKeyboardShortcuts;