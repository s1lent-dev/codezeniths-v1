import { toast as sonnerToast } from 'sonner';
import { BellIcon } from 'lucide-react';
import React from 'react';

export const toast = {
    default: (title: string, description?: string, options?: any) => {
        const duration = options?.duration || 4000;
        return sonnerToast(title, {
            description,
            duration,
            icon: <BellIcon className="size-5 text-primary" />,
            style: { '--toast-duration': `${duration}ms` } as any,
            ...options
        });
    },
    success: (title: string, description?: string, options?: any) => {
        const duration = options?.duration || 4000;
        return sonnerToast.success(title, {
            description,
            duration,
            style: { '--toast-duration': `${duration}ms` } as any,
            ...options
        });
    },
    error: (title: string, description?: string, options?: any) => {
        const duration = options?.duration || 4000;
        return sonnerToast.error(title, {
            description,
            duration,
            style: { '--toast-duration': `${duration}ms` } as any,
            ...options
        });
    },
    warning: (title: string, description?: string, options?: any) => {
        const duration = options?.duration || 4000;
        return sonnerToast.warning(title, {
            description,
            duration,
            style: { '--toast-duration': `${duration}ms` } as any,
            ...options
        });
    },
    info: (title: string, description?: string, options?: any) => {
        const duration = options?.duration || 4000;
        return sonnerToast.info(title, {
            description,
            duration,
            style: { '--toast-duration': `${duration}ms` } as any,
            ...options
        });
    },
    promise: <T,>(
        promise: Promise<T> | (() => Promise<T>),
        options: {
            loading?: string | React.ReactNode;
            success?: string | React.ReactNode | ((data: T) => React.ReactNode | string);
            error?: string | React.ReactNode | ((error: any) => React.ReactNode | string);
            successType?: 'success' | 'info' | 'default' | 'warning' | 'error';
            errorType?: 'error' | 'warning' | 'default' | 'info' | 'success';
            duration?: number;
        } & any
    ) => {
        const id = sonnerToast.loading(options.loading || 'Loading...', { ...options });
        
        const p = typeof promise === 'function' ? promise() : promise;

        p.then((data) => {
            const successMsg = typeof options.success === 'function' ? options.success(data) : (options.success || 'Success');
            const type = options.successType || 'success';
            const duration = options.duration || 4000;
            const style = { '--toast-duration': `${duration}ms` } as any;

            if (type === 'default') {
                sonnerToast(successMsg, { id, icon: <BellIcon className="size-5 text-primary" />, duration, style, ...options });
            } else {
                (sonnerToast as any)[type](successMsg, { id, duration, style, ...options });
            }
        }).catch((err) => {
            const errorMsg = typeof options.error === 'function' ? options.error(err) : (options.error || 'Error');
            const type = options.errorType || 'error';
            const duration = options.duration || 4000;
            const style = { '--toast-duration': `${duration}ms` } as any;

            if (type === 'default') {
                sonnerToast(errorMsg, { id, icon: <BellIcon className="size-5 text-primary" />, duration, style, ...options });
            } else {
                (sonnerToast as any)[type](errorMsg, { id, duration, style, ...options });
            }
        });

        return id;
    },
    dismiss: (id?: string | number) => sonnerToast.dismiss(id)
};

export const useToast = () => {
    return toast;
};

