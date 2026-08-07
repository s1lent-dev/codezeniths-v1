'use client';
import { Loader } from './loader';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta: Meta<typeof Loader> = {
    title: 'Components/Feedback/Loader',
    component: Loader,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component:
                    'A choreographed 5-square loader with 3D cube faces, glow effects, and staggered fade-in. Animates infinitely — centered fixed in the viewport.',
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof Loader>;

// ── Default ──────────────────────────────────────────────
export const Default: Story = {
    name: 'Default',
    parameters: {
        backgrounds: {
            default: 'dark',
            values: [
                { name: 'dark',  value: '#181C31' },
                { name: 'light', value: '#f2eeff' },
            ],
        },
    },
};

// ── On Dark Background ────────────────────────────────────
export const OnDark: Story = {
    name: 'On Dark Background',
    parameters: {
        backgrounds: { default: 'dark' },
    },
    decorators: [
        (Story) => (
            <div
                style={{
                    width: '100vw',
                    height: '100vh',
                    background: '#181C31',
                    position: 'relative',
                }}
            >
                <Story />
            </div>
        ),
    ],
};

// ── On Light Background ───────────────────────────────────
export const OnLight: Story = {
    name: 'On Light Background',
    parameters: {
        backgrounds: { default: 'light' },
    },
    decorators: [
        (Story) => (
            <div
                style={{
                    width: '100vw',
                    height: '100vh',
                    background: '#f2eeff',
                    position: 'relative',
                }}
            >
                <Story />
            </div>
        ),
    ],
};

// ── Over Page Content ─────────────────────────────────────
export const OverContent: Story = {
    name: 'Over Page Content',
    parameters: {
        backgrounds: { default: 'dark' },
        docs: {
            description: {
                story: 'Simulates the loader overlaying a page — the typical real-world usage.',
            },
        },
    },
    decorators: [
        (Story) => (
            <div style={{ width: '100vw', height: '100vh', position: 'relative', background: '#181C31' }}>
                <div style={{ padding: '2rem', opacity: 0.15, color: '#a9b1d6', fontFamily: 'sans-serif' }}>
                    <div style={{ height: 24, width: '40%', background: '#6A7CFF', borderRadius: 4, marginBottom: 12 }} />
                    <div style={{ height: 12, width: '70%', background: '#565f89', borderRadius: 4, marginBottom: 8 }} />
                    <div style={{ height: 12, width: '55%', background: '#565f89', borderRadius: 4, marginBottom: 8 }} />
                    <div style={{ height: 12, width: '65%', background: '#565f89', borderRadius: 4 }} />
                </div>
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(24, 28, 49, 0.75)',
                        backdropFilter: 'blur(2px)',
                    }}
                />
                <Story />
            </div>
        ),
    ],
};