'use client';
import React, { useState } from 'react';
import { Container, Typography, TypographyColor, TypographyVariant, TypographyWeight } from '@codezeniths/components';
import { cn } from '@codezeniths/design/cn';
import {
    cardContentVariants,
    cardFooterVariants,
    cardHeaderVariants,
    cardVariants,
} from './card.variants';
import {
    CardContext,
    resolveEffectConfig,
    usePerspectiveContainer,
} from './card.utils';
import {
    CardBackgroundEffect,
    CardBorderEffect,
    CardChildEffect,
    CardSize,
    CardVariant,
    CardWrapperEffect,
} from './card.types';
import type {
    BaseCardProps,
    CardActionProps,
    CardContentProps,
    CardDescriptionProps,
    CardFooterProps,
    CardHeaderProps,
    CardTitleProps,
    ChildEffectItemProps,
} from './card.types';
import {
    WRAPPER_EFFECT_REGISTRY,
    BACKGROUND_EFFECT_REGISTRY,
    BORDER_EFFECT_REGISTRY,
    CHILD_EFFECT_REGISTRY,
} from './card.effect-registry';


// ─────────────────────────────────────────────────────────────
// Card — root compound component
// Establishes context for all sub-components, resolves and
// renders all three effect layers.
// ─────────────────────────────────────────────────────────────

function Card({
    className,
    variant = CardVariant.DEFAULT,
    size = CardSize.DEFAULT,
    effectConfig,
    children,
    ...props
}: BaseCardProps) {
    const [isMouseEntered, setIsMouseEntered] = useState(false);
    const { containerRef, handleMouseMove, handleMouseLeave } = usePerspectiveContainer();

    const {
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
    } = resolveEffectConfig(effectConfig);

    // Resolve per-layer effect props
    const wrapperEffectProps = (() => {
        switch (wrapperEffect) {
            case CardWrapperEffect.COMET:           return cometProps ?? {};
            case CardWrapperEffect.PERSPECTIVE:     return perspectiveWrapperProps ?? {};
            case CardWrapperEffect.FLOAT:           return floatProps ?? {};
            case CardWrapperEffect.INTERACTIVE_3D:  return interactive3DProps ?? {};
            default:                                return {};
        }
    })();

    const backgroundEffectProps = (() => {
        switch (backgroundEffect) {
            case CardBackgroundEffect.MAGIC:         return magicProps ?? {};
            case CardBackgroundEffect.CANVAS_REVEAL: return canvasProps ?? {};
            case CardBackgroundEffect.AURORA:        return auroraProps ?? {};
            default:                                 return {};
        }
    })();

    const borderEffectProps = (() => {
        if (!borderEffect) {return {};}
        switch (borderEffect) {
            case CardBorderEffect.BORDER_BEAM:     return borderBeamProps ?? {};
            case CardBorderEffect.GRADIENT_BORDER: return gradientBorderProps ?? {};
            case CardBorderEffect.GRADIENT_HOVER:  return gradientHoverProps ?? {};
            default:                               return {};
        }
    })();

    // Run registry hooks unconditionally (satisfying React rules of hooks)
    const cometData = WRAPPER_EFFECT_REGISTRY[CardWrapperEffect.COMET].useEffectHook(cometProps ?? {});
    const interactive3dData = WRAPPER_EFFECT_REGISTRY[CardWrapperEffect.INTERACTIVE_3D].useEffectHook(interactive3DProps ?? {});
    const magicData = BACKGROUND_EFFECT_REGISTRY[CardBackgroundEffect.MAGIC].useEffectHook(magicProps ?? {});
    const canvasData = BACKGROUND_EFFECT_REGISTRY[CardBackgroundEffect.CANVAS_REVEAL].useEffectHook(canvasProps ?? {});
    const gradientHoverData = BORDER_EFFECT_REGISTRY[CardBorderEffect.GRADIENT_HOVER].useEffectHook(gradientHoverProps ?? {});

    const activeWrapperData = {
        [CardWrapperEffect.NONE]: {},
        [CardWrapperEffect.COMET]: cometData,
        [CardWrapperEffect.PERSPECTIVE]: {},
        [CardWrapperEffect.FLOAT]: {},
        [CardWrapperEffect.INTERACTIVE_3D]: interactive3dData,
    }[wrapperEffect];

    const activeBackgroundData = {
        [CardBackgroundEffect.NONE]: {},
        [CardBackgroundEffect.MAGIC]: magicData,
        [CardBackgroundEffect.CANVAS_REVEAL]: canvasData,
        [CardBackgroundEffect.AURORA]: {},
    }[backgroundEffect];

    const activeBorderData = borderEffect ? {
        [CardBorderEffect.BORDER_BEAM]: {},
        [CardBorderEffect.GRADIENT_BORDER]: {},
        [CardBorderEffect.GRADIENT_HOVER]: gradientHoverData,
    }[borderEffect] : {};

    const handlePerspectiveMouseEnter = () => setIsMouseEntered(true);
    const handlePerspectiveMouseLeave = () => {
        setIsMouseEntered(false);
        handleMouseLeave();
    };

    const wrapperHandlers = {
        containerRef,
        onMouseEnter: handlePerspectiveMouseEnter,
        onMouseLeave: handlePerspectiveMouseLeave,
        onMouseMove: handleMouseMove,
    };

    const isPerspective = childEffect === CardChildEffect.PERSPECTIVE;

    const renderedBackground = backgroundEffect !== CardBackgroundEffect.NONE
        ? BACKGROUND_EFFECT_REGISTRY[backgroundEffect].renderLayer(activeBackgroundData, backgroundEffectProps)
        : null;

    const renderedBorder = borderEffect
        ? BORDER_EFFECT_REGISTRY[borderEffect].renderLayer(activeBorderData, borderEffectProps)
        : null;

    const cardElement = (
        <div
            data-slot="card"
            data-variant={variant}
            data-size={size}
            data-child-effect={childEffect}
            data-wrapper-effect={wrapperEffect}
            data-background-effect={backgroundEffect}
            data-border-effect={borderEffect ?? 'none'}
            className={cn(
                cardVariants({ variant, size }),
                isPerspective && [
                    'overflow-visible',
                    'transform-3d',
                    '*:transform-3d',
                ],
                className,
            )}
            {...props}
        >
            {/* Layer 2: Background — absolute, below content */}
            {renderedBackground}

            {/* Layer 3: Border — absolute, over background, below content */}
            {renderedBorder}

            {/* Card content — sits above all effects. */}
            <Container
                direction="col"
                size="none"
                gap="0"
                padded={false}
                centered={false}
                className={cn(
                    'relative z-10 h-full',
                    isPerspective && 'transform-style:preserve-3d *:transform-3d',
                )}
            >
                {children}
            </Container>
        </div>
    );

    return (
        <CardContext.Provider
            value={{
                childEffect,
                ...(childEffectProps ?? {}),
                isMouseEntered,
                setIsMouseEntered,
                wrapperEffect,
                size,
                variant,
            }}
        >
            {/* Layer 1: Wrapper — wraps the entire card element */}
            {WRAPPER_EFFECT_REGISTRY[wrapperEffect].renderWrapper(
                activeWrapperData,
                cardElement,
                wrapperHandlers,
            )}
        </CardContext.Provider>
    );
}

Card.displayName = 'Card';


// ─────────────────────────────────────────────────────────────
// CardHeader — top section with grid layout for action placement
// ─────────────────────────────────────────────────────────────

function CardHeader({
    className,
    childEffectItemProps,
    children,
    ...props
}: CardHeaderProps) {
    const { size, childEffect } = React.useContext(CardContext);

    const content = (
        <Container
            data-slot="card-header"
            className={cn(cardHeaderVariants({ size }), className)}
            {...props}
        >
            {children}
        </Container>
    );

    return <>{CHILD_EFFECT_REGISTRY[childEffect].renderChild('header', childEffectItemProps, content)}</>;
}

CardHeader.displayName = 'CardHeader';


// ─────────────────────────────────────────────────────────────
// CardTitle — heading text using Typography
// ─────────────────────────────────────────────────────────────

function CardTitle({
    className,
    childEffectItemProps,
    children,
    ...props
}: CardTitleProps) {
    const { size, childEffect } = React.useContext(CardContext);

    // Map card size to Typography variant for proportional type scale
    const variantMap: Record<CardSize, TypographyVariant> = {
        [CardSize.XS]:      TypographyVariant.H6,
        [CardSize.SM]:      TypographyVariant.H5,
        [CardSize.DEFAULT]: TypographyVariant.H4,
        [CardSize.LG]:      TypographyVariant.H3,
        [CardSize.XL]:      TypographyVariant.H2,
    };

    const content = (
        <Typography
            data-slot="card-title"
            as="h3"
            variant={variantMap[size]}
            weight={TypographyWeight.BOLD}
            color={TypographyColor.HEADING}
            className={cn('leading-none tracking-tight', className)}
            {...(props as React.ComponentProps<typeof Typography>)}
        >
            {children}
        </Typography>
    );

    return <>{CHILD_EFFECT_REGISTRY[childEffect].renderChild('title', childEffectItemProps, content)}</>;
}

CardTitle.displayName = 'CardTitle';


// ─────────────────────────────────────────────────────────────
// CardDescription — muted supporting text using Typography
// ─────────────────────────────────────────────────────────────

function CardDescription({
    className,
    childEffectItemProps,
    children,
    ...props
}: CardDescriptionProps) {
    const { childEffect } = React.useContext(CardContext);

    const content = (
        <Typography
            data-slot="card-description"
            as="p"
            variant={TypographyVariant.P}
            color={TypographyColor.MUTED}
            className={cn('typography-p', className)}
            {...(props as React.ComponentProps<typeof Typography>)}
        >
            {children}
        </Typography>
    );

    return <>{CHILD_EFFECT_REGISTRY[childEffect].renderChild('description', childEffectItemProps, content)}</>;
}

CardDescription.displayName = 'CardDescription';


// ─────────────────────────────────────────────────────────────
// CardAction — corner action slot (top-right in grid header)
// ─────────────────────────────────────────────────────────────

function CardAction({
    className,
    childEffectItemProps,
    children,
    ...props
}: CardActionProps) {
    const { childEffect } = React.useContext(CardContext);

    const content = (
        <Container 
            data-slot="card-action"
            direction="row"
            align="center"
            size="none"
            padded={false}
            centered={false}
            gap="0"
            className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
            {...(props as React.ComponentProps<typeof Container>)}
        >
            {children}
        </Container>
    );

    return <>{CHILD_EFFECT_REGISTRY[childEffect].renderChild('action', childEffectItemProps, content)}</>;
}

CardAction.displayName = 'CardAction';


// ─────────────────────────────────────────────────────────────
// CardContent — main body area using Container
// ─────────────────────────────────────────────────────────────

function CardContent({
    className,
    childEffectItemProps,
    children,
    ...props
}: CardContentProps) {
    const { size, childEffect } = React.useContext(CardContext);

    const content = (
        <Container
            data-slot="card-content"
            direction="col"
            size="none"
            padded={false}
            centered={false}
            gap="0"
            className={cn(cardContentVariants({ size }), className)}
            {...(props as React.ComponentProps<typeof Container>)}
        >
            {children}
        </Container>
    );

    return <>{CHILD_EFFECT_REGISTRY[childEffect].renderChild('content', childEffectItemProps, content)}</>;
}

CardContent.displayName = 'CardContent';


// ─────────────────────────────────────────────────────────────
// CardFooter — bottom strip using Container
// ─────────────────────────────────────────────────────────────

function CardFooter({
    className,
    childEffectItemProps,
    children,
    ...props
}: CardFooterProps) {
    const { size, childEffect } = React.useContext(CardContext);

    const content = (
        <Container
            data-slot="card-footer"
            direction="row"
            align="center"
            size="none"
            padded={false}
            centered={false}
            gap="3"
            className={cn(cardFooterVariants({ size }), className)}
            {...(props as React.ComponentProps<typeof Container>)}
        >
            {children}
        </Container>
    );

    return <>{CHILD_EFFECT_REGISTRY[childEffect].renderChild('footer', childEffectItemProps, content)}</>;
}

CardFooter.displayName = 'CardFooter';


// ─────────────────────────────────────────────────────────────
// CardImage — convenience image with positional radius handling
// ─────────────────────────────────────────────────────────────

interface CardImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    position?: 'top' | 'bottom' | 'middle';
    childEffectItemProps?: ChildEffectItemProps;
}

function CardImage({
    className,
    position = 'top',
    childEffectItemProps,
    ...props
}: CardImageProps) {
    const { childEffect } = React.useContext(CardContext);

    const positionClass = {
        top:    'rounded-t-xl',
        bottom: 'rounded-b-xl',
        middle: '',
    }[position];

    const content = (
        <img
            data-slot="card-image"
            className={cn('w-full object-cover', positionClass, className)}
            {...props}
        />
    );

    return <>{CHILD_EFFECT_REGISTRY[childEffect].renderChild('image', childEffectItemProps, content)}</>;
}

CardImage.displayName = 'CardImage';


// ─────────────────────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────────────────────

export {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardAction,
    CardContent,
    CardFooter,
    CardImage,
    CardContext,
};

// Re-export enums so consumers only need to import from './card'
export {
    CardVariant,
    CardSize,
    CardChildEffect,
    CardWrapperEffect,
    CardBackgroundEffect,
    CardBorderEffect,
} from './card.types';

export type {
    BaseCardProps,
    CardHeaderProps,
    CardTitleProps,
    CardDescriptionProps,
    CardActionProps,
    CardContentProps,
    CardFooterProps,
    CardEffectConfig,
    ChildEffectItemProps,
    PerspectiveChildEffectProps,
    PerspectiveEffectProps,
    PerspectiveEffectItemProps,
    FloatEffectProps,
    CometEffectProps,
    MagicEffectProps,
    CanvasEffectProps,
    AuroraBackgroundEffectProps,
    BorderBeamEffectProps,
    GradientBorderEffectProps,
    GradientHoverEffectProps,
} from './card.types';