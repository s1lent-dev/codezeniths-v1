'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type {
    Direction,
    GradientHoverEffectProps,
    PulsatingEffectProps,
    RippleEffectProps,
    RippleState,
    ShimmerEffectProps,
    ThemeColor,
} from './button.types';

export function useShimmerEffect(props: ShimmerEffectProps) {
    const {
        shimmerColor: propShimmerColor,
        shimmerSize = '0.05em',
        shimmerDuration = '3s',
        background: propBackground,
    } = props;

    const [isDark, setIsDark] = useState<boolean>(false);

    useEffect(() => {
        const htmlElement = document.documentElement;

        const updateTheme = () => {
            setIsDark(htmlElement.classList.contains('dark'));
        };

        updateTheme();

        const observer = new MutationObserver(updateTheme);
        observer.observe(htmlElement, {
            attributes: true,
            attributeFilter: ['class'],
        });

        return () => observer.disconnect();
    }, []);

    const defaultShimmerColor = isDark ? '#a78bfa' : '#7c3aed';
    const defaultBackground = isDark ? '#1C2136' : '#e1def7';

    const resolveColor = (colorProp?: ThemeColor, fallback?: string): string => {
        if (!colorProp) return fallback || '';
        if (typeof colorProp === 'string') return colorProp;
        return isDark ? colorProp.dark : colorProp.light;
    };

    const finalShimmerColor = resolveColor(propShimmerColor, defaultShimmerColor);
    const finalBackground = resolveColor(propBackground, defaultBackground);

    const style = useMemo(() => ({
        '--spread': '90deg',
        '--shimmer-color': finalShimmerColor,
        '--speed': shimmerDuration,
        '--cut': shimmerSize,
        '--bg': finalBackground,
    } as React.CSSProperties), [finalShimmerColor, shimmerDuration, shimmerSize, finalBackground]);

    return { style };
}

export function useRippleEffect(props: RippleEffectProps) {
    const { rippleColor = '#ffffff', rippleDuration = '600ms' } = props;
    const [buttonRipples, setButtonRipples] = useState<Array<RippleState>>([]);

    useEffect(() => {
        if (buttonRipples.length > 0) {
            const lastRipple = buttonRipples[buttonRipples.length - 1];
            const timeout = setTimeout(() => {
                setButtonRipples((prevRipples) =>
                    prevRipples.filter((ripple) => ripple.key !== lastRipple?.key),
                );
            }, parseInt(rippleDuration));
            return () => clearTimeout(timeout);
        }
    }, [buttonRipples, rippleDuration]);

    const createRipple = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        const button = event.currentTarget;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        // Fix 5: Verify crypto.randomUUID() is used for ripple IDs
        const uuid = typeof crypto !== 'undefined' && crypto.randomUUID 
            ? crypto.randomUUID() 
            : Math.random().toString(36).substring(2);
        const newRipple = { x, y, size, key: uuid };
        setButtonRipples((prevRipples) => [...prevRipples, newRipple]);
    }, []);

    return { buttonRipples, rippleColor, rippleDuration, createRipple };
}

export function usePulsatingEffect(props: PulsatingEffectProps) {
    const { pulseColor = '#808080', pulseDuration = '1.5s' } = props;

    const style = useMemo(() => ({
        '--pulse-color': pulseColor,
        '--duration': pulseDuration,
    } as React.CSSProperties), [pulseColor, pulseDuration]);

    return { style };
}

export function useGradientHoverEffect(props: GradientHoverEffectProps) {
    const {
        duration = 1,
        clockwise = false,
        highlightColor = '#a78bfa',
        gradients,
    } = props;

    const [hovered, setHovered] = useState(false);
    const [direction, setDirection] = useState<Direction>('TOP');
    const directions = useMemo(() => ['TOP', 'RIGHT', 'BOTTOM', 'LEFT'] as const, []);

    const rotateDirection = useCallback((current: Direction): Direction => {
        const idx = directions.indexOf(current);
        const nextIdx = clockwise
            ? (idx - 1 + directions.length) % directions.length
            : (idx + 1) % directions.length;
        return directions[nextIdx];
    }, [clockwise, directions]);

    useEffect(() => {
        if (!hovered) {
            const interval = setInterval(() => {
                setDirection((prev) => rotateDirection(prev));
            }, duration * 1000);
            return () => clearInterval(interval);
        }
    }, [hovered, duration, rotateDirection]);

    const movingMap = useMemo(() => ({
        TOP: gradients?.TOP || `radial-gradient(20.7% 50% at 50% 0%, ${highlightColor} 0%, transparent 100%)`,
        RIGHT: gradients?.RIGHT || `radial-gradient(16.2% 41.2% at 100% 50%, ${highlightColor} 0%, transparent 100%)`,
        BOTTOM: gradients?.BOTTOM || `radial-gradient(20.7% 50% at 50% 100%, ${highlightColor} 0%, transparent 100%)`,
        LEFT: gradients?.LEFT || `radial-gradient(16.6% 43.1% at 0% 50%, ${highlightColor} 0%, transparent 100%)`,
    }), [gradients, highlightColor]);

    const highlight = useMemo(() => `radial-gradient(75% 181% at 50% 50%, ${highlightColor} 0%, transparent 100%)`, [highlightColor]);

    return {
        hovered,
        setHovered,
        direction,
        movingMap,
        highlight,
        duration,
    };
}
