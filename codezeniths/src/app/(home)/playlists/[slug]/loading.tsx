import React from 'react';
import { Loader } from '@codezeniths/components';

export default function Loading() {
    return (
        <div className="flex h-full min-h-[60vh] w-full items-center justify-center">
            <Loader />
        </div>
    );
}
