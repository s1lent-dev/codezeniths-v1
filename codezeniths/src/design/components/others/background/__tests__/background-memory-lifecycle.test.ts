import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as THREE from 'three';

// --- Test Hook Runner for Node environment ---
interface HookState {
    hooks: any[];
    effects: Array<{ index: number; fn: () => any; deps?: any[] }>;
    activeEffects: Map<number, { deps?: any[]; cleanup?: () => void }>;
    hookIndex: number;
}

let currentRunner: HookState | null = null;

function shallowEqualDeps(a?: any[], b?: any[]): boolean {
    if (!a || !b) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (!Object.is(a[i], b[i])) return false;
    }
    return true;
}

const mockReactHooks = {
    useRef: <T>(initialValue: T): { current: T } => {
        if (!currentRunner) throw new Error('No active hook runner');
        const idx = currentRunner.hookIndex++;
        if (currentRunner.hooks[idx] === undefined) {
            currentRunner.hooks[idx] = { current: initialValue };
        }
        return currentRunner.hooks[idx];
    },
    useState: <T>(initialValue: T | (() => T)): [T, (next: T | ((prev: T) => T)) => void] => {
        if (!currentRunner) throw new Error('No active hook runner');
        const idx = currentRunner.hookIndex++;
        if (currentRunner.hooks[idx] === undefined) {
            const val = typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue;
            currentRunner.hooks[idx] = val;
        }
        const setState = (next: T | ((prev: T) => T)) => {
            if (typeof next === 'function') {
                currentRunner!.hooks[idx] = (next as (prev: T) => T)(currentRunner!.hooks[idx]);
            } else {
                currentRunner!.hooks[idx] = next;
            }
        };
        return [currentRunner.hooks[idx], setState];
    },
    useCallback: <T extends (...args: any[]) => any>(callback: T, deps?: any[]): T => {
        if (!currentRunner) throw new Error('No active hook runner');
        const idx = currentRunner.hookIndex++;
        const prev = currentRunner.hooks[idx];
        if (!prev || !shallowEqualDeps(prev.deps, deps)) {
            currentRunner.hooks[idx] = { callback, deps };
            return callback;
        }
        return prev.callback;
    },
    useMemo: <T>(factory: () => T, deps?: any[]): T => {
        if (!currentRunner) throw new Error('No active hook runner');
        const idx = currentRunner.hookIndex++;
        const prev = currentRunner.hooks[idx];
        if (!prev || !shallowEqualDeps(prev.deps, deps)) {
            const value = factory();
            currentRunner.hooks[idx] = { value, deps };
            return value;
        }
        return prev.value;
    },
    useEffect: (fn: () => any, deps?: any[]): void => {
        if (!currentRunner) throw new Error('No active hook runner');
        const idx = currentRunner.hookIndex++;
        currentRunner.effects.push({ index: idx, fn, deps });
    },
};

vi.mock('react', async (importOriginal) => {
    const actual = await importOriginal<typeof import('react')>();
    return {
        ...actual,
        useRef: (init: any) => mockReactHooks.useRef(init),
        useState: (init: any) => mockReactHooks.useState(init),
        useCallback: (fn: any, deps: any) => mockReactHooks.useCallback(fn, deps),
        useMemo: (fn: any, deps: any) => mockReactHooks.useMemo(fn, deps),
        useEffect: (fn: any, deps: any) => mockReactHooks.useEffect(fn, deps),
    };
});

// Mock Three.js size from @react-three/fiber
let currentThreeSize = { width: 100, height: 100 };
vi.mock('@react-three/fiber', () => ({
    useThree: () => ({ size: currentThreeSize }),
    useFrame: vi.fn(),
}));

function createHookHarness<P, R>(hookFn: (props: P) => R, initialProps: P) {
    const state: HookState = {
        hooks: [],
        effects: [],
        activeEffects: new Map(),
        hookIndex: 0,
    };

    let latestResult: R;

    const commitEffects = () => {
        for (const effect of state.effects) {
            const prev = state.activeEffects.get(effect.index);
            if (!prev || !shallowEqualDeps(prev.deps, effect.deps)) {
                if (prev?.cleanup) {
                    prev.cleanup();
                }
                const cleanup = effect.fn();
                state.activeEffects.set(effect.index, {
                    deps: effect.deps,
                    cleanup: typeof cleanup === 'function' ? cleanup : undefined,
                });
            }
        }
        state.effects = [];
    };

    const render = (props: P): R => {
        currentRunner = state;
        state.hookIndex = 0;
        state.effects = [];
        latestResult = hookFn(props);
        commitEffects();
        currentRunner = null;
        return latestResult;
    };

    const unmount = () => {
        for (const { cleanup } of state.activeEffects.values()) {
            if (cleanup) {
                cleanup();
            }
        }
        state.activeEffects.clear();
    };

    latestResult = render(initialProps);

    return {
        get result() {
            return latestResult;
        },
        rerender: (newProps: P) => render(newProps),
        unmount,
    };
}

// Import hooks under test AFTER mocks
import { useShaderMaterial3D, useDottedGlow } from '../background.effect-hooks';

describe('Background Memory Lifecycle & Resource Cleanup', () => {
    let originalWindow: any;
    let originalDocument: any;
    let originalPerformance: any;

    beforeEach(() => {
        currentThreeSize = { width: 100, height: 100 };
        originalWindow = global.window;
        originalDocument = global.document;
        originalPerformance = global.performance;

        if (typeof global.performance === 'undefined') {
            (global as any).performance = { now: () => Date.now() };
        }
    });

    afterEach(() => {
        global.window = originalWindow;
        global.document = originalDocument;
        global.performance = originalPerformance;
        vi.clearAllMocks();
    });

    describe('useShaderMaterial3D Memory & Uniform Lifecycle', () => {
        it('disposes the ShaderMaterial when unmounted', () => {
            const harness = createHookHarness(
                (props) => useShaderMaterial3D(props),
                {
                    source: 'void main() { gl_FragColor = vec4(1.0); }',
                    uniforms: {},
                    maxFps: 60,
                }
            );

            const material = harness.result.material;
            expect(material).toBeInstanceOf(THREE.ShaderMaterial);

            const disposeSpy = vi.spyOn(material, 'dispose');

            harness.unmount();

            expect(disposeSpy).toHaveBeenCalledTimes(1);
        });

        it('updates u_resolution in-place without recreating the ShaderMaterial instance on viewport resize', () => {
            currentThreeSize = { width: 200, height: 150 };

            const harness = createHookHarness(
                (props) => useShaderMaterial3D(props),
                {
                    source: 'void main() { gl_FragColor = vec4(1.0); }',
                    uniforms: {},
                    maxFps: 60,
                }
            );

            const initialMaterial = harness.result.material;
            const resUniform = initialMaterial.uniforms['u_resolution']?.value as THREE.Vector2;
            expect(resUniform).toBeDefined();
            expect(resUniform.x).toBe(400); // 200 * 2
            expect(resUniform.y).toBe(300); // 150 * 2

            // Viewport resize occurs:
            currentThreeSize = { width: 500, height: 400 };
            harness.rerender({
                source: 'void main() { gl_FragColor = vec4(1.0); }',
                uniforms: {},
                maxFps: 60,
            });

            // Must NOT recreate the material (same memory reference)
            expect(harness.result.material).toBe(initialMaterial);

            // Must update u_resolution in place
            const updatedRes = harness.result.material.uniforms['u_resolution']?.value as THREE.Vector2;
            expect(updatedRes.x).toBe(1000); // 500 * 2
            expect(updatedRes.y).toBe(800);  // 400 * 2
        });
    });

    describe('useDottedGlowEffect Zombie RAF Halting', () => {
        it('halts requestAnimationFrame when isVisible becomes false and resumes when visible', () => {
            let intersectionCallback: IntersectionObserverCallback = () => {};
            class MockIntersectionObserver implements IntersectionObserver {
                readonly root: Element | null = null;
                readonly rootMargin: string = '';
                readonly scrollMargin: string = '';
                readonly thresholds: ReadonlyArray<number> = [];
                constructor(callback: IntersectionObserverCallback) {
                    intersectionCallback = callback;
                }
                observe = vi.fn();
                unobserve = vi.fn();
                disconnect = vi.fn();
                takeRecords = () => [];
            }

            class MockResizeObserver {
                observe = vi.fn();
                unobserve = vi.fn();
                disconnect = vi.fn();
            }

            const rafCallbacks = new Map<number, FrameRequestCallback>();
            let nextRafId = 1;
            const mockRaf = vi.fn((cb: FrameRequestCallback) => {
                const id = nextRafId++;
                rafCallbacks.set(id, cb);
                return id;
            });
            const mockCaf = vi.fn((id: number) => {
                rafCallbacks.delete(id);
            });

            const mockContext2d = {
                clearRect: vi.fn(),
                createRadialGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
                fillRect: vi.fn(),
                save: vi.fn(),
                restore: vi.fn(),
                beginPath: vi.fn(),
                arc: vi.fn(),
                fill: vi.fn(),
                setTransform: vi.fn(),
                fillStyle: '',
                shadowColor: '',
                shadowBlur: 0,
                globalAlpha: 1,
            };

            const mockCanvas = {
                getContext: vi.fn(() => mockContext2d),
                width: 800,
                height: 600,
                style: {},
            } as unknown as HTMLCanvasElement;

            const mockContainer = {
                getBoundingClientRect: vi.fn(() => ({
                    width: 800,
                    height: 600,
                    top: 0,
                    left: 0,
                    right: 800,
                    bottom: 600,
                    x: 0,
                    y: 0,
                    toJSON: () => {},
                })),
            } as unknown as HTMLDivElement;

            const docElement = {
                classList: {
                    contains: vi.fn(() => false),
                },
            };
            (global as any).document = {
                documentElement: docElement,
            };
            (global as any).getComputedStyle = vi.fn(() => ({
                getPropertyValue: vi.fn(() => ''),
            }));
            (global as any).IntersectionObserver = MockIntersectionObserver;
            (global as any).ResizeObserver = MockResizeObserver;
            (global as any).window = {
                devicePixelRatio: 1,
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                getComputedStyle: (global as any).getComputedStyle,
                matchMedia: vi.fn(() => ({
                    matches: false,
                    addEventListener: vi.fn(),
                    removeEventListener: vi.fn(),
                })),
            };
            (global as any).requestAnimationFrame = mockRaf;
            (global as any).cancelAnimationFrame = mockCaf;

            const harness = createHookHarness(
                (props: { gap: number }) => useDottedGlow({
                    gap: props.gap,
                    radius: 1.5,
                    color: '#00f2fe',
                    glowColor: '#4facfe',
                    opacity: 0.8,
                    backgroundOpacity: 0,
                    speedMin: 0.4,
                    speedMax: 1.2,
                    speedScale: 1,
                }),
                { gap: 20 }
            );

            // Attach refs
            harness.result.canvasRef.current = mockCanvas;
            harness.result.containerRef.current = mockContainer;

            // Trigger re-render with updated prop so effect re-evaluates with attached refs
            harness.rerender({ gap: 21 });

            // Check that initial RAF was scheduled
            expect(mockRaf).toHaveBeenCalled();
            const initialRafCalls = mockRaf.mock.calls.length;

            // Retrieve the active scheduled callback and execute one frame while visible
            const lastId = nextRafId - 1;
            const drawFrame = rafCallbacks.get(lastId);
            expect(drawFrame).toBeDefined();

            // Execute frame 1 (visible) -> should request next frame
            drawFrame!(100);
            expect(mockRaf.mock.calls.length).toBe(initialRafCalls + 1);

            // Now, simulate canvas leaving viewport (isVisible = false)
            intersectionCallback(
                [{ isIntersecting: false } as IntersectionObserverEntry],
                {} as IntersectionObserver
            );

            // Execute frame 2 (invisible)
            const frame2Id = nextRafId - 1;
            const drawFrame2 = rafCallbacks.get(frame2Id);
            expect(drawFrame2).toBeDefined();

            const rafCallsBeforeInvisibleDraw = mockRaf.mock.calls.length;
            drawFrame2!(200);

            // MUST NOT request another animation frame while invisible (no zombie loop)
            expect(mockRaf.mock.calls.length).toBe(rafCallsBeforeInvisibleDraw);

            // Now simulate canvas scrolling back into view (isIntersecting = true)
            intersectionCallback(
                [{ isIntersecting: true } as IntersectionObserverEntry],
                {} as IntersectionObserver
            );

            // RAF loop must resume
            expect(mockRaf.mock.calls.length).toBe(rafCallsBeforeInvisibleDraw + 1);

            // Cleanup on unmount
            harness.unmount();
            expect(mockCaf).toHaveBeenCalled();
        });
    });
});
