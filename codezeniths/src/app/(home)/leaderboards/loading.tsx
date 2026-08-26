import React from 'react';
import { Loader } from '@codezeniths/components';

export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-[60vh] w-full">
            <Loader />
        </div>
    );
}
