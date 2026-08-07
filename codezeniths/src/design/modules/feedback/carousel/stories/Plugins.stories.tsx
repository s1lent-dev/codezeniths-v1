'use client';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { Carousel, CarouselContent, CarouselItem } from '../index';
import Autoplay from 'embla-carousel-autoplay';
import AutoScroll from 'embla-carousel-auto-scroll';
import ClassNames from 'embla-carousel-class-names';

const meta = {
  title: 'Modules/Feedback/Carousel/Plugins',
  component: Carousel,
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

const Slide = ({ index }: { index: number }) => (
  <div className="flex h-40 items-center justify-center rounded-xl border bg-card text-card-foreground shadow-sm bg-muted/20">
    <span className="text-xl font-semibold">Slide {index + 1}</span>
  </div>
);

export const AutoplayPlugin: Story = {
  render: () => (
    <Carousel plugins={[Autoplay({ delay: 2000,  })]} className="w-full max-w-xl mx-auto">
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

export const AutoScrollPlugin: Story = {
  render: () => (
    <Carousel plugins={[AutoScroll({ speed: 1 })]} options={{ loop: true }} className="w-full max-w-xl mx-auto">
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

export const ClassNamesPlugin: Story = {
  render: () => (
    <Carousel plugins={[ClassNames()]} className="w-full max-w-xl mx-auto">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="basis-1/2 transition-opacity duration-300 [&:not(.is-selected)]:opacity-50">
            <Slide index={index} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  ),
};
