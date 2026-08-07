/** @imports */

/** @enums */
enum SpinnerVariant {
    LOADER          = 'loader',           // LoaderIcon  
    LOADER_CIRCLE   = 'loaderCircle',     // LoaderCircleIcon
    LOADER_PINWHEEL = 'loaderPinwheel',   // LoaderPinwheelIcon
    DOT_SHIMMER     = 'dotShimmer',       // Dot shimmer animation 
    DOT_WAVE        = 'dotWave',          // Dot wave animation — motion/react
    PULSE           = 'pulse',            // Pulsing concentric rings
    BARS            = 'bars',             // Staggered wave bars
}

enum SpinnerSize {
    XS      = 'xs',
    SM      = 'sm',
    DEFAULT = 'default',
    LG      = 'lg',
    XL      = 'xl',
}

/** @prop_interfaces */

// Base props shared across all variants
interface BaseSpinnerProps {
    size?:      SpinnerSize | undefined;
    className?: string | undefined;
    label?:     string | undefined;
    speed?:     'slow' | 'normal' | 'fast' | undefined;
}

// Dots-variant specific props
interface DotShimmerSpinnerProps {
    count?:  number | undefined;  
    innerClassName?: string | undefined;            
}

interface DotWaveSpinnerProps {
    count?:  number | undefined;    
    innerClassName?: string | undefined;           
}

// Pulse-variant specific props
interface PulseSpinnerProps {
    rings?:  number | undefined;  
    innerClassName?: string | undefined;               
}

// Bars-variant specific props
interface BarsSpinnerProps {
    count?:  number | undefined;     
    innerClassName?: string | undefined;
}


// Discriminated union of all spinner props
type VariantProps =
    | ({variant: SpinnerVariant.LOADER | SpinnerVariant.LOADER_CIRCLE | SpinnerVariant.LOADER_PINWHEEL} & BaseSpinnerProps)
    | ({variant: SpinnerVariant.DOT_SHIMMER} & DotShimmerSpinnerProps)
    | ({variant: SpinnerVariant.DOT_WAVE} & DotWaveSpinnerProps)
    | ({variant: SpinnerVariant.PULSE} & PulseSpinnerProps)
    | ({variant: SpinnerVariant.BARS} & BarsSpinnerProps);
    

type SpinnerProps = VariantProps & BaseSpinnerProps;

// Size map type (used for icon px sizing)
type SizeMap = Record<SpinnerSize, string>;

/** @exports */
export { SpinnerVariant, SpinnerSize };
export type {
    BaseSpinnerProps,
    DotShimmerSpinnerProps,
    DotWaveSpinnerProps,
    PulseSpinnerProps,
    BarsSpinnerProps,
    SpinnerProps,
    SizeMap,
};