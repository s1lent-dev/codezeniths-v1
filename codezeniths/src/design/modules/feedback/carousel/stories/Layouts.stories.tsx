'use client';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { Carousel, CarouselContent, CarouselItem } from '../index';
import { CarouselAxis, CarouselAlign } from '../core/types';

const meta = {
  title: 'Modules/Feedback/Carousel/Layouts',
  component: Carousel,
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

const Slide = ({ index }: { index: number }) => (
  <div className="flex h-40 items-center justify-center rounded-xl border bg-card text-card-foreground shadow-sm bg-muted/20">
    <span className="text-xl font-semibold">Slide {index + 1}</span>
  </div>
);

export const Centered: Story = {
  args: {
    options: { align: 'center' },
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

export const VerticalAxis: Story = {
  args: {
    orientation: CarouselAxis.VERTICAL,
  },
  render: (args) => (
    <Carousel {...args} className="w-full max-w-xl mx-auto h-96">
      <CarouselContent className="h-full">
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="basis-1/3">
            <Slide index={index} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  ),
};

export const MultiItem: Story = {
  render: () => (
    <Carousel className="w-full max-w-3xl mx-auto">
      <CarouselContent>
        {Array.from({ length: 8 }).map((_, index) => (
          <CarouselItem key={index} className="basis-1/3 lg:basis-1/4">
            <Slide index={index} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  ),
};
