'use client';

import { tagQueryService, moduleQueryService, productQueryService } from '@/lib/tanstack';

export const useLayoutData = () => {
    const {
        data: products = [],
        isLoading: isLoadingProductsRaw,
        isFetching: isFetchingProducts,
    } = productQueryService.getProducts();

    const {
        data: modules = [],
        isLoading: isLoadingModulesRaw,
        isFetching: isFetchingModules,
    } = moduleQueryService.getModules();

    const {
        data: tags = [],
        isLoading: isLoadingTagsRaw,
        isFetching: isFetchingTags,
    } = tagQueryService.getTags();

    const isLoadingProducts = isLoadingProductsRaw || isFetchingProducts;
    const isLoadingModules = isLoadingModulesRaw || isFetchingModules;
    const isLoadingTags = isLoadingTagsRaw || isFetchingTags;
    const isLoadingAny = isLoadingProducts || isLoadingModules || isLoadingTags;

    return {
        products,
        modules,
        tags,
        isLoadingProducts,
        isLoadingModules,
        isLoadingTags,
        isLoadingAny,
    };
};
