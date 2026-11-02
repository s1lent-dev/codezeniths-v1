'use client';

import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { cn } from '@codezeniths/design/cn';
import type {
    ActivityTerrainPalette,
    ActivityTerrainProps,
    Pose,
    Rgb,
    TerrainCell,
} from './activity-terrain.types';
import {
    DEFAULT_TERRAIN_CONSTANTS,
    buildTerrainLayout,
    clamp,
    easeOutBack,
    isPointInPolygon,
    projectPoint,
    rubber,
    visibleFaces,
} from './activity-terrain.math';

const {
    DAYS,
    DEG,
    PITCH_TERRAIN,
    YAW_TERRAIN,
    YAW_LIMIT,
    PITCH_LIMIT,
    DRAG_YAW,
    DRAG_PITCH,
    SPIN_HALF_LIFE,
    PITCH_STIFFNESS,
    EDGE_STIFFNESS,
    BUMP_STIFFNESS,
    BUMP,
    WAVE,
    PADDING,
    REST_EPSILON,
} = DEFAULT_TERRAIN_CONSTANTS;

const PITCH_DAMPING = 2 * Math.sqrt(PITCH_STIFFNESS);
const BUMP_DAMPING = 2 * Math.sqrt(BUMP_STIFFNESS) * 0.7;
const SPIN_IN = (YAW_TERRAIN * Math.LN2) / SPIN_HALF_LIFE;

export function getTerrainPalette(isDark: boolean): ActivityTerrainPalette {
    if (isDark) {
        return {
            levels: [
                [40, 48, 80],    // Level 0: #283050 (Dark idle tile)
                [15, 79, 68],    // Level 1: #0f4f44
                [9, 123, 94],    // Level 2: #097b5e
                [5, 150, 105],   // Level 3: #059669
                [16, 185, 129],  // Level 4: #10b981
            ],
            outOfBounds: [31, 37, 62], // #1f253e
            accent: [52, 211, 153],    // #34d399
            text: '#9ca3af',
            font: 'system-ui, -apple-system, sans-serif',
        };
    }

    return {
        levels: [
            [210, 201, 238], // Level 0: #d2c9ee (Light idle tile)
            [167, 243, 208], // Level 1: #a7f3d0
            [52, 211, 153],  // Level 2: #34d399
            [5, 150, 105],   // Level 3: #059669
            [4, 120, 87],    // Level 4: #047857
        ],
        outOfBounds: [238, 235, 250], // #eeebfa
        accent: [16, 185, 129],       // #10b981
        text: '#71717a',
        font: 'system-ui, -apple-system, sans-serif',
    };
}

export function shade([r, g, b]: Rgb, amount: number): string {
    const k = 1 - amount;
    return `rgb(${Math.round(r * k)},${Math.round(g * k)},${Math.round(b * k)})`;
}

export function sortCellsByDepth(
    cells: TerrainCell[],
    pose: Pose,
    totalWidth: number
): TerrainCell[] {
    const sinYaw = Math.sin(pose.yaw);
    const cosYaw = Math.cos(pose.pitch > 0.01 ? pose.yaw : 0);
    const halfWidth = totalWidth / 2;
    const halfDays = DAYS / 2;

    const depth = (c: TerrainCell) =>
        (c.colX - halfWidth) * sinYaw + (c.rowZ - halfDays) * cosYaw;

    return [...cells].sort((a, b) => depth(a) - depth(b));
}

function drawPolygon(ctx: CanvasRenderingContext2D, points: [number, number][]) {
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i][0], points[i][1]);
    }
    ctx.closePath();
}

export const ActivityTerrain: React.FC<ActivityTerrainProps> = ({
    months,
    selectedYear,
    onCellHover,
    className,
}) => {
    const layout = useMemo(() => buildTerrainLayout(months), [months]);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dragging, setDragging] = useState(false);

    const isDarkRef = useRef(false);
    const paletteRef = useRef<ActivityTerrainPalette>(getTerrainPalette(false));

    const sim = useRef({
        yaw: 0,
        yawSpeed: 0,
        pitch: 0,
        pitchSpeed: 0,
        pitchTarget: PITCH_TERRAIN,
        bumps: new Float64Array(layout.cells.length),
        bumpSpeeds: new Float64Array(layout.cells.length),
        hovered: -1,
        origin: { colX: 0, rowZ: 3 },
        width: 0,
        height: 0,
        dpr: 1,
        drag: null as null | {
            id: number;
            x: number;
            y: number;
            yaw: number;
            pitch: number;
            moved: boolean;
            samples: { t: number; x: number; y: number }[];
        },
        raf: 0,
        last: 0,
        visible: false,
        started: false,
        reduceMotion: false,
    });

    const cellsRef = useRef(layout.cells);
    cellsRef.current = layout.cells;

    if (sim.current.bumps.length !== layout.cells.length) {
        sim.current.bumps = new Float64Array(layout.cells.length);
        sim.current.bumpSpeeds = new Float64Array(layout.cells.length);
    }

    const columnHeight = useCallback(
        (cell: TerrainCell, lift: number) => {
            const s = sim.current;
            const span = Math.hypot(layout.totalWidth, DAYS) || 1;
            const d =
                Math.hypot(cell.colX - s.origin.colX, cell.rowZ - s.origin.rowZ) / span;
            const local = clamp(lift * (1 + WAVE) - d * WAVE, 0, 1);
            return cell.baseHeight * easeOutBack(local) + s.bumps[cell.index];
        },
        [layout.totalWidth]
    );

    const getPose = useCallback((): Pose & { lift: number } => {
        const s = sim.current;
        const lift = clamp(s.pitch / PITCH_TERRAIN, 0, 1.2);
        const w = layout.totalWidth;
        const corners = [
            [-w / 2, -DAYS / 2],
            [w / 2, -DAYS / 2],
            [-w / 2, DAYS / 2],
            [w / 2, DAYS / 2],
        ];

        const probe: Pose = { yaw: s.yaw, pitch: s.pitch, scale: 1, cx: 0, cy: 0 };
        let minX = Number.POSITIVE_INFINITY;
        let maxX = Number.NEGATIVE_INFINITY;
        let minY = Number.POSITIVE_INFINITY;
        let maxY = Number.NEGATIVE_INFINITY;

        for (const [x, z] of corners) {
            for (const y of [0, DEFAULT_TERRAIN_CONSTANTS.MAX_HEIGHT * Math.min(lift, 1)]) {
                const [px, py] = projectPoint(probe, x, y, z);
                minX = Math.min(minX, px);
                maxX = Math.max(maxX, px);
                minY = Math.min(minY, py);
                maxY = Math.max(maxY, py);
            }
        }

        const scale = Math.min(
            (s.width - PADDING * 2) / Math.max(1, maxX - minX),
            (s.height - PADDING * 2) / Math.max(1, maxY - minY)
        );

        return {
            yaw: s.yaw,
            pitch: s.pitch,
            scale,
            cx: s.width / 2 - ((minX + maxX) / 2) * scale,
            cy: s.height / 2 - ((minY + maxY) / 2) * scale + 10,
            lift,
        };
    }, [layout.totalWidth]);

    const drawMonthLabels = useCallback(
        (ctx: CanvasRenderingContext2D, p: Pose, lift: number, palette: ActivityTerrainPalette) => {
            const alpha = clamp(1 - lift * 1.5, 0, 1);
            if (alpha <= 0.01) return;

            ctx.globalAlpha = alpha;
            ctx.fillStyle = palette.text;
            ctx.font = `11px ${palette.font}`;
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';

            const halfWidth = layout.totalWidth / 2;
            for (const label of layout.monthLabels) {
                const [x, y] = projectPoint(
                    p,
                    label.centerX - halfWidth,
                    0,
                    label.rowZ
                );
                ctx.fillText(label.monthName, x, y);
            }
            ctx.globalAlpha = 1;
        },
        [layout.monthLabels, layout.totalWidth]
    );

    const draw = useCallback(() => {
        const s = sim.current;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx || !s.width) return;

        const palette = paletteRef.current;
        const p = getPose();

        ctx.setTransform(s.dpr, 0, 0, s.dpr, 0, 0);
        ctx.clearRect(0, 0, s.width, s.height);

        drawMonthLabels(ctx, p, p.lift, palette);

        const halfWidth = layout.totalWidth / 2;
        const halfDays = DAYS / 2;
        const ordered = sortCellsByDepth(cellsRef.current, p, layout.totalWidth);

        ctx.lineJoin = 'round';

        for (const c of ordered) {
            const h = columnHeight(c, p.lift);
            const isHovered = c.index === s.hovered;
            const isOutOfBounds = c.cell.isBeforeCreation || c.cell.isFuture;

            const color: Rgb = isHovered
                ? palette.accent
                : isOutOfBounds
                ? palette.outOfBounds
                : palette.levels[c.cell.level];

            const faces = visibleFaces(
                p,
                c.colX - halfWidth,
                c.rowZ - halfDays,
                h
            );

            for (const face of faces) {
                drawPolygon(ctx, face.points);
                const fill = shade(color, face.tone);
                ctx.fillStyle = fill;
                ctx.fill();

                ctx.strokeStyle = fill;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }, [columnHeight, drawMonthLabels, getPose, layout.totalWidth]);

    const hitTest = useCallback(
        (canvasX: number, canvasY: number): TerrainCell | null => {
            const p = getPose();
            const halfWidth = layout.totalWidth / 2;
            const halfDays = DAYS / 2;
            const ordered = sortCellsByDepth(cellsRef.current, p, layout.totalWidth);

            // Front to back search
            for (let i = ordered.length - 1; i >= 0; i--) {
                const c = ordered[i];
                const h = columnHeight(c, p.lift);
                const faces = visibleFaces(
                    p,
                    c.colX - halfWidth,
                    c.rowZ - halfDays,
                    h
                );
                for (const face of faces) {
                    if (isPointInPolygon(face.points, canvasX, canvasY)) {
                        return c;
                    }
                }
            }
            return null;
        },
        [columnHeight, getPose, layout.totalWidth]
    );

    const stepSprings = useCallback((dt: number): number => {
        const s = sim.current;
        let energy = 0;

        if (!s.drag) {
            s.yawSpeed *= Math.pow(0.5, dt / SPIN_HALF_LIFE);
            let targetYaw = s.yaw;
            if (s.yaw > YAW_LIMIT) targetYaw = YAW_LIMIT;
            else if (s.yaw < -YAW_LIMIT) targetYaw = -YAW_LIMIT;

            if (targetYaw !== s.yaw) {
                s.yawSpeed +=
                    ((targetYaw - s.yaw) * EDGE_STIFFNESS -
                        s.yawSpeed * 2 * Math.sqrt(EDGE_STIFFNESS)) *
                    dt;
            }
            s.yaw += s.yawSpeed * dt;
            energy = Math.max(energy, Math.abs(s.yawSpeed), Math.abs(targetYaw - s.yaw));

            const forcePitch =
                (s.pitchTarget - s.pitch) * PITCH_STIFFNESS -
                s.pitchSpeed * PITCH_DAMPING;
            s.pitchSpeed += forcePitch * dt;
            s.pitch += s.pitchSpeed * dt;
            energy = Math.max(
                energy,
                Math.abs(s.pitchSpeed),
                Math.abs(s.pitchTarget - s.pitch)
            );
        }

        for (let i = 0; i < s.bumps.length; i++) {
            const targetBump = i === s.hovered && s.pitch > 0.1 ? BUMP : 0;
            s.bumpSpeeds[i] +=
                ((targetBump - s.bumps[i]) * BUMP_STIFFNESS -
                    s.bumpSpeeds[i] * BUMP_DAMPING) *
                dt;
            s.bumps[i] += s.bumpSpeeds[i] * dt;
            energy = Math.max(
                energy,
                Math.abs(s.bumpSpeeds[i]) * 0.1,
                Math.abs(targetBump - s.bumps[i])
            );
        }

        return energy;
    }, []);

    const tick = useCallback(
        (now: number) => {
            const s = sim.current;
            s.raf = 0;
            const dt = s.last ? Math.min((now - s.last) / 1000, 1 / 30) : 1 / 60;
            s.last = now;
            const energy = stepSprings(dt);
            draw();
            if ((s.drag || energy > REST_EPSILON) && s.visible) {
                s.raf = requestAnimationFrame(tick);
            } else {
                s.last = 0;
            }
        },
        [draw, stepSprings]
    );

    const turnIn = useCallback(() => {
        const s = sim.current;
        if (Math.abs(s.yaw) > 2 * DEG) return;
        if (s.reduceMotion) {
            s.yaw = YAW_TERRAIN;
        } else {
            s.yawSpeed = SPIN_IN;
        }
    }, []);

    const wake = useCallback(() => {
        const s = sim.current;
        if (s.reduceMotion) {
            s.pitch = s.pitchTarget;
            s.yaw = clamp(s.yaw, -YAW_LIMIT, YAW_LIMIT);
            s.pitchSpeed = 0;
            s.yawSpeed = 0;
            s.bumps.fill(0);
            draw();
            return;
        }
        if (!s.raf && s.visible) {
            s.raf = requestAnimationFrame(tick);
        }
    }, [draw, tick]);

    // Handle dark mode changes
    useEffect(() => {
        const updatePalette = () => {
            const isDark = document.documentElement.classList.contains('dark');
            isDarkRef.current = isDark;
            paletteRef.current = getTerrainPalette(isDark);
            draw();
        };

        updatePalette();

        const observer = new MutationObserver(() => updatePalette());
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });

        return () => observer.disconnect();
    }, [draw]);

    // Lifecycle: ResizeObserver, IntersectionObserver, and Visibility
    useEffect(() => {
        const s = sim.current;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
        s.reduceMotion = motionMedia.matches;

        const resize = new ResizeObserver(([entry]) => {
            s.width = entry.contentRect.width;
            s.height = entry.contentRect.height;
            s.dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.round(s.width * s.dpr);
            canvas.height = Math.round(s.height * s.dpr);
            draw();
        });
        resize.observe(canvas);

        let onScreen = false;
        const updateVisibility = () => {
            s.visible = onScreen && !document.hidden;
            if (s.visible) {
                if (!s.started) {
                    s.started = true;
                    turnIn();
                }
                wake();
            } else if (s.raf) {
                cancelAnimationFrame(s.raf);
                s.raf = 0;
                s.last = 0;
            }
        };

        const intersection = new IntersectionObserver(([entry]) => {
            onScreen = entry.isIntersecting;
            updateVisibility();
        });
        intersection.observe(canvas);

        document.addEventListener('visibilitychange', updateVisibility);

        return () => {
            resize.disconnect();
            intersection.disconnect();
            document.removeEventListener('visibilitychange', updateVisibility);
            if (s.raf) {
                cancelAnimationFrame(s.raf);
                s.raf = 0;
            }
        };
    }, [draw, turnIn, wake]);

    const getLocalPoint = (event: React.PointerEvent<HTMLCanvasElement>) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        return rect
            ? { x: event.clientX - rect.left, y: event.clientY - rect.top }
            : { x: 0, y: 0 };
    };

    const handleHover = (cell: TerrainCell | null, clientPos: { x: number; y: number } | null) => {
        const s = sim.current;
        const newIndex = cell ? cell.index : -1;
        if (newIndex !== s.hovered) {
            s.hovered = newIndex;
            if (onCellHover) {
                onCellHover(cell ? cell.cell : null, clientPos);
            }
            if (s.reduceMotion) {
                draw();
            } else {
                wake();
            }
        }
    };

    const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
        if (event.pointerType === 'mouse' && event.button !== 0) return;
        const s = sim.current;
        const { x, y } = getLocalPoint(event);
        event.currentTarget.setPointerCapture(event.pointerId);

        const hit = hitTest(x, y);
        if (hit) {
            s.origin = { colX: hit.colX, rowZ: hit.rowZ };
        }

        s.drag = {
            id: event.pointerId,
            x: event.clientX,
            y: event.clientY,
            yaw: s.yaw,
            pitch: s.pitch,
            moved: false,
            samples: [{ t: event.timeStamp, x: event.clientX, y: event.clientY }],
        };
        s.yawSpeed = 0;
        s.pitchSpeed = 0;
        setDragging(true);
        handleHover(hit, { x: event.clientX, y: event.clientY });
        wake();
    };

    const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
        const s = sim.current;
        const drag = s.drag;

        if (!drag || drag.id !== event.pointerId) {
            if (event.pointerType === 'mouse') {
                const { x, y } = getLocalPoint(event);
                const hit = hitTest(x, y);
                handleHover(hit, hit ? { x: event.clientX, y: event.clientY } : null);
            }
            return;
        }

        const dx = event.clientX - drag.x;
        const dy = event.clientY - drag.y;

        if (!drag.moved && Math.hypot(dx, dy) > 4) {
            drag.moved = true;
        }
        if (!drag.moved) return;

        s.yaw = rubber(drag.yaw + dx * DRAG_YAW, -YAW_LIMIT, YAW_LIMIT);
        s.pitch = rubber(drag.pitch + dy * DRAG_PITCH, 0.05, PITCH_LIMIT);

        drag.samples.push({
            t: event.timeStamp,
            x: event.clientX,
            y: event.clientY,
        });
        if (drag.samples.length > 5) {
            drag.samples.shift();
        }

        if (s.reduceMotion) {
            draw();
        } else {
            wake();
        }
    };

    const handlePointerUp = (event: React.PointerEvent<HTMLCanvasElement>) => {
        const s = sim.current;
        const drag = s.drag;
        if (!drag || drag.id !== event.pointerId) return;

        s.drag = null;
        setDragging(false);

        if (!drag.moved) {
            wake();
            return;
        }

        const first = drag.samples[0];
        const lastSample = drag.samples.at(-1) ?? first;
        const dt = Math.max((lastSample.t - first.t) / 1000, 0.016);
        const vx = (lastSample.x - first.x) / dt;
        const vy = (lastSample.y - first.y) / dt;
        const isRecent = event.timeStamp - lastSample.t < 80;

        s.yawSpeed = isRecent ? vx * DRAG_YAW : 0;
        s.pitchSpeed = isRecent ? vy * DRAG_PITCH : 0;
        s.pitchTarget = PITCH_TERRAIN;
        wake();
    };

    const handlePointerLeave = (event: React.PointerEvent<HTMLCanvasElement>) => {
        if (!sim.current.drag && event.pointerType === 'mouse') {
            handleHover(null, null);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLCanvasElement>) => {
        const moves: Record<string, [number, number]> = {
            ArrowLeft: [-1, 0],
            ArrowRight: [1, 0],
            ArrowUp: [0, -1],
            ArrowDown: [0, 1],
        };

        // Shift + Arrows rotates camera
        if (event.shiftKey) {
            const s = sim.current;
            if (event.key === 'ArrowLeft') {
                s.yaw = clamp(s.yaw - 4 * DEG, -YAW_LIMIT, YAW_LIMIT);
                wake();
                event.preventDefault();
            } else if (event.key === 'ArrowRight') {
                s.yaw = clamp(s.yaw + 4 * DEG, -YAW_LIMIT, YAW_LIMIT);
                wake();
                event.preventDefault();
            } else if (event.key === 'ArrowUp') {
                s.pitch = clamp(s.pitch - 4 * DEG, 0.05, PITCH_LIMIT);
                wake();
                event.preventDefault();
            } else if (event.key === 'ArrowDown') {
                s.pitch = clamp(s.pitch + 4 * DEG, 0.05, PITCH_LIMIT);
                wake();
                event.preventDefault();
            }
            return;
        }

        const move = moves[event.key];
        if (!move) return;
        event.preventDefault();

        const cells = cellsRef.current;
        const current = cells[sim.current.hovered] ?? cells[0];
        if (!current) return;

        const nextColX = current.colX + move[0];
        const nextRowZ = current.rowZ + move[1];

        const next = cells.find((c) => c.colX === nextColX && c.rowZ === nextRowZ);
        if (next) {
            const rect = canvasRef.current?.getBoundingClientRect();
            const p = getPose();
            const [px, py] = projectPoint(
                p,
                next.colX - layout.totalWidth / 2,
                next.baseHeight,
                next.rowZ - DAYS / 2
            );
            const clientPos = rect
                ? { x: rect.left + px, y: rect.top + py }
                : null;
            handleHover(next, clientPos);
        }
    };

    return (
        <div
            ref={containerRef}
            className={cn('w-full overflow-x-auto py-2 select-none', className)}
        >
            <div className="min-w-[720px] sm:min-w-0 w-full relative">
                <canvas
                    ref={canvasRef}
                    role="img"
                    tabIndex={0}
                    aria-label={`3D Activity Terrain for ${selectedYear}. Use arrow keys to navigate days, drag to rotate.`}
                    className={cn(
                        'block h-64 sm:h-72 w-full touch-pan-y outline-none rounded-lg focus-visible:ring-2 focus-visible:ring-primary/40',
                        dragging ? 'cursor-grabbing' : 'cursor-grab'
                    )}
                    onKeyDown={handleKeyDown}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerLeave}
                    onPointerCancel={handlePointerUp}
                    onLostPointerCapture={handlePointerUp}
                    onBlur={() => {
                        if (!sim.current.drag) {
                            handleHover(null, null);
                        }
                    }}
                />
            </div>
        </div>
    );
};
