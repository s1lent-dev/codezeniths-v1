import React from 'react';
import { Loader } from '@codezeniths/components';

export default function Loading() {
    return (
        <div className="flex flex-1 min-h-[450px] sm:min-h-[550px] lg:min-h-[calc(100vh-16rem)] w-full items-center justify-center py-12">
            <Loader />
        </div>
    );
}
