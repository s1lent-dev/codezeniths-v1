'use client';
// Pagination.stories.tsx
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './pagination';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta = {
    title: 'Modules/Navigation/Pagination',
    component: Pagination,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

// ───────────────────────────────────────────────

export const Default: Story = {
    render: () => (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink isActive>
                        2
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink>3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    ),
};

// ───────────────────────────────────────────────

export const WithEllipsis: Story = {
    render: () => (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink>10</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    ),
    name: 'With Ellipsis',
};

// ───────────────────────────────────────────────

export const FirstAndLast: Story = {
    render: () => (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationLink>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink isActive>2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink>3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink>4</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink>5</PaginationLink>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    ),
    name: 'First Few Pages',
};

// ───────────────────────────────────────────────

export const Disabled: Story = {
    render: () => (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious disabled />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink>2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink>3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    ),
    name: 'Previous Disabled',
};

// ───────────────────────────────────────────────

export const ManyPages: Story = {
    render: () => (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink>2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink>10</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink>11</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink>12</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    ),
    name: 'Many Pages',
};
