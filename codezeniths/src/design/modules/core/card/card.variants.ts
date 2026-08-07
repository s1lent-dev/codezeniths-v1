import { cva } from 'class-variance-authority';
import { CardSize, CardVariant } from './card.types';

// ─────────────────────────────────────────────────────────────
// Base card variants
// ─────────────────────────────────────────────────────────────

export const cardVariants = cva(
    [
        // Base structural styles
        'relative overflow-hidden rounded-xl',
        'transition-all duration-300 ease-out',
        'flex flex-col',
        'group/card',
    ],
    {
        variants: {
            variant: {
                [CardVariant.DEFAULT]: [
                    'bg-foreground-dark',
                    'text-body-dark',
                    'ring-1 ring-primary-shade3/20',
                    'shadow-lg shadow-background-dark/40',
                ].join(' '),

                [CardVariant.OUTLINED]: [
                    'bg-transparent',
                    'text-body-dark',
                    'border border-primary-shade3/30',
                    'hover:border-primary-shade3/60',
                    'shadow-sm',
                ].join(' '),

                [CardVariant.GHOST]: [
                    'bg-foreground-dark/30',
                    'text-body-dark',
                    'backdrop-blur-sm',
                    'hover:bg-foreground-dark/50',
                ].join(' '),

                [CardVariant.ELEVATED]: [
                    'bg-foreground-dark-shade1',
                    'text-body-dark',
                    'shadow-xl shadow-background-dark/60',
                    'ring-1 ring-primary-shade3/10',
                    'hover:shadow-2xl hover:shadow-primary/10',
                    'hover:-translate-y-0.5',
                ].join(' '),

                [CardVariant.GLASS]: [
                    'bg-foreground-dark/20',
                    'text-body-dark',
                    'backdrop-blur-xl',
                    'border border-white/10',
                    'shadow-xl shadow-background-dark/30',
                    'hover:bg-foreground-dark/30',
                    'hover:border-white/20',
                ].join(' '),

                [CardVariant.FLAT]: [
                    'bg-background-dark-shade1',
                    'text-body-dark',
                    'border-none',
                    'shadow-none',
                ].join(' '),
            },

            size: {
                [CardSize.XS]: 'gap-xs-2',
                [CardSize.SM]: 'gap-sm-2',
                [CardSize.DEFAULT]: 'gap-sm-2',
                [CardSize.LG]: 'gap-md-1',
                [CardSize.XL]: 'gap-md-2',
            },
        },

        defaultVariants: {
            variant: CardVariant.DEFAULT,
            size: CardSize.DEFAULT,
        },
    },
);

// ─────────────────────────────────────────────────────────────
// Card header variants
// ─────────────────────────────────────────────────────────────

export const cardHeaderVariants = cva(
    [
        'grid auto-rows-min items-start',
        'rounded-t-xl',
        'has-[data-slot=card-action]:grid-cols-[1fr_auto]',
        'has-[data-slot=card-description]:grid-rows-[auto_auto]',
    ],
    {
        variants: {
            size: {
                [CardSize.XS]: 'px-sm-2 py-xs-2 gap-xs-2',
                [CardSize.SM]: 'px-md-1 py-sm-1 gap-sm-1',
                [CardSize.DEFAULT]: 'px-md-2 py-sm-2 gap-sm-2',
                [CardSize.LG]: 'px-lg-1 py-md-1 gap-sm-2',
                [CardSize.XL]: 'px-lg-2 py-md-2 gap-md-1',
            },
        },
        defaultVariants: {
            size: CardSize.DEFAULT,
        },
    },
);

// ─────────────────────────────────────────────────────────────
// Card content variants
// ─────────────────────────────────────────────────────────────

export const cardContentVariants = cva(
    ['flex flex-col'],
    {
        variants: {
            size: {
                [CardSize.XS]: 'px-sm-2 gap-xs-2',
                [CardSize.SM]: 'px-md-1 gap-sm-1',
                [CardSize.DEFAULT]: 'px-md-2 gap-sm-2',
                [CardSize.LG]: 'px-lg-1 gap-md-1',
                [CardSize.XL]: 'px-lg-2 gap-md-1',
            },
        },
        defaultVariants: {
            size: CardSize.DEFAULT,
        },
    },
);

// ─────────────────────────────────────────────────────────────
// Card footer variants
// ─────────────────────────────────────────────────────────────

export const cardFooterVariants = cva(
    [
        'flex flex-row items-center',
        'rounded-b-xl',
        'border-t border-t-primary-shade3/10',
        'bg-foreground-dark/30',
    ],
    {
        variants: {
            size: {
                [CardSize.XS]: 'px-sm-2 py-xs-2 gap-xs-2',
                [CardSize.SM]: 'px-md-1 py-sm-1 gap-sm-1',
                [CardSize.DEFAULT]: 'px-md-2 py-sm-2 gap-sm-2',
                [CardSize.LG]: 'px-lg-1 py-md-1 gap-md-1',
                [CardSize.XL]: 'px-lg-2 py-md-2 gap-md-1',
            },
        },
        defaultVariants: {
            size: CardSize.DEFAULT,
        },
    },
);