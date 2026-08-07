'use client';
// Dialog.stories.tsx
import { Button, ButtonVariant, Field, FieldLabel, Input } from '@codezeniths/components';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from './dialog';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta = {
    title: 'Modules/Overlay/Dialog',
    component: Dialog,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    name: 'Default',
    render: () => (
        <Dialog>
            <form>
                <DialogTrigger asChild>
                    <Button variant={ButtonVariant.OUTLINE}>Open Dialog</Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here. Click save when you&apos;re done.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <Field>
                            <FieldLabel htmlFor="field-2" className='text-muted-light-shade3 dark:text-muted-dark-shade3'>Email</FieldLabel>
                            <Input id="field-2" type="email" placeholder="Enter email" />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="field-3" className='text-muted-light-shade3 dark:text-muted-dark-shade3'>Username</FieldLabel>
                            <Input id="field-3" type="text" placeholder="Enter username" />
                        </Field>

                    </div>

                    <DialogFooter className='border-muted-light-shade3 dark:border-muted-dark-shade3'>
                        <DialogClose asChild>
                            <Button variant={ButtonVariant.OUTLINE}>Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    ),
};