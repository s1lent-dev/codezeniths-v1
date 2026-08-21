'use client';
import * as React from 'react';
import {
    Building2,
    Palette,
    User,
    Users,
} from 'lucide-react';
import { cn } from '@codezeniths/design/cn';
import { defineStepper } from './stepper';
import type { Meta, StoryObj } from '@storybook/nextjs';

// ─────────────────────────────────────────────────────────────────────────────
// Story Wrapper
// Adds consistent padding + max-width so every story looks the same in the
// Storybook canvas regardless of the surrounding theme.
// ─────────────────────────────────────────────────────────────────────────────

function StoryWrapper({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={cn('w-full max-w-2xl mx-auto p-8 space-y-4', className)}>
            {children}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared form field primitives (keep stories focused on the Stepper)
// ─────────────────────────────────────────────────────────────────────────────

const inputCls =
    'w-full rounded-md border border-input bg-background px-3 py-2 text-sm ' +
  'placeholder:text-body-light dark:text-body-dark focus-visible:outline-none ' +
  'focus-visible:ring-2 focus-visible:ring-ring';

const labelCls = 'block text-xs font-medium text-body-light dark:text-body-dark mb-1.5';

function Field({
    label,
    placeholder,
    type = 'text',
}: {
    label: string;
    placeholder: string;
    type?: string;
}) {
    return (
        <div>
            <label className={labelCls}>{label}</label>
            <input type={type} className={inputCls} placeholder={placeholder} />
        </div>
    );
}

function RadioCard({
    label,
    sublabel,
    badge,
}: {
    label: string;
    sublabel: string;
    badge?: string;
}) {
    return (
        <label className="flex items-center gap-3 rounded-lg border border-input p-3 cursor-pointer hover:bg-accent transition-colors">
            <input type="radio" name="option" className="accent-primary" />
            <div className="flex-1">
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-body-light dark:text-body-dark">{sublabel}</p>
            </div>
            {badge && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                    {badge}
                </span>
            )}
        </label>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// META
// ─────────────────────────────────────────────────────────────────────────────

const meta: Meta = {
    title: 'Modules/Navigation/Stepper',
    tags:      ['autodocs'],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: `
A headless-first, compound-component stepper built in the shadcn/CVA pattern.
Create a fully-typed stepper with \`defineStepper(...steps)\` and compose it
from \`Stepper.Provider\`, \`Stepper.Navigation\`, \`Stepper.Panel\`,
\`Stepper.Controls\`, and more.
        `,
            },
        },
    },
};

export default meta;
type Story = StoryObj;

// ─────────────────────────────────────────────────────────────────────────────
// 1. DEFAULT — horizontal, all defaults
// ─────────────────────────────────────────────────────────────────────────────

const { Stepper: DefaultStepper } = defineStepper(
    { id: 'details',  title: 'Details',  description: 'Basic info'      },
    { id: 'review',   title: 'Review',   description: 'Check your data' },
    { id: 'confirm',  title: 'Confirm',  description: 'Done!'           },
);

export const Default: Story = {
    name: 'Default',
    parameters: {
        docs: {
            description: {
                story: 'Three-step flow with the default horizontal orientation, filled variant, and medium size.',
            },
        },
    },
    render: () => (
        <StoryWrapper>
            <DefaultStepper.Provider>
                <DefaultStepper.Navigation />
                <DefaultStepper.Panel>
                    {({ step }) => (
                        <div className="rounded-lg border border-dashed border-border p-6 text-center">
                            <p className="text-sm text-body-light dark:text-body-dark">
                                Active step: <span className="font-semibold text-foreground">{step.title}</span>
                            </p>
                            <p className="mt-1 text-xs text-body-light dark:text-body-dark">{step.description}</p>
                        </div>
                    )}
                </DefaultStepper.Panel>
                <DefaultStepper.Controls />
            </DefaultStepper.Provider>
        </StoryWrapper>
    ),
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. SIZES — sm / md / lg side-by-side
// ─────────────────────────────────────────────────────────────────────────────

const { Stepper: SizeStepper } = defineStepper(
    { id: 'a', title: 'Start'  },
    { id: 'b', title: 'Middle' },
    { id: 'c', title: 'End'    },
);

export const Sizes: Story = {
    name: 'Sizes',
    parameters: {
        docs: {
            description: {
                story: 'The `size` prop on `<Stepper.Provider>` scales indicators and labels uniformly.',
            },
        },
    },
    render: () => (
        <StoryWrapper className="space-y-10">
            {(['sm', 'md', 'lg'] as const).map((size) => (
                <div key={size} className="space-y-2">
                    <p className="text-xs font-mono text-body-light dark:text-body-dark">size=&quot;{size}&quot;</p>
                    <SizeStepper.Provider size={size}>
                        <SizeStepper.Navigation />
                    </SizeStepper.Provider>
                </div>
            ))}
        </StoryWrapper>
    ),
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. VARIANTS — default / outline / ghost
// ─────────────────────────────────────────────────────────────────────────────

const { Stepper: VariantStepper } = defineStepper(
    { id: 'one',   title: 'Account'  },
    { id: 'two',   title: 'Profile'  },
    { id: 'three', title: 'Security' },
);

export const Variants: Story = {
    name: 'Variants',
    parameters: {
        docs: {
            description: {
                story: 'Three indicator styles: `default` (filled), `outline` (bordered), and `ghost` (minimal border, transparent fill).',
            },
        },
    },
    render: () => (
        <StoryWrapper className="space-y-10">
            {(['default', 'outline', 'ghost'] as const).map((variant) => (
                <div key={variant} className="space-y-2">
                    <p className="text-xs font-mono text-body-light dark:text-body-dark">variant=&quot;{variant}&quot;</p>
                    {/* Start at step 2 so we see upcoming + active + completed */}
                    <VariantStepper.Provider variant={variant} initialStep="two">
                        <VariantStepper.Navigation />
                    </VariantStepper.Provider>
                </div>
            ))}
        </StoryWrapper>
    ),
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. VERTICAL orientation
// ─────────────────────────────────────────────────────────────────────────────

const { Stepper: VerticalStepper } = defineStepper(
    { id: 'profile',   title: 'Your profile',     description: 'Name, photo & bio'         },
    { id: 'workspace', title: 'Create workspace', description: 'Name your team space'       },
    { id: 'invite',    title: 'Invite people',    description: 'Add teammates via email'    },
    { id: 'plan',      title: 'Choose a plan',    description: 'Pick the right tier for you'},
);

export const Vertical: Story = {
    name: 'Vertical',
    parameters: {
        docs: {
            description: {
                story: 'Vertical orientation renders the navigation as a sidebar-style list with a vertical connector line.',
            },
        },
    },
    render: () => (
        <StoryWrapper className="max-w-3xl">
            <VerticalStepper.Provider orientation="vertical">
                <div className="flex gap-8">
                    <VerticalStepper.Navigation className="w-44 shrink-0" />
                    <div className="flex-1 space-y-6">
                        <div>
                            <VerticalStepper.Title />
                            <VerticalStepper.Description />
                        </div>
                        <VerticalStepper.Panel>
                            {({ step }) => (
                                <div className="rounded-lg border border-dashed border-border p-6 text-center">
                                    <p className="text-sm text-body-light dark:text-body-dark">
                                        Showing panel for: <span className="font-semibold text-foreground">{step.title}</span>
                                    </p>
                                </div>
                            )}
                        </VerticalStepper.Panel>
                        <VerticalStepper.Controls />
                    </div>
                </div>
            </VerticalStepper.Provider>
        </StoryWrapper>
    ),
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. WITH PROGRESS BAR
// ─────────────────────────────────────────────────────────────────────────────

const { Stepper: ProgressStepper } = defineStepper(
    { id: 'info',     title: 'Info',     description: 'Personal details'   },
    { id: 'address',  title: 'Address',  description: 'Where do you live?' },
    { id: 'payment',  title: 'Payment',  description: 'Card details'       },
    { id: 'review',   title: 'Review',   description: 'Double-check'       },
    { id: 'complete', title: 'Complete', description: "You're done!"       },
);

export const WithProgressBar: Story = {
    name: 'With Progress Bar',
    parameters: {
        docs: {
            description: {
                story: '`<Stepper.Progress>` renders an animated bar above or below the navigation. Pair it with `<Stepper.Title>` and `<Stepper.Description>` for a complete header.',
            },
        },
    },
    render: () => (
        <StoryWrapper>
            <ProgressStepper.Provider>
                <ProgressStepper.Progress />
                <ProgressStepper.Navigation />
                <ProgressStepper.Panel>
                    {({ step }) => (
                        <div className="rounded-lg border border-dashed border-border p-6 text-center">
                            <p className="text-sm text-body-light dark:text-body-dark">
                                Step content for <span className="font-semibold text-foreground">{step.title}</span>
                            </p>
                        </div>
                    )}
                </ProgressStepper.Panel>
                <ProgressStepper.Controls />
            </ProgressStepper.Provider>
        </StoryWrapper>
    ),
};

// ─────────────────────────────────────────────────────────────────────────────
// 6. CUSTOM CONTROLS — render-prop children
// ─────────────────────────────────────────────────────────────────────────────

const { Stepper: CustomCtrlStepper } = defineStepper(
    { id: 'step-1', title: 'Step 1' },
    { id: 'step-2', title: 'Step 2' },
    { id: 'step-3', title: 'Step 3' },
);

export const CustomControls: Story = {
    name: 'Custom Controls',
    parameters: {
        docs: {
            description: {
                story: 'Pass a render-prop to `<Stepper.Controls>` to completely replace the default buttons while still receiving `next`, `prev`, `isFirst`, `isLast`, and all other methods.',
            },
        },
    },
    render: () => (
        <StoryWrapper>
            <CustomCtrlStepper.Provider>
                <CustomCtrlStepper.Navigation />
                <CustomCtrlStepper.Panel>
                    {({ step }) => (
                        <div className="rounded-lg border border-dashed border-border p-6 text-center">
                            <p className="text-sm text-body-light dark:text-body-dark">
                                Active: <span className="font-semibold text-foreground">{step.title}</span>
                            </p>
                        </div>
                    )}
                </CustomCtrlStepper.Panel>
                <CustomCtrlStepper.Controls>
                    {({ next, prev, isFirst, isLast, currentIndex, steps, reset }) => (
                        <div className="flex items-center justify-between">
                            <button
                                onClick={prev}
                                disabled={isFirst}
                                className={cn(
                                    'text-sm text-body-light dark:text-body-dark underline-offset-4 hover:underline disabled:pointer-events-none disabled:opacity-30',
                                )}
                            >
                                ← Back
                            </button>

                            <span className="text-xs text-body-light dark:text-body-dark">
                                {currentIndex + 1} / {steps.length}
                            </span>

                            {isLast ? (
                                <button
                                    onClick={reset}
                                    className="rounded-full bg-green-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-green-600 transition-colors"
                                >
                                    ✓ Finish
                                </button>
                            ) : (
                                <button
                                    onClick={next}
                                    className="rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-foreground-dark-shade3 dark:text-foreground-light-shade3 hover:bg-primary/90 transition-colors"
                                >
                                    Next →
                                </button>
                            )}
                        </div>
                    )}
                </CustomCtrlStepper.Controls>
            </CustomCtrlStepper.Provider>
        </StoryWrapper>
    ),
};

// ─────────────────────────────────────────────────────────────────────────────
// 7. PROVIDER RENDER-PROP — headless / fully custom layout
// ─────────────────────────────────────────────────────────────────────────────

const { Stepper: HeadlessStepper, useStepper: useHeadless } = defineStepper(
    { id: 'basics',   title: 'The basics'    },
    { id: 'goals',    title: 'Your goals'    },
    { id: 'pricing',  title: 'Pricing'       },
    { id: 'done',     title: 'All set'       },
);

export const HeadlessCustomLayout: Story = {
    name: 'Headless — Custom Layout',
    parameters: {
        docs: {
            description: {
                story:
          'Pass a function as `children` of `<Stepper.Provider>` to receive the raw `methods` object and build a fully custom layout — no default navigation rendered at all.',
            },
        },
    },
    render: () => (
        <StoryWrapper className="max-w-sm">
            <HeadlessStepper.Provider>
                {({ methods }) => (
                    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
                        {/* Custom header */}
                        <div className="space-y-1">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-mono text-body-light dark:text-body-dark">
                                    Step {methods.currentIndex + 1} of {methods.steps.length}
                                </span>
                                <button
                                    onClick={methods.reset}
                                    className="text-xs text-body-light dark:text-body-dark hover:text-foreground underline-offset-2 hover:underline"
                                >
                                    Restart
                                </button>
                            </div>
                            <h2 className="text-xl font-bold">{methods.current.title}</h2>
                            {/* Custom dot indicators */}
                            <div className="flex gap-1.5 pt-1">
                                {methods.steps.map((step) => {
                                    const status = methods.statusOf(step.id);
                                    return (
                                        <button
                                            key={step.id}
                                            onClick={() => methods.goTo(step.id)}
                                            className={cn(
                                                'h-1.5 rounded-full transition-all duration-300',
                                                status === 'completed' && 'w-4 bg-primary',
                                                status === 'active'    && 'w-6 bg-primary',
                                                status === 'upcoming'  && 'w-1.5 bg-muted',
                                            )}
                                            aria-label={step.title}
                                        />
                                    );
                                })}
                            </div>
                        </div>

                        {/* Panel content */}
                        <HeadlessStepper.Panel>
                            {({ step }) => (
                                <div className="rounded-lg bg-muted/40 p-4 text-sm text-body-light dark:text-body-dark min-h-[80px] flex items-center justify-center">
                                    Content for &quot;{step.title}&quot;
                                </div>
                            )}
                        </HeadlessStepper.Panel>

                        {/* Custom footer */}
                        <div className="flex gap-2">
                            <button
                                disabled={methods.isFirst}
                                onClick={methods.prev}
                                className="flex-1 rounded-lg border border-input py-2 text-sm font-medium disabled:opacity-30 hover:bg-accent transition-colors"
                            >
                                Back
                            </button>
                            <button
                                onClick={methods.isLast ? methods.reset : methods.next}
                                className="flex-1 rounded-lg bg-primary py-2 text-sm font-medium text-foreground-dark-shade3 dark:text-foreground-light-shade3 hover:bg-primary/90 transition-colors"
                            >
                                {methods.isLast ? 'Start over' : 'Continue'}
                            </button>
                        </div>
                    </div>
                )}
            </HeadlessStepper.Provider>
        </StoryWrapper>
    ),
};

// ─────────────────────────────────────────────────────────────────────────────
// 8. SCOPED PANELS — forStep prop
// ─────────────────────────────────────────────────────────────────────────────

const { Stepper: ScopedStepper } = defineStepper(
    { id: 'personal', title: 'Personal' },
    { id: 'company',  title: 'Company'  },
    { id: 'plan',     title: 'Plan'     },
);

export const ScopedPanels: Story = {
    name: 'Scoped Panels (forStep)',
    parameters: {
        docs: {
            description: {
                story:
          'Each `<Stepper.Panel forStep="...">` is only mounted when that step is active. Useful when you want to declare per-step content inline rather than via a switch/render-prop.',
            },
        },
    },
    render: () => (
        <StoryWrapper>
            <ScopedStepper.Provider>
                <ScopedStepper.Navigation />

                <ScopedStepper.Panel forStep="personal">
                    <div className="grid gap-4">
                        <Field label="Full name"    placeholder="Jane Smith"       />
                        <Field label="Email"        placeholder="jane@example.com" type="email" />
                    </div>
                </ScopedStepper.Panel>

                <ScopedStepper.Panel forStep="company">
                    <div className="grid gap-4">
                        <Field label="Company name" placeholder="Acme Inc."        />
                        <Field label="Company size" placeholder="1–10 employees"   />
                    </div>
                </ScopedStepper.Panel>

                <ScopedStepper.Panel forStep="plan">
                    <div className="space-y-2">
                        <RadioCard label="Starter"      sublabel="Up to 3 users · Free"          badge="Free"       />
                        <RadioCard label="Pro"          sublabel="Up to 25 users · $12/mo"       badge="Popular"    />
                        <RadioCard label="Enterprise"   sublabel="Unlimited users · Custom"                         />
                    </div>
                </ScopedStepper.Panel>

                <ScopedStepper.Controls />
            </ScopedStepper.Provider>
        </StoryWrapper>
    ),
};

// ─────────────────────────────────────────────────────────────────────────────
// 9. REAL-WORLD — Checkout flow (horizontal, all features)
// ─────────────────────────────────────────────────────────────────────────────

const { Stepper: CheckoutStepper } = defineStepper(
    { id: 'address',  title: 'Address',  description: 'Where to ship'      },
    { id: 'shipping', title: 'Shipping', description: 'Delivery method'    },
    { id: 'payment',  title: 'Payment',  description: 'Card details'       },
    { id: 'review',   title: 'Review',   description: 'Confirm & pay'      },
);

export const CheckoutFlow: Story = {
    name: 'Real-world — Checkout Flow',
    parameters: {
        docs: {
            description: {
                story: 'A realistic e-commerce checkout using `forStep` panels, a progress bar, and the default controls.',
            },
        },
    },
    render: () => (
        <StoryWrapper>
            <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                <CheckoutStepper.Provider>
                    {/* Header */}
                    <div className="px-8 pt-8 pb-6 space-y-4 border-b border-border">
                        <CheckoutStepper.Progress />
                        <CheckoutStepper.Navigation />
                    </div>

                    {/* Step title */}
                    <div className="px-8 pt-6 pb-2">
                        <CheckoutStepper.Title    className="text-base font-semibold" />
                        <CheckoutStepper.Description />
                    </div>

                    {/* Panels */}
                    <div className="px-8 py-4 min-h-47.5">
                        <CheckoutStepper.Panel forStep="address">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2"><Field label="Street"      placeholder="123 Main St"  /></div>
                                <Field label="City"         placeholder="New York"      />
                                <Field label="Postal code"  placeholder="10001"         />
                            </div>
                        </CheckoutStepper.Panel>

                        <CheckoutStepper.Panel forStep="shipping">
                            <div className="space-y-2">
                                <RadioCard label="Standard (5–7 days)" sublabel="Free shipping on orders over $50"  badge="Free"    />
                                <RadioCard label="Express (2–3 days)"  sublabel="$8.99 flat rate"                                   />
                                <RadioCard label="Overnight"           sublabel="$19.99 · Order by 2 PM"            badge="Fastest" />
                            </div>
                        </CheckoutStepper.Panel>

                        <CheckoutStepper.Panel forStep="payment">
                            <div className="space-y-4">
                                <Field label="Card number"  placeholder="4242 4242 4242 4242" />
                                <div className="grid grid-cols-2 gap-4">
                                    <Field label="Expiry"     placeholder="MM / YY" />
                                    <Field label="CVV"        placeholder="•••"     />
                                </div>
                            </div>
                        </CheckoutStepper.Panel>

                        <CheckoutStepper.Panel forStep="review">
                            <div className="rounded-lg bg-muted/40 divide-y divide-border text-sm">
                                {[
                                    ['Subtotal',  '$89.00'],
                                    ['Shipping',  'Free'],
                                    ['Tax',       '$7.12'],
                                ].map(([label, value]) => (
                                    <div key={label} className="flex justify-between px-4 py-2.5 text-body-light dark:text-body-dark">
                                        <span>{label}</span>
                                        <span className="font-medium text-foreground">{value}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between px-4 py-3 font-semibold">
                                    <span>Total</span>
                                    <span className="text-primary">$96.12</span>
                                </div>
                            </div>
                        </CheckoutStepper.Panel>
                    </div>

                    {/* Footer controls */}
                    <div className="px-8 py-4 border-t border-border">
                        <CheckoutStepper.Controls
                            nextLabel="Save & Continue"
                            finishLabel="Place Order →"
                        />
                    </div>
                </CheckoutStepper.Provider>
            </div>
        </StoryWrapper>
    ),
};

// ─────────────────────────────────────────────────────────────────────────────
// 10. REAL-WORLD — Onboarding (vertical, outline variant)
// ─────────────────────────────────────────────────────────────────────────────

const { Stepper: OnboardStepper } = defineStepper(
    { id: 'profile',    title: 'Your profile',      description: 'Name, photo, bio'           },
    { id: 'workspace',  title: 'Create workspace',  description: 'Give your space a name'     },
    { id: 'invite',     title: 'Invite teammates',  description: 'Collaborate from day one'   },
    { id: 'theme',      title: 'Pick a theme',      description: 'Personalise the look & feel'},
);

const onboardIcons: Record<string, React.ReactNode> = {
    profile:   <User    className="h-4 w-4" />,
    workspace: <Building2 className="h-4 w-4" />,
    invite:    <Users   className="h-4 w-4" />,
    theme:     <Palette className="h-4 w-4" />,
};

export const OnboardingFlow: Story = {
    name: 'Real-world — Onboarding (vertical)',
    parameters: {
        docs: {
            description: {
                story: 'A vertical onboarding wizard with an outline variant, custom icons alongside the navigation, and a two-column layout.',
            },
        },
    },
    render: () => (
        <StoryWrapper className="max-w-3xl">
            <OnboardStepper.Provider orientation="vertical" variant="outline">
                <div className="flex gap-10">
                    {/* Left: vertical navigation */}
                    <aside className="w-52 shrink-0">
                        <OnboardStepper.Navigation
                            onStepClick={(step) => console.log('clicked', step.id)}
                        />
                    </aside>

                    {/* Right: content */}
                    <div className="flex-1 space-y-6">
                        <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <OnboardStepper.Panel>
                                    {({ step }) => onboardIcons[step.id] ?? null}
                                </OnboardStepper.Panel>
                            </span>
                            <div>
                                <OnboardStepper.Title    className="text-base" />
                                <OnboardStepper.Description />
                            </div>
                        </div>

                        <OnboardStepper.Panel forStep="profile">
                            <div className="grid gap-4">
                                <Field label="Full name"      placeholder="Jane Smith"         />
                                <Field label="Display name"   placeholder="janedoe"            />
                                <Field label="Bio"            placeholder="Tell us about you…" />
                            </div>
                        </OnboardStepper.Panel>

                        <OnboardStepper.Panel forStep="workspace">
                            <div className="grid gap-4">
                                <Field label="Workspace name" placeholder="Acme Inc."          />
                                <Field label="Slug"           placeholder="acme-inc"           />
                            </div>
                        </OnboardStepper.Panel>

                        <OnboardStepper.Panel forStep="invite">
                            <div className="space-y-3">
                                {['', '', ''].map((_, i) => (
                                    <Field key={i} label={`Email ${i + 1}`} placeholder="teammate@example.com" type="email" />
                                ))}
                            </div>
                        </OnboardStepper.Panel>

                        <OnboardStepper.Panel forStep="theme">
                            <div className="grid grid-cols-3 gap-3">
                                {['Zinc', 'Rose', 'Violet'].map((name) => (
                                    <label key={name} className="flex flex-col items-center gap-2 rounded-xl border border-input p-4 cursor-pointer hover:bg-accent transition-colors">
                                        <input type="radio" name="theme" className="sr-only" />
                                        <span className={cn(
                                            'h-8 w-8 rounded-full',
                                            name === 'Zinc'   && 'bg-zinc-500',
                                            name === 'Rose'   && 'bg-rose-500',
                                            name === 'Violet' && 'bg-violet-500',
                                        )} />
                                        <span className="text-xs font-medium">{name}</span>
                                    </label>
                                ))}
                            </div>
                        </OnboardStepper.Panel>

                        <OnboardStepper.Controls
                            nextLabel="Save & continue →"
                            finishLabel="🎉 Launch workspace"
                        />
                    </div>
                </div>
            </OnboardStepper.Provider>
        </StoryWrapper>
    ),
};

// ─────────────────────────────────────────────────────────────────────────────
// 11. WITH useStepper HOOK — external/controlled usage
// ─────────────────────────────────────────────────────────────────────────────

const { Stepper: HookStepper, useStepper: useSetupStepper } = defineStepper(
    { id: 'security',     title: 'Security',     description: '2FA & password'    },
    { id: 'permissions',  title: 'Permissions',  description: 'Role assignment'   },
    { id: 'deploy',       title: 'Deploy',       description: 'Push to production'},
);

function HookDrivenComponent() {
    const stepper   = useSetupStepper();
    const [log, setLog] = React.useState<Array<string>>([]);

    const logAction = (msg: string) =>
        setLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 5));

    return (
        <StoryWrapper className="max-w-3xl">
            <div className="grid grid-cols-2 gap-6">
                {/* Stepper */}
                <HookStepper.Provider initialStep="security">
                    <HookStepper.Navigation onStepClick={(s) => logAction(`Clicked: ${s.title}`)} />
                    <HookStepper.Panel>
                        {({ step }) => (
                            <div className="rounded-lg border border-dashed border-border p-4 text-sm text-body-light dark:text-body-dark">
                                {step.title}: {step.description}
                            </div>
                        )}
                    </HookStepper.Panel>
                    <HookStepper.Controls />
                </HookStepper.Provider>

                {/* External hook control panel */}
                <div className="space-y-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-body-light dark:text-body-dark">
                        useStepper hook
                    </p>
                    <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-2 text-sm font-mono">
                        <div className="flex justify-between">
                            <span className="text-body-light dark:text-body-dark">currentIndex</span>
                            <span className="text-foreground">{stepper.currentIndex}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-body-light dark:text-body-dark">current.id</span>
                            <span className="text-foreground">&quot;{stepper.current.id}&quot;</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-body-light dark:text-body-dark">isFirst</span>
                            <span className={stepper.isFirst ? 'text-green-500' : 'text-body-light dark:text-body-dark'}>
                                {String(stepper.isFirst)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-body-light dark:text-body-dark">isLast</span>
                            <span className={stepper.isLast ? 'text-green-500' : 'text-body-light dark:text-body-dark'}>
                                {String(stepper.isLast)}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {stepper.steps.map((step) => (
                            <button
                                key={step.id}
                                onClick={() => { stepper.goTo(step.id); logAction(`goTo("${step.id}")`); }}
                                className={cn(
                                    'rounded px-2 py-1 text-xs font-medium border transition-colors',
                                    stepper.current.id === step.id
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-input bg-background text-body-light dark:text-body-dark hover:text-foreground',
                                )}
                            >
                                {step.id}
                            </button>
                        ))}
                        <button
                            onClick={() => { stepper.reset(); logAction('reset()'); }}
                            className="rounded px-2 py-1 text-xs font-medium border border-input text-body-light dark:text-body-dark hover:text-foreground transition-colors"
                        >
                            reset()
                        </button>
                    </div>

                    {/* Event log */}
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-wider text-body-light dark:text-body-dark font-semibold">Event log</p>
                        <div className="rounded border border-border bg-muted/20 p-2 space-y-0.5 min-h-[80px]">
                            {log.length === 0 && (
                                <p className="text-[11px] text-body-light dark:text-body-dark">No events yet…</p>
                            )}
                            {log.map((entry, i) => (
                                <p key={i} className="text-[11px] font-mono text-body-light dark:text-body-dark">{entry}</p>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </StoryWrapper>
    );
}

export const WithUseStepperHook: Story = {
    name: 'With useStepper Hook',
    parameters: {
        docs: {
            description: {
                story:
          'The `useStepper` hook can be used standalone — independently of the compound components — for fully external control. The right panel demonstrates live state inspection and programmatic navigation.',
            },
        },
    },
    render: () => <HookDrivenComponent />,
};

// ─────────────────────────────────────────────────────────────────────────────
// 12. COMPLETE STATES — shows all step statuses in one frozen view
// ─────────────────────────────────────────────────────────────────────────────

const { Stepper: StateStepper } = defineStepper(
    { id: 'completed-1', title: 'Address'   },
    { id: 'completed-2', title: 'Shipping'  },
    { id: 'active',      title: 'Payment'   },
    { id: 'upcoming-1',  title: 'Review'    },
    { id: 'upcoming-2',  title: 'Confirm'   },
);

export const AllStates: Story = {
    name: 'All States (Static)',
    parameters: {
        docs: {
            description: {
                story: 'A static snapshot showing all three indicator states — `completed`, `active`, `upcoming` — across all three variants at once.',
            },
        },
    },
    render: () => (
        <StoryWrapper className="space-y-10">
            {(['default', 'outline', 'ghost'] as const).map((variant) => (
                <div key={variant} className="space-y-2">
                    <p className="text-xs font-mono text-body-light dark:text-body-dark">variant=&quot;{variant}&quot;</p>
                    {/* initialStep="active" puts two completed steps before it */}
                    <StateStepper.Provider initialStep="active" variant={variant}>
                        <StateStepper.Navigation />
                    </StateStepper.Provider>
                </div>
            ))}
        </StoryWrapper>
    ),
};