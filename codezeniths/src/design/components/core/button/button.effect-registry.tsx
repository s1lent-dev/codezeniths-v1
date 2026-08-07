'use client';
import React from 'react';
import { cn } from '@codezeniths/design/cn';
import { ButtonEffect, EffectPropsMap, SharedComponentProps } from './button.types';
import {
    useShimmerEffect,
    useRippleEffect,
    usePulsatingEffect,
    useGradientHoverEffect,
} from './button.effect-hooks';
import {
    RippleLayer,
    ShinyLayer,
    InteractiveHoverLayer,
    PulsatingLayer,
    GradientHoverLayer,
} from './button.effect-layers';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyEffectDefinition = EffectDefinition<any, any>;

export interface EffectDefinition<E extends ButtonEffect, HookData extends object = Record<string, never>> {
    // Runs unconditionally inside the root component. Must not contain JSX.
    useEffectHook: (props: EffectPropsMap[E]) => HookData;

    // Returns React nodes rendered INSIDE the root element — never a root element itself.
    renderLayer: (data: HookData, shared: SharedComponentProps) => React.ReactNode;

    // Optional extra props to merge onto the root element (style, className additions, event handlers).
    getRootProps?: (data: HookData, shared: SharedComponentProps) => Partial<React.HTMLAttributes<HTMLElement>>;
}

export const EFFECT_REGISTRY: Record<ButtonEffect, AnyEffectDefinition> = {
    [ButtonEffect.NONE]: {
        useEffectHook: () => ({}),
        renderLayer: (_d, shared) => shared.children,
    },
    [ButtonEffect.SHIMMER]: {
        useEffectHook: (props) => useShimmerEffect(props),
        renderLayer: (_d, shared) => (
            <>
                {/* Shimmer layer */}
                <div
                    className={cn(
                        '-z-30 blur-[2px]',
                        '[container-type:size] absolute inset-0 overflow-visible',
                    )}
                >
                    <div className="animate-shimmer-slide absolute inset-0 [aspect-ratio:1] h-[100cqh] [border-radius:0] [mask:none]">
                        <div
                            className="animate-spin-around absolute -inset-full w-auto [translate:0_0] rotate-0"
                            style={{
                                background: 'conic-gradient(from calc(270deg - (var(--spread) * 0.5)), transparent 0, var(--shimmer-color) var(--spread), transparent var(--spread))',
                            }}
                        />
                    </div>
                </div>

                {/* Content */}
                {shared.children}

                {/* Overlay shadow / shine */}
                <div
                    className={cn(
                        'absolute inset-0 size-full',
                        'rounded-lg px-md-2 py-sm-2 text-p font-medium',
                        'shadow-[inset_0_-8px_10px_#ffffff1f]',
                        'transform-gpu transition-all duration-300 ease-in-out',
                        'group-hover:shadow-[inset_0_-6px_10px_#ffffff3f]',
                        'group-active:shadow-[inset_0_-10px_10px_#ffffff3f]',
                    )}
                />

                {/* Inner background cutout layer */}
                <div
                    className={cn(
                        'absolute [inset:var(--cut)] -z-20 [border-radius:inherit] bg-[var(--bg)]',
                    )}
                />
            </>
        ),
        getRootProps: (data) => ({
            style: data.style,
            className: 'group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden bg-[var(--bg)] transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px',
        }),
    },
    [ButtonEffect.RIPPLE]: {
        useEffectHook: (props) => useRippleEffect(props),
        renderLayer: (data, shared) => (
            <>
                <div className="relative z-10 flex flex-row h-full w-full items-center justify-center gap-2">{shared.children}</div>
                <RippleLayer buttonRipples={data.buttonRipples} rippleColor={data.rippleColor} />
            </>
        ),
        getRootProps: (data, shared) => ({
            className: 'relative flex cursor-pointer items-center justify-center overflow-hidden',
            onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
                data.createRipple(event);
                shared.nativeProps.onClick?.(event as any);
            },
        }),
    },
    [ButtonEffect.SHINY]: {
        useEffectHook: () => ({}),
        renderLayer: (_d, shared) => <ShinyLayer>{shared.children}</ShinyLayer>,
        getRootProps: () => ({
            className: 'relative cursor-pointer backdrop-blur-xl transition-shadow duration-300 ease-in-out hover:shadow dark:bg-[radial-gradient(circle_at_50%_0%,var(--color-primary)/10%_0%,transparent_60%)] dark:hover:shadow-[0_0_20px_var(--color-primary)/10%]',
            initial: { '--x': '100%', scale: 0.8 },
            animate: { '--x': '-100%', scale: 1 },
            whileTap: { scale: 0.95 },
            transition: {
                repeat: Infinity,
                repeatType: 'loop',
                repeatDelay: 1,
                type: 'spring',
                stiffness: 20,
                damping: 15,
                mass: 2,
                scale: {
                    type: 'spring',
                    stiffness: 200,
                    damping: 5,
                    mass: 0.5,
                },
            },
        } as any),
    },
    [ButtonEffect.INTERACTIVE_HOVER]: {
        useEffectHook: () => ({}),
        renderLayer: (_d, shared) => <InteractiveHoverLayer>{shared.children}</InteractiveHoverLayer>,
        getRootProps: () => ({
            className: 'group relative inline-flex items-center justify-center min-w-[140px] px-md-2 py-md-1 rounded-full border border-secondary bg-primary overflow-hidden transition-all duration-300 hover:border-primary/70',
        }),
    },
    [ButtonEffect.GRADIENT_HOVER]: {
        useEffectHook: (props) => useGradientHoverEffect(props),
        renderLayer: (data, shared) => (
            <GradientHoverLayer
                hovered={data.hovered}
                direction={data.direction}
                movingMap={data.movingMap}
                highlight={data.highlight}
                duration={data.duration}
            >
                {shared.children}
            </GradientHoverLayer>
        ),
        getRootProps: (data) => ({
            onMouseEnter: () => data.setHovered(true),
            onMouseLeave: () => data.setHovered(false),
        }),
    },
    [ButtonEffect.PULSATING]: {
        useEffectHook: (props) => usePulsatingEffect(props),
        renderLayer: (_d, shared) => <PulsatingLayer>{shared.children}</PulsatingLayer>,
        getRootProps: (data) => ({
            style: data.style,
            className: 'relative flex flex-row cursor-pointer items-center justify-center',
        }),
    },
} satisfies Record<ButtonEffect, AnyEffectDefinition>;

export function useAllEffectHooks(
    effect: ButtonEffect,
    effectProps: Partial<EffectPropsMap[ButtonEffect]>,
    shared: SharedComponentProps,
): {
    rootProps: Partial<React.HTMLAttributes<HTMLElement>>;
    effectChildren: React.ReactNode;
} {
    // Unconditional hook calls
    const shimmerData = EFFECT_REGISTRY[ButtonEffect.SHIMMER].useEffectHook(
        effectProps as EffectPropsMap[typeof ButtonEffect.SHIMMER],
    );
    const rippleData = EFFECT_REGISTRY[ButtonEffect.RIPPLE].useEffectHook(
        effectProps as EffectPropsMap[typeof ButtonEffect.RIPPLE],
    );
    const gradientHoverData = EFFECT_REGISTRY[ButtonEffect.GRADIENT_HOVER].useEffectHook(
        effectProps as EffectPropsMap[typeof ButtonEffect.GRADIENT_HOVER],
    );
    const pulsatingData = EFFECT_REGISTRY[ButtonEffect.PULSATING].useEffectHook(
        effectProps as EffectPropsMap[typeof ButtonEffect.PULSATING],
    );

    const dataMap = {
        [ButtonEffect.NONE]: {},
        [ButtonEffect.SHIMMER]: shimmerData,
        [ButtonEffect.RIPPLE]: rippleData,
        [ButtonEffect.SHINY]: {},
        [ButtonEffect.INTERACTIVE_HOVER]: {},
        [ButtonEffect.GRADIENT_HOVER]: gradientHoverData,
        [ButtonEffect.PULSATING]: pulsatingData,
    } as const;

    const activeData = dataMap[effect];
    const activeDefinition = EFFECT_REGISTRY[effect];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rootProps = activeDefinition.getRootProps?.(activeData as any, shared) ?? {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const effectChildren = activeDefinition.renderLayer(activeData as any, shared);

    return { rootProps, effectChildren };
}
