/**
 * @vitest-environment jsdom
 */
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '../error';
import GlobalErrorBoundary from '../global-error';

describe('Next.js Error Boundaries', () => {
  describe('Segment Error Boundary (error.tsx)', () => {
    it('renders error illustration, description, and calls reset on button click', () => {
      const resetMock = vi.fn();
      const mockError = new Error('Test segment error message');
      (mockError as Error & { digest?: string }).digest = 'ERR_DIGEST_123';

      render(<ErrorBoundary error={mockError} reset={resetMock} />);

      // Verify heading and error description
      expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
      expect(screen.getByText(/Test segment error message/i)).toBeInTheDocument();

      // Verify digest indicator
      expect(screen.getByText(/ERR_DIGEST_123/i)).toBeInTheDocument();

      // Verify AlertTriangle icon or illustration is rendered
      expect(screen.getByTestId('error-illustration')).toBeInTheDocument();

      // Verify Try Again button calls reset
      const tryAgainButton = screen.getByRole('button', { name: /try again/i });
      expect(tryAgainButton).toBeInTheDocument();
      fireEvent.click(tryAgainButton);
      expect(resetMock).toHaveBeenCalledTimes(1);

      // Verify Return Home navigation link / button
      const returnHome = screen.getByRole('link', { name: /return home/i });
      expect(returnHome).toBeInTheDocument();
      expect(returnHome).toHaveAttribute('href', '/');
    });

    it('renders fallback error message when error.message is not provided', () => {
      const resetMock = vi.fn();
      const mockError = { name: 'Error', message: '' } as Error;

      render(<ErrorBoundary error={mockError} reset={resetMock} />);

      expect(screen.getByText(/An unexpected error occurred/i)).toBeInTheDocument();
    });
  });

  describe('Root Global Error Boundary (global-error.tsx)', () => {
    it('renders root html and body tags with Tokyo Night styling, and handles recovery', () => {
      const resetMock = vi.fn();
      const mockError = new Error('Critical root error');
      (mockError as Error & { digest?: string }).digest = 'CRITICAL_DIGEST_999';

      // 1. Verify HTML structure (root <html> and <body> with Tokyo Night palette)
      const { renderToStaticMarkup } = require('react-dom/server');
      const staticHtml = renderToStaticMarkup(<GlobalErrorBoundary error={mockError} reset={resetMock} />);
      expect(staticHtml).toContain('<html');
      expect(staticHtml).toContain('<body');
      expect(staticHtml).toContain('#1a1b26');

      // 2. Verify interactive client behavior (DOM rendering, button clicks, recovery)
      render(<GlobalErrorBoundary error={mockError} reset={resetMock} />);

      // Verify critical error text
      expect(screen.getByText(/Critical Application Error/i)).toBeInTheDocument();
      expect(screen.getByText(/Critical root error/i)).toBeInTheDocument();

      // Verify digest indicator
      expect(screen.getByText(/CRITICAL_DIGEST_999/i)).toBeInTheDocument();

      // Verify Try Again button calls reset
      const tryAgainButton = screen.getByRole('button', { name: /try again/i });
      expect(tryAgainButton).toBeInTheDocument();
      fireEvent.click(tryAgainButton);
      expect(resetMock).toHaveBeenCalledTimes(1);

      // Verify Return Home button / link
      const returnHome = screen.getByRole('link', { name: /return home/i });
      expect(returnHome).toBeInTheDocument();
      expect(returnHome).toHaveAttribute('href', '/');
    });
  });
});
