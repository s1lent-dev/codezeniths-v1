'use client';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Carousel, CarouselContent, CarouselItem } from './index';
import { NavigationModule } from './modules/navigation';
import { PaginationModule } from './modules/pagination';

// Basic mock for window.matchMedia needed for embla
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('Carousel Integration', () => {
  it('renders a base carousel with items', () => {
    render(
      <Carousel data-testid="carousel">
        <CarouselContent>
          <CarouselItem>Item 1</CarouselItem>
          <CarouselItem>Item 2</CarouselItem>
        </CarouselContent>
      </Carousel>
    );
    
    expect(screen.getByTestId('carousel')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
  });

  it('renders modules cleanly without strict dependency violations', () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Item 1</CarouselItem>
        </CarouselContent>
        <NavigationModule />
        <PaginationModule />
      </Carousel>
    );

    // Should render buttons
    expect(screen.getByRole('button', { name: /previous slide/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next slide/i })).toBeInTheDocument();
  });
});
