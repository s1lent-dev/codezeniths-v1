'use client';
/**
 * background.effect-hooks.ts
 * Pure TypeScript hooks extracted from background.effects.tsx.
 * No JSX elements here.
 */

import {
    useCallback,
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
} from 'react';
import { useAnimation } from 'motion/react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { Container } from '@tsparticles/engine';
import type {
    AnimatedGridSquare,
    LightRay,
    DottedGlowDot,
    ShaderUniforms,
} from './background.types';

// ─────────────────────────────────────────────────────────────
// 1. Grid Pattern
// ─────────────────────────────────────────────────────────────

export const useGridPattern = () => {
    const id = useId();
    return { id };
};

// ─────────────────────────────────────────────────────────────
// 3. Animated Grid Pattern
// ─────────────────────────────────────────────────────────────

export interface UseAnimatedGridPatternParams {
    width: number;
    height: number;
    numSquares: number;
}

export const useAnimatedGridPattern = ({
    width,
    height,
    numSquares,
}: UseAnimatedGridPatternParams) => {
    const id = useId();
    const containerRef = useRef<SVGSVGElement | null>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [squares, setSquares] = useState<Array<AnimatedGridSquare>>([]);

    const getPos = useCallback((): [number, number] => {
        return [
            Math.floor((Math.random() * dimensions.width) / width),
            Math.floor((Math.random() * dimensions.height) / height),
        ];
    }, [dimensions.height, dimensions.width, height, width]);

    const generateSquares = useCallback(
        (count: number) => {
            return Array.from({ length: count }, (_, i) => ({
                id: i,
                pos: getPos(),
                iteration: 0,
            }));
        },
        [getPos],
    );

    const updateSquarePosition = useCallback(
        (squareId: number) => {
            setSquares((currentSquares) => {
                const current = currentSquares[squareId];
                if (!current || current.id !== squareId) { return currentSquares; }
                const nextSquares = currentSquares.slice();
                nextSquares[squareId] = {
                    ...current,
                    pos: getPos(),
                    iteration: current.iteration + 1,
                };
                return nextSquares;
            });
        },
        [getPos],
    );

    useEffect(() => {
        if (dimensions.width && dimensions.height) {
            setSquares(generateSquares(numSquares));
        }
    }, [dimensions.width, dimensions.height, generateSquares, numSquares]);

    useEffect(() => {
        const element = containerRef.current;
        if (!element) { return; }
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setDimensions((curr) => {
                    const nextWidth = entry.contentRect.width;
                    const nextHeight = entry.contentRect.height;
                    if (curr.width === nextWidth && curr.height === nextHeight) { return curr; }
                    return { width: nextWidth, height: nextHeight };
                });
            }
        });
        resizeObserver.observe(element);
        return () => resizeObserver.disconnect();
    }, []);

    return {
        id,
        containerRef,
        squares,
        updateSquarePosition,
    };
};

// ─────────────────────────────────────────────────────────────
// 4. Dot Pattern
// ─────────────────────────────────────────────────────────────

export interface UseDotPatternParams {
    width: number;
    height: number;
    cx: number;
    cy: number;
}

export const useDotPattern = ({
    width,
    height,
    cx,
    cy,
}: UseDotPatternParams) => {
    const id = useId();
    const containerRef = useRef<SVGSVGElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const { width: w, height: h } = containerRef.current.getBoundingClientRect();
                setDimensions({ width: w, height: h });
            }
        };
        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    const dots = useMemo(() => {
        if (!dimensions.width || !dimensions.height) { return []; }
        return Array.from(
            {
                length:
                    Math.ceil(dimensions.width / width) *
                    Math.ceil(dimensions.height / height),
            },
            (_, i) => {
                const col = i % Math.ceil(dimensions.width / width);
                const row = Math.floor(i / Math.ceil(dimensions.width / width));
                return {
                    x: col * width + cx,
                    y: row * height + cy,
                    delay: Math.random() * 5,
                    duration: Math.random() * 3 + 2,
                };
            },
        );
    }, [dimensions, width, height, cx, cy]);

    return {
        id,
        containerRef,
        dots,
    };
};

// ─────────────────────────────────────────────────────────────
// 5. Flickering Grid
// ─────────────────────────────────────────────────────────────

export interface UseFlickeringGridParams {
    squareSize: number;
    gridGap: number;
    flickerChance: number;
    color: string;
    width?: number;
    height?: number;
    maxOpacity: number;
}

export const useFlickeringGrid = ({
    squareSize,
    gridGap,
    flickerChance,
    color,
    width,
    height,
    maxOpacity,
}: UseFlickeringGridParams) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isInView, setIsInView] = useState(false);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

    const memoizedColor = useMemo(() => {
        const toRGBA = (c: string) => {
            if (typeof window === 'undefined') { return 'rgba(0, 0, 0,'; }
            const canvas = document.createElement('canvas');
            canvas.width = canvas.height = 1;
            const ctx = canvas.getContext('2d');
            if (!ctx) { return 'rgba(255, 0, 0,'; }
            ctx.fillStyle = c;
            ctx.fillRect(0, 0, 1, 1);
            const [r, g, b] = Array.from(ctx.getImageData(0, 0, 1, 1).data);
            return `rgba(${r}, ${g}, ${b},`;
        };
        return toRGBA(color);
    }, [color]);

    const setupCanvas = useCallback(
        (canvas: HTMLCanvasElement, w: number, h: number) => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;
            const cols = Math.floor(w / (squareSize + gridGap));
            const rows = Math.floor(h / (squareSize + gridGap));
            const sq = new Float32Array(cols * rows);
            for (let i = 0; i < sq.length; i++) { sq[i] = Math.random() * maxOpacity; }
            return { cols, rows, squares: sq, dpr };
        },
        [squareSize, gridGap, maxOpacity],
    );

    const updateSquares = useCallback(
        (sq: Float32Array, deltaTime: number) => {
            for (let i = 0; i < sq.length; i++) {
                if (Math.random() < flickerChance * deltaTime) { sq[i] = Math.random() * maxOpacity; }
            }
        },
        [flickerChance, maxOpacity],
    );

    const drawGrid = useCallback(
        (
            ctx: CanvasRenderingContext2D,
            w: number,
            h: number,
            cols: number,
            rows: number,
            sq: Float32Array,
            dpr: number,
        ) => {
            ctx.clearRect(0, 0, w, h);
            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const opacity = sq[i * rows + j]!;
                    ctx.fillStyle = `${memoizedColor}${opacity})`;
                    ctx.fillRect(
                        i * (squareSize + gridGap) * dpr,
                        j * (squareSize + gridGap) * dpr,
                        squareSize * dpr,
                        squareSize * dpr,
                    );
                }
            }
        },
        [memoizedColor, squareSize, gridGap],
    );

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) { return; }
        const ctx = canvas.getContext('2d');
        if (!ctx) { return; }

        let animationFrameId: number;
        let gridParams: ReturnType<typeof setupCanvas>;

        const updateCanvasSize = () => {
            const newWidth = width || container.clientWidth;
            const newHeight = height || container.clientHeight;
            setCanvasSize({ width: newWidth, height: newHeight });
            gridParams = setupCanvas(canvas, newWidth, newHeight);
        };

        updateCanvasSize();

        let lastTime = 0;
        const animate = (time: number) => {
            if (!isInView) { return; }
            const deltaTime = (time - lastTime) / 1000;
            lastTime = time;
            updateSquares(gridParams.squares, deltaTime);
            drawGrid(ctx, canvas.width, canvas.height, gridParams.cols, gridParams.rows, gridParams.squares, gridParams.dpr);
            animationFrameId = requestAnimationFrame(animate);
        };

        const resizeObserver = new ResizeObserver(() => updateCanvasSize());
        resizeObserver.observe(container);

        const intersectionObserver = new IntersectionObserver(
            ([entry]) => setIsInView(entry?.isIntersecting ?? false),
            { threshold: 0 },
        );
        intersectionObserver.observe(canvas);

        if (isInView) { animationFrameId = requestAnimationFrame(animate); }

        return () => {
            cancelAnimationFrame(animationFrameId);
            resizeObserver.disconnect();
            intersectionObserver.disconnect();
        };
    }, [setupCanvas, updateSquares, drawGrid, width, height, isInView]);

    return {
        canvasRef,
        containerRef,
        canvasSize,
    };
};

// ─────────────────────────────────────────────────────────────
// 6. Striped Pattern
// ─────────────────────────────────────────────────────────────

export const useStripedPattern = () => {
    const id = useId();
    return { id };
};

// ─────────────────────────────────────────────────────────────
// 10. Light Rays
// ─────────────────────────────────────────────────────────────

const createRays = (count: number, cycle: number): Array<LightRay> => {
    if (count <= 0) { return []; }
    return Array.from({ length: count }, (_, index) => {
        const left = 8 + Math.random() * 84;
        const rotate = -28 + Math.random() * 56;
        const width = 160 + Math.random() * 160;
        const swing = 0.8 + Math.random() * 1.8;
        const delay = Math.random() * cycle;
        const duration = cycle * (0.75 + Math.random() * 0.5);
        const intensity = 0.6 + Math.random() * 0.5;
        return { id: `${index}-${Math.round(left * 10)}`, left, rotate, width, swing, delay, duration, intensity };
    });
};

export interface UseLightRaysParams {
    count: number;
    speed: number;
}

export const useLightRays = ({ count, speed }: UseLightRaysParams) => {
    const [rays, setRays] = useState<Array<LightRay>>([]);
    const cycleDuration = Math.max(speed || 14, 0.1);

    useEffect(() => {
        setRays(createRays(count || 7, cycleDuration));
    }, [count, cycleDuration]);

    return { rays };
};

// ─────────────────────────────────────────────────────────────
// 11. Background Ripple Effect (Interactive Grid)
// ─────────────────────────────────────────────────────────────

export interface UseDivGridParams {
    rows: number;
    cols: number;
}

export const useDivGrid = ({ rows, cols }: UseDivGridParams) => {
    const cells = useMemo(
        () => Array.from({ length: rows * cols }, (_, idx) => idx),
        [rows, cols],
    );
    return { cells };
};

export const useBackgroundRippleEffect = (props?: { rows?: number; cols?: number }) => {
    const rows = props?.rows ?? 8;
    const cols = props?.cols ?? 27;

    const [clickedCell, setClickedCell] = useState<{ row: number; col: number } | null>(null);
    const [rippleKey, setRippleKey] = useState(0);

    const handleCellClick = useCallback((row: number, col: number) => {
        setClickedCell({ row, col });
        setRippleKey((k) => k + 1);
    }, []);

    const cells = useMemo(
        () => Array.from({ length: rows * cols }, (_, idx) => idx),
        [rows, cols],
    );

    return {
        clickedCell,
        rippleKey,
        handleCellClick,
        cells,
    };
};

// ─────────────────────────────────────────────────────────────
// 12. Dotted Glow Background
// ─────────────────────────────────────────────────────────────

export interface UseDottedGlowParams {
    gap: number;
    radius: number;
    color: string;
    darkColor?: string;
    glowColor: string;
    darkGlowColor?: string;
    colorLightVar?: string;
    colorDarkVar?: string;
    glowColorLightVar?: string;
    glowColorDarkVar?: string;
    opacity: number;
    backgroundOpacity: number;
    speedMin: number;
    speedMax: number;
    speedScale: number;
}

export const useDottedGlow = ({
    gap,
    radius,
    color,
    darkColor,
    glowColor,
    darkGlowColor,
    colorLightVar,
    colorDarkVar,
    glowColorLightVar,
    glowColorDarkVar,
    opacity,
    backgroundOpacity,
    speedMin,
    speedMax,
    speedScale,
}: UseDottedGlowParams) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [resolvedColor, setResolvedColor] = useState<string>(color);
    const [resolvedGlowColor, setResolvedGlowColor] = useState<string>(glowColor);

    const resolveCssVariable = (el: Element, variableName?: string): string | null => {
        if (!variableName) { return null; }
        const normalized = variableName.startsWith('--') ? variableName : `--${variableName}`;
        const fromEl = getComputedStyle(el).getPropertyValue(normalized).trim();
        if (fromEl) { return fromEl; }
        const fromRoot = getComputedStyle(document.documentElement).getPropertyValue(normalized).trim();
        return fromRoot || null;
    };

    const detectDarkMode = (): boolean => {
        const root = document.documentElement;
        if (root.classList.contains('dark')) { return true; }
        if (root.classList.contains('light')) { return false; }
        return window.matchMedia('(prefers-color-scheme: dark)').matches || false;
    };

    useEffect(() => {
        const container = containerRef.current ?? document.documentElement;
        const compute = () => {
            const isDark = detectDarkMode();
            let nextColor = color;
            let nextGlow = glowColor;
            if (isDark) {
                const varDot = resolveCssVariable(container, colorDarkVar);
                const varGlow = resolveCssVariable(container, glowColorDarkVar);
                nextColor = varDot || darkColor || nextColor;
                nextGlow = varGlow || darkGlowColor || nextGlow;
            } else {
                const varDot = resolveCssVariable(container, colorLightVar);
                const varGlow = resolveCssVariable(container, glowColorLightVar);
                nextColor = varDot || nextColor;
                nextGlow = varGlow || nextGlow;
            }
            setResolvedColor(nextColor);
            setResolvedGlowColor(nextGlow);
        };
        compute();

        const mql = window.matchMedia('(prefers-color-scheme: dark)');
        mql.addEventListener('change', compute);

        // Instead of MutationObserver, poll changes to theme or container colors
        const intervalId = setInterval(compute, 500);

        return () => {
            mql.removeEventListener('change', compute);
            clearInterval(intervalId);
        };
    }, [color, darkColor, glowColor, darkGlowColor, colorLightVar, colorDarkVar, glowColorLightVar, glowColorDarkVar]);

    useEffect(() => {
        const el = canvasRef.current;
        const container = containerRef.current;
        if (!el || !container) { return; }
        const ctx = el.getContext('2d');
        if (!ctx) { return; }

        let raf = 0;
        let stopped = false;
        let isVisible = true;
        const dpr = Math.min(Math.max(1, window.devicePixelRatio || 1), 2);

        const resize = () => {
            const { width, height } = container.getBoundingClientRect();
            el.width = Math.max(1, Math.floor(width * dpr));
            el.height = Math.max(1, Math.floor(height * dpr));
            el.style.width = `${Math.floor(width)}px`;
            el.style.height = `${Math.floor(height)}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        const ro = new ResizeObserver(resize);
        ro.observe(container);
        resize();

        let dots: Array<DottedGlowDot> = [];
        const regenDots = () => {
            dots = [];
            const { width, height } = container.getBoundingClientRect();
            const cols = Math.ceil(width / gap) + 2;
            const rows = Math.ceil(height / gap) + 2;
            const min = Math.min(speedMin, speedMax);
            const max = Math.max(speedMin, speedMax);
            for (let i = -1; i < cols; i++) {
                for (let j = -1; j < rows; j++) {
                    const x = i * gap + (j % 2 === 0 ? 0 : gap * 0.5);
                    const y = j * gap;
                    dots.push({ x, y, phase: Math.random() * Math.PI * 2, speed: min + Math.random() * Math.max(max - min, 0) });
                }
            }
        };
        regenDots();

        let last = performance.now();
        const draw = (now: number) => {
            if (stopped) { return; }
            if (!isVisible) { raf = requestAnimationFrame(draw); return; }
            const dt = (now - last) / 1000;
            last = now;
            const { width, height } = container.getBoundingClientRect();
            ctx.clearRect(0, 0, el.width, el.height);
            ctx.globalAlpha = opacity;

            if (backgroundOpacity > 0) {
                const grad = ctx.createRadialGradient(width * 0.5, height * 0.4, Math.min(width, height) * 0.1, width * 0.5, height * 0.5, Math.max(width, height) * 0.7);
                grad.addColorStop(0, 'rgba(0,0,0,0)');
                grad.addColorStop(1, `rgba(0,0,0,${Math.min(Math.max(backgroundOpacity, 0), 1)})`);
                ctx.fillStyle = grad as unknown as string;
                ctx.fillRect(0, 0, width, height);
            }

            ctx.save();
            const time = (now / 1000) * Math.max(speedScale, 0);
            for (const d of dots) {
                const mod = (time * d.speed + d.phase) % 2;
                const lin = mod < 1 ? mod : 2 - mod;
                const a = 0.25 + 0.55 * lin;
                if (a > 0.6) { ctx.shadowColor = resolvedGlowColor; ctx.shadowBlur = 6 * ((a - 0.6) / 0.4); }
                else { ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; }
                ctx.globalAlpha = a * opacity;
                ctx.fillStyle = resolvedColor;
                ctx.beginPath();
                ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
            raf = requestAnimationFrame(draw);
        };

        const handleResize = () => { resize(); regenDots(); };
        const observer = new IntersectionObserver(([e]) => { isVisible = e?.isIntersecting ?? true; }, { threshold: 0.1 });
        observer.observe(container);
        window.addEventListener('resize', handleResize);
        raf = requestAnimationFrame(draw);

        return () => { stopped = true; cancelAnimationFrame(raf); window.removeEventListener('resize', handleResize); observer.disconnect(); ro.disconnect(); };
    }, [gap, radius, resolvedColor, resolvedGlowColor, opacity, backgroundOpacity, speedMin, speedMax, speedScale]);

    return {
        canvasRef,
        containerRef,
    };
};

// ─────────────────────────────────────────────────────────────
// 13. Canvas Reveal Effect (WebGL / Three.js)
// ─────────────────────────────────────────────────────────────

export interface UseShaderMaterial3DParams {
    source: string;
    uniforms: ShaderUniforms;
    maxFps: number;
}

export const useShaderMaterial3D = ({
    source,
    uniforms,
    maxFps = 60,
}: UseShaderMaterial3DParams) => {
    const { size } = useThree();
    const ref = useRef<THREE.Mesh>(null!);
    const lastFrameTimeRef = useRef(0);

    useFrame(({ clock }) => {
        const timestamp = clock.getElapsedTime();
        if (timestamp - lastFrameTimeRef.current < 1 / maxFps) { return; }
        lastFrameTimeRef.current = timestamp;
        const material = ref.current.material as THREE.ShaderMaterial & { uniforms: Record<string, { value: unknown }> };
        if (material?.uniforms?.['u_time']) {
            material.uniforms['u_time'].value = timestamp;
        }
    });

    const getUniforms = useCallback(() => {
        const prepared: Record<string, { value: unknown }> = {};
        for (const name in uniforms) {
            const u = uniforms[name]!;
            switch (u.type) {
                case 'uniform1f': prepared[name] = { value: u.value }; break;
                case 'uniform3f': prepared[name] = { value: new THREE.Vector3().fromArray(u.value as Array<number>) }; break;
                case 'uniform1fv': prepared[name] = { value: u.value }; break;
                case 'uniform3fv': prepared[name] = { value: (u.value as Array<Array<number>>).map((v) => new THREE.Vector3().fromArray(v)) }; break;
                case 'uniform2f': prepared[name] = { value: new THREE.Vector2().fromArray(u.value as Array<number>) }; break;
                default: break;
            }
        }
        prepared['u_time'] = { value: 0 };
        prepared['u_resolution'] = { value: new THREE.Vector2(size.width * 2, size.height * 2) };
        return prepared;
    }, [uniforms, size.width, size.height]);

    const material = useMemo(() => {
        return new THREE.ShaderMaterial({
            vertexShader: `
                precision mediump float;
                uniform vec2 u_resolution;
                out vec2 fragCoord;
                void main() {
                    float x = position.x;
                    float y = position.y;
                    gl_Position = vec4(x, y, 0.0, 1.0);
                    fragCoord = (position.xy + vec2(1.0)) * 0.5 * u_resolution;
                    fragCoord.y = u_resolution.y - fragCoord.y;
                }
            `,
            fragmentShader: source,
            uniforms: getUniforms(),
            glslVersion: THREE.GLSL3,
            blending: THREE.CustomBlending,
            blendSrc: THREE.SrcAlphaFactor,
            blendDst: THREE.OneFactor,
        });
    }, [source, getUniforms]);

    return {
        ref,
        material,
    };
};

export interface UseDotMatrixUniformsParams {
    colors?: Array<Array<number>>;
    opacities?: Array<number>;
    totalSize?: number;
    dotSize?: number;
}

export const useDotMatrixUniforms = ({
    colors = [[0, 0, 0]],
    opacities = [0.04, 0.04, 0.04, 0.04, 0.04, 0.08, 0.08, 0.08, 0.08, 0.14],
    totalSize = 4,
    dotSize = 2,
}: UseDotMatrixUniformsParams) => {
    const colorsKey = JSON.stringify(colors);
    const opacitiesKey = JSON.stringify(opacities);

    const uniforms = useMemo(() => {
        let colorsArray = [colors[0], colors[0], colors[0], colors[0], colors[0], colors[0]];
        if (colors.length === 2) { colorsArray = [colors[0], colors[0], colors[0], colors[1], colors[1], colors[1]]; }
        else if (colors.length === 3) { colorsArray = [colors[0], colors[0], colors[1], colors[1], colors[2], colors[2]]; }
        return {
            u_colors: { value: colorsArray.map((c) => [c![0]! / 255, c![1]! / 255, c![2]! / 255]), type: 'uniform3fv' },
            u_opacities: { value: opacities, type: 'uniform1fv' },
            u_total_size: { value: totalSize, type: 'uniform1f' },
            u_dot_size: { value: dotSize, type: 'uniform1f' },
        };
    }, [colorsKey, opacitiesKey, totalSize, dotSize]);

    return { uniforms };
};

// ─────────────────────────────────────────────────────────────
// 14. Mask Reveal
// ─────────────────────────────────────────────────────────────

export const useMaskContainer = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [mousePosition, setMousePosition] = useState<{ x: number | null; y: number | null }>({ x: null, y: null });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) { return; }
        const updateMousePosition = (e: MouseEvent) => {
            const rect = el.getBoundingClientRect();
            setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        };
        el.addEventListener('mousemove', updateMousePosition);
        return () => el.removeEventListener('mousemove', updateMousePosition);
    }, []);

    return {
        isHovered,
        setIsHovered,
        mousePosition,
        containerRef,
    };
};

// ─────────────────────────────────────────────────────────────
// 15. TS Particles
// ─────────────────────────────────────────────────────────────

let engineReady = false;
let enginePromise: Promise<void> | null = null;

export const useParticlesEngine = () => {
    const [ready, setReady] = useState(engineReady);

    useEffect(() => {
        if (engineReady) { setReady(true); return; }
        if (!enginePromise) {
            enginePromise = initParticlesEngine(async (engine) => {
                await loadSlim(engine);
            });
        }
        enginePromise.then(() => {
            engineReady = true;
            setReady(true);
        });
    }, []);

    return ready;
};

export const useParticlesBackground = () => {
    const ready = useParticlesEngine();
    const controls = useAnimation();
    const generatedId = useId();

    const onParticlesLoaded = useCallback(async (container?: Container) => {
        if (container) {
            await controls.start({ opacity: 1, transition: { duration: 1 } });
        }
    }, [controls]);

    return {
        ready,
        controls,
        generatedId,
        onParticlesLoaded,
    };
};
