import React from 'react';
import { HomeLayout } from '@codezeniths/layouts';


export default function AppHomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <HomeLayout>
            {children}
        </HomeLayout>
    );
}
