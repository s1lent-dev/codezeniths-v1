'use client';
// components/ui/container.tsx
import * as React from 'react';
import { cn } from '@codezeniths/design/cn';
import {
    ContainerProps,
    alignMap,
    justifyMap,
    dirMap,
    maxWidthMap
} from './container.types';
function getContainerClasses({
    className,
    align,
    justify,
    direction,
    gap,
    size,
    padded,
    centered,
}: ContainerProps) {
    return cn(
        (direction || align || justify || gap) && 'flex',
        direction && dirMap[direction],
        align && alignMap[align],
        justify && justifyMap[justify],
        gap && `gap-${gap}`,
        centered && 'mx-auto',
        size && size !== 'none' && maxWidthMap[size],
        padded && 'px-4 sm:px-6 lg:px-8',
        className
    );
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
    ({ className, align, justify, direction, gap, size, padded, centered, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={getContainerClasses({ className, align, justify, direction, gap, size, padded, centered })}
                {...props}
            >
                {children}
            </div>
        );
    }
);
Container.displayName = 'Container';

const Main = React.forwardRef<
    HTMLElement,
    Omit<ContainerProps, 'asChild'> & { as?: never }
>(({ className, align, justify, direction, gap, size, padded, centered, children, ...props }, ref) => (
    <main ref={ref} className={getContainerClasses({ className, align, justify, direction, gap, size, padded, centered })} {...props}>
        {children}
    </main>
));
Main.displayName = 'Main';

const Section = React.forwardRef<
    HTMLElement,
    Omit<ContainerProps, 'asChild'> & { as?: never }
>(({ className, align, justify, direction, gap, size, padded, centered, children, ...props }, ref) => (
    <section ref={ref} className={getContainerClasses({ className, align, justify, direction, gap, size, padded, centered })} {...props}>
        {children}
    </section>
));
Section.displayName = 'Section';

const Nav = React.forwardRef<
    HTMLElement,
    Omit<ContainerProps, 'asChild'> & { as?: never }
>(({ className, align, justify, direction, gap, size, padded, centered, children, ...props }, ref) => (
    <nav ref={ref} className={getContainerClasses({ className, align, justify, direction, gap, size, padded, centered })} {...props}>
        {children}
    </nav>
));
Nav.displayName = 'Nav';

const Article = React.forwardRef<
    HTMLElement,
    Omit<ContainerProps, 'asChild'> & { as?: never }
>(({ className, align, justify, direction, gap, size, padded, centered, children, ...props }, ref) => (
    <article ref={ref} className={getContainerClasses({ className, align, justify, direction, gap, size, padded, centered })} {...props}>
        {children}
    </article>
));
Article.displayName = 'Article';

const Aside = React.forwardRef<
    HTMLElement,
    Omit<ContainerProps, 'asChild'> & { as?: never }
>(({ className, align, justify, direction, gap, size, padded, centered, children, ...props }, ref) => (
    <aside ref={ref} className={getContainerClasses({ className, align, justify, direction, gap, size, padded, centered })} {...props}>
        {children}
    </aside>
));
Aside.displayName = 'Aside';

export {
    Container,   
    Main,
    Section,
    Article,
    Aside,
    Nav
};
export type { ContainerProps };
