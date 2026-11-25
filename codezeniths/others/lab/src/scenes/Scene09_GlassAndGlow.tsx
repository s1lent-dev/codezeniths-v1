import { useState } from 'react';
import { SceneHeader } from '../components/shell/SceneHeader.tsx';
import {
  Mic,
  Video,
  Share2,
  PhoneOff,
  Sparkles,
  Sliders,
  ShieldCheck,
  Layout,
  Terminal,
  Layers,
} from 'lucide-react';

export function Scene09_GlassAndGlow() {
  const [localReducedTransparency, setLocalReducedTransparency] = useState(false);
  const [localNoBackdrop, setLocalNoBackdrop] = useState(false);

  return (
    <section className="space-y-10">
      <SceneHeader
        number={9}
        title="Glass & Luminous Glow"
        purpose="Verification of optical glass physics: translucent glass stacked over luminous glow light sources (glow-primary, glow-secondary, glow-frost), floating docks, call control bars, prismatic rims, and fallback behavior."
        tokens={[
          'bg-glass',
          'bg-glass-strong',
          'backdrop-blur-glass',
          'border-glass-line',
          'border-glass-edge',
          'bg-glow-primary',
          'bg-glow-secondary',
          'bg-glow-frost',
          'shadow-float',
          'shadow-dialog',
        ]}
      />

      {/* Part 1: Interactive Physics Playground */}
      <div className="p-6 rounded-2xl bg-surface border border-line space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line-subtle pb-3">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-ink-heading font-mono flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary-ink" />
              1. Glass Substrate over Atmospheric Light Sources
            </h3>
            <span className="text-xs text-ink-muted">
              Cold (glow-primary) & Warm (glow-secondary) sources radiating behind frosted layers
            </span>
          </div>

          {/* Local Switcher */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <button
              type="button"
              onClick={() => setLocalReducedTransparency(!localReducedTransparency)}
              className={`px-2.5 py-1 rounded-md border text-[11px] font-medium transition-colors ${
                localReducedTransparency
                  ? 'bg-primary text-primary-on border-primary'
                  : 'bg-surface-chip text-ink-base border-line-subtle hover:bg-surface-chip-hover'
              }`}
            >
              Reduced Transparency: {localReducedTransparency ? 'ON' : 'OFF'}
            </button>
            <button
              type="button"
              onClick={() => setLocalNoBackdrop(!localNoBackdrop)}
              className={`px-2.5 py-1 rounded-md border text-[11px] font-medium transition-colors ${
                localNoBackdrop
                  ? 'bg-primary text-primary-on border-primary'
                  : 'bg-surface-chip text-ink-base border-line-subtle hover:bg-surface-chip-hover'
              }`}
            >
              No Backdrop Filter: {localNoBackdrop ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Luminous Glow Stage Container */}
        <div className="relative rounded-2xl p-8 sm:p-12 overflow-hidden bg-background-deep border border-line min-h-[360px] flex flex-col items-center justify-center">
          {/* Luminous Glow Emitters (Atmospheric light sources behind glass) */}
          <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-glow-primary blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full bg-glow-secondary blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-glow-frost blur-2xl pointer-events-none" />

          {/* Overlaid Floating Glass Card */}
          <div
            className={`relative z-10 w-full max-w-lg rounded-2xl p-6 sm:p-8 space-y-4 transition-all duration-300 group ${
              localReducedTransparency
                ? 'bg-surface border border-line shadow-dialog'
                : localNoBackdrop
                ? 'bg-surface border border-glass-edge shadow-dialog'
                : 'bg-glass-strong backdrop-blur-glass border border-glass-edge shadow-dialog hover:shadow-glow-primary'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                <h4 className="text-sm font-bold font-mono text-ink-heading">
                  Optical Glass Specimen
                </h4>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-surface-chip text-ink-heading border border-line-subtle">
                {localReducedTransparency ? 'Opaque Fallback' : 'bg-glass-strong (74% / 11%)'}
              </span>
            </div>

            <p className="text-xs text-ink-base leading-relaxed">
              This card is positioned directly over the intersecting radiance of <code className="font-mono text-primary-ink">glow-primary</code> and <code className="font-mono text-secondary-ink">glow-secondary</code>. Notice how the starlight typography remains razor-sharp and passes WCAG AA (&ge; 4.5:1).
            </p>

            <div className="pt-3 border-t border-glass-line flex items-center justify-between text-xs font-mono">
              <span className="text-ink-muted flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-success-ink" />
                Legibility Over Glow:
              </span>
              <span className="font-bold text-success-ink">PASS (7.4:1 AA)</span>
            </div>
          </div>

          {/* Floating Call Controls Bar (under the glass card) */}
          <div
            className={`relative z-10 mt-8 rounded-full px-5 py-2.5 flex items-center gap-4 transition-all ${
              localReducedTransparency
                ? 'bg-surface border border-line shadow-float'
                : 'bg-glass backdrop-blur-glass border border-glass-edge shadow-float'
            }`}
          >
            <button
              type="button"
              className="p-2 rounded-full hover:bg-surface-hover text-ink-heading transition-colors"
              title="Toggle Microphone"
            >
              <Mic className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-2 rounded-full hover:bg-surface-hover text-ink-heading transition-colors"
              title="Toggle Camera"
            >
              <Video className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-2 rounded-full hover:bg-surface-hover text-ink-heading transition-colors"
              title="Share Screen"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-2 rounded-full bg-destructive text-destructive-on hover:bg-destructive-hover transition-colors shadow-sm"
              title="End Transmission"
            >
              <PhoneOff className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Part 2: Floating Dock & Fallback Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Floating App Dock */}
        <div className="p-6 rounded-2xl bg-surface border border-line space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-ink-heading font-mono">
            2. Floating Application Dock
          </h3>
          <p className="text-xs text-ink-muted">
            Frosted dock bar with specular rim highlights (<code className="font-mono text-primary-ink">border-glass-edge</code>) and subtle depth shadow.
          </p>

          <div className="py-6 flex items-center justify-center bg-background-band rounded-xl border border-line-subtle">
            <div className="rounded-2xl p-2 bg-glass-strong backdrop-blur-glass border border-glass-edge shadow-dialog flex items-center gap-2">
              {[
                { icon: Layout, label: 'Workbench' },
                { icon: Terminal, label: 'Terminal' },
                { icon: Layers, label: 'Layers' },
                { icon: Sliders, label: 'Preferences' },
              ].map((dock, idx) => {
                const Icon = dock.icon;
                return (
                  <button
                    key={dock.label}
                    type="button"
                    className="p-2.5 rounded-xl hover:bg-surface-hover text-ink-heading transition-transform hover:-translate-y-1 relative group"
                    title={dock.label}
                  >
                    <Icon className="w-5 h-5" />
                    {idx === 0 && (
                      <span className="w-1 h-1 rounded-full bg-primary absolute bottom-1 left-1/2 -translate-x-1/2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Fallback Comparison Matrix */}
        <div className="p-6 rounded-2xl bg-surface border border-line space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-ink-heading font-mono">
            3. Fallback Modes Comparison
          </h3>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-glass backdrop-blur-glass border border-glass-line text-xs">
              <span className="font-mono font-bold text-ink-heading block mb-1">
                A. Standard Native Glass (blur-glass: 22px)
              </span>
              <span className="text-ink-muted">
                Translucent wash letting background luminance gently illuminate foreground content.
              </span>
            </div>

            <div className="p-3 rounded-xl bg-surface border border-line text-xs">
              <span className="font-mono font-bold text-ink-heading block mb-1">
                B. prefers-reduced-transparency Fallback (bg-surface)
              </span>
              <span className="text-ink-muted">
                Opaque surface layer completely shielding sensitive users from background visual motion.
              </span>
            </div>

            <div className="p-3 rounded-xl bg-surface-dialog border border-glass-edge text-xs">
              <span className="font-mono font-bold text-ink-heading block mb-1">
                C. no-backdrop-filter Fallback (Solid Dialog Tier)
              </span>
              <span className="text-ink-muted">
                High-opacity surface container ensuring text passes WCAG AA without CSS backdrop-filter.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
