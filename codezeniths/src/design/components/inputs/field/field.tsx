'use client';
import { useMemo } from 'react';
import { cva } from 'class-variance-authority';
import {
    Label,
    Separator,
    Typography,
    TypographyColor,
    TypographyEffect,
    TypographyVariant,
    TypographyWeight,
} from '@codezeniths/components';
import { cn } from '@codezeniths/design/cn';
import type {TypographyProps} from '@codezeniths/components'; 
import type { VariantProps } from 'class-variance-authority';

function FieldSet({ className, ...props }: React.ComponentProps<'fieldset'>) {
    return (
        <fieldset
            data-slot="field-set"
            className={cn(
                'gap-md-2 has-[>[data-slot=checkbox-group]]:gap-md-1 has-[>[data-slot=radio-group]]:gap-md-1 flex flex-col',
                className,
            )}
            {...props}
        />
    );
}

type FieldLegendProps = Omit<TypographyProps, keyof React.HTMLAttributes<any> | 'variant' | 'color' | 'as' | 'children'> & React.ComponentProps<'legend'> & {
    variant?: TypographyVariant.LEGEND | TypographyVariant.LABEL;
    color?: TypographyColor;
};

function FieldLegend({
    className,
    variant = TypographyVariant.LEGEND,
    weight = TypographyWeight.MEDIUM,
    color = TypographyColor.DEFAULT,
    effect: _effect = TypographyEffect.NONE,
    ...props
}: FieldLegendProps) {
    return (
        <Typography
            as="legend"
            data-slot="field-legend"
            data-variant={variant}
            variant={variant}
            effect={TypographyEffect.NONE}
            weight={weight}
            color={color}
            className={cn('mb-sm-2', className)}
            {...(props as any)}
        />
    );
}

const fieldVariants = cva('data-[invalid=true]:text-destructive gap-sm-2 group/field flex w-full', {
    variants: {
        orientation: {
            vertical: 'flex-col *:w-full [&>.sr-only]:w-auto',
            horizontal: 'flex-row items-center *:data-[slot=field-label]:flex-auto has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-xs-2',
            responsive: 'flex-col *:w-full [&>.sr-only]:w-auto @md/field-group:flex-row @md/field-group:items-center @md/field-group:*:w-auto @md/field-group:*:data-[slot=field-label]:flex-auto @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-xs-2',
        },
    },
    defaultVariants: {
        orientation: 'vertical',
    },
});

function Field({
    className,
    orientation = 'vertical',
    ...props
}: React.ComponentProps<'div'> & VariantProps<typeof fieldVariants>) {
    return (
        <div
            role="group"
            data-slot="field"
            data-orientation={orientation}
            className={cn(fieldVariants({ orientation }), className)}
            {...props}
        />
    );
}

function FieldContent({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="field-content"
            className={cn(
                'gap-xs-2 group/field-content flex flex-1 flex-col leading-snug',
                className,
            )}
            {...props}
        />
    );
}

function FieldLabel({ className, ...props }: React.ComponentProps<typeof Label>) {
    return (
        <Label
            data-slot="field-label"
            className={cn(
                'has-data-checked:bg-primary/5 has-data-checked:border-primary/30 dark:has-data-checked:border-primary/20 dark:has-data-checked:bg-primary/10 gap-sm-2 group-data-[disabled=true]/field:opacity-50 has-[>[data-slot=field]]:rounded-lg has-[>[data-slot=field]]:border *:data-[slot=field]:p-md-1 group/field-label peer/field-label flex w-fit leading-snug',
                'has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col',
                className,
            )}
            {...props}
        />
    );
}

type FieldTitleProps = Omit<TypographyProps, keyof React.HTMLAttributes<any> | 'variant' | 'as' | 'children' | 'color'> & React.ComponentProps<'div'> & {
    color?: TypographyColor;
};

function FieldTitle({ 
    className, 
    color = TypographyColor.DEFAULT, 
    effect: _effect = TypographyEffect.NONE,
    weight = TypographyWeight.MEDIUM, 
    ...props 
}: FieldTitleProps) {
    return (
        <Typography
            as="div"
            data-slot="field-label"
            variant={TypographyVariant.LABEL}
            weight={weight}
            color={color}
            className={cn(
                'gap-sm-2 text-p group-data-[disabled=true]/field:opacity-50 flex w-fit items-center leading-snug',
                className,
            )}
            {...(props as any)}
        />
    );
}

type FieldDescriptionProps = Omit<TypographyProps, keyof React.HTMLAttributes<any> | 'as' | 'children' | 'color'> & React.ComponentProps<'p'> & {
    color?: TypographyColor;
};

function FieldDescription({
    className,
    variant = TypographyVariant.MUTED,
    color = TypographyColor.MUTED,
    effect: _effect = TypographyEffect.NONE,
    ...props
}: FieldDescriptionProps) {
    return (
        <Typography
            as="p"
            data-slot="field-description"
            variant={variant}
            effect={TypographyEffect.NONE}
            color={color}
            className={cn(
                'text-left text-p [[data-variant=legend]+&]:-mt-sm-2 leading-normal font-normal group-has-data-horizontal/field:text-balance',
                'last:mt-0 nth-last-2:-mt-xs-2',
                '[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4',
                className,
            )}
            {...(props as any)}
        />
    );
}

interface FieldSeparatorProps extends React.ComponentProps<'div'> {
    children?: React.ReactNode;
}

function FieldSeparator({ children, className, ...props }: FieldSeparatorProps) {
    return (
        <div
            data-slot="field-separator"
            data-content={!!children}
            className={cn('-my-sm-2 h-lg-1 text-p group-data-[variant=outline]/field-group:-mb-sm-2 relative', className)}
            {...props}
        >
            <Separator className="absolute inset-0 top-1/2" />
            {children && (
                <Typography
                    as="span"
                    variant={TypographyVariant.MUTED}
                    className="px-sm-2 bg-foreground-light dark:bg-foreground-dark relative mx-auto block w-fit text-p"
                    data-slot="field-separator-content"
                    effect={TypographyEffect.NONE}
                >
                    {children}
                </Typography>
            )}
        </div>
    );
}

type FieldErrorProps = Omit<TypographyProps, keyof React.HTMLAttributes<any> | 'color' | 'as' | 'children'> & React.ComponentProps<'div'> & {
    errors?: Array<{ message?: string } | undefined>;
    color?: TypographyColor;
};

function FieldError({
    className,
    children,
    errors,
    variant = TypographyVariant.MUTED,
    effect: _effect = TypographyEffect.NONE,
    color = TypographyColor.DESTRUCTIVE,
    ...props
}: FieldErrorProps) {
    const content = useMemo(() => {
        if (children) {return children;}

        if (!errors?.length) {return null;}

        const uniqueErrors = [
            ...new Map(errors.map((error) => [error?.message, error])).values(),
        ];

        if (uniqueErrors.length === 1) {
            return uniqueErrors[0]?.message;
        }

        return (
            <ul className="ml-md-2 flex list-disc flex-col gap-xs-2">
                {uniqueErrors.map(
                    (error, index) =>
                        error?.message && <li key={index}>{error.message}</li>,
                )}
            </ul>
        );
    }, [children, errors]);

    if (!content) {return null;}

    return (
        <Typography
            as="div"
            role="alert"
            data-slot="field-error"
            variant={variant}
            effect={TypographyEffect.NONE}
            color={color}
            className={cn('text-p font-normal', className)}
            {...(props as any)}
        >
            {content}
        </Typography>
    );
}

function FieldGroup({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="field-group"
            className={cn(
                'gap-lg-1 data-[slot=checkbox-group]:gap-md-1 *:data-[slot=field-group]:gap-md-2 group/field-group @container/field-group flex w-full flex-col',
                className,
            )}
            {...props}
        />
    );
}

export {
    Field,
    FieldLabel,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLegend,
    FieldSeparator,
    FieldSet,
    FieldContent,
    FieldTitle,
};