'use client';
import React from 'react';
import { cn } from '@codezeniths/design/cn';
import { backgroundWrapperVariants, backgroundPresets } from './background.variants';
import { BACKGROUND_VARIANT_REGISTRY, useAllVariantHooks } from './background.effect-registry';
import { BackgroundVariant, BACKGROUND_EFFECT_PROP_KEYS } from './background.types';
import type { BackgroundProps } from './background.types';
import {
    GridPatternLayer,
    RetroGrid,
    AnimatedGridPatternLayer,
    DotPatternLayer,
    FlickeringGridLayer,
    StripedPatternLayer,
    BackgroundBeams,
    Spotlight,
    Ripple,
    LightRaysLayer,
    BackgroundRippleEffectLayer,
    DottedGlowLayer,
    CanvasRevealLayer,
    MaskContainerLayer,
    ParticlesBackgroundLayer,
} from './background.effect-layers';

function extractEffectProps(props: Record<string, any>) {
    const result: Record<string, any> = {};
    for (const key of BACKGROUND_EFFECT_PROP_KEYS) {
        if (key in props) {
            result[key] = props[key];
        }
    }
    return result;
}

function omitEffectProps(props: Record<string, any>) {
    const result = { ...props };
    for (const key of BACKGROUND_EFFECT_PROP_KEYS) {
        delete result[key];
    }
    return result;
}

const Background = ({
    fill = true,
    wrapperClassName,
    children,
    ...props
}: BackgroundProps) => {
    const { variant } = props;

    // Separate effect props from wrapper props
    const effectProps = extractEffectProps(props);

    // Call all variant hooks unconditionally
    const { activeData } = useAllVariantHooks(variant, effectProps);

    const activeRegistry = variant ? BACKGROUND_VARIANT_REGISTRY[variant] : undefined;

    // Render active variant using the registry, passing the full props object
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const renderedVariant = activeRegistry ? activeRegistry.renderVariant(activeData as any, props as any) : null;

    return (
        <div
            data-slot="background"
            data-variant={variant}
            className={cn(backgroundWrapperVariants({ fill, variant }), wrapperClassName)}
        >
            {renderedVariant}
            {children}
        </div>
    );
};

// Export individual component named exports verbatim
export {
    Background,
    BackgroundVariant,
    backgroundPresets,
};

// Re-export the layer components directly so they can still be used without the wrapper if needed
export {
    GridPatternLayer as GridPattern,
    RetroGrid,
    AnimatedGridPatternLayer as AnimatedGridPattern,
    DotPatternLayer as DotPattern,
    FlickeringGridLayer as FlickeringGrid,
    StripedPatternLayer as StripedPattern,
    BackgroundBeams,
    Spotlight,
    Ripple,
    LightRaysLayer as LightRays,
    BackgroundRippleEffectLayer as BackgroundRippleEffect,
    DottedGlowLayer as DottedGlowBackground,
    CanvasRevealLayer as CanvasRevealEffect,
    MaskContainerLayer as MaskContainer,
    ParticlesBackgroundLayer as ParticlesBackground,
};