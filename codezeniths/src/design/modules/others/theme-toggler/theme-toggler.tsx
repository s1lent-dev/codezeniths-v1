'use client';

import { useCallback, useRef } from 'react';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@codezeniths/design/cn';
import { Button, ButtonVariant, ButtonSize, ButtonEffect } from '@codezeniths/components';
import { useTheme } from './theme';

interface ThemeTogglerProps extends React.ComponentPropsWithoutRef<'button'> {
    duration?: number;
}

export const ThemeToggler = ({
    className,
    duration = 400,
    ...props
}: ThemeTogglerProps) => {
    const { isDark, mounted, toggleTheme } = useTheme(duration);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleToggle = useCallback(
        (event: React.MouseEvent<HTMLButtonElement>) => {
            const rect = buttonRef.current?.getBoundingClientRect();
            const x = rect ? rect.left + rect.width / 2 : event.clientX;
            const y = rect ? rect.top + rect.height / 2 : event.clientY;
            
            toggleTheme({ clientX: x, clientY: y });
        },
        [toggleTheme]
    );

    return (
        <Button
            type="button"
            ref={buttonRef}
            variant={ButtonVariant.ICON}
            size={ButtonSize.NONE}
            effect={ButtonEffect.NONE}
            onClick={handleToggle}
            className={cn('bg-transparent border-none p-0 hover:bg-transparent active:bg-transparent', className)}
            aria-label="Toggle theme"
            {...props}
        >
            {mounted ? (
                isDark ? (
                    <Sun className="size-6! text-muted-light dark:text-muted-dark cursor-pointer" />
                ) : (
                    <Moon className="size-6! text-muted-light dark:text-muted-dark cursor-pointer" />
                )
            ) : (
                <div className="size-6!" />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
};