'use client';

import { createContext, useContext, useRef } from 'react';
import {
    CardBackgroundEffect,
    CardBorderEffect,
    CardChildEffect,
    CardSize,
    CardVariant,
    CardWrapperEffect,
} from './card.types';
import type {
    CardContextValue,
    CardEffectConfig,
    CardSubComponentSlot,
    ChildEffectItemProps,
} from './card.types';
import type React from 'react';


// ─────────────────────────────────────────────────────────────
// CardContext
// Provides card-wide state to all sub-components.
// ─────────────────────────────────────────────────────────────

export const CardContext = createContext<CardContextValue>({
    childEffect: CardChildEffect.NONE,
    childEffectProps: undefined,
    isMouseEntered: false,
    setIsMouseEntered: () => undefined,
    wrapperEffect: CardWrapperEffect.NONE,
    size: CardSize.DEFAULT,
    variant: CardVariant.DEFAULT,
});

CardContext.displayName = 'CardContext';


// ─────────────────────────────────────────────────────────────
// useCardContext — safe context consumer
// ─────────────────────────────────────────────────────────────

export function useCardContext(): CardContextValue {
    const context = useContext(CardContext);
    return context;
}


// ─────────────────────────────────────────────────────────────
// getChildEffectSlotDefaults
// Returns the default ChildEffectItemProps for a given slot
// under the active child effect. This is the ONLY place you
// need to touch when adding a new child effect or a new slot.
//
// Structure:
//   effect → slot → defaults
//
// Adding a new child effect: add a new `case CardChildEffect.NEW_EFFECT` block.
// Adding a new sub-component slot: add its key to each existing effect block.
// ─────────────────────────────────────────────────────────────

export function getChildEffectSlotDefaults(
    effect: CardChildEffect,
    slot: CardSubComponentSlot,
): ChildEffectItemProps {
    switch (effect) {
        case CardChildEffect.PERSPECTIVE:
            // Z-depth per slot — title floats highest, footer stays grounded.
            // These create the parallax depth layering on mouse hover.
            switch (slot) {
                case 'header':      return { translateZ: 40 };
                case 'title':       return { translateZ: 40 };
                case 'description': return { translateZ: 30 };
                case 'content':     return { translateZ: 75 };
                case 'footer':      return { translateZ: 60 };
                case 'action':      return { translateZ: 50 };
                case 'image':       return { translateZ: 75 };
                default:            return { translateZ: 20 };
            }

            // Future child effects — add cases here:
            // case CardChildEffect.PARALLAX:
            //     switch (slot) { ... }

        case CardChildEffect.NONE:
        default:
            return {};
    }
}


// ─────────────────────────────────────────────────────────────
// resolveEffectConfig
// Safely unpacks effectConfig into flat named values used by Card.
// ─────────────────────────────────────────────────────────────

export function resolveEffectConfig(effectConfig?: CardEffectConfig) {
    const childEffect = effectConfig?.childEffect ?? CardChildEffect.NONE;
    const childEffectProps = effectConfig?.childEffectProps?.[CardChildEffect.PERSPECTIVE];

    const wrapperEffect = effectConfig?.wrapperEffect ?? CardWrapperEffect.NONE;
    const backgroundEffect = effectConfig?.backgroundEffect ?? CardBackgroundEffect.NONE;
    const borderEffect = effectConfig?.borderEffect ?? undefined;

    const cometProps = effectConfig?.wrapperEffectProps?.[CardWrapperEffect.COMET];
    const perspectiveWrapperProps = effectConfig?.wrapperEffectProps?.[CardWrapperEffect.PERSPECTIVE];
    const floatProps = effectConfig?.wrapperEffectProps?.[CardWrapperEffect.FLOAT];
    const interactive3DProps = effectConfig?.wrapperEffectProps?.[CardWrapperEffect.INTERACTIVE_3D];

    const magicProps = effectConfig?.backgroundEffectProps?.[CardBackgroundEffect.MAGIC];
    const canvasProps = effectConfig?.backgroundEffectProps?.[CardBackgroundEffect.CANVAS_REVEAL];
    const auroraProps = effectConfig?.backgroundEffectProps?.[CardBackgroundEffect.AURORA];

    const borderBeamProps = effectConfig?.borderEffectProps?.[CardBorderEffect.BORDER_BEAM];
    const gradientBorderProps = effectConfig?.borderEffectProps?.[CardBorderEffect.GRADIENT_BORDER];
    const gradientHoverProps = effectConfig?.borderEffectProps?.[CardBorderEffect.GRADIENT_HOVER];

    return {
        childEffect,
        childEffectProps,
        wrapperEffect,
        backgroundEffect,
        borderEffect,
        cometProps,
        perspectiveWrapperProps,
        floatProps,
        interactive3DProps,
        magicProps,
        canvasProps,
        auroraProps,
        borderBeamProps,
        gradientBorderProps,
        gradientHoverProps,
    };
}


// ─────────────────────────────────────────────────────────────
// usePerspectiveContainer
// Tracks mouse position and drives CSS 3D rotation on the card.
// Used by the PerspectiveWrapperEffect and Card root when
// childEffect === PERSPECTIVE.
// ─────────────────────────────────────────────────────────────

// card.utils.ts
export function usePerspectiveContainer() {
    const containerRef = useRef<HTMLDivElement>(null);
    const currentX = useRef(0);
    const currentY = useRef(0);
    const rafId = useRef<number>(0);

    function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

    function animate(targetX: number, targetY: number) {
        currentX.current = lerp(currentX.current, targetX, 0.08);
        currentY.current = lerp(currentY.current, targetY, 0.08);
        if (containerRef.current) {
            containerRef.current.style.transform = 
                `rotateY(${currentX.current}deg) rotateX(${currentY.current}deg)`;
        }
        if (Math.abs(currentX.current - targetX) > 0.01 || 
            Math.abs(currentY.current - targetY) > 0.01) {
            rafId.current = requestAnimationFrame(() => animate(targetX, targetY));
        }
    }

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        if (!containerRef.current) {return;}
        const { left, top, width, height } = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - left - width / 2) / 12;
        const y = (e.clientY - top - height / 2) / 12;
        cancelAnimationFrame(rafId.current);
        rafId.current = requestAnimationFrame(() => animate(x, -y));
    }

    function handleMouseLeave() {
        cancelAnimationFrame(rafId.current);
        rafId.current = requestAnimationFrame(() => animate(0, 0));
    }

    return { containerRef, handleMouseMove, handleMouseLeave };
}

// ─────────────────────────────────────────────────────────────
// mergeChildEffectItemProps
// Merges slot defaults with consumer-provided overrides.
// Consumer props always win.
// ─────────────────────────────────────────────────────────────

export function mergeChildEffectItemProps(
    defaults: ChildEffectItemProps,
    overrides?: ChildEffectItemProps,
): ChildEffectItemProps {
    if (!overrides) {return defaults;}
    return { ...defaults, ...overrides };
}