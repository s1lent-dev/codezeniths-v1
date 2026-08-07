'use client';
// Sheet.stories.tsx
import { Button, ButtonVariant, Field, FieldLabel, Input } from '@codezeniths/components';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from './sheet';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta = {
    title: 'Components/Overlay/Sheet',
    component: Sheet,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

// ───────────────────────────────────────────────

export const Default: Story = {
    render: () => (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant={ButtonVariant.OUTLINE}>Open Sheet</Button>
            </SheetTrigger>
            <SheetContent className='gap-sm-1 border-muted-light-shade3 dark:border-muted-dark-shade3'>
                <SheetHeader>
                    <SheetTitle className='text-h5'>Edit Profile</SheetTitle>
                    <SheetDescription className='text-span'>
                        This is a sheet description.
                    </SheetDescription>
                </SheetHeader>
                <div className="p-md-2 flex flex-col gap-md-2">
                    <Field>
                        <FieldLabel htmlFor="field-2" className='text-muted-light-shade3 dark:text-muted-dark-shade3'>Email</FieldLabel>
                        <Input id="field-2" type="email" placeholder="Enter email" />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="field-3" className='text-muted-light-shade3 dark:text-muted-dark-shade3'>Username</FieldLabel>
                        <Input id="field-3" type="text" placeholder="Enter username" />
                    </Field>
                </div>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button variant={ButtonVariant.DEFAULT}>
                            Save Changes
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    ),
};
