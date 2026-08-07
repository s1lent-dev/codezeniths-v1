import { cva } from 'class-variance-authority';
import { 
    TypographyAlign, 
    TypographyColor, 
    TypographyEffect, 
    TypographyFont, 
    TypographyVariant,
    TypographyWeight,
} from './typography.types';

export const typographyVariants = cva(
    [
        'transition-colors duration-200',
    ],
    {
        variants: {
            variant: {
                [TypographyVariant.H1]: [
                    'typography-h1',
                    'dark:text-heading-dark',
                    'text-heading-light',
                ].join(' '),

                [TypographyVariant.H2]: [
                    'typography-h2',
                    'dark:text-heading-dark-shade1',
                    'text-heading-light-shade1',
                ].join(' '),

                [TypographyVariant.H3]: [
                    'typography-h3',
                    'dark:text-heading-dark-shade2',
                    'text-heading-light-shade2',
                ].join(' '),

                [TypographyVariant.H4]: [
                    'typography-h4',
                    'dark:text-heading-dark-shade3',
                    'text-heading-light-shade3',
                ].join(' '),

                [TypographyVariant.H5]: [
                    'typography-h5',
                    'dark:text-body-dark',
                    'text-body-light',
                ].join(' '),

                [TypographyVariant.H6]: [
                    'typography-h6',
                    'dark:text-muted-dark',
                    'text-muted-light',
                ].join(' '),

                [TypographyVariant.P]: [
                    'typography-p',
                    'dark:text-body-dark',
                    'text-body-light',
                ].join(' '),

                [TypographyVariant.SPAN]: [
                    'typography-span',
                    'dark:text-muted-dark',
                    'text-muted-light-shade1',
                ].join(' '),

                [TypographyVariant.LABEL]: [
                    'typography-label',
                    'dark:text-secondary',
                    'text-secondary',
                ].join(' '),

                [TypographyVariant.CAPTION]: [
                    'typography-caption',
                    'dark:text-body-dark-shade3',
                    'text-body-light-shade3',
                ].join(' '),

                [TypographyVariant.MUTED]: [
                    'typography-p',
                    'dark:text-muted-dark-shade1',
                    'text-muted-light-shade2',
                    'opacity-70',
                ].join(' '),

                [TypographyVariant.LEAD]: [
                    'typography-h5',
                    'dark:text-heading-dark',
                    'text-heading-light-shade3',
                ].join(' '),

                [TypographyVariant.BLOCKQUOTE]: [
                    'typography-p',
                    'border-l-4',
                    'dark:border-primary-shade3',
                    'border-secondary-shade2',
                    'pl-md-2',
                    'italic',
                    'dark:text-primary-shade1',
                    'text-primary-shade2',
                ].join(' '),

                [TypographyVariant.CODE]: [
                    'typography-span',
                    'font-mono',
                    'dark:bg-foreground-dark-shade2',
                    'bg-foreground-light-shade2',
                    'dark:text-pink',
                    'text-pink-shade3',
                    'px-sm-1',
                    'py-xs-2',
                    'rounded-sm',
                ].join(' '),

                [TypographyVariant.LEGEND]: [
                    'typography-legend',
                    'dark:text-muted-dark',
                    'text-muted-light',
                ].join(' '),
            },

            weight: {
                [TypographyWeight.EXTRATHIN]: 'font-extrathin',
                [TypographyWeight.THIN]: 'font-thin',
                [TypographyWeight.EXTRALIGHT]: 'font-extralight',
                [TypographyWeight.LIGHT]: 'font-light',
                [TypographyWeight.NORMAL]: 'font-normal',
                [TypographyWeight.MEDIUM]: 'font-medium',
                [TypographyWeight.SEMIBOLD]: 'font-semibold',
                [TypographyWeight.BOLD]: 'font-bold',
                [TypographyWeight.EXTRABOLD]: 'font-extrabold',
                [TypographyWeight.SUPERBOLD]: 'font-superbold',
            },

            align: {
                [TypographyAlign.LEFT]: 'text-left',
                [TypographyAlign.CENTER]: 'text-center',
                [TypographyAlign.RIGHT]: 'text-right',
                [TypographyAlign.JUSTIFY]: 'text-justify',
            },

            color: {
                [TypographyColor.DEFAULT]: '',
                [TypographyColor.HEADING]: [
                    'dark:text-heading-dark',
                    'text-heading-light-shade3',
                ].join(' '),
                [TypographyColor.PRIMARY]: [
                    'dark:text-primary',
                    'text-primary-shade3',
                ].join(' '),
                [TypographyColor.SECONDARY]: [
                    'dark:text-secondary',
                    'text-secondary-shade2',
                ].join(' '),
                [TypographyColor.BODY]: [
                    'dark:text-body-dark',
                    'text-body-light',
                ].join(' '),
                [TypographyColor.MUTED]: [
                    'dark:text-muted-dark',
                    'text-muted-light',
                    'opacity-60',
                ].join(' '),
                [TypographyColor.DESTRUCTIVE]: [
                    'dark:text-destructive',
                    'text-destructive-shade3',
                ].join(' '),
                [TypographyColor.SUCCESS]: [
                    'dark:text-success',
                    'text-success-shade3',
                ].join(' '),
                [TypographyColor.WARNING]: [
                    'dark:text-warning',
                    'text-warning-shade3',
                ].join(' '),
                [TypographyColor.INFO]: [
                    'dark:text-info',
                    'text-info-shade3',
                ].join(' '),

            },

            font: {
                [TypographyFont.SANS]: 'font-sans',
                [TypographyFont.SERIF]: 'font-serif',
                [TypographyFont.MONO]: 'font-mono',
                [TypographyFont.LOGO]: 'font-logo',
            },

            effect: {
                [TypographyEffect.NONE]: '',
                [TypographyEffect.AURORA]: [
                    'relative inline-block',
                ].join(' '),
                [TypographyEffect.SHINY]: [
                    'mx-auto max-w-md',
                ].join(' '),
                [TypographyEffect.GRADIENT]: [
                    'inline bg-clip-text text-transparent',
                ].join(' '),
                [TypographyEffect.MORPHING]: [
                    'relative mx-auto text-center font-sans leading-none font-bold',
                ].join(' '),
                [TypographyEffect.TYPING]: [
                    'inline-block',
                ].join(' '),
                [TypographyEffect.ANIMATE]: [
                    'whitespace-pre-wrap',
                ].join(' '),
            },

            truncate: {
                true: 'truncate',
                false: '',
            },

            italic: {
                true: 'italic',
                false: '',
            },

            underline: {
                true: 'underline underline-offset-4',
                false: '',
            },

            strikethrough: {
                true: 'line-through',
                false: '',
            },
        },
        defaultVariants: {
            variant: TypographyVariant.P,
            align: TypographyAlign.LEFT,
            color: TypographyColor.DEFAULT,
            font: TypographyFont.SANS,
            effect: TypographyEffect.NONE,
            truncate: false,
            italic: false,
            underline: false,
            strikethrough: false,
        },
    },
);

export type TypographyVariantsType = typeof typographyVariants;