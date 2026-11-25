import { useState } from 'react';
import { SceneHeader } from '../components/shell/SceneHeader.tsx';
import {
  Search,
  Check,
  ChevronRight,
  Info,
  X,
  FileCode,
  Share2,
  Trash2,
  Bell,
  Sparkles,
} from 'lucide-react';

export function Scene08_Overlays() {
  const [activeItem, setActiveItem] = useState(1);

  return (
    <section className="space-y-10">
      <SceneHeader
        number={8}
        title="Overlays & Modals"
        purpose="Verification of elevated layers: popover menus, command palettes, inverse tooltips, toast notifications, scrimmed dialogs, slide-out drawers, and skeleton loaders. Demonstrates strict enforcement of surface-overlay-* states inside L4 layers."
        tokens={[
          'bg-surface-dialog',
          'bg-surface-float',
          'bg-surface-overlay-hover',
          'bg-surface-overlay-selected',
          'bg-surface-overlay-active',
          'bg-surface-inverse',
          'text-ink-inverse',
          'bg-scrim',
          'bg-surface-skeleton',
          'bg-surface-skeleton-shine',
        ]}
      />

      {/* Part 1: Command Palette & Popover Dropdown (surface-overlay-* proof) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Command Palette */}
        <div className="p-6 rounded-2xl bg-surface border border-line space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-ink-heading font-mono flex items-center gap-2">
              <Search className="w-4 h-4 text-primary-ink" />
              1. Command Palette [surface-dialog]
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary-tint text-primary-ink font-semibold">
              shadow-dialog
            </span>
          </div>

          <div className="rounded-xl bg-surface-dialog border border-glass-edge shadow-dialog overflow-hidden">
            {/* Search Input inside Palette */}
            <div className="p-3 border-b border-line-subtle flex items-center gap-2.5">
              <Search className="w-4 h-4 text-ink-subtle" />
              <input
                type="text"
                placeholder="Type a command or search files..."
                defaultValue="Deploy"
                className="w-full bg-transparent text-xs text-ink-base placeholder:text-ink-subtle outline-none"
              />
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-chip text-ink-muted">
                ESC
              </span>
            </div>

            {/* List with surface-overlay-* items */}
            <div className="p-2 space-y-0.5">
              <span className="px-2.5 py-1 text-[10px] font-mono text-ink-muted uppercase block">
                Suggested Actions (Items use surface-overlay-*)
              </span>

              {[
                { id: 1, label: 'Deploy project to production', icon: Sparkles, shortcut: '⌘D' },
                { id: 2, label: 'Create new scratch sandbox', icon: FileCode, shortcut: '⌘N' },
                { id: 3, label: 'Share cluster credentials', icon: Share2, shortcut: '⌘S' },
                { id: 4, label: 'Purge Redis cache cluster', icon: Trash2, shortcut: '⌘⌫' },
              ].map((item) => {
                const Icon = item.icon;
                const isSel = activeItem === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveItem(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors text-left ${
                      isSel
                        ? 'bg-surface-overlay-selected text-ink-heading font-medium'
                        : 'text-ink-base hover:bg-surface-overlay-hover active:bg-surface-overlay-active'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-3.5 h-3.5 ${isSel ? 'text-primary-ink' : 'text-ink-muted'}`} />
                      <span>{item.label}</span>
                    </div>
                    <span className="text-[10px] font-mono text-ink-muted">{item.shortcut}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Popover Dropdown & Tooltip Specimen */}
        <div className="p-6 rounded-2xl bg-surface border border-line space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-ink-heading font-mono">
              2. Floating Popover & Inverse Tooltip
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-chip text-ink-muted">
              shadow-float
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Popover Menu */}
            <div className="rounded-xl p-2 bg-surface-float border border-line-subtle shadow-float space-y-1">
              <span className="px-2 py-1 text-[10px] font-mono text-ink-muted uppercase block">
                User Settings [bg-surface-float]
              </span>
              <button
                type="button"
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs text-ink-base hover:bg-surface-overlay-hover transition-colors text-left"
              >
                <span>Edit Profile</span>
                <ChevronRight className="w-3 h-3 text-ink-muted" />
              </button>
              <button
                type="button"
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs bg-surface-overlay-selected font-medium text-ink-heading text-left"
              >
                <span>API Keys (Active)</span>
                <Check className="w-3 h-3 text-primary-ink" />
              </button>
              <button
                type="button"
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs text-destructive-ink hover:bg-destructive-tint transition-colors text-left"
              >
                <span>Revoke Access</span>
                <X className="w-3 h-3 text-destructive-ink" />
              </button>
            </div>

            {/* Inverse Tooltip & Toast Notifications */}
            <div className="space-y-3 flex flex-col justify-center">
              {/* Tooltip */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-ink-muted block uppercase">
                  Inverse Tooltip [surface-inverse]
                </span>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-surface-inverse text-ink-inverse border border-line-inverse shadow-float">
                  <Info className="w-3.5 h-3.5" />
                  <span>Only admins can edit cluster roles</span>
                </div>
              </div>

              {/* Toast Notification */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-ink-muted block uppercase">
                  Notification Toast [surface-inverse]
                </span>
                <div className="flex items-center justify-between p-3 rounded-xl bg-surface-inverse text-ink-inverse border border-line-inverse shadow-float">
                  <div className="flex items-center gap-2 text-xs">
                    <Bell className="w-4 h-4 text-warning" />
                    <span>Configuration saved to cloud</span>
                  </div>
                  <span className="text-[10px] font-mono opacity-80">Just now</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Part 2: Skeleton Loaders */}
      <div className="p-6 rounded-2xl bg-surface border border-line space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-ink-heading font-mono">
            3. Skeleton Loaders (surface-skeleton & surface-skeleton-shine)
          </h3>
          <span className="text-xs text-ink-muted">Simulates loading placeholders</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((card) => (
            <div
              key={card}
              className="p-4 rounded-xl bg-surface-well border border-line-subtle space-y-3 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-skeleton" />
                <div className="flex-1 space-y-1.5">
                  <div className="w-2/3 h-3 rounded bg-surface-skeleton" />
                  <div className="w-1/3 h-2.5 rounded bg-surface-skeleton-shine" />
                </div>
              </div>
              <div className="space-y-1.5 pt-2">
                <div className="w-full h-2.5 rounded bg-surface-skeleton" />
                <div className="w-5/6 h-2.5 rounded bg-surface-skeleton" />
                <div className="w-1/2 h-2.5 rounded bg-surface-skeleton-shine" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
