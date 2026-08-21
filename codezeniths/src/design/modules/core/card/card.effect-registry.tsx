'use client';
import React from 'react';
import {
    CardBackgroundEffect,
    CardBorderEffect,
    CardChildEffect,
    CardWrapperEffect,
} from './card.types';
import type {
    ChildEffectItemProps,
    CardSubComponentSlot,
} from './card.types';
import {
    useCometEffect,
    useMagicBackgroundEffect,
    useCanvasRevealEffect,
    useGradientHoverBorderEffect,
    useInteractive3DWrapperEffect,
} from './card.effect-hooks';
import {
    CometWrapperLayer,
    PerspectiveWrapperLayer,
    FloatWrapperLayer,
    Interactive3DWrapperLayer,
    MagicBackgroundLayer,
    CanvasRevealLayer,
    AuroraBackgroundLayer,
    BorderBeamLayer,
    GradientBorderLayer,
    GradientHoverBorderLayer,
    PerspectiveChildLayer,
} from './card.effect-layers';
import { getChildEffectSlotDefaults, mergeChildEffectItemProps } from './card.utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyWrapperEffectDefinition = WrapperEffectDefinition<any, any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyBackgroundEffectDefinition = BackgroundEffectDefinition<any, any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyBorderEffectDefinition = BorderEffectDefinition<any, any>;

export interface WrapperEffectDefinition<E extends CardWrapperEffect, HookData extends object = Record<string, never>> {
    useEffectHook: (props: any) => HookData;
    renderWrapper: (data: HookData, children: React.ReactNode, handlers: any) => React.ReactNode;
}

export interface BackgroundEffectDefinition<E extends CardBackgroundEffect, HookData extends object = Record<string, never>> {
    useEffectHook: (props: any) => HookData;
    renderLayer: (data: HookData, props: any) => React.ReactNode;
}

export interface BorderEffectDefinition<E extends CardBorderEffect, HookData extends object = Record<string, never>> {
    useEffectHook: (props: any) => HookData;
    renderLayer: (data: HookData, props: any) => React.ReactNode;
}

export interface ChildEffectDefinition {
    renderChild: (slot: CardSubComponentSlot, itemProps: ChildEffectItemProps | undefined, children: React.ReactNode) => React.ReactNode;
}

// ── Wrapper registry ──────────────────────────────────────
export const WRAPPER_EFFECT_REGISTRY: Record<CardWrapperEffect, AnyWrapperEffectDefinition> = {
    [CardWrapperEffect.NONE]: {
        useEffectHook: () => ({}),
        renderWrapper: (_d, children) => children,
    },
    [CardWrapperEffect.COMET]: {
        useEffectHook: (props) => useCometEffect(props),
        renderWrapper: (data, children) => <CometWrapperLayer {...data}>{children}</CometWrapperLayer>,
    },
    [CardWrapperEffect.PERSPECTIVE]: {
        useEffectHook: () => ({}),
        renderWrapper: (_d, children, handlers) => <PerspectiveWrapperLayer {...handlers}>{children}</PerspectiveWrapperLayer>,
    },
    [CardWrapperEffect.FLOAT]: {
        useEffectHook: () => ({}),
        renderWrapper: (_d, children, handlers) => <FloatWrapperLayer {...handlers}>{children}</FloatWrapperLayer>,
    },
    [CardWrapperEffect.INTERACTIVE_3D]: {
        useEffectHook: (props) => useInteractive3DWrapperEffect(props),
        renderWrapper: (data, children, handlers) => <Interactive3DWrapperLayer data={data} handlers={handlers}>{children}</Interactive3DWrapperLayer>,
    },
} satisfies Record<CardWrapperEffect, AnyWrapperEffectDefinition>;

// ── Background registry ────────────────────────────────────
export const BACKGROUND_EFFECT_REGISTRY: Record<CardBackgroundEffect, AnyBackgroundEffectDefinition> = {
    [CardBackgroundEffect.NONE]: {
        useEffectHook: () => ({}),
        renderLayer: () => null,
    },
    [CardBackgroundEffect.MAGIC]: {
        useEffectHook: (props) => useMagicBackgroundEffect(props),
        renderLayer: (data, props) => <MagicBackgroundLayer data={data} {...props} />,
    },
    [CardBackgroundEffect.CANVAS_REVEAL]: {
        useEffectHook: (props) => useCanvasRevealEffect(props),
        renderLayer: (data, props) => <CanvasRevealLayer {...data} {...props} />,
    },
    [CardBackgroundEffect.AURORA]: {
        useEffectHook: () => ({}),
        renderLayer: (_d, props) => <AuroraBackgroundLayer {...props} />,
    },
} satisfies Record<CardBackgroundEffect, AnyBackgroundEffectDefinition>;

// ── Border registry ────────────────────────────────────────
export const BORDER_EFFECT_REGISTRY: Record<CardBorderEffect, AnyBorderEffectDefinition> = {
    [CardBorderEffect.BORDER_BEAM]: {
        useEffectHook: () => ({}),
        renderLayer: (_d, props) => <BorderBeamLayer {...props} />,
    },
    [CardBorderEffect.GRADIENT_BORDER]: {
        useEffectHook: () => ({}),
        renderLayer: (_d, props) => <GradientBorderLayer {...props} />,
    },
    [CardBorderEffect.GRADIENT_HOVER]: {
        useEffectHook: (props) => useGradientHoverBorderEffect(props),
        renderLayer: (data, props) => <GradientHoverBorderLayer data={data} {...props} />,
    },
} satisfies Record<CardBorderEffect, AnyBorderEffectDefinition>;

// ── Child registry (Layer 0) ────────────────────────────────
export const CHILD_EFFECT_REGISTRY: Record<CardChildEffect, ChildEffectDefinition> = {
    [CardChildEffect.NONE]: {
        renderChild: (_slot, _itemProps, children) => children,
    },
    [CardChildEffect.PERSPECTIVE]: {
        renderChild: (slot, itemProps, children) => {
            const defaults = getChildEffectSlotDefaults(CardChildEffect.PERSPECTIVE, slot);
            const merged = mergeChildEffectItemProps(defaults, itemProps);
            return <PerspectiveChildLayer {...merged}>{children}</PerspectiveChildLayer>;
        },
    },
} satisfies Record<CardChildEffect, ChildEffectDefinition>;
