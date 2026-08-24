'use client';
/** @imports */
import type { Transition } from 'motion/react';
import type React from 'react';
import type { Container, Typography } from '@codezeniths/components';

/** @enums */
enum CardVariant {
    DEFAULT = 'default',
    OUTLINED = 'outlined',
    GHOST = 'ghost',
    ELEVATED = 'elevated',
    GLASS = 'glass',
    FLAT = 'flat',
}

enum CardSize {
    XS = 'xs',
    SM = 'sm',
    DEFAULT = 'default',
    LG = 'lg',
    XL = 'xl',
}

/**
 * Layer 0 — Child propagation effects.
 * These are effects that require the card root to propagate
 * transform/state information down into each sub-component child.
 * Sub-components self-wrap using the ChildEffectRenderer when this is active.
 *
 * Currently: PERSPECTIVE
 * Future additions (PARALLAX, TILT_DEPTH, etc.) go here —
 * no changes needed in any sub-component file.
 */
enum CardChildEffect {
    NONE = 'none',
    PERSPECTIVE = 'perspective',
    // Future: PARALLAX = 'parallax', TILT_DEPTH = 'tilt_depth'
}

enum CardWrapperEffect {
    NONE = 'none',
    COMET = 'comet',
    PERSPECTIVE = 'perspective',
    FLOAT = 'float',
    INTERACTIVE_3D = 'interactive_3d',
}

enum CardBackgroundEffect {
    NONE = 'none',
    MAGIC = 'magic',
    CANVAS_REVEAL = 'canvas_reveal',
    AURORA = 'aurora',
}

enum CardBorderEffect {
    BORDER_BEAM = 'border_beam',
    GRADIENT_BORDER = 'gradient_border',
    GRADIENT_HOVER = 'gradient_hover',
}

// ─────────────────────────────────────────────────────────────
// @props — Layer 0 child effect
// ─────────────────────────────────────────────────────────────

/** Config for the perspective child effect (container-level) */
interface PerspectiveChildEffectProps {
    perspective?: number | undefined;
}

/**
 * Per-item override props consumed by ChildEffectRenderer.
 * Each sub-component accepts `childEffectItemProps` to override its
 * slot defaults for the active Layer 0 effect.
 * Typed generically so it works for present and future child effects.
 */
interface ChildEffectItemProps {
    translateX?: number | string | undefined;
    translateY?: number | string | undefined;
    translateZ?: number | string | undefined;
    rotateX?: number | string | undefined;
    rotateY?: number | string | undefined;
    rotateZ?: number | string | undefined;
    [key: string]: unknown;
}

// ─────────────────────────────────────────────────────────────
// @props — Layer 1: Wrapper effects
// ─────────────────────────────────────────────────────────────

/** CometEffectProps */
interface CometEffectProps {
    rotateDepth?: number | undefined;
    translateDepth?: number | undefined;
    glare?: boolean | undefined;
    glareOpacity?: number | undefined;
}

/** PerspectiveEffectItemProps — direct 3D item control (for CardItem-style usage) */
interface PerspectiveEffectItemProps {
    as?: React.ElementType | undefined;
    children?: React.ReactNode | undefined;
    className?: string | undefined;
    translateX?: number | string | undefined;
    translateY?: number | string | undefined;
    translateZ?: number | string | undefined;
    rotateX?: number | string | undefined;
    rotateY?: number | string | undefined;
    rotateZ?: number | string | undefined;
    [key: string]: unknown;
}

/** PerspectiveEffectProps — wrapper-level perspective config */
interface PerspectiveEffectProps {
    perspective?: number | undefined;
}

/** FloatEffectProps */
interface FloatEffectProps {
    floatAmount?: number | undefined;
    shadowIntensity?: number | undefined;
    duration?: number | undefined;
}

/** Interactive3DEffectProps */
interface Interactive3DEffectProps {
    maxRotation?: number | undefined;
    glareOpacity?: number | undefined;
}

// ─────────────────────────────────────────────────────────────
// @props — Layer 2: Background effects
// ─────────────────────────────────────────────────────────────

/** MagicEffectProps */
interface MagicEffectProps {
    gradientRadius?: number | undefined;
    gradientColor?: string | undefined;
    gradientFrom?: string | undefined;
    gradientTo?: string | undefined;
    gradientSize?: number | undefined;
    gradientOpacity?: number | undefined;
}

/** CanvasEffectProps */
interface CanvasEffectProps {
    radius?: number | undefined;
    color?: string | undefined;
    dotSize?: number | undefined;
    animationSpeed?: number | undefined;
    canvasColors?: Array<[number, number, number]> | undefined;
}

/** AuroraBackgroundEffectProps */
interface AuroraBackgroundEffectProps {
    primaryColor?: string;
    secondaryColor?: string;
    tertiaryColor?: string;
    duration?: number;
    opacity?: number;
    blur?: number;
}

// ─────────────────────────────────────────────────────────────
// @props — Layer 3: Border effects
// ─────────────────────────────────────────────────────────────

/** BorderBeamEffectProps */
interface BorderBeamEffectProps {
    className?: string;
    size?: number;
    duration?: number;
    delay?: number;
    colorFrom?: string;
    colorTo?: string;
    transition?: Transition;
    reverse?: boolean;
    style?: React.CSSProperties;
    initialOffset?: number;
    borderWidth?: number;
}

/** GradientBorderEffectProps */
interface GradientBorderEffectProps {
    borderWidth?: number | undefined;
    duration?: number | undefined;
    shineColor?: string | Array<string> | undefined;
}

/** GradientHoverEffectProps */
interface GradientHoverEffectProps {
    gradientColor?: string | undefined;
    gradientSize?: number | undefined;
    gradientOpacity?: number | undefined;
    borderWidth?: number | undefined;
}

// ─────────────────────────────────────────────────────────────
// @props — Composite effect config
// ─────────────────────────────────────────────────────────────

interface CardEffectConfig {
    /**
     * Layer 0 — child propagation effect.
     * When set, sub-components auto-wrap themselves via ChildEffectRenderer.
     * Each sub-component can override its defaults via `childEffectItemProps`.
     */
    childEffect?: CardChildEffect | undefined;
    childEffectProps?: {
        [CardChildEffect.PERSPECTIVE]?: PerspectiveChildEffectProps;
    } | undefined;

    /** Layer 1 — wraps the entire card externally */
    wrapperEffect?: CardWrapperEffect | undefined;
    wrapperEffectProps?: {
        [CardWrapperEffect.COMET]?: CometEffectProps;
        [CardWrapperEffect.PERSPECTIVE]?: PerspectiveEffectProps;
        [CardWrapperEffect.FLOAT]?: FloatEffectProps;
        [CardWrapperEffect.INTERACTIVE_3D]?: Interactive3DEffectProps;
    } | undefined;

    /** Layer 2 — absolute background inside the card */
    backgroundEffect?: CardBackgroundEffect;
    backgroundEffectProps?: {
        [CardBackgroundEffect.MAGIC]?: MagicEffectProps;
        [CardBackgroundEffect.CANVAS_REVEAL]?: CanvasEffectProps;
        [CardBackgroundEffect.AURORA]?: AuroraBackgroundEffectProps;
    } | undefined;

    /** Layer 3 — absolute border inside the card */
    borderEffect?: CardBorderEffect | undefined;
    borderEffectProps?: {
        [CardBorderEffect.BORDER_BEAM]?: BorderBeamEffectProps;
        [CardBorderEffect.GRADIENT_BORDER]?: GradientBorderEffectProps;
        [CardBorderEffect.GRADIENT_HOVER]?: GradientHoverEffectProps;
    } | undefined;
}

// ─────────────────────────────────────────────────────────────
// @props — Sub-component props
// Each sub-component accepts `childEffectItemProps` to customise
// its Layer 0 effect transform. The rest are standard HTML props.
// ─────────────────────────────────────────────────────────────

type CardHeaderProps = React.ComponentProps<typeof Container> & {
    childEffectItemProps?: ChildEffectItemProps;
};
type CardTitleProps = React.ComponentProps<typeof Typography> & {
    childEffectItemProps?: ChildEffectItemProps;
};
type CardDescriptionProps = React.ComponentProps<typeof Typography> & {
    childEffectItemProps?: ChildEffectItemProps;
};
type CardActionProps = React.ComponentProps<typeof Container> & {
    childEffectItemProps?: ChildEffectItemProps;
};
type CardContentProps = React.ComponentProps<typeof Container> & {
    childEffectItemProps?: ChildEffectItemProps;
};
type CardFooterProps = React.ComponentProps<typeof Container> & {
    childEffectItemProps?: ChildEffectItemProps;
};

/** PerspectiveWrapperItemProps - for internal CardItem use */
interface PerspectiveWrapperItemProps {
    as?: React.ElementType;
    children?: React.ReactNode;
    className?: string;
    translateX?: number | string;
    translateY?: number | string;
    translateZ?: number | string;
    rotateX?: number | string;
    rotateY?: number | string;
    rotateZ?: number | string;
    perspectiveItemProps?: PerspectiveEffectItemProps;
    [key: string]: unknown;
}

// ─────────────────────────────────────────────────────────────
// @props — Effect renderer props
// ─────────────────────────────────────────────────────────────

interface WrapperEffectRendererProps {
    effect: CardWrapperEffect;
    effectProps?: CometEffectProps | PerspectiveEffectProps | FloatEffectProps | Interactive3DEffectProps;
    children: React.ReactNode;
    className?: string | undefined;
}

interface BackgroundEffectRendererProps {
    effect: CardBackgroundEffect;
    effectProps?: MagicEffectProps | CanvasEffectProps | AuroraBackgroundEffectProps;
}

interface BorderEffectRendererProps {
    effect: CardBorderEffect;
    effectProps?: BorderBeamEffectProps | GradientBorderEffectProps | GradientHoverEffectProps;
}

/**
 * ChildEffectRendererProps — Layer 0 generic renderer interface.
 * The renderer switches on `effect` to apply the right wrapping strategy.
 * `slot` drives per-slot defaults. `itemProps` overrides them.
 */
interface ChildEffectRendererProps {
    effect: CardChildEffect;
    effectProps?: PerspectiveChildEffectProps;
    itemProps?: ChildEffectItemProps;
    slot: CardSubComponentSlot;
    children: React.ReactNode;
    className?: string;
}

/**
 * Named slots for all card sub-components.
 * Used by the Layer 0 system to resolve per-slot default transforms.
 * When adding a new sub-component, add its slot name here and add
 * its defaults in `getChildEffectSlotDefaults()` in card.utils.ts.
 */
type CardSubComponentSlot =
    | 'header'
    | 'title'
    | 'description'
    | 'content'
    | 'footer'
    | 'action'
    | 'image';

// ─────────────────────────────────────────────────────────────
// @props — Base card
// ─────────────────────────────────────────────────────────────

interface BaseCardProps extends Omit<React.ComponentProps<'div'>, 'size'> {
    variant?: CardVariant;
    size?: CardSize;
    effectConfig?: CardEffectConfig;
}

// ─────────────────────────────────────────────────────────────
// @context
// ─────────────────────────────────────────────────────────────

interface CardContextValue {
    /** Layer 0 — active child propagation effect */
    childEffect: CardChildEffect;
    /** Layer 0 — config for the active child effect (e.g. { perspective: 1000 }) */
    childEffectProps?: PerspectiveChildEffectProps;
    /** Layer 0 / Layer 1 — whether mouse is currently entered (drives perspective transforms) */
    isMouseEntered: boolean;
    setIsMouseEntered: React.Dispatch<React.SetStateAction<boolean>>;
    /** Layer 1 — active wrapper effect */
    wrapperEffect: CardWrapperEffect;
    /** The card size — consumed by all sub-components for spacing */
    size: CardSize;
    /** The card variant */
    variant: CardVariant;
}

// ─────────────────────────────────────────────────────────────
// @exports
// ─────────────────────────────────────────────────────────────

export {
    CardVariant,
    CardSize,
    CardChildEffect,
    CardWrapperEffect,
    CardBackgroundEffect,
    CardBorderEffect,
};

export type {
    PerspectiveChildEffectProps,
    ChildEffectItemProps,
    ChildEffectRendererProps,
    CardSubComponentSlot,
    CometEffectProps,
    PerspectiveEffectProps,
    PerspectiveEffectItemProps,
    FloatEffectProps,
    Interactive3DEffectProps,
    MagicEffectProps,
    CanvasEffectProps,
    AuroraBackgroundEffectProps,
    BorderBeamEffectProps,
    GradientBorderEffectProps,
    GradientHoverEffectProps,
    CardEffectConfig,
    CardHeaderProps,
    CardTitleProps,
    CardDescriptionProps,
    CardActionProps,
    CardContentProps,
    CardFooterProps,
    PerspectiveWrapperItemProps,
    WrapperEffectRendererProps,
    BackgroundEffectRendererProps,
    BorderEffectRendererProps,
    BaseCardProps,
    CardContextValue,
};