'use client';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { Carousel, CarouselContent, CarouselItem } from '../index';

const meta = {
  title: 'Modules/Feedback/Carousel/Options',
  component: Carousel,
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

const Slide = ({ index }: { index: number }) => (
  <div className="flex h-40 items-center justify-center rounded-xl border bg-card text-card-foreground shadow-sm bg-muted/20">
    <span className="text-xl font-semibold">Slide {index + 1}</span>
  </div>
);

export const InfiniteLoop: Story = {
  args: {
    options: { loop: true },
  },
  render: (args) => (
    <Carousel {...args} className="w-full max-w-xl mx-auto">
      <CarouselContent>
        {Array.from({ length: 4 }).map((_, index) => (
          <CarouselItem key={index} className="basis-1/2">
            <Slide index={index} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  ),
};

export const DragFreeMomentum: Story = {
  args: {
    options: { dragFree: true },
  },
  render: (args) => (
    <Carousel {...args} className="w-full max-w-xl mx-auto">
      <CarouselContent>
        {Array.from({ length: 8 }).map((_, index) => (
          <CarouselItem key={index} className="basis-1/3">
            <Slide index={index} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  ),
};

export const StartIndex: Story = {
  args: {
    options: { startIndex: 2 },
  },
  render: (args) => (
    <Carousel {...args} className="w-full max-w-xl mx-auto">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="basis-1/2">
            <Slide index={index} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  ),
};
