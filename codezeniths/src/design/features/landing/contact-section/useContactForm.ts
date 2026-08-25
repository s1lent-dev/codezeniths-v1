'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@codezeniths/modules';
import { trpc } from '@/lib/trpc/trpc/trpc.client';
import { useAuth } from '@/lib/auth/auth';

const contactFormSchema = z.object({
    name: z.string().min(2, 'Please enter your full name (at least 2 characters)'),
    email: z.string().email('Please enter a valid email address'),
    subject: z.string().min(3, 'Please enter a subject (at least 3 characters)'),
    phone: z.string().optional(),
    message: z.string().min(10, 'Please enter a detailed message (at least 10 characters)'),
    terms: z.boolean().refine((val) => val === true, {
        message: 'You must agree to the form terms before submitting.',
    }),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export function useContactForm() {
    const toast = useToast();
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactFormSchema),
        defaultValues: {
            name: '',
            email: '',
            subject: '',
            phone: '',
            message: '',
            terms: false,
        },
    });

    // Auto pre-fill name and email if authenticated
    useEffect(() => {
        if (user) {
            if (user.name) setValue('name', user.name);
            if (user.email) setValue('email', user.email);
        }
    }, [user, setValue]);

    const mutation = trpc.contact.sendMessage.useMutation();

    const onSubmit = async (data: ContactFormData) => {
        setIsSubmitting(true);
        try {
            // Determine active client theme from localStorage or html class
            let clientTheme: 'dark' | 'light' = 'dark';
            if (typeof window !== 'undefined') {
                const savedTheme = localStorage.getItem('theme');
                if (savedTheme === 'light' || savedTheme === 'dark') {
                    clientTheme = savedTheme;
                } else if (document.documentElement.classList.contains('dark')) {
                    clientTheme = 'dark';
                } else {
                    clientTheme = 'light';
                }
            }

            const response = await mutation.mutateAsync({
                name: data.name.trim(),
                email: data.email.trim(),
                subject: data.subject.trim(),
                phone: data.phone?.trim() || undefined,
                message: data.message.trim(),
                clientTheme,
            });

            toast.success(
                'Message Sent Successfully! 🚀',
                'Thank you for reaching out. We have sent a confirmation email and our team will respond shortly.'
            );

            // Reset form fields (preserving name & email if logged in)
            reset({
                name: user?.name || '',
                email: user?.email || '',
                subject: '',
                phone: '',
                message: '',
                terms: false,
            });
        } catch (error: any) {
            console.error('Failed to submit contact message:', error);
            toast.error(
                'Failed to Send Message',
                error?.message || 'Something went wrong while sending your message. Please try again.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        register,
        handleSubmit,
        onSubmit,
        setValue,
        watch,
        errors,
        isSubmitting,
    };
}
