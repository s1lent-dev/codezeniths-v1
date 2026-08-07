'use client';
import React from 'react';
import Image from 'next/image';
import { Container } from '@codezeniths/components';
import logoLight from '@codezeniths/assets/shared/logo_light.svg';
import logoDark from '@codezeniths/assets/shared/logo_dark.svg';

export const Logo = () => {
    return (
        <Container size="none" direction="row" align="center" padded={false} centered={false} gap="0">
            <a href="/" className="flex items-center relative z-60 cursor-pointer">
                <Image 
                    src={logoLight} 
                    alt="CodeZeniths Logo" 
                    width={100} 
                    height={25} 
                    priority
                    className="w-auto h-6 object-contain dark:hidden"
                />
                <Image 
                    src={logoDark} 
                    alt="CodeZeniths Logo" 
                    width={100} 
                    height={25} 
                    priority
                    className="w-auto h-6 object-contain hidden dark:block"
                />
            </a>
        </Container>
    );
};
