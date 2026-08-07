'use client';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { Carousel, CarouselContent, CarouselItem } from '../index';
import { CarouselAxis } from '../core/types';

const meta = {
  title: 'Modules/Feedback/Carousel',
  component: Carousel,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'radio',
      options: [CarouselAxis.HORIZONTAL, CarouselAxis.VERTICAL],
    },
  },
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultHorizontal: Story = {
  args: {
    orientation: CarouselAxis.HORIZONTAL,
  },
  render: (args) => (
    <div className="w-full max-w-xl mx-auto border rounded-lg p-8">
      <Carousel {...args}>
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index} className="basis-1/2">
              <div className="flex aspect-square items-center justify-center rounded-xl border bg-card text-card-foreground shadow-sm bg-muted/20">
                <span className="text-3xl font-semibold">Slide {index + 1}</span>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  ),
};
