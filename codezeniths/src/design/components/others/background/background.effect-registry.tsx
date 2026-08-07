'use client';
import React from 'react';
import { BackgroundVariant, VariantPropsMap } from './background.types';
import {
    useGridPattern,
    useAnimatedGridPattern,
    useDotPattern,
    useFlickeringGrid,
    useLightRays,
    useBackgroundRippleEffect,
    useDottedGlow,
    useMaskContainer,
    useParticlesBackground,
} from './background.effect-hooks';
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyVariantDefinition = BackgroundVariantDefinition<any, any>;

export interface BackgroundVariantDefinition<V extends BackgroundVariant, HookData extends object = Record<string, never>> {
    useVariantHook: (props: VariantPropsMap[V]) => HookData;
    renderVariant: (data: HookData, props: VariantPropsMap[V]) => React.ReactNode;
}

export const BACKGROUND_VARIANT_REGISTRY: Record<BackgroundVariant, AnyVariantDefinition> = {
    [BackgroundVariant.GRID]: {
        useVariantHook: () => useGridPattern(),
        renderVariant: (data, props) => <GridPatternLayer {...props} id={data.id} />,
    },
    [BackgroundVariant.RETRO_GRID]: {
        useVariantHook: () => ({}),
        renderVariant: (_d, props) => <RetroGrid {...props} />,
    },
    [BackgroundVariant.ANIMATED_GRID]: {
        useVariantHook: (props) => useAnimatedGridPattern({
            width: props.width ?? 40,
            height: props.height ?? 40,
            numSquares: props.numSquares ?? 50,
        }),
        renderVariant: (data, props) => <AnimatedGridPatternLayer {...props} {...data} />,
    },
    [BackgroundVariant.DOT_PATTERN]: {
        useVariantHook: (props) => useDotPattern({
            width: props.width ?? 16,
            height: props.height ?? 16,
            cx: props.cx ?? 1,
            cy: props.cy ?? 1,
        }),
        renderVariant: (data, props) => <DotPatternLayer {...props} {...data} />,
    },
    [BackgroundVariant.FLICKERING_GRID]: {
        useVariantHook: (props) => useFlickeringGrid(props),
        renderVariant: (data, props) => <FlickeringGridLayer {...props} {...data} />,
    },
    [BackgroundVariant.STRIPED]: {
        useVariantHook: () => useGridPattern(),
        renderVariant: (data, props) => <StripedPatternLayer {...props} id={data.id} />,
    },
    [BackgroundVariant.BACKGROUND_BEAMS]: {
        useVariantHook: () => ({}),
        renderVariant: (_d, props) => <BackgroundBeams {...props} />,
    },
    [BackgroundVariant.SPOTLIGHT]: {
        useVariantHook: () => ({}),
        renderVariant: (_d, props) => <Spotlight {...props} />,
    },
    [BackgroundVariant.RIPPLE]: {
        useVariantHook: () => ({}),
        renderVariant: (_d, props) => <Ripple {...props} />,
    },
    [BackgroundVariant.LIGHT_RAYS]: {
        useVariantHook: (props) => useLightRays({
            count: props.count ?? 7,
            speed: props.speed ?? 14,
        }),
        renderVariant: (data, props) => <LightRaysLayer {...props} {...data} />,
    },
    [BackgroundVariant.BACKGROUND_RIPPLE]: {
        useVariantHook: (props) => useBackgroundRippleEffect({
            rows: props.rows,
            cols: props.cols,
        }),
        renderVariant: (data, props) => <BackgroundRippleEffectLayer {...props} {...data} />,
    },
    [BackgroundVariant.DOTTED_GLOW]: {
        useVariantHook: (props) => useDottedGlow(props),
        renderVariant: (data, props) => <DottedGlowLayer {...props} {...data} />,
    },
    [BackgroundVariant.CANVAS_REVEAL]: {
        useVariantHook: () => ({}),
        renderVariant: (_d, props) => <CanvasRevealLayer {...props} />,
    },
    [BackgroundVariant.MASK_REVEAL]: {
        useVariantHook: () => useMaskContainer(),
        renderVariant: (data, props) => <MaskContainerLayer {...props} {...data} />,
    },
    [BackgroundVariant.PARTICLES]: {
        useVariantHook: () => useParticlesBackground(),
        renderVariant: (data, props) => <ParticlesBackgroundLayer {...props} {...data} />,
    },
} satisfies Record<BackgroundVariant, AnyVariantDefinition>;

export function useAllVariantHooks(
    variant: BackgroundVariant,
    variantProps: Partial<VariantPropsMap[BackgroundVariant]>,
): {
    activeData: any;
} {
    // Unconditional hook calls
    const gridData = useGridPattern();

    const animatedGridProps = variantProps as VariantPropsMap[BackgroundVariant.ANIMATED_GRID];
    const animatedGridData = useAnimatedGridPattern({
        width: animatedGridProps?.width ?? 40,
        height: animatedGridProps?.height ?? 40,
        numSquares: animatedGridProps?.numSquares ?? 50,
    });

    const dotPatternProps = variantProps as VariantPropsMap[BackgroundVariant.DOT_PATTERN];
    const dotPatternData = useDotPattern({
        width: dotPatternProps?.width ?? 16,
        height: dotPatternProps?.height ?? 16,
        cx: dotPatternProps?.cx ?? 1,
        cy: dotPatternProps?.cy ?? 1,
    });

    const flickeringGridProps = variantProps as VariantPropsMap[BackgroundVariant.FLICKERING_GRID];
    const flickeringGridData = useFlickeringGrid({
        squareSize: flickeringGridProps?.squareSize ?? 4,
        gridGap: flickeringGridProps?.gridGap ?? 6,
        flickerChance: flickeringGridProps?.flickerChance ?? 0.3,
        color: flickeringGridProps?.color ?? 'rgb(106,124,255)',
        width: flickeringGridProps?.width,
        height: flickeringGridProps?.height,
        maxOpacity: flickeringGridProps?.maxOpacity ?? 0.25,
    });

    const lightRaysProps = variantProps as VariantPropsMap[BackgroundVariant.LIGHT_RAYS];
    const lightRaysData = useLightRays({
        count: lightRaysProps?.count ?? 7,
        speed: lightRaysProps?.speed ?? 14,
    });

    const backgroundRippleProps = variantProps as VariantPropsMap[BackgroundVariant.BACKGROUND_RIPPLE];
    const backgroundRippleData = useBackgroundRippleEffect({
        rows: backgroundRippleProps?.rows,
        cols: backgroundRippleProps?.cols,
    });

    const dottedGlowProps = variantProps as VariantPropsMap[BackgroundVariant.DOTTED_GLOW];
    const dottedGlowData = useDottedGlow({
        gap: dottedGlowProps?.gap ?? 12,
        radius: dottedGlowProps?.radius ?? 2,
        color: dottedGlowProps?.color ?? 'rgba(106,124,255,0.6)',
        darkColor: dottedGlowProps?.darkColor,
        glowColor: dottedGlowProps?.glowColor ?? 'rgba(106,124,255,0.85)',
        darkGlowColor: dottedGlowProps?.darkGlowColor,
        colorLightVar: dottedGlowProps?.colorLightVar,
        colorDarkVar: dottedGlowProps?.colorDarkVar,
        glowColorLightVar: dottedGlowProps?.glowColorLightVar,
        glowColorDarkVar: dottedGlowProps?.glowColorDarkVar,
        opacity: dottedGlowProps?.opacity ?? 0.6,
        backgroundOpacity: dottedGlowProps?.backgroundOpacity ?? 0.05,
        speedMin: dottedGlowProps?.speedMin ?? 1,
        speedMax: dottedGlowProps?.speedMax ?? 3,
        speedScale: dottedGlowProps?.speedScale ?? 1,
    });

    const maskContainerData = useMaskContainer();
    const particlesData = useParticlesBackground();

    const dataMap = {
        [BackgroundVariant.GRID]: gridData,
        [BackgroundVariant.RETRO_GRID]: gridData,
        [BackgroundVariant.ANIMATED_GRID]: animatedGridData,
        [BackgroundVariant.DOT_PATTERN]: dotPatternData,
        [BackgroundVariant.FLICKERING_GRID]: flickeringGridData,
        [BackgroundVariant.STRIPED]: gridData,
        [BackgroundVariant.BACKGROUND_BEAMS]: {},
        [BackgroundVariant.SPOTLIGHT]: {},
        [BackgroundVariant.RIPPLE]: {},
        [BackgroundVariant.LIGHT_RAYS]: lightRaysData,
        [BackgroundVariant.BACKGROUND_RIPPLE]: backgroundRippleData,
        [BackgroundVariant.DOTTED_GLOW]: dottedGlowData,
        [BackgroundVariant.CANVAS_REVEAL]: {},
        [BackgroundVariant.MASK_REVEAL]: maskContainerData,
        [BackgroundVariant.PARTICLES]: particlesData,
    } as const;

    const activeData = dataMap[variant];
    return { activeData };
}
