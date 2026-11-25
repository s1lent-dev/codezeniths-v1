'use client';

import React, { createContext, useContext } from 'react';
import { SkeletonContextValue } from './types';
import { DEFAULT_SKELETON_CONTEXT } from './constants';

export const SkeletonContext = createContext<SkeletonContextValue>(DEFAULT_SKELETON_CONTEXT);

export const useSkeletonContext = (): SkeletonContextValue => {
    return useContext(SkeletonContext);
};
