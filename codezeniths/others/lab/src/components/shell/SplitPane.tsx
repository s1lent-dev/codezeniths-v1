import React from 'react';
import type { ViewMode } from './TopBar.tsx';
import { Sun, Moon } from 'lucide-react';

interface SplitPaneProps {
  viewMode: ViewMode;
  children: React.ReactNode;
  reducedTransparency: boolean;
  noBackdropFilter: boolean;
}

export function SplitPane({
  viewMode,
  children,
  reducedTransparency,
  noBackdropFilter,
}: SplitPaneProps) {
  const containerClasses = [
    reducedTransparency ? 'theme-reduced-transparency' : '',
    noBackdropFilter ? 'theme-no-backdrop' : '',
  ].filter(Boolean).join(' ');

  if (viewMode === 'side-by-side') {
    return (
      <div className={`grid grid-cols-1 xl:grid-cols-2 divide-y xl:divide-y-0 xl:divide-x divide-line min-h-[calc(100vh-4rem)] ${containerClasses}`}>
        {/* Left Pane: FORCED LIGHT MODE */}
        <div className="flex flex-col bg-background text-ink-base min-w-0">
          <div className="sticky top-16 z-30 flex items-center justify-between px-6 py-2.5 bg-background-band border-b border-line text-xs font-mono font-semibold text-ink-heading">
            <span className="flex items-center gap-2">
              <Sun className="w-3.5 h-3.5 text-warning-ink" />
              Light Mode Viewport
            </span>
            <span className="text-[10px] text-ink-muted">Canvas L=96.0%</span>
          </div>
          <div className="p-6 md:p-8 flex-1 overflow-x-hidden">
            {children}
          </div>
        </div>

        {/* Right Pane: FORCED DARK MODE */}
        <div className="dark flex flex-col bg-background text-ink-base min-w-0">
          <div className="sticky top-16 z-30 flex items-center justify-between px-6 py-2.5 bg-background-band border-b border-line text-xs font-mono font-semibold text-ink-heading">
            <span className="flex items-center gap-2">
              <Moon className="w-3.5 h-3.5 text-primary-ink" />
              Dark Mode Viewport
            </span>
            <span className="text-[10px] text-ink-muted">Canvas L=15.0%</span>
          </div>
          <div className="p-6 md:p-8 flex-1 overflow-x-hidden">
            {children}
          </div>
        </div>
      </div>
    );
  }

  // Single Viewport Mode
  const isDark = viewMode === 'dark';
  return (
    <div className={`${isDark ? 'dark' : ''} min-h-[calc(100vh-4rem)] bg-background text-ink-base ${containerClasses}`}>
      <div className="max-w-7xl mx-auto p-6 md:p-10">
        {children}
      </div>
    </div>
  );
}
