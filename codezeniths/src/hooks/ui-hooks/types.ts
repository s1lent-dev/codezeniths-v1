/**
 * Type definitions for useDoubleClick hook and related click handling utilities
 * Single and double click event detection and handling
 */

import type { KeyboardEvent, MouseEvent, MouseEventHandler, RefObject } from 'react';


// ========================= DOUBLE CLICK INTERFACES =========================

export interface UseDoubleClickOptions {
    singleClick?: (() => void) | undefined;
    doubleClick: () => void;
    delay?: number | undefined;
}

// ========================= ADVANCED DOUBLE CLICK OPTIONS =========================

export interface UseDoubleClickAdvancedOptions extends UseDoubleClickOptions {
    preventDefault?: boolean | undefined;
    stopPropagation?: boolean | undefined;
    enabled?: boolean | undefined;
    maxClicks?: number | undefined;
    onMultiClick?: ((clickCount: number) => void) | undefined;
}

export interface UseDoubleClickAdvancedReturn {
    handleClick: MouseEventHandler<HTMLElement>;
    clickCount: number;
    isDoubleClick: boolean;
    reset: () => void;
}

// ========================= CLICK DETECTION TYPES =========================

export type ClickHandler = () => void;
export type ClickEventHandler = MouseEventHandler<HTMLElement>;
export type ClickEvent = MouseEvent<HTMLElement>;

// ========================= CLICK SEQUENCE TYPES =========================

export interface ClickSequenceConfig {
    sequence: Array<number>;
    tolerance: number;
    onSequenceComplete: () => void;
    reset?: boolean | undefined;
}

export interface UseClickSequenceReturn {
    handleClick: ClickEventHandler;
    currentSequence: Array<number>;
    progress: number;
    isComplete: boolean;
    reset: () => void;
}

// ========================= UTILITY TYPES =========================

export type ClickTimeout = NodeJS.Timeout | null;
export type ClickCount = number;
export type ClickDelay = number;

// ========================= GESTURE RECOGNITION TYPES =========================

export interface GestureConfig {
    tap: ClickHandler;
    doubleTap: ClickHandler;
    longPress: ClickHandler;
    tapDelay: number;
    longPressDelay: number;
}

export interface UseGestureReturn {
    onMouseDown: (event: MouseEvent<HTMLElement>) => void;
    onMouseUp: (event: MouseEvent<HTMLElement>) => void;
    onMouseLeave: (event: MouseEvent<HTMLElement>) => void;
    isPressed: boolean;
    gestureType: 'tap' | 'doubleTap' | 'longPress' | null;
}

/**
 * Type definitions for useFocus hook and related focus management utilities
 * DOM element focus state management and control
 */

// ========================= FOCUS INTERFACES =========================

export interface UseFocusOptions {
    autoFocus?: boolean | undefined;
    onFocus?: (() => void) | undefined;
    onBlur?: (() => void) | undefined;
}

export interface UseFocusReturn<T extends HTMLElement> {
    ref: RefObject<T | null>;
    focus: () => void;
    blur: () => void;
    isFocused: boolean;
}

// ========================= ADVANCED FOCUS OPTIONS =========================

export interface UseFocusAdvancedOptions extends UseFocusOptions {
    selectOnFocus?: boolean | undefined;
    preventScroll?: boolean | undefined;
    focusDelay?: number | undefined;
    onFocusVisible?: (() => void) | undefined;
}

export interface UseFocusAdvancedReturn<T extends HTMLElement> extends UseFocusReturn<T> {
    isFocusVisible: boolean;
    focusVisible: () => void;
    isWithinFocusScope: boolean;
}

// ========================= FOCUS TRAP TYPES =========================

export interface UseFocusTrapOptions {
    autoFocus?: boolean | undefined;
    restoreFocus?: boolean | undefined;
    focusFirstDescendant?: boolean | undefined;
    allowOutsideClick?: boolean | undefined;
}

export interface UseFocusTrapReturn {
    focusTrapRef: RefObject<HTMLElement>;
    activate: () => void;
    deactivate: () => void;
    isActive: boolean;
}

// ========================= FOCUS MANAGER TYPES =========================

export interface FocusManagerConfig {
    tabbable?: boolean | undefined;
    wrap?: boolean | undefined;
    orientation?: 'horizontal' | 'vertical' | 'both' | undefined;
}

export interface UseFocusManagerReturn {
    focusNext: () => void;
    focusPrevious: () => void;
    focusFirst: () => void;
    focusLast: () => void;
    currentIndex: number;
    focusableElements: Array<HTMLElement>;
}

// ========================= UTILITY TYPES =========================

export type FocusEventHandler = () => void;
export type FocusableElement = HTMLElement;
export type FocusDirection = 'next' | 'previous' | 'first' | 'last';

// ========================= FOCUS CONTEXT TYPES =========================

export interface FocusContextValue {
    currentFocus: HTMLElement | null;
    setCurrentFocus: (element: HTMLElement | null) => void;
    focusStack: Array<HTMLElement>;
    pushFocus: (element: HTMLElement) => void;
    popFocus: () => HTMLElement | null;
}

/**
 * Type definitions for useKeyboardShortcuts hook and related keyboard event utilities
 * Keyboard shortcut handling with modifier key support
*/

// ========================= KEYBOARD SHORTCUT INTERFACES =========================

export type KeyboardShortcutHandler = (event: KeyboardEvent<HTMLElement>) => void;

export type KeyboardShortcuts = Record<string, KeyboardShortcutHandler>;

export interface UseKeyboardShortcutsOptions {
    targetRef?: RefObject<HTMLElement> | undefined;
    preventDefault?: boolean | undefined;
    enabled?: boolean | undefined;
}

// ========================= KEYBOARD EVENT TYPES =========================

export type ModifierKey = 'ctrl' | 'meta' | 'alt' | 'shift';
export type KeyCombination = string;
export type ShortcutMap = Record<KeyCombination, KeyboardShortcutHandler>;

// ========================= KEYBOARD SHORTCUT CONFIGURATION =========================

export interface KeyboardShortcutConfig {
    key: string;
    modifiers: Array<ModifierKey>;
    handler: KeyboardShortcutHandler;
    preventDefault?: boolean | undefined;
    description?: string | undefined;
}

export interface KeyboardShortcutGroup {
    name: string;
    shortcuts: Array<KeyboardShortcutConfig>;
    enabled?: boolean | undefined;
}

// ========================= ADVANCED KEYBOARD SHORTCUT OPTIONS =========================

export interface UseKeyboardShortcutsAdvancedOptions extends UseKeyboardShortcutsOptions {
    capture?: boolean | undefined;
    passive?: boolean | undefined;
    once?: boolean | undefined;
    onShortcutTrigger?: ((shortcut: string, event: KeyboardEvent<HTMLElement>) => void) | undefined;
}

// ========================= KEYBOARD SHORTCUT CONTEXT TYPES =========================

export interface KeyboardShortcutContextValue {
    shortcuts: KeyboardShortcuts;
    registerShortcut: (shortcut: string, handler: KeyboardShortcutHandler) => void;
    unregisterShortcut: (shortcut: string) => void;
    isEnabled: boolean;
    setEnabled: (enabled: boolean) => void;
}

// ========================= KEYBOARD SHORTCUT PROVIDER OPTIONS =========================

export interface KeyboardShortcutProviderOptions {
    globalShortcuts?: KeyboardShortcuts | undefined;
    preventDefault?: boolean | undefined;
    enabled?: boolean | undefined;
}

// ========================= UTILITY TYPES =========================

export type ShortcutNormalizer = (shortcut: string) => string;
export type EventMatcher = (event: KeyboardEvent<HTMLElement>, shortcut: string) => boolean;

// ========================= KEYBOARD SHORTCUT MANAGER TYPES =========================

export interface KeyboardShortcutManager {
    register: (shortcuts: KeyboardShortcuts) => void;
    unregister: (shortcuts: Array<string>) => void;
    clear: () => void;
    isRegistered: (shortcut: string) => boolean;
    getRegistered: () => Array<string>;
    trigger: (shortcut: string, event: KeyboardEvent<HTMLElement>) => boolean;
}

// ========================= KEYBOARD EVENT UTILITIES =========================

export interface KeyboardEventInfo {
    key: string;
    code: string;
    modifiers: Array<ModifierKey>;
    combination: string;
    isModifier: boolean;
}

export interface KeyboardShortcutMatch {
    shortcut: string;
    handler: KeyboardShortcutHandler;
    config: KeyboardShortcutConfig;
}


/**
 * Type definitions for useMediaQuery hook and related media query utilities
 * Responsive design and system preference detection
 */

// ========================= MEDIA QUERY INTERFACES =========================

export interface UseMediaQueryOptions {
    defaultValue?: boolean | undefined;
    initializeWithValue?: boolean | undefined;
}

// ========================= COLOR SCHEME TYPES =========================

export type ColorScheme = 'light' | 'dark' | null;

// ========================= UTILITY TYPES =========================

export type MediaQueryString = string;
export type MediaQueryCallback = (event: MediaQueryListEvent) => void;

// ========================= ADVANCED MEDIA QUERY OPTIONS =========================

export interface UseMediaQueryAdvancedOptions extends UseMediaQueryOptions {
    onChange?: ((matches: boolean) => void) | undefined;
    debounceMs?: number | undefined;
    enabled?: boolean | undefined;
}

// ========================= BREAKPOINT TYPES =========================

export type BreakpointName =
    | 'xs'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | '2xl';

export interface BreakpointConfig {
    [key: string]: string;
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
}

// ========================= MEDIA QUERY HOOK RETURN TYPES =========================

export interface UseMediaQueryReturn {
    matches: boolean;
    query: MediaQueryString;
    supported: boolean;
}

export interface UseMediaQueryAdvancedReturn extends UseMediaQueryReturn {
    toggle: () => void;
    setQuery: (newQuery: MediaQueryString) => void;
}

// ========================= SYSTEM PREFERENCE TYPES =========================

export type MotionPreference = boolean;
export type ContrastPreference = 'normal' | 'high' | null;
export type DataUsagePreference = boolean;

export interface SystemPreferences {
    colorScheme: ColorScheme;
    reducedMotion: MotionPreference;
    highContrast: ContrastPreference;
    reducedData: DataUsagePreference;
}

// ========================= RESPONSIVE UTILITY TYPES =========================

export type ResponsiveValue<T> = T | Partial<Record<BreakpointName, T>>;

export interface MediaQueryResponsiveConfig {
    breakpoints: BreakpointConfig;
    defaultBreakpoint: BreakpointName;
}


/**
 * Type definitions for useOutsideClick hook and related click detection utilities
 * Outside click detection and boundary-based event handling
 */

// ========================= OUTSIDE CLICK INTERFACES =========================

export interface UseOutsideClickOptions {
    enabled?: boolean | undefined;
    ignoreRefs?: Array<RefObject<HTMLElement | HTMLDivElement | HTMLInputElement | HTMLButtonElement>> | undefined;
}

export interface UseOutsideClickReturn<T extends HTMLElement> {
    ref: RefObject<T | null>;
    isOutsideClick: boolean;
}

// ========================= ADVANCED OUTSIDE CLICK OPTIONS =========================

export interface UseOutsideClickAdvancedOptions extends UseOutsideClickOptions {
    event?: 'mousedown' | 'mouseup' | 'click' | 'pointerdown' | undefined;
    capture?: boolean | undefined;
    once?: boolean | undefined;
    delay?: number | undefined;
    onOutsideClick?: (() => void) | undefined;
    onInsideClick?: (() => void) | undefined;
}

export interface UseOutsideClickAdvancedReturn<T extends HTMLElement> extends UseOutsideClickReturn<T> {
    clickCount: number;
    lastClickTime: number;
    reset: () => void;
}

// ========================= BOUNDARY DETECTION TYPES =========================

export interface BoundaryConfig {
    elements: Array<RefObject<HTMLElement>>;
    mode: 'any' | 'all';
    includeChildren?: boolean | undefined;
}

export interface UseBoundaryClickReturn {
    isWithinBoundary: boolean;
    boundaryElements: Array<HTMLElement>;
    addBoundaryElement: (element: HTMLElement) => void;
    removeBoundaryElement: (element: HTMLElement) => void;
}

// ========================= CLICK AREA TYPES =========================

export interface ClickAreaConfig {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface UseClickAreaReturn {
    isWithinArea: (event: MouseEvent) => boolean;
    updateArea: (config: ClickAreaConfig) => void;
    currentArea: ClickAreaConfig | null;
}

// ========================= UTILITY TYPES =========================

export type ClickCallback = () => void;
export type ClickEventType = 'mousedown' | 'mouseup' | 'click' | 'pointerdown';
export type ElementMatcher = (element: HTMLElement, target: Node) => boolean;

// ========================= ESCAPE HANDLING TYPES =========================

export interface UseEscapeKeyOptions {
    enabled?: boolean | undefined;
    onEscape: () => void;
    capturePhase?: boolean | undefined;
}

export interface UseClickAwayReturn<T extends HTMLElement> {
    ref: RefObject<T | null>;
    isActive: boolean;
    setActive: (active: boolean) => void;
}

// ========================= MODAL/OVERLAY TYPES =========================

export interface UseModalClickReturn<T extends HTMLElement> extends UseOutsideClickReturn<T> {
    overlayRef: RefObject<HTMLDivElement>;
    contentRef: RefObject<T>;
    closeOnOverlayClick: boolean;
    setCloseOnOverlayClick: (close: boolean) => void;
}

export interface ModalClickConfig {
    closeOnOutsideClick?: boolean | undefined;
    closeOnEscape?: boolean | undefined;
    preventScroll?: boolean | undefined;
    restoreFocus?: boolean | undefined;
}

/**
 * Type definitions for useResponsive hook and related responsive design utilities
 * Tailwind CSS breakpoint system and responsive state management
 */

// ========================= BREAKPOINT TYPES =========================

export type BreakpointKey = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type BreakpointValue = string;
export type CustomBreakpoints = Record<string, BreakpointValue>;

export interface DefaultBreakpoints {
    readonly sm: '640px';
    readonly md: '768px';
    readonly lg: '1024px';
    readonly xl: '1280px';
    readonly '2xl': '1536px';
}

// ========================= RESPONSIVE STATE INTERFACES =========================

export interface ResponsiveState {
    // Individual breakpoint flags
    isMobile: boolean;      // < 768px (below md)
    isTablet: boolean;      // >= 768px and < 1024px (md to lg)
    isDesktop: boolean;     // >= 1024px and < 1280px (lg to xl)
    isLarge: boolean;       // >= 1280px (xl and above)

    // Tailwind breakpoint flags
    isSm: boolean;          // >= 640px
    isMd: boolean;          // >= 768px
    isLg: boolean;          // >= 1024px
    isXl: boolean;          // >= 1280px
    is2Xl: boolean;         // >= 1536px

    // Current active breakpoint
    current: 'mobile' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

    // Utility functions
    isAtLeast: (breakpoint: BreakpointKey | string) => boolean;
    isAtMost: (breakpoint: BreakpointKey | string) => boolean;
    isBetween: (min: BreakpointKey | string, max: BreakpointKey | string) => boolean;
}

// ========================= HOOK OPTIONS =========================

export interface UseResponsiveOptions {
    customBreakpoints?: CustomBreakpoints | undefined;
    fallbackBreakpoint?: 'mobile' | BreakpointKey | undefined;
}

export interface UseBreakpointOptions {
    fallback?: ResponsiveState['current'] | undefined;
}

// ========================= RESPONSIVE VALUE TYPES =========================

export type CurrentBreakpoint = ResponsiveState['current'];
export type ResponsiveValueMap<T> = Partial<Record<CurrentBreakpoint, T>>;

// ========================= UTILITY TYPES =========================

export type BreakpointChecker = (breakpoint: BreakpointKey | string) => boolean;
export type BreakpointRange = (min: BreakpointKey | string, max: BreakpointKey | string) => boolean;

// ========================= ADVANCED RESPONSIVE TYPES =========================

export interface ResponsiveConfig {
    breakpoints: DefaultBreakpoints & CustomBreakpoints;
    defaultBreakpoint: CurrentBreakpoint;
    mobileFirst: boolean;
}

export interface ResponsiveTheme {
    breakpoints: ResponsiveConfig['breakpoints'];
    spacing: ResponsiveValueMap<string>;
    fontSize: ResponsiveValueMap<string>;
    lineHeight: ResponsiveValueMap<string>;
}

// ========================= RESPONSIVE HOOK RETURN TYPES =========================

export type UseResponsiveReturn = ResponsiveState;

export interface UseBreakpointReturn {
    current: CurrentBreakpoint;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
}

export interface UseResponsiveValueReturn<T> {
    value: T;
    breakpoint: CurrentBreakpoint;
    fallback: T;
}

// ========================= RESPONSIVE CONFIGURATION TYPES =========================

export interface ResponsiveProviderOptions {
    breakpoints?: CustomBreakpoints | undefined;
    theme?: Partial<ResponsiveTheme> | undefined;
    defaultBreakpoint?: CurrentBreakpoint | undefined;
}

// ========================= RESPONSIVE CONTEXT TYPES =========================

export interface ResponsiveContextValue {
    breakpoints: ResponsiveConfig['breakpoints'];
    current: CurrentBreakpoint;
    theme: ResponsiveTheme;
    utils: {
        isAtLeast: BreakpointChecker;
        isAtMost: BreakpointChecker;
        isBetween: BreakpointRange;
    };
}


/**
 * Type definitions for useToggle hook
 * Boolean state management with convenient toggle functionality
 */

// ========================= TOGGLE INTERFACES =========================

export interface UseToggleActions {
    toggle: () => void;
    setTrue: () => void;
    setFalse: () => void;
    setValue: (value: boolean) => void;
    reset: () => void;
}

// ========================= HOOK RETURN TYPES =========================

export type UseToggleReturn = [boolean, UseToggleActions];

// ========================= HOOK OPTIONS =========================

export interface UseToggleOptions {
    initialValue?: boolean | undefined;
    onToggle?: ((newValue: boolean) => void) | undefined;
    enabled?: boolean | undefined;
}

// ========================= EXTENDED TOGGLE TYPES =========================

export interface UseToggleState {
    value: boolean;
    initialValue: boolean;
    toggleCount: number;
}

export interface UseToggleAdvancedReturn extends UseToggleState {
    actions: UseToggleActions;
    history: Array<boolean>;
    canUndo: boolean;
    undo: () => void;
    clear: () => void;
}

// ========================= UTILITY TYPES =========================

export type ToggleCallback = (newValue: boolean, previousValue: boolean) => void;
export type ToggleValidator = (newValue: boolean) => boolean;

// ========================= ADVANCED OPTIONS =========================

export interface UseToggleAdvancedOptions extends UseToggleOptions {
    maxHistory?: number | undefined;
    validator?: ToggleValidator | undefined;
    onBeforeChange?: ToggleCallback | undefined;
    onAfterChange?: ToggleCallback | undefined;
    persistence?: {
        key: string;
        storage?: 'localStorage' | 'sessionStorage' | undefined;
    } | undefined;
}