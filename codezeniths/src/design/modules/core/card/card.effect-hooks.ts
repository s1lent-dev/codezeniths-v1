'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    useMotionTemplate,
    useMotionValue,
    useSpring,
    useTransform,
} from 'motion/react';
import { useCardContext } from './card.utils';
import type {
    CanvasEffectProps,
    CometEffectProps,
    GradientHoverEffectProps,
    MagicEffectProps,
} from './card.types';

// ─────────────────────────────────────────────────────────────
// Hook: usePerspectiveChild
// ─────────────────────────────────────────────────────────────
interface UsePerspectiveChildProps {
    translateX?: number | string;
    translateY?: number | string;
    translateZ?: number | string;
    rotateX?: number | string;
    rotateY?: number | string;
    rotateZ?: number | string;
}

export function usePerspectiveChild({
    translateX = 0,
    translateY = 0,
    translateZ = 0,
    rotateX = 0,
    rotateY = 0,
    rotateZ = 0,
}: UsePerspectiveChildProps) {
    const { isMouseEntered } = useCardContext();
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) {return;}
        if (isMouseEntered) {
            ref.current.style.transform = `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
        } else {
            ref.current.style.transform =
                'translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)';
        }
    }, [isMouseEntered, translateX, translateY, translateZ, rotateX, rotateY, rotateZ]);

    return ref;
}

// ─────────────────────────────────────────────────────────────
// Hook: useCometEffect
// ─────────────────────────────────────────────────────────────
export function useCometEffect({
    rotateDepth = 17.5,
    translateDepth = 20,
}: CometEffectProps) {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(
        mouseYSpring,
        [-0.5, 0.5],
        [`-${rotateDepth}deg`, `${rotateDepth}deg`],
    );
    const rotateY = useTransform(
        mouseXSpring,
        [-0.5, 0.5],
        [`${rotateDepth}deg`, `-${rotateDepth}deg`],
    );
    const translateX = useTransform(
        mouseXSpring,
        [-0.5, 0.5],
        [`-${translateDepth}px`, `${translateDepth}px`],
    );
    const translateY = useTransform(
        mouseYSpring,
        [-0.5, 0.5],
        [`${translateDepth}px`, `-${translateDepth}px`],
    );
    const glareX = useTransform(mouseXSpring, [-0.5, 0.5], [0, 100]);
    const glareY = useTransform(mouseYSpring, [-0.5, 0.5], [0, 100]);
    const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.9) 10%, rgba(255,255,255,0.75) 20%, rgba(255,255,255,0) 80%)`;

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) {return;}
        const rect = ref.current.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
    }, [x, y]);

    const handleMouseLeave = useCallback(() => {
        x.jump(0);
        y.jump(0);
    }, [x, y]);

    return {
        ref,
        rotateX,
        rotateY,
        translateX,
        translateY,
        glareBackground,
        handleMouseMove,
        handleMouseLeave,
    };
}

// ─────────────────────────────────────────────────────────────
// Hook: useMagicBackgroundEffect
// ─────────────────────────────────────────────────────────────
export function useMagicBackgroundEffect({
    gradientSize = 200,
    gradientColor = '#262626',
    gradientFrom = '#9E7AFF',
    gradientTo = '#FE8BBB',
}: MagicEffectProps) {
    const mouseX = useMotionValue(-gradientSize);
    const mouseY = useMotionValue(-gradientSize);
    const overlayRef = useRef<HTMLDivElement>(null);

    const reset = useCallback(() => {
        mouseX.set(-gradientSize);
        mouseY.set(-gradientSize);
    }, [gradientSize, mouseX, mouseY]);

    useEffect(() => {
        reset();
    }, [reset]);

    useEffect(() => {
        const handlePointerOut = (e: PointerEvent) => { if (!e.relatedTarget) {reset();} };
        const handleVisibility = () => { if (document.visibilityState !== 'visible') {reset();} };
        window.addEventListener('pointerout', handlePointerOut);
        window.addEventListener('blur', reset);
        document.addEventListener('visibilitychange', handleVisibility);
        return () => {
            window.removeEventListener('pointerout', handlePointerOut);
            window.removeEventListener('blur', reset);
            document.removeEventListener('visibilitychange', handleVisibility);
        };
    }, [reset]);

    useEffect(() => {
        const parent = overlayRef.current?.parentElement;
        if (!parent) {return;}
        const handleMove = (e: PointerEvent) => {
            const rect = parent.getBoundingClientRect();
            mouseX.set(e.clientX - rect.left);
            mouseY.set(e.clientY - rect.top);
        };
        parent.addEventListener('pointermove', handleMove as EventListener);
        parent.addEventListener('pointerleave', reset as EventListener);
        parent.addEventListener('pointerenter', reset as EventListener);
        return () => {
            parent.removeEventListener('pointermove', handleMove as EventListener);
            parent.removeEventListener('pointerleave', reset as EventListener);
            parent.removeEventListener('pointerenter', reset as EventListener);
        };
    }, [mouseX, mouseY, reset]);

    const borderGlowBackground = useMotionTemplate`
        radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px,
        ${gradientFrom}, ${gradientTo}, transparent 100%)
    `;

    const innerSpotlightBackground = useMotionTemplate`
        radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px, ${gradientColor}, transparent 100%)
    `;

    return {
        overlayRef,
        borderGlowBackground,
        innerSpotlightBackground,
    };
}

// ─────────────────────────────────────────────────────────────
// Hook: useCanvasRevealEffect
// ─────────────────────────────────────────────────────────────
export function useCanvasRevealEffect({
    radius = 350,
}: CanvasEffectProps) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const [isHovering, setIsHovering] = useState(false);
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const parent = overlayRef.current?.parentElement;
        if (!parent) {return;}
        const handleMove = (e: MouseEvent) => {
            const { left, top } = parent.getBoundingClientRect();
            mouseX.set(e.clientX - left);
            mouseY.set(e.clientY - top);
        };
        const handleEnter = () => setIsHovering(true);
        const handleLeave = () => setIsHovering(false);
        parent.addEventListener('mousemove', handleMove);
        parent.addEventListener('mouseenter', handleEnter);
        parent.addEventListener('mouseleave', handleLeave);
        return () => {
            parent.removeEventListener('mousemove', handleMove);
            parent.removeEventListener('mouseenter', handleEnter);
            parent.removeEventListener('mouseleave', handleLeave);
        };
    }, [mouseX, mouseY]);

    const maskImage = useMotionTemplate`
        radial-gradient(
            ${radius}px circle at ${mouseX}px ${mouseY}px,
            white, transparent 80%
        )
    `;

    return {
        overlayRef,
        isHovering,
        maskImage,
    };
}

// ─────────────────────────────────────────────────────────────
// Hook: useGradientHoverBorderEffect
// ─────────────────────────────────────────────────────────────
export function useGradientHoverBorderEffect({
    gradientColor = '#6A7CFF',
    gradientSize = 150,
}: GradientHoverEffectProps) {
    const mouseX = useMotionValue(-gradientSize);
    const mouseY = useMotionValue(-gradientSize);
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const parent = overlayRef.current?.parentElement;
        if (!parent) {return;}
        const handleMove = (e: PointerEvent) => {
            const rect = parent.getBoundingClientRect();
            mouseX.set(e.clientX - rect.left);
            mouseY.set(e.clientY - rect.top);
        };
        const handleLeave = () => {
            mouseX.set(-gradientSize);
            mouseY.set(-gradientSize);
        };
        parent.addEventListener('pointermove', handleMove as EventListener);
        parent.addEventListener('pointerleave', handleLeave);
        return () => {
            parent.removeEventListener('pointermove', handleMove as EventListener);
            parent.removeEventListener('pointerleave', handleLeave);
        };
    }, [mouseX, mouseY, gradientSize]);

    const background = useMotionTemplate`radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px, ${gradientColor}, transparent 80%)`;

    return {
        overlayRef,
        background,
    };
}

// ─────────────────────────────────────────────────────────────
// Hook: useInteractive3DWrapperEffect
// ─────────────────────────────────────────────────────────────
export function useInteractive3DWrapperEffect({
    maxRotation = 15,
    glareOpacity = 0.6,
}: import('./card.types').Interactive3DEffectProps) {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
    const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [`${maxRotation}deg`, `-${maxRotation}deg`]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [`-${maxRotation}deg`, `${maxRotation}deg`]);
    
    // Glare effect movement
    const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["100%", "-100%"]);
    const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["100%", "-100%"]);
    
    // Using opacity via template so we can scale it
    const opacityTransform = useTransform(x, [-0.5, 0, 0.5], [glareOpacity, 0, glareOpacity]);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) {return;}
        const rect = ref.current.getBoundingClientRect();
        
        const width = rect.width || 1;
        const height = rect.height || 1;
        
        let newX = (e.clientX - rect.left) / width - 0.5;
        let newY = (e.clientY - rect.top) / height - 0.5;
        
        x.set(newX);
        y.set(newY);
    }, [x, y]);

    const handleMouseLeave = useCallback(() => {
        x.jump(0);
        y.jump(0);
    }, [x, y]);

    return {
        ref,
        rotateX,
        rotateY,
        glareX,
        glareY,
        opacityTransform,
        handleMouseMove,
        handleMouseLeave,
    };
}
