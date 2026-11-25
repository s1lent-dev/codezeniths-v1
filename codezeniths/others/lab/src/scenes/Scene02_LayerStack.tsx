import { SceneHeader } from '../components/shell/SceneHeader.tsx';
import { Layers, ArrowDown, Scissors, Sparkles } from 'lucide-react';

export function Scene02_LayerStack() {
  return (
    <section className="space-y-10">
      <SceneHeader
        number={2}
        title="Layer Stack & Optical Depth"
        purpose="Demonstration of the physical optical elevation model: nested containment from base canvas to floating dialog, depth ladders with role labels, and the optical cut-through effect."
        tokens={[
          'bg-background',
          'bg-background-band',
          'bg-surface',
          'bg-surface-well',
          'bg-surface-deep',
          'bg-surface-input',
          'bg-surface-float',
          'bg-surface-dialog',
          'bg-scrim',
        ]}
      />

      {/* Part 1: Nested Containment Ladder */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-ink-heading font-mono flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary-ink" />
            1. Nested Containment Stack (L0 → L4)
          </h3>
          <span className="text-xs text-ink-muted">All layers nested sequentially</span>
        </div>

        {/* Level 0: Page Background Canvas */}
        <div className="rounded-2xl p-6 bg-background border border-line space-y-4">
          <div className="flex items-center justify-between text-xs font-mono font-semibold">
            <span className="text-ink-heading">L0: Page Canvas [bg-background]</span>
            <span className="text-ink-muted">Bedrock app floor</span>
          </div>

          {/* Level 1: Background Band */}
          <div className="rounded-xl p-5 bg-background-band border border-line-subtle space-y-4">
            <div className="flex items-center justify-between text-xs font-mono font-semibold">
              <span className="text-ink-heading">L1: Section Band [bg-background-band]</span>
              <span className="text-ink-muted">Breaks vertical monotony</span>
            </div>

            {/* Level 2: Surface Card */}
            <div className="rounded-xl p-5 bg-surface border border-line space-y-4">
              <div className="flex items-center justify-between text-xs font-mono font-semibold">
                <span className="text-ink-heading">L2: Primary Card [bg-surface]</span>
                <span className="text-ink-muted">Elevated workspace</span>
              </div>

              {/* Level 3: Inset Well */}
              <div className="rounded-lg p-4 bg-surface-well border border-line-subtle space-y-4">
                <div className="flex items-center justify-between text-xs font-mono font-semibold">
                  <span className="text-ink-heading flex items-center gap-1.5">
                    <Scissors className="w-3.5 h-3.5 text-primary-ink" />
                    L3: Recessed Inset [bg-surface-well]
                  </span>
                  <span className="text-primary-ink font-bold">Cut-Through to L0</span>
                </div>

                {/* Level 3.5: Form Input */}
                <div className="rounded-md p-3 bg-surface-input border border-line-strong space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono font-semibold">
                    <span className="text-ink-heading">L3.5: Form Control [bg-surface-input]</span>
                    <span className="text-ink-muted">Active form element</span>
                  </div>

                  {/* Level 4: Floating Popover */}
                  <div className="rounded-lg p-3 bg-surface-float border border-glass-edge shadow-float space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono font-semibold">
                      <span className="text-ink-heading flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-secondary-ink" />
                        L4: Floating Popover [bg-surface-float]
                      </span>
                      <span className="text-secondary-ink font-bold">Overlaid Layer</span>
                    </div>
                    <p className="text-xs text-ink-base">
                      Items inside popovers/dialogs must use <code className="font-mono text-primary-ink">surface-overlay-*</code>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Part 2: The Cut-Through Effect Proof */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-ink-heading font-mono flex items-center gap-2">
          <Scissors className="w-4 h-4 text-primary-ink" />
          2. The "Cut-Through" Effect Optical Proof
        </h3>
        <p className="text-xs text-ink-body max-w-2xl">
          In Nightglass, <code className="font-mono text-primary-ink">bg-surface-well</code> is mathematically matched to <code className="font-mono text-primary-ink">bg-background</code> ($L=15.0\%$ dark, $L=96.0\%$ light). Placing a well inside a card visually cuts through the elevated layer to reveal the bedrock canvas.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-surface border border-line">
          {/* Card containing a well */}
          <div className="p-5 rounded-xl bg-surface-well border border-line-subtle space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-ink-heading">Inset Well Region</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-primary-tint text-primary-ink font-semibold">
                bg-surface-well
              </span>
            </div>
            <p className="text-xs text-ink-base leading-relaxed">
              This well is physically embedded inside an elevated card. Look at how seamlessly its tone matches the bedrock canvas below.
            </p>
            <div className="pt-2 border-t border-line-subtle flex items-center justify-between font-mono text-[11px] text-ink-muted">
              <span>Luminance:</span>
              <span className="text-ink-heading font-bold">15.0% (Dark) / 96.0% (Light)</span>
            </div>
          </div>

          {/* Reference Bedrock Canvas Block */}
          <div className="p-5 rounded-xl bg-background border border-line space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-ink-heading">Bedrock Canvas Reference</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-surface-chip text-ink-base font-semibold">
                bg-background
              </span>
            </div>
            <p className="text-xs text-ink-base leading-relaxed">
              This block uses the base canvas directly. Notice the zero-step luminance transition with the adjacent well.
            </p>
            <div className="pt-2 border-t border-line-subtle flex items-center justify-between font-mono text-[11px] text-ink-muted">
              <span>Luminance Delta:</span>
              <span className="text-success-ink font-bold">ΔL = 0.00% (Identical)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Part 3: Deep Terminal Recess & Scrimmed Dialog */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-ink-heading font-mono flex items-center gap-2">
          <ArrowDown className="w-4 h-4 text-primary-ink" />
          3. Deep Recesses & Scrim Overlays
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Deep Recess (Terminal/Logs) */}
          <div className="rounded-xl bg-surface border border-line p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-ink-heading">Deep Recess [bg-surface-deep]</span>
              <span className="text-[10px] font-mono text-ink-muted">L=11.2% (Dark) / 91.0% (Light)</span>
            </div>
            <div className="rounded-lg p-3.5 bg-surface-deep border border-line-subtle font-mono text-xs text-ink-body space-y-1">
              <div className="text-primary-ink">$ systemctl status judge-worker-01</div>
              <div className="text-success-ink">● judge-worker.service - Active (running)</div>
              <div className="text-ink-muted">  Memory: 412.3MB | CPU: 12% | Latency: 14ms</div>
            </div>
            <p className="text-xs text-ink-muted">
              Used for deepest in-card recesses such as terminals, code editors, and raw JSON previews.
            </p>
          </div>

          {/* Dialog on Scrim Simulation */}
          <div className="relative rounded-xl overflow-hidden border border-line p-6 flex items-center justify-center min-h-[180px]">
            {/* Scrim Backdrop */}
            <div className="absolute inset-0 bg-scrim flex items-center justify-center p-4">
              {/* Modal Dialog */}
              <div className="relative z-10 w-full max-w-sm rounded-xl p-4 bg-surface-dialog border border-glass-edge shadow-dialog space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-ink-heading">Confirm Deployment</h4>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-surface-chip text-ink-muted">
                    surface-dialog
                  </span>
                </div>
                <p className="text-xs text-ink-muted">
                  Scrim overlay (<code className="font-mono text-ink-heading">bg-scrim</code>) creates depth isolation.
                </p>
                <div className="flex justify-end gap-2 pt-1">
                  <button className="px-2.5 py-1 rounded text-xs bg-surface-overlay-hover text-ink-base font-medium">
                    Cancel
                  </button>
                  <button className="px-2.5 py-1 rounded text-xs bg-primary text-primary-on font-medium shadow-sm">
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
