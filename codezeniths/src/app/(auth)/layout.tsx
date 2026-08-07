import React from 'react';
import { MainLayout } from "@codezeniths/layouts";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <MainLayout mainClassName="grow flex flex-col items-center justify-center">
            {children}
        </MainLayout>
    );
}
