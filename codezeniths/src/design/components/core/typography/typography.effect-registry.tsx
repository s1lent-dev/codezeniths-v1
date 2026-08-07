'use client';
import React from 'react';
import { TypographyEffect, EffectPropsMap, SharedTypographyProps } from './typography.types';
import {
    useAuroraEffect,
    useShinyEffect,
    useGradientEffect,
    useMorphingEffect,
    useTypingEffect,
    useAnimateEffect,
} from './typography.effect-hooks';
import {
    AuroraLayer,
    ShinyLayer,
    GradientLayer,
    MorphingLayer,
    TypingLayer,
    AnimateLayer,
} from './typography.effect-layers';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyEffectDefinition = EffectDefinition<any, any>;

export interface EffectDefinition<E extends TypographyEffect, HookData extends object = Record<string, never>> {
    // Runs unconditionally inside the root component. Must not contain JSX.
    useEffectHook: (props: EffectPropsMap[E], shared: SharedTypographyProps) => HookData;

    // Returns React nodes rendered INSIDE the root element — never a root element itself.
    renderLayer: (data: HookData, shared: SharedTypographyProps) => React.ReactNode;

    // Optional extra props to merge onto the root element (style, className additions, event handlers).
    getRootProps?: (data: HookData, shared: SharedTypographyProps) => Partial<React.HTMLAttributes<HTMLElement>>;
}

export const EFFECT_REGISTRY: Record<TypographyEffect, AnyEffectDefinition> = {
    [TypographyEffect.NONE]: {
        useEffectHook: () => ({}),
        renderLayer: (_d, shared) => shared.children,
    },
    [TypographyEffect.AURORA]: {
        useEffectHook: (props) => useAuroraEffect(props),
        renderLayer: (data, shared) => <AuroraLayer style={data.style}>{shared.children}</AuroraLayer>,
    },
    [TypographyEffect.SHINY]: {
        useEffectHook: (props) => useShinyEffect(props),
        renderLayer: (data, shared) => <ShinyLayer style={data.style}>{shared.children}</ShinyLayer>,
    },
    [TypographyEffect.GRADIENT]: {
        useEffectHook: (props) => useGradientEffect(props),
        renderLayer: (data, shared) => <GradientLayer style={data.style}>{shared.children}</GradientLayer>,
    },
    [TypographyEffect.MORPHING]: {
        useEffectHook: (props) => useMorphingEffect(props),
        renderLayer: (data, shared) => (
            <MorphingLayer
                text1Ref={data.text1Ref}
                text2Ref={data.text2Ref}
                className={shared.className}
                forwardedRef={shared.nativeProps.forwardedRef}
                {...shared.nativeProps}
            />
        ),
    },
    [TypographyEffect.TYPING]: {
        useEffectHook: (props, shared) => useTypingEffect({
            ...props,
            initialText: typeof shared.children === 'string' ? shared.children : '',
        }),
        renderLayer: (data, shared) => (
            <TypingLayer
                displayedText={data.displayedText}
                shouldShowCursor={data.shouldShowCursor}
                getCursorChar={data.getCursorChar}
                elementRef={data.elementRef}
                blinkCursor={data.blinkCursor}
                elementType={shared.elementType}
                className={shared.className}
                forwardedRef={shared.nativeProps.forwardedRef}
                {...shared.nativeProps}
            />
        ),
    },
    [TypographyEffect.ANIMATE]: {
        useEffectHook: (props, shared) => useAnimateEffect({
            ...props,
            text: typeof shared.children === 'string' ? shared.children : '',
        }),
        renderLayer: (data, shared) => (
            <AnimateLayer
                segments={data.segments}
                finalVariants={data.finalVariants}
                by={data.by}
                startOnView={data.startOnView}
                once={data.once}
                elementType={shared.elementType}
                className={shared.className}
                forwardedRef={shared.nativeProps.forwardedRef}
                {...shared.nativeProps}
            >
                {typeof shared.children === 'string' ? shared.children : ''}
            </AnimateLayer>
        ),
    },
} satisfies Record<TypographyEffect, AnyEffectDefinition>;

export function useAllEffectHooks(
    effect: TypographyEffect,
    effectProps: Partial<EffectPropsMap[TypographyEffect]>,
    shared: SharedTypographyProps,
): {
    rootProps: Partial<React.HTMLAttributes<HTMLElement>>;
    effectChildren: React.ReactNode;
} {
    // Unconditional hook calls
    const auroraData = EFFECT_REGISTRY[TypographyEffect.AURORA].useEffectHook(
        effectProps as EffectPropsMap[typeof TypographyEffect.AURORA],
        shared,
    );
    const shinyData = EFFECT_REGISTRY[TypographyEffect.SHINY].useEffectHook(
        effectProps as EffectPropsMap[typeof TypographyEffect.SHINY],
        shared,
    );
    const gradientData = EFFECT_REGISTRY[TypographyEffect.GRADIENT].useEffectHook(
        effectProps as EffectPropsMap[typeof TypographyEffect.GRADIENT],
        shared,
    );
    const morphingData = EFFECT_REGISTRY[TypographyEffect.MORPHING].useEffectHook(
        effectProps as EffectPropsMap[typeof TypographyEffect.MORPHING],
        shared,
    );
    const typingData = EFFECT_REGISTRY[TypographyEffect.TYPING].useEffectHook(
        effectProps as EffectPropsMap[typeof TypographyEffect.TYPING],
        shared,
    );
    const animateData = EFFECT_REGISTRY[TypographyEffect.ANIMATE].useEffectHook(
        effectProps as EffectPropsMap[typeof TypographyEffect.ANIMATE],
        shared,
    );

    const dataMap = {
        [TypographyEffect.NONE]: {},
        [TypographyEffect.AURORA]: auroraData,
        [TypographyEffect.SHINY]: shinyData,
        [TypographyEffect.GRADIENT]: gradientData,
        [TypographyEffect.MORPHING]: morphingData,
        [TypographyEffect.TYPING]: typingData,
        [TypographyEffect.ANIMATE]: animateData,
    } as const;

    const activeData = dataMap[effect];
    const activeDefinition = EFFECT_REGISTRY[effect];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rootProps = activeDefinition.getRootProps?.(activeData as any, shared) ?? {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const effectChildren = activeDefinition.renderLayer(activeData as any, shared);

    return { rootProps, effectChildren };
}
