'use client';
import { forwardRef, useMemo } from 'react';
import * as React from 'react';
import { cn } from '@codezeniths/design/cn';
import { typographyVariants } from './typography.variants';
import { useAllEffectHooks } from './typography.effect-registry';
import {
    TypographyAlign,
    TypographyColor,
    TypographyEffect,
    TypographyFont,
    TypographyVariant,
    TypographyWeight,
    TYPOGRAPHY_EFFECT_PROP_KEYS,
} from './typography.types';
import type { TypographyProps, SharedTypographyProps } from './typography.types';

const variantElementMap: Record<TypographyVariant, React.ElementType> = {
    [TypographyVariant.H1]: 'h1',
    [TypographyVariant.H2]: 'h2',
    [TypographyVariant.H3]: 'h3',
    [TypographyVariant.H4]: 'h4',
    [TypographyVariant.H5]: 'h5',
    [TypographyVariant.H6]: 'h6',
    [TypographyVariant.P]: 'p',
    [TypographyVariant.SPAN]: 'span',
    [TypographyVariant.LABEL]: 'label',
    [TypographyVariant.CAPTION]: 'span',
    [TypographyVariant.MUTED]: 'p',
    [TypographyVariant.LEAD]: 'p',
    [TypographyVariant.BLOCKQUOTE]: 'blockquote',
    [TypographyVariant.CODE]: 'code',
    [TypographyVariant.LEGEND]: 'legend',
};

function extractEffectProps(props: Record<string, any>) {
    const result: Record<string, any> = {};
    for (const key of TYPOGRAPHY_EFFECT_PROP_KEYS) {
        if (key in props) {
            result[key] = props[key];
        }
    }
    return result;
}

function omitEffectProps(props: Record<string, any>) {
    const result = { ...props };
    for (const key of TYPOGRAPHY_EFFECT_PROP_KEYS) {
        delete result[key];
    }
    return result;
}

const Typography = forwardRef<HTMLElement, TypographyProps>(
    (
        {
            className,
            variant = TypographyVariant.P,
            weight,
            align,
            color,
            font,
            effect = TypographyEffect.NONE,
            as,
            truncate = false,
            italic = false,
            underline = false,
            strikethrough = false,
            children,
            ...props
        },
        ref,
    ) => {
        const elementType = as || variantElementMap[variant];

        // Separate effect props
        const effectProps = extractEffectProps(props);
        const nativeProps = omitEffectProps(props);

        const baseClassName = useMemo(() => {
            return cn(
                typographyVariants({
                    variant,
                    weight,
                    align,
                    color,
                    font,
                    effect,
                    truncate,
                    italic,
                    underline,
                    strikethrough,
                    className,
                }),
            );
        }, [variant, weight, align, color, font, effect, truncate, italic, underline, strikethrough, className]);

        const shared: SharedTypographyProps = {
            nativeProps: {
                ...nativeProps,
                forwardedRef: ref, // Pass forwarded ref to shared props
            },
            className: baseClassName,
            children,
            elementType,
        };

        const { rootProps, effectChildren } = useAllEffectHooks(effect, effectProps, shared);

        const isSelfRootEffect = 
            effect === TypographyEffect.TYPING || 
            effect === TypographyEffect.ANIMATE || 
            effect === TypographyEffect.MORPHING;

        if (isSelfRootEffect) {
            return <>{effectChildren}</>;
        }

        return React.createElement(
            elementType,
            {
                ref,
                className: cn(baseClassName, rootProps.className),
                style: rootProps.style,
                'data-variant': variant,
                'data-effect': effect,
                ...nativeProps,
                ...rootProps,
            },
            effectChildren,
        );
    },
);

Typography.displayName = 'Typography';

// Export convenience components for common variants
const H1 = forwardRef<HTMLHeadingElement, Omit<TypographyProps, 'variant'>>(
    (props, ref) => <Typography ref={ref} {...props} variant={TypographyVariant.H1} effect={TypographyEffect.NONE} />,
);
H1.displayName = 'H1';

const H2 = forwardRef<HTMLHeadingElement, Omit<TypographyProps, 'variant'>>(
    (props, ref) => <Typography ref={ref} {...props} variant={TypographyVariant.H2} effect={TypographyEffect.NONE} />,
);
H2.displayName = 'H2';

const H3 = forwardRef<HTMLHeadingElement, Omit<TypographyProps, 'variant'>>(
    (props, ref) => <Typography ref={ref} {...props} variant={TypographyVariant.H3} effect={TypographyEffect.NONE} />,
);
H3.displayName = 'H3';

const H4 = forwardRef<HTMLHeadingElement, Omit<TypographyProps, 'variant'>>(
    (props, ref) => <Typography ref={ref} {...props} variant={TypographyVariant.H4} effect={TypographyEffect.NONE} />,
);
H4.displayName = 'H4';

const H5 = forwardRef<HTMLHeadingElement, Omit<TypographyProps, 'variant'>>(
    (props, ref) => <Typography ref={ref} {...props} variant={TypographyVariant.H5} effect={TypographyEffect.NONE} />,
);
H5.displayName = 'H5';

const H6 = forwardRef<HTMLHeadingElement, Omit<TypographyProps, 'variant'>>(
    (props, ref) => <Typography ref={ref} {...props} variant={TypographyVariant.H6} effect={TypographyEffect.NONE} />,
);
H6.displayName = 'H6';

const P = forwardRef<HTMLParagraphElement, Omit<TypographyProps, 'variant'>>(
    (props, ref) => <Typography ref={ref} {...props} variant={TypographyVariant.P} effect={TypographyEffect.NONE} />,
);
P.displayName = 'P';

const Lead = forwardRef<HTMLParagraphElement, Omit<TypographyProps, 'variant'>>(
    (props, ref) => <Typography ref={ref} {...props} variant={TypographyVariant.LEAD} effect={TypographyEffect.NONE} />,
);
Lead.displayName = 'Lead';

const Muted = forwardRef<HTMLParagraphElement, Omit<TypographyProps, 'variant'>>(
    (props, ref) => <Typography ref={ref} {...props} variant={TypographyVariant.MUTED} effect={TypographyEffect.NONE} />,
);
Muted.displayName = 'Muted';

const Blockquote = forwardRef<HTMLQuoteElement, Omit<TypographyProps, 'variant'>>(
    (props, ref) => <Typography ref={ref} {...props} variant={TypographyVariant.BLOCKQUOTE} effect={TypographyEffect.NONE} />,
);
Blockquote.displayName = 'Blockquote';

const InlineCode = forwardRef<HTMLElement, Omit<TypographyProps, 'variant'>>(
    (props, ref) => <Typography ref={ref} {...props} variant={TypographyVariant.CODE} effect={TypographyEffect.NONE} />,
);
InlineCode.displayName = 'InlineCode';

export {
    Typography,
    typographyVariants,
    H1,
    H2,
    H3,
    H4,
    H5,
    H6,
    P,
    Lead,
    Muted,
    Blockquote,
    InlineCode,
};

export type { TypographyProps };

export {
    TypographyVariant,
    TypographyWeight,
    TypographyAlign,
    TypographyColor,
    TypographyFont,
    TypographyEffect,
};