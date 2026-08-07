'use client';
import {
    Typography,
    TypographyAlign,
    TypographyColor,
    TypographyEffect,
    TypographyFont,
    TypographyVariant,
    TypographyWeight,
} from './typography';
import type { Meta, StoryObj } from '@storybook/nextjs';
import type { AnimationVariant } from './typography.types';


// ────────────────────────────────────────────────
// Meta / Global Configuration
// ────────────────────────────────────────────────

const meta = {
    title: 'Components/Core/Typography',
    component: Typography,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        backgrounds: {
            default: 'light',
            values: [
                { name: 'light', value: '#edeef7' },
                { name: 'dark', value: '#181C31' },
                { name: 'maroon', value: '#400' },
            ],
        },
        controls: {
            expanded: true,
        },
    },
    argTypes: {
        animation: {
            control: 'select',
            options: [
                'fadeIn',
                'blurIn',
                'blurInUp',
                'blurInDown',
                'slideUp',
                'slideDown',
                'slideLeft',
                'slideRight',
                'scaleUp',
                'scaleDown',
            ] as Array<AnimationVariant>,
            description: 'Choose which animation variant to preview',
        },
        by: {
            control: 'select',
            options: ['text', 'word', 'character', 'line'],
            description: 'How to split the text for staggering',
        },
        delay: {
            control: { type: 'range', min: 0, max: 1, step: 0.05 },
        },
        duration: {
            control: { type: 'range', min: 0.1, max: 1.5, step: 0.1 },
        },
        startOnView: { control: 'boolean' },
        once: { control: 'boolean' },
        variant: {
            control: 'select',
            options: Object.values(TypographyVariant),
        },
        weight: {
            control: 'select',
            options: Object.values(TypographyWeight),
        },
        align: {
            control: 'select',
            options: Object.values(TypographyAlign),
        },
        color: {
            control: 'select',
            options: Object.values(TypographyColor),
        },
        font: {
            control: 'select',
            options: Object.values(TypographyFont),
        },
        effect: {
            control: 'select',
            options: Object.values(TypographyEffect),
        },
        children: {
            control: 'text',
        },
        as: {
            control: 'text',
        },
        truncate: { control: 'boolean' },
        italic: { control: 'boolean' },
        underline: { control: 'boolean' },
        strikethrough: { control: 'boolean' },
    },
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

// ────────────────────────────────────────────────
// Basic Variants
// ────────────────────────────────────────────────

export const Heading1: Story = {
    args: {
        variant: TypographyVariant.H1,
        children: 'Heading 1 – Main Page Title',
    },
};

export const Heading2: Story = {
    args: {
        variant: TypographyVariant.H2,
        children: 'Section Heading Level 2',
    },
};

export const Heading3: Story = {
    args: {
        variant: TypographyVariant.H3,
        children: 'Subsection Heading Level 3',
    },
};

export const Heading4: Story = {
    args: {
        variant: TypographyVariant.H4,
        children: 'Minor Heading Level 4',
    },
};

export const Heading5: Story = {
    args: {
        variant: TypographyVariant.H5,
        children: 'Small Heading Level 5',
    },
};

export const Heading6: Story = {
    args: {
        variant: TypographyVariant.H6,
        children: 'Smallest Heading Level 6',
    },
};

export const Paragraph: Story = {
    args: {
        variant: TypographyVariant.P,
        children:
            'This is a standard paragraph used for body text. It supports multiple lines and wraps naturally. You can combine it with weight, color, align, and font controls.',
    },
};

export const Span: Story = {
    args: {
        variant: TypographyVariant.SPAN,
        children: 'This is an inline span, useful for styling parts of text differently.',
    },
};

export const MutedText: Story = {
    args: {
        variant: TypographyVariant.MUTED,
        children: 'This text appears subdued — great for secondary info, hints, footnotes.',
    },
};

export const LeadText: Story = {
    args: {
        variant: TypographyVariant.LEAD,
        children: 'Lead paragraph — slightly larger and more prominent introductory text.',
    },
};

export const Blockquote: Story = {
    args: {
        variant: TypographyVariant.BLOCKQUOTE,
        children: 'The future belongs to those who believe in the beauty of their dreams. — Eleanor Roosevelt',
    },
};

export const InlineCode: Story = {
    args: {
        variant: TypographyVariant.CODE,
        children: 'const greet = () => "Hello Storybook"',
    },
};

// ────────────────────────────────────────────────
// Weights & Styles
// ────────────────────────────────────────────────

export const FontWeights: Story = {
    render: () => (
        <div className="space-y-4 text-center max-w-xl">
            <Typography weight={TypographyWeight.EXTRATHIN}>Extrathin – Almost invisible</Typography>
            <Typography weight={TypographyWeight.THIN}>Thin</Typography>
            <Typography weight={TypographyWeight.LIGHT}>Light</Typography>
            <Typography weight={TypographyWeight.NORMAL}>Normal (default)</Typography>
            <Typography weight={TypographyWeight.MEDIUM}>Medium</Typography>
            <Typography weight={TypographyWeight.SEMIBOLD}>Semibold</Typography>
            <Typography weight={TypographyWeight.BOLD}>Bold</Typography>
            <Typography weight={TypographyWeight.EXTRABOLD}>Extra Bold</Typography>
            <Typography weight={TypographyWeight.SUPERBOLD}>Super Bold</Typography>
        </div>
    ),
};

export const TextDecorations: Story = {
    render: () => (
        <div className="space-y-3">
            <Typography italic>Italic text for emphasis or quotes</Typography>
            <Typography underline>Underlined – often used for links or important terms</Typography>
            <Typography strikethrough>Strikethrough – deleted or invalid information</Typography>
            <Typography truncate className="max-w-xs">
                Very very long text that should be truncated with ellipsis when it overflows the container width
            </Typography>
        </div>
    ),
};

// ────────────────────────────────────────────────
// Effects Showcase
// ────────────────────────────────────────────────

export const AuroraEffect: Story = {
    args: {
        variant: TypographyVariant.H1,
        weight: TypographyWeight.EXTRABOLD,
        effect: TypographyEffect.AURORA,
        children: 'Aurora Glow Title',
        colors: ['#FF0080', '#7928CA', '#0070F3', '#00D4FF'],
        speed: 1.2,
    },
};

export const ShinyEffect: Story = {
    args: {
        effect: TypographyEffect.SHINY,
        children: 'Shiny Hover Text',
        shimmerWidth: 40,
        className: 'text-body-light dark:text-secondary',
    },
};

export const GradientEffect: Story = {
    args: {
        effect: TypographyEffect.GRADIENT,
        children: 'Animated Gradient Heading',
        colorFrom: '#6A7CFF',
        colorTo: '#a289fa',
        speed: 1,
    },
};

export const MorphingEffect: Story = {
    args: {
        variant: TypographyVariant.H1,
        effect: TypographyEffect.MORPHING,
        children: 'Morphing', // fallback – ignored when texts provided
        texts: ['Creative', 'Dynamic', 'Modern', 'Typography'],
    },
    parameters: {
        docs: {
            description: {
                story:
                    'Morphing requires an array of `texts`. Single child string is ignored in this mode.',
            },
        },
    },
};

export const TypingEffect: Story = {
    args: {
        variant: TypographyVariant.H3,
        effect: TypographyEffect.TYPING,
        children: 'Initial fallback text',
        words: ['Hello', 'नमस्ते', 'Bonjour', 'Hola', 'Ciao'],
        typeSpeed: 80,
        deleteSpeed: 40,
        pauseDelay: 1800,
        loop: true,
        showCursor: true,
        blinkCursor: true,
        cursorStyle: 'line',
    },
};

export const AnimateAllVariants: Story = {
    name: 'Animate – All Variants',
    render: (args: any) => {
        const previewText = 'The quick brown fox jumps over the lazy dog';

        return (
            <div className="w-full max-w-4xl space-y-16 p-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <Typography variant={TypographyVariant.H2} className="mb-2">
                        Animate Effect Preview
                    </Typography>
                    <Typography variant={TypographyVariant.P} color={TypographyColor.MUTED}>
                        Change the <strong>animation</strong> control in the sidebar to see different effects.<br />
                        Try also changing <strong>by</strong> (word / character / line) and <strong>duration</strong>.
                    </Typography>
                </div>

                {/* Demo area */}
                <div className="min-h-[300px] flex items-center justify-center border border-primary-shade3/20 rounded-xl bg-foreground-dark/50 p-10">
                    <Typography
                        effect={TypographyEffect.ANIMATE}
                        animation={args.animation ?? 'fadeIn'}
                        by={args.by ?? 'word'}
                        delay={args.delay ?? 0.1}
                        duration={args.duration ?? 0.6}
                        startOnView={args.startOnView ?? true}
                        once={args.once ?? true}
                        variant={TypographyVariant.H3}
                        className="text-center max-w-3xl"
                    >
                        {previewText}
                    </Typography>
                </div>

                {/* Quick reference grid – shows all possibilities */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        { name: 'fadeIn', desc: 'Simple opacity fade' },
                        { name: 'blurIn', desc: 'Fade + remove blur' },
                        { name: 'blurInUp', desc: 'Blur + rise from bottom' },
                        { name: 'blurInDown', desc: 'Blur + drop from top' },
                        { name: 'slideUp', desc: 'Slide upward' },
                        { name: 'slideDown', desc: 'Slide downward' },
                        { name: 'slideLeft', desc: 'Slide from right to left' },
                        { name: 'slideRight', desc: 'Slide from left to right' },
                        { name: 'scaleUp', desc: 'Grow from small to normal' },
                        { name: 'scaleDown', desc: 'Shrink from large to normal' },
                    ].map((item) => (
                        <div
                            key={item.name}
                            className="p-6 border border-primary-shade3/20 rounded-lg bg-foreground-dark/30 hover:bg-foreground-dark/50 transition-colors"
                        >
                            <Typography variant={TypographyVariant.H4} className="mb-2">
                                {item.name}
                            </Typography>
                            <Typography variant={TypographyVariant.P} color={TypographyColor.MUTED} className="text-sm">
                                {item.desc}
                            </Typography>
                        </div>
                    ))}
                </div>
            </div>
        );
    },
    args: {
        animation: 'blurInUp' as AnimationVariant,
        by: 'word',
        delay: 0.1,
        duration: 0.6,
        startOnView: true,
        once: true,
    },
};

// ────────────────────────────────────────────────
// Combination Example – Hero Section Feel
// ────────────────────────────────────────────────

export const HeroExample: Story = {
    render: () => (
        <div className="space-y-6 text-center max-w-3xl mx-auto px-4">
            <Typography
                variant={TypographyVariant.H1}
                effect={TypographyEffect.AURORA}
                color={TypographyColor.PRIMARY}
                weight={TypographyWeight.EXTRABOLD}
                align={TypographyAlign.CENTER}
            >
                Welcome to the Future
            </Typography>

            <Typography
                variant={TypographyVariant.LEAD}
                color={TypographyColor.MUTED}
                align={TypographyAlign.CENTER}
            >
                Build beautiful, accessible, and performant user interfaces with modern typography.
            </Typography>

            <Typography
                variant={TypographyVariant.H3}
                effect={TypographyEffect.TYPING}
                words={['Fast', 'Reliable', 'Scalable', 'Beautiful']}
                loop
                className="inline-block"
            />
        </div>
    ),
    name: 'Hero / Marketing Example',
};