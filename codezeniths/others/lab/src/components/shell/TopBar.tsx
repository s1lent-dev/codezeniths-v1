import { Sun, Moon, Columns2, Sparkles, EyeOff, ShieldCheck } from 'lucide-react';

export type ViewMode = 'light' | 'dark' | 'side-by-side';

interface TopBarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  reducedTransparency: boolean;
  onToggleReducedTransparency: () => void;
  noBackdropFilter: boolean;
  onToggleNoBackdropFilter: () => void;
  activeSceneTitle: string;
}

export function TopBar({
  viewMode,
  onViewModeChange,
  reducedTransparency,
  onToggleReducedTransparency,
  noBackdropFilter,
  onToggleNoBackdropFilter,
  activeSceneTitle,
}: TopBarProps) {
  return (
    <header className="sticky top-0 z-50 w-full h-16 bg-background-glass backdrop-blur-glass border-b border-line flex items-center justify-between px-4 lg:px-6 select-none">
      {/* Brand & Active Scene Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary text-primary-on shadow-float font-bold text-base">
          NL
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold tracking-tight text-ink-heading">
              Nightglass Visual Lab
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-success-tint text-success-ink border border-success-line">
              <ShieldCheck className="w-3 h-3" />
              Tailwind v4 OKLCH
            </span>
          </div>
          <p className="text-xs text-ink-muted hidden md:block">
            {activeSceneTitle}
          </p>
        </div>
      </div>

      {/* Center / Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Optical Accessibility Fallback Switches */}
        <div className="hidden lg:flex items-center gap-1.5 bg-background-sunken p-1 rounded-lg border border-line-subtle text-xs">
          <button
            type="button"
            onClick={onToggleReducedTransparency}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors font-medium ${
              reducedTransparency
                ? 'bg-primary text-primary-on'
                : 'text-ink-muted hover:text-ink-heading hover:bg-background-hover'
            }`}
            title="Simulate prefers-reduced-transparency media query"
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span>Reduced Transparency</span>
          </button>

          <button
            type="button"
            onClick={onToggleNoBackdropFilter}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors font-medium ${
              noBackdropFilter
                ? 'bg-primary text-primary-on'
                : 'text-ink-muted hover:text-ink-heading hover:bg-background-hover'
            }`}
            title="Simulate browser without backdrop-filter support"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>No Backdrop Filter</span>
          </button>
        </div>

        {/* View Mode Segmented Switcher */}
        <div className="flex items-center bg-background-sunken p-1 rounded-lg border border-line-subtle">
          <button
            type="button"
            onClick={() => onViewModeChange('light')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              viewMode === 'light'
                ? 'bg-surface text-ink-heading shadow-float font-semibold'
                : 'text-ink-muted hover:text-ink-heading hover:bg-background-hover'
            }`}
            title="Force Light Mode"
          >
            <Sun className="w-3.5 h-3.5 text-warning-ink" />
            <span className="hidden sm:inline">Light</span>
          </button>

          <button
            type="button"
            onClick={() => onViewModeChange('dark')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              viewMode === 'dark'
                ? 'bg-surface text-ink-heading shadow-float font-semibold'
                : 'text-ink-muted hover:text-ink-heading hover:bg-background-hover'
            }`}
            title="Force Dark Mode"
          >
            <Moon className="w-3.5 h-3.5 text-primary-ink" />
            <span className="hidden sm:inline">Dark</span>
          </button>

          <button
            type="button"
            onClick={() => onViewModeChange('side-by-side')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              viewMode === 'side-by-side'
                ? 'bg-primary text-primary-on shadow-float font-semibold'
                : 'text-ink-muted hover:text-ink-heading hover:bg-background-hover'
            }`}
            title="Side-by-Side Dual Viewport"
          >
            <Columns2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Side-by-Side</span>
          </button>
        </div>
      </div>
    </header>
  );
}
