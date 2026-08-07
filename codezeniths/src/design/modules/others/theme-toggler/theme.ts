'use client';

import { useCallback, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

export type Theme = 'light' | 'dark';

export function useTheme(duration = 400) {
    const [isDark, setIsDark] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        
        // Retrieve and apply the theme from localStorage on initial mount
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else if (savedTheme === 'light' || !savedTheme) {
            document.documentElement.classList.remove('dark');
            if (!savedTheme) {
                localStorage.setItem('theme', 'light');
            }
        }

        const updateTheme = () => {
            setIsDark(document.documentElement.classList.contains('dark'));
        };

        updateTheme();

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    updateTheme();
                }
            });
        });
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });

        return () => observer.disconnect();
    }, []);

    const applyTheme = useCallback((newIsDark: boolean, position?: { clientX: number, clientY: number }) => {
        if (typeof document === 'undefined') return;

        const isAppearanceTransition =
            position &&
            'startViewTransition' in document &&
            !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!isAppearanceTransition) {
            setIsDark(newIsDark);
            if (newIsDark) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
            return;
        }

        const x = position.clientX;
        const y = position.clientY;
        const endRadius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
        );

        const style = document.createElement('style');
        style.textContent = `
            ::view-transition-old(root),
            ::view-transition-new(root) {
                animation: none;
                mix-blend-mode: normal;
            }
            ::view-transition-old(root) {
                z-index: 1;
            }
            ::view-transition-new(root) {
                z-index: 2;
            }
        `;
        document.head.appendChild(style);

        const transition = document.startViewTransition(() => {
            flushSync(() => {
                setIsDark(newIsDark);
                if (newIsDark) {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
                localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
            });
        });

        transition.ready.then(() => {
            const clipPath = [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`,
            ];
            document.documentElement.animate(
                {
                    clipPath,
                },
                {
                    duration,
                    easing: 'ease-out',
                    pseudoElement: '::view-transition-new(root)',
                }
            );
        });

        transition.finished.then(() => {
            style.remove();
        });
    }, [duration]);

    const toggleTheme = useCallback((position?: { clientX: number, clientY: number }) => {
        applyTheme(!isDark, position);
    }, [isDark, applyTheme]);

    const setTheme = useCallback((theme: Theme, position?: { clientX: number, clientY: number }) => {
        applyTheme(theme === 'dark', position);
    }, [applyTheme]);

    return { theme: isDark ? 'dark' as const : 'light' as const, isDark, mounted, toggleTheme, setTheme };
}
