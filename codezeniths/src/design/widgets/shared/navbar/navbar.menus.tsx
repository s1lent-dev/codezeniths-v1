'use client';
import React, { useState, useMemo } from 'react';
import {
    Spinner,
    SpinnerVariant,
    Typography,
    TypographyVariant,
    Input,
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
    Grid,
    GridItem,
} from '@codezeniths/components';
import {
    NavigationMenuLink,
    AdaptiveDropdownMenuItem,
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationPrevious,
    PaginationNext,
} from '@codezeniths/modules';
import { Search } from 'lucide-react';
import { useLayoutData } from '../common/useLayoutData';

export const TagsMenuDesktop = () => {
    const { tags, isLoadingTags } = useLayoutData();
    const [level, setLevel] = useState('all');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const pageSize = 12;

    const filteredTags = useMemo(() => {
        return tags.filter(tag => {
            const matchLevel = level === 'all' || tag.level === level;
            const matchSearch = tag.title.toLowerCase().includes(search.toLowerCase());
            return matchLevel && matchSearch;
        });
    }, [tags, level, search]);

    const totalPages = Math.ceil(filteredTags.length / pageSize) || 1;
    const paginatedTags = filteredTags.slice((page - 1) * pageSize, page * pageSize);

    React.useEffect(() => setPage(1), [level, search]);

    return (
        <div className="flex flex-col w-200 p-4 gap-4">
            <div className="flex flex-row justify-between items-center gap-4">
                <Select value={level} onValueChange={setLevel}>
                    <SelectTrigger className="w-45 cursor-pointer rounded-sm">
                        <SelectValue placeholder="Select Level" />
                    </SelectTrigger>
                    <SelectContent className="z-150 border border-secondary cursor-pointer rounded-sm">
                        <SelectItem value="all" className='cursor-pointer'>All Levels</SelectItem>
                        <SelectItem value="fundamental" className='cursor-pointer'>Fundamental</SelectItem>
                        <SelectItem value="intermediate" className='cursor-pointer'>Intermediate</SelectItem>
                        <SelectItem value="advanced" className='cursor-pointer'>Advanced</SelectItem>
                    </SelectContent>
                </Select>
                
                <div className="relative w-62.5">
                    <Search className="absolute left-2 top-2.5 size-4 text-muted-dark opacity-50" />
                    <Input 
                        placeholder="Search tags..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-8 rounded-full border border-secondary transition-all shadow-2xs"
                    />
                </div>
            </div>

            <Grid cols={4} gap="md" className="min-h-75 content-start pt-4">
                {isLoadingTags ? (
                    <GridItem colSpan={4} className="flex items-center justify-center h-full min-h-60">
                        <Spinner variant={SpinnerVariant.LOADER_CIRCLE} />
                    </GridItem>
                ) : paginatedTags.length === 0 ? (
                    <GridItem colSpan={4} className="flex items-center justify-center py-8 text-muted-dark">
                        No tags found matching your criteria.
                    </GridItem>
                ) : (
                    paginatedTags.map(tag => (
                        <GridItem key={tag.id} colSpan={1}>
                            <NavigationMenuLink href={`/tags/${tag.slug}`} className="flex flex-col p-2 rounded-md hover:bg-foreground-light-shade1 dark:hover:bg-foreground-dark-shade1 transition-colors h-full">
                                <Typography variant={TypographyVariant.P} className="font-semibold text-body-light dark:text-body-dark">{tag.title}</Typography>
                                <Typography variant={TypographyVariant.MUTED} className="text-muted-light font-extrathin text-[0.825rem] dark:text-muted-dark line-clamp-2 text-ellipsis overflow-hidden">{tag.description || 'No description available'}</Typography>
                            </NavigationMenuLink>
                        </GridItem>
                    ))
                )}
            </Grid>

            <Pagination className="mt-2 w-full">
                <PaginationContent className="w-full flex justify-between items-center">
                    <PaginationItem>
                        <PaginationPrevious 
                            onClick={(e) => {
                                e.preventDefault();
                                setPage(p => Math.max(1, p - 1));
                            }}
                            className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                    </PaginationItem>
                    <PaginationItem>
                        <span className="px-4 text-sm text-muted-dark">Page {page} of {totalPages}</span>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext 
                            onClick={(e) => {
                                e.preventDefault();
                                setPage(p => Math.min(totalPages, p + 1));
                            }}
                            className={page === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
};

export const TagsMenuMobile = () => {
    const { tags, isLoadingTags } = useLayoutData();
    const [level, setLevel] = useState('all');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const filteredTags = useMemo(() => {
        return tags.filter(tag => {
            const matchLevel = level === 'all' || tag.level === level;
            const matchSearch = tag.title.toLowerCase().includes(search.toLowerCase());
            return matchLevel && matchSearch;
        });
    }, [tags, level, search]);

    const totalPages = Math.ceil(filteredTags.length / pageSize) || 1;
    const paginatedTags = filteredTags.slice((page - 1) * pageSize, page * pageSize);

    React.useEffect(() => setPage(1), [level, search]);

    return (
        <div className="flex flex-col gap-2 p-2">
            <Select value={level} onValueChange={setLevel}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Level" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="fundamental">Fundamental</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
            </Select>
            
            <div className="relative w-full">
                <Search className="absolute left-2 top-2.5 size-4 text-muted-dark opacity-50" />
                <Input 
                    placeholder="Search tags..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8"
                />
            </div>

            <div className="flex flex-col gap-2 mt-2 min-h-60">
                {isLoadingTags ? (
                    <div className="flex items-center justify-center h-full min-h-40">
                        <Spinner variant={SpinnerVariant.LOADER_CIRCLE} />
                    </div>
                ) : paginatedTags.length === 0 ? (
                    <div className="py-4 text-center text-sm text-muted-dark">No tags found.</div>
                ) : (
                    paginatedTags.map(tag => (
                        <AdaptiveDropdownMenuItem key={tag.id} asChild className="typography-small text-muted-light dark:text-muted-dark hover:text-primary block py-2 cursor-pointer">
                            <a href={`/tags/${tag.slug}`}>
                                <div className="flex flex-col gap-0.5">
                                    <span className="font-medium text-body-light dark:text-body-dark">{tag.title}</span>
                                    {tag.description && <span className="line-clamp-1 text-xs opacity-70">{tag.description}</span>}
                                </div>
                            </a>
                        </AdaptiveDropdownMenuItem>
                    ))
                )}
            </div>

            <Pagination className="mt-2 w-full">
                <PaginationContent className="w-full flex justify-between items-center px-2">
                    <PaginationItem>
                        <PaginationPrevious 
                            onClick={(e) => {
                                e.preventDefault();
                                setPage(p => Math.max(1, p - 1));
                            }}
                            className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                    </PaginationItem>
                    <PaginationItem>
                        <span className="text-sm text-muted-dark">Page {page} of {totalPages}</span>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext 
                            onClick={(e) => {
                                e.preventDefault();
                                setPage(p => Math.min(totalPages, p + 1));
                            }}
                            className={page === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
};

export const ModulesMenuDesktop = () => {
    const { modules, isLoadingModules } = useLayoutData();
    return (
        <Grid cols={4} gap="md" className="p-4 w-200 min-h-60">
            {isLoadingModules ? (
                <GridItem colSpan={4} className="flex items-center justify-center h-full">
                    <Spinner variant={SpinnerVariant.LOADER_CIRCLE} />
                </GridItem>
            ) : modules.length === 0 ? (
                <GridItem colSpan={4} className="flex items-center justify-center text-muted-dark h-full">
                    No modules found.
                </GridItem>
            ) : (
                modules.map((module) => (
                    <GridItem key={module.id} colSpan={1}>
                        <NavigationMenuLink href={`/modules/${module.slug}`} className="flex flex-col gap-1 p-2 rounded-md hover:bg-foreground-light-shade1 dark:hover:bg-foreground-dark-shade1 transition-colors">
                            <Typography variant={TypographyVariant.P} className="font-semibold text-body-light dark:text-body-dark">{module.title}</Typography>
                            <Typography variant={TypographyVariant.MUTED} className="text-muted-light font-extrathin text-[0.825rem] dark:text-muted-dark line-clamp-2 text-ellipsis overflow-hidden">{module.description}</Typography>
                        </NavigationMenuLink>
                    </GridItem>
                ))
            )}
        </Grid>
    );
};

export const ModulesMenuMobile = () => {
    const { modules, isLoadingModules } = useLayoutData();
    return (
        <div className="flex flex-col gap-2 px-4 py-1 min-h-40">
            {isLoadingModules ? (
                <div className="flex items-center justify-center h-full">
                    <Spinner variant={SpinnerVariant.LOADER_CIRCLE} />
                </div>
            ) : modules.length === 0 ? (
                <div className="py-4 text-center text-sm text-muted-dark">No modules found.</div>
            ) : (
                modules.map((module) => (
                    <AdaptiveDropdownMenuItem key={module.id} className="typography-small text-muted-light dark:text-muted-dark hover:text-primary block py-1.5 cursor-pointer" asChild>
                        <a href={`/modules/${module.slug}`}>
                            <div className="flex flex-col gap-0.5">
                                <span className="font-medium text-body-light dark:text-body-dark">{module.title}</span>
                                <span className="line-clamp-1 text-xs opacity-70">{module.description}</span>
                            </div>
                        </a>
                    </AdaptiveDropdownMenuItem>
                ))
            )}
        </div>
    );
};

const FALLBACK_PRODUCTS = [
    { id: 'algozenith', slug: 'algozenith', name: 'AlgoZenith', title: 'AlgoZenith', description: 'A comprehensive CS practice platform with LeetCode-style editors and cloud IDE workspaces.' },
    { id: 'algowars', slug: 'algowars', name: 'AlgoWars', title: 'AlgoWars', description: 'Global competitive programming arena with live leaderboards, hack phases, and ratings.' },
    { id: 'zenlab', slug: 'zenlab', name: 'ZenLab', title: 'ZenLab', description: 'Browser-based cloud development environment for React, Node.js, Spring Boot, and more.' },
    { id: 'zendraw', slug: 'zendraw', name: 'ZenDraw', title: 'ZenDraw', description: 'Collaborative engineering whiteboard built for software architecture and system design.' },
    { id: 'intervyn', slug: 'intervyn', name: 'Intervyn', title: 'Intervyn', description: 'Comprehensive technical interview and assessment platform with custom evaluation pipelines.' },
    { id: 'algodemy', slug: 'algodemy', name: 'Algodemy', title: 'Algodemy', description: 'Structured education platform delivering courses, bootcamps, and guided learning paths.' },
    { id: 'archivis', slug: 'archivis', name: 'Archivis', description: 'Interactive knowledge repository embedding animations, projects, and playgrounds in articles.' },
    { id: 'codeflow', slug: 'codeflow', name: 'CodeFlow', title: 'CodeFlow', description: 'Interactive execution visualization engine powering animations across the entire ecosystem.' },
    { id: 'zenhub', slug: 'zenhub', name: 'ZenHub', title: 'ZenHub', description: 'Engineering-focused community for professional profiles, mentorship, and knowledge sharing.' }
];

export const ProductsMenuDesktop = () => {
    const { products, isLoadingProducts } = useLayoutData();
    const displayProducts = (products && products.length > 0) ? products : FALLBACK_PRODUCTS;

    return (
        <Grid cols={3} gap="md" className="p-4 w-200 min-h-60">
            {isLoadingProducts ? (
                <GridItem colSpan={3} className="flex items-center justify-center h-full">
                    <Spinner variant={SpinnerVariant.LOADER_CIRCLE} />
                </GridItem>
            ) : (
                displayProducts.map((product: any) => {
                    const slug = product.slug || product.id;
                    const title = product.name || product.title || slug;
                    return (
                        <GridItem key={product.id || slug} colSpan={1}>
                            <NavigationMenuLink href={`/products/${slug}`} className="flex flex-col gap-1 p-2 rounded-md hover:bg-foreground-light-shade1 dark:hover:bg-foreground-dark-shade1 transition-colors">
                                <Typography variant={TypographyVariant.P} className="font-semibold text-body-light dark:text-body-dark">{title}</Typography>
                                <Typography variant={TypographyVariant.MUTED} className="text-muted-light font-extrathin text-[0.825rem] dark:text-muted-dark line-clamp-2 text-ellipsis overflow-hidden">{product.description || 'No description available'}</Typography>
                            </NavigationMenuLink>
                        </GridItem>
                    );
                })
            )}
        </Grid>
    );
};

export const ProductsMenuMobile = () => {
    const { products, isLoadingProducts } = useLayoutData();
    const displayProducts = (products && products.length > 0) ? products : FALLBACK_PRODUCTS;

    return (
        <div className="flex flex-col gap-2 px-4 py-1 min-h-40">
            {isLoadingProducts ? (
                <div className="flex items-center justify-center h-full">
                    <Spinner variant={SpinnerVariant.LOADER_CIRCLE} />
                </div>
            ) : (
                displayProducts.map((product: any) => {
                    const slug = product.slug || product.id;
                    const title = product.name || product.title || slug;
                    return (
                        <AdaptiveDropdownMenuItem key={product.id || slug} className="typography-small text-muted-light dark:text-muted-dark hover:text-primary block py-1.5 cursor-pointer" asChild>
                            <a href={`/products/${slug}`}>
                                <div className="flex flex-col gap-0.5">
                                    <span className="font-medium text-body-light dark:text-body-dark">{title}</span>
                                    <span className="line-clamp-1 text-xs opacity-70">{product.description}</span>
                                </div>
                            </a>
                        </AdaptiveDropdownMenuItem>
                    );
                })
            )}
        </div>
    );
};
