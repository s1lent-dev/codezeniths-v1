import React from 'react';
import { SettingsLayoutSection } from '@codezeniths/features';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    return (
        <SettingsLayoutSection>
            {children}
        </SettingsLayoutSection>
    );
}
