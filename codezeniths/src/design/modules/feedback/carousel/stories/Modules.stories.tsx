'use client';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { Carousel, CarouselContent, CarouselItem } from '../index';
import { NavigationModule } from '../modules/navigation';
import { PaginationModule } from '../modules/pagination';
import { ScrollbarModule } from '../modules/scrollbar';

const meta = {
  title: 'Modules/Feedback/Carousel/Modules',
  component: Carousel,
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

const Slide = ({ index }: { index: number }) => (
  <div className="flex h-40 items-center justify-center rounded-xl border bg-card text-card-foreground shadow-sm bg-muted/20">
    <span className="text-xl font-semibold">Slide {index + 1}</span>
  </div>
);

export const WithNavigation: Story = {
  render: () => (
    <Carousel className="w-full max-w-xl mx-auto relative">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="basis-1/2">
            <Slide index={index} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <NavigationModule />
    </Carousel>
  ),
};

export const WithPagination: Story = {
  render: () => (
    <Carousel className="w-full max-w-xl mx-auto relative mb-12">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="basis-1/2">
            <Slide index={index} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <PaginationModule options={{ type: 'bullets' }} />
    </Carousel>
  ),
};

export const WithScrollbar: Story = {
  render: () => (
    <Carousel className="w-full max-w-xl mx-auto relative mb-12">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="basis-1/2">
            <Slide index={index} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <ScrollbarModule />
    </Carousel>
  ),
};
