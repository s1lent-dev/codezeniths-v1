import { cva } from 'class-variance-authority';
import { ButtonEffect, ButtonSize, ButtonVariant } from './button.types';

export const buttonVariants = cva(
    [
        'inline-flex items-center justify-center gap-2',
        'whitespace-nowrap rounded-md text-sm font-medium',
        '',
        'disabled:pointer-events-none disabled:opacity-60 cursor-pointer',
        '[&_svg]:pointer-events-none [&_svg]:shrink-0',
        'outline-none focus-visible:ring-0 focus-visible:ring-none focus-visible:ring-offset-0 focus-visible:ring-offset-none',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
    ],
    {
        variants: {
            variant: {
                [ButtonVariant.DEFAULT]: [
                    'dark:bg-primary dark:text-foreground-light',
                    'dark:hover:bg-primary-shade1 dark:active:bg-primary-shade2',
                    'bg-primary text-foreground-dark',
                    'hover:bg-primary-shade1 active:bg-primary-shade2',
                ].join(' '),

                [ButtonVariant.OUTLINE]: [
                    'dark:bg-transparent dark:border dark:border-secondary dark:text-foreground-light',
                    'dark:hover:bg-secondary/10 dark:active:bg-secondary/15',
                    'bg-transparent border border-secondary text-foreground-dark',
                    'hover:bg-secondary/5 active:bg-secondary/10',
                ].join(' '),

                [ButtonVariant.SECONDARY]:  [
                    'dark:bg-foreground-dark dark:border dark:border-secondary-shade1 dark:text-foreground-light-shade3',
                    'dark:hover:bg-foreground-dark-shade1 dark:active:bg-foreground-dark-shade2',
                    'bg-foreground-light border border-secondary-shade2 text-foreground-dark-shade2',
                    'hover:bg-foreground-light-shade1 active:bg-foreground-light-shade2',
                ].join(' '),

                [ButtonVariant.GHOST]:  [
                    'bg-transparent text-heading-light dark:text-heading-dark',
                    'hover:bg-foreground-light-shade1 dark:hover:bg-foreground-dark-shade1 active:bg-foreground-light-shade2',
                ].join(' '),

                [ButtonVariant.ERROR]: [
                    'bg-destructive/10 text-destructive',
                    'hover:bg-destructive/20 focus-visible:ring-destructive/20 focus-visible:border-destructive/40',
                    'dark:focus-visible:ring-destructive/40 dark:bg-destructive/20 dark:hover:bg-destructive/30',
                ].join(' '),

                [ButtonVariant.SUCCESS]: [
                    'bg-success text-success',
                    'hover:bg-success-shade1 focus-visible:ring-success focus-visible:border-success-shade1',
                    'dark:focus-visible:ring-success dark:bg-success-shade1 dark:hover:bg-success-shade2',
                ].join(' '),

                [ButtonVariant.INFO]: [
                    'bg-info text-info',
                    'hover:bg-info-shade1 focus-visible:ring-info focus-visible:border-info-shade1',
                    'dark:focus-visible:ring-info dark:bg-info-shade1 dark:hover:bg-info-shade2',
                ].join(' '),

                [ButtonVariant.LINK]: [
                    'bg-transparent underline-offset-4 hover:underline text-primary',
                    'dark:text-primary-shade1',
                ].join(' '),
                
                [ButtonVariant.ICON]: [
                    'bg-transparent text-current border-none p-0',
                    'hover:bg-transparent active:bg-transparent',
                ].join(' '),
            },
            size: {
                [ButtonSize.DEFAULT]: 'h-9 px-md-2 py-sm-2 has-[>svg]:px-md-2',
                [ButtonSize.XS]: 'h-7 rounded-md gap-sm-1 px-sm-2 has-[>svg]:px-xs-2',
                [ButtonSize.SM]: 'h-8 rounded-md gap-sm-1 px-sm-2 has-[>svg]:px-sm-2',
                [ButtonSize.LG]: 'h-10 px-lg-1 has-[>svg]:px-lg-1 py-md-2',
                [ButtonSize.ICON]: 'size-9 p-0',  
                [ButtonSize.ICON_XS]: 'size-6 p-xs-1',
                [ButtonSize.ICON_SM]: 'size-7 p-sm-1',
                [ButtonSize.ICON_LG]: 'size-10 p-md-1',
                [ButtonSize.NONE]: '',
            },
            effect: {
                [ButtonEffect.NONE]: '',
                [ButtonEffect.SHIMMER]: [
                    'group relative z-0 overflow-hidden border-transparent font-sans rounded-full px-lg-1 py-md-1',
                    'dark:text-foreground-light dark:bg-foreground-dark hover:dark:bg-transparent active:dark:bg-transparent',
                    'text-foreground-dark bg-foreground-light hover:bg-transparent active:bg-transparent',
                    'transform-gpu cursor-pointer',
                ].join(' '),

                [ButtonEffect.RIPPLE]: [
                    'relative overflow-hidden border',
                    'dark:bg-foreground-dark dark:text-foreground-light',
                    'border-secondary bg-foreground-light text-foreground-dark',
                    'cursor-pointer',
                ].join(' '),

                [ButtonEffect.SHINY]: '',

                [ButtonEffect.INTERACTIVE_HOVER]:  [
                    'group relative overflow-hidden rounded-full border border-transparent',
                    'dark:bg-foreground-dark dark:text-foreground-light dark:font-semibold',
                    'bg-foreground-light text-foreground-dark font-semibold',
                    'hover:bg-primary active:bg-primary-shade1 dark:hover:bg-primary dark:active:bg-primary-shade1',
                    'px-xl-1 py-lg-2 cursor-pointer',
                ].join(' '),

                [ButtonEffect.GRADIENT_HOVER]: [
                    'relative flex rounded-full content-center transition duration-500items-center flex-col flex-nowrap gap-10 h-min justify-center overflow-visible p-px decoration-clone w-fit',        
                    'bg-foreground-light hover:bg-foreground-light-shade1 dark:bg-foreground-dark dark:hover:bg-foreground-dark-shade1',
                    'border border-transparent dark:border-secondary-shade3 cursor-pointer',
                ].join(' '),
                
                [ButtonEffect.PULSATING]:  [ 
                    'relative border',
                    'dark:bg-primary dark:text-foreground-light hover:dark:bg-primary-shade3 active:dark:bg-primary-shade2',
                    'border-secondary bg-primary text-foreground-dark',
                    'cursor-pointer',
                ].join(' '),
            },
        },
        defaultVariants: {
            variant: ButtonVariant.DEFAULT,
            size: ButtonSize.DEFAULT,
            effect: ButtonEffect.NONE,
        },
    },
);

export type ButtonVariantsType = typeof buttonVariants;