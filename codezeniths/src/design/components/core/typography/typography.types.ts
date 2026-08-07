
/** @imports */
import type React from 'react';
import type { ReactNode } from 'react';

/** @enums */
enum TypographyVariant {
    H1 = 'h1',
    H2 = 'h2',
    H3 = 'h3',
    H4 = 'h4',
    H5 = 'h5',
    H6 = 'h6',
    P = 'p',
    SPAN = 'span',
    LABEL = 'label',
    CAPTION = 'caption',
    MUTED = 'muted',
    LEAD = 'lead',
    BLOCKQUOTE = 'blockquote',
    CODE = 'code',
    LEGEND = 'legend',
}

enum TypographyWeight {
    EXTRATHIN = 'extrathin',
    THIN = 'thin',
    EXTRALIGHT = 'extralight',
    LIGHT = 'light',
    NORMAL = 'normal',
    MEDIUM = 'medium',
    SEMIBOLD = 'semibold',
    BOLD = 'bold',
    EXTRABOLD = 'extrabold',
    SUPERBOLD = 'superbold',
}

enum TypographyAlign {
    LEFT = 'left',
    CENTER = 'center',
    RIGHT = 'right',
    JUSTIFY = 'justify',
}

enum TypographyColor {
    DEFAULT = 'default',
    HEADING = 'heading',
    BODY = 'body',
    MUTED = 'muted',
    PRIMARY = 'primary',
    SECONDARY = 'secondary',
    DESTRUCTIVE = 'destructive',
    SUCCESS = 'success',
    WARNING = 'warning',
    INFO = 'info',
}

enum TypographyFont {
    SANS = 'sans',
    SERIF = 'serif',
    MONO = 'mono',
    LOGO = 'logo',
}

enum TypographyEffect {
    NONE = 'none',
    AURORA = 'aurora',
    SHINY = 'shiny',
    GRADIENT = 'gradient',
    MORPHING = 'morphing',
    TYPING = 'typing',
    ANIMATE = 'animate',
}

/** @prop_interfaces */

// Aurora effect props
interface AuroraEffectProps {
    colors?: Array<string>;
    speed?: number;
}

// Shiny effect props
interface ShinyEffectProps {
    shimmerWidth?: number;
}

// Gradient effect props
interface GradientEffectProps {
    speed?: number;
    colorFrom?: string;
    colorTo?: string;
}

// Morphing effect props
interface MorphingEffectProps {
    texts: Array<string>;
}

// Typing animation props
interface TypingEffectProps {
    words?: Array<string>;
    typeSpeed?: number;
    deleteSpeed?: number;
    delay?: number;
    pauseDelay?: number;
    loop?: boolean;
    showCursor?: boolean;
    blinkCursor?: boolean;
    cursorStyle?: 'line' | 'block' | 'underscore';
}

// Text animate props
type AnimationType = 'text' | 'word' | 'character' | 'line';
type AnimationVariant =
    | 'fadeIn'
    | 'blurIn'
    | 'blurInUp'
    | 'blurInDown'
    | 'slideUp'
    | 'slideDown'
    | 'slideLeft'
    | 'slideRight'
    | 'scaleUp'
    | 'scaleDown';

interface AnimateEffectProps {
    delay?: number;
    duration?: number;
    by?: AnimationType;
    animation?: AnimationVariant;
    startOnView?: boolean;
    once?: boolean;
}

// Effect Props Union
type EffectProps =
    | { effect?: TypographyEffect.NONE }
    | ({ effect: TypographyEffect.AURORA } & AuroraEffectProps)
    | ({ effect: TypographyEffect.SHINY } & ShinyEffectProps)
    | ({ effect: TypographyEffect.GRADIENT } & GradientEffectProps)
    | ({ effect: TypographyEffect.MORPHING } & MorphingEffectProps)
    | ({ effect: TypographyEffect.TYPING } & TypingEffectProps)
    | ({ effect: TypographyEffect.ANIMATE } & AnimateEffectProps);

// Base Typography Props
interface BaseTypographyProps extends Omit<React.AllHTMLAttributes<HTMLElement>, 'as'> {
    variant?: TypographyVariant;
    weight?: TypographyWeight;
    align?: TypographyAlign;
    color?: TypographyColor;
    font?: TypographyFont;
    className?: string;
    children?: ReactNode;
    as?: React.ElementType;
    truncate?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
}

// Complete Typography Props
type TypographyProps = BaseTypographyProps & EffectProps;

// Shared Props interface for Registry
interface SharedTypographyProps {
    nativeProps: Record<string, any>;
    className: string;
    children: React.ReactNode;
    elementType: React.ElementType;
}

// EffectPropsMap for each typography effect
export interface EffectPropsMap {
    [TypographyEffect.NONE]:     Record<string, never>;
    [TypographyEffect.AURORA]:   AuroraEffectProps;
    [TypographyEffect.SHINY]:    ShinyEffectProps;
    [TypographyEffect.GRADIENT]: GradientEffectProps;
    [TypographyEffect.MORPHING]: MorphingEffectProps;
    [TypographyEffect.TYPING]:   TypingEffectProps;
    [TypographyEffect.ANIMATE]:  AnimateEffectProps;
}

// TYPOGRAPHY_EFFECT_PROP_KEYS tuple
export const TYPOGRAPHY_EFFECT_PROP_KEYS = [
    'colors', 'speed',
    'shimmerWidth',
    'colorFrom', 'colorTo',
    'texts',
    'words', 'typeSpeed', 'deleteSpeed', 'delay', 'pauseDelay', 'loop',
    'showCursor', 'blinkCursor', 'cursorStyle',
    'duration', 'by', 'animation', 'startOnView', 'once',
] as const satisfies ReadonlyArray<keyof (
    AuroraEffectProps & ShinyEffectProps & GradientEffectProps &
    MorphingEffectProps & TypingEffectProps & AnimateEffectProps
)>;

/** @exports */
export { 
    TypographyVariant, 
    TypographyWeight, 
    TypographyAlign, 
    TypographyColor, 
    TypographyFont,
    TypographyEffect, 
};

export type {
    AuroraEffectProps,
    ShinyEffectProps,
    GradientEffectProps,
    MorphingEffectProps,
    TypingEffectProps,
    AnimateEffectProps,
    AnimationType,
    AnimationVariant,
    EffectProps,
    BaseTypographyProps,
    TypographyProps,
    SharedTypographyProps,
};