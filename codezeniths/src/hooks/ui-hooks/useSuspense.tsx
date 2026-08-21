'use client';

import { lazy, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import type { ComponentType, FC, JSX, LazyExoticComponent, ReactNode } from 'react';

/**
 * @function useSuspense
 * Wraps a lazily loaded component with React `Suspense` and `ErrorBoundary`.
 * @template T Props of the lazy component.
 * @param loader Dynamic import function returning the component.
 * @param fallback UI shown while loading.
 * @param errorFallback UI shown on error.
 * @returns A functional component with built-in loading and error handling.
 *
 * @example
 * const LazyChart = useSuspense(() => import('./Chart'), <Spinner />, <ErrorMessage />);
 * return <LazyChart data={chartData} />;
*/


const useSuspense = <T extends object & JSX.IntrinsicAttributes>(
    loader: () => Promise<{ default: ComponentType<T> }>,
    fallback: ReactNode,
    errorFallback: ReactNode,
): FC<T> => {
    const LazyComponent = lazy(loader);
    const SuspendedComponent: FC<T> = (props: T) => (
        <ErrorBoundary FallbackComponent={() => <>{errorFallback}</>}>
            <Suspense fallback={fallback}>
                <LazyComponent {...props} />
            </Suspense>
        </ErrorBoundary>
    );

    return SuspendedComponent;
};

export default useSuspense;
