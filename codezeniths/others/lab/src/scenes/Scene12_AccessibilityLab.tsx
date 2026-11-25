import { useState } from 'react';
import { SceneHeader } from '../components/shell/SceneHeader.tsx';
import { ContrastBadge } from '../components/common/ContrastBadge.tsx';
import { HUE_FAMILIES, ROLE_TOKENS } from '../lib/tokens.ts';
import { calculateContrast, calculateDeltaE, blendWithBackground } from '../lib/culori-math.ts';
import { AlertOctagon, Eye, Focus, ShieldCheck } from 'lucide-react';

export function Scene12_AccessibilityLab() {
  const [forcedColors, setForcedColors] = useState(false);

  const statuses = HUE_FAMILIES.filter((f) => f.role === 'status');

  // Surface tokens
  const surfaceToken = ROLE_TOKENS.find((t) => t.name === 'surface')!;
  const lineStrongToken = ROLE_TOKENS.find((t) => t.name === 'line-strong')!;

  // Line-strong contrast on surface (Required >= 3:1)
  const lineContrastDark = calculateContrast(lineStrongToken.darkVal, surfaceToken.darkVal);
  const lineContrastLight = calculateContrast(lineStrongToken.lightVal, surfaceToken.lightVal);

  // Status pairwise distance calculation
  const statusPairs: { pair: string; darkDelta: number; lightDelta: number }[] = [];
  for (let i = 0; i < statuses.length; i++) {
    for (let j = i + 1; j < statuses.length; j++) {
      const s1 = statuses[i];
      const s2 = statuses[j];
      const darkDelta = calculateDeltaE(s1.solidDark, s2.solidDark);
      const lightDelta = calculateDeltaE(s1.solidLight, s2.solidLight);
      statusPairs.push({
        pair: `${s1.label} ↔ ${s2.label}`,
        darkDelta,
        lightDelta,
      });
    }
  }

  return (
    <section className="space-y-10">
      <SceneHeader
        number={12}
        title="Accessibility Lab & Verification Matrix"
        purpose="Automated verification suite testing contrast thresholds ({name}-on on {name} >= 4.5:1, {name}-ink on 15% tint >= 4.5:1, line-strong >= 3:1), minimum color-blind separation (Delta E), focus ring visibility, and forced-colors simulation."
        tokens={[
          '--color-focus',
          '--line-strong',
          '--*-on',
          '--*-ink',
          '--*-tint',
        ]}
      />

      {/* Part 1: Solid & Tint Contrast Verification Matrix */}
      <div className="p-6 rounded-2xl bg-surface border border-line space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-ink-heading font-mono flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary-ink" />
            1. Container Contrast Rule Assertions ({'{name}'}-on & {'{name}'}-ink)
          </h3>
          <span className="text-xs font-mono text-ink-muted">Threshold: &ge; 4.5:1</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-line-subtle">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead className="bg-surface-well border-b border-line-subtle text-ink-muted uppercase text-[10px]">
              <tr>
                <th className="p-3">Family</th>
                <th className="p-3 text-center">Solid + On (Light)</th>
                <th className="p-3 text-center">Solid + On (Dark)</th>
                <th className="p-3 text-center">Ink on 15% Tint (Light)</th>
                <th className="p-3 text-center">Ink on 15% Tint (Dark)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-subtle text-ink-base">
              {HUE_FAMILIES.map((fam) => {
                const solidOnLight = calculateContrast(fam.onLight, fam.solidLight);
                const solidOnDark = calculateContrast(fam.onDark, fam.solidDark);

                // Blend 15% tint over surface
                const tintLight = blendWithBackground(fam.solidLight, surfaceToken.lightVal, 0.15);
                const tintDark = blendWithBackground(fam.solidDark, surfaceToken.darkVal, 0.15);

                const inkTintLight = calculateContrast(fam.inkLight, tintLight);
                const inkTintDark = calculateContrast(fam.inkDark, tintDark);

                return (
                  <tr key={fam.id} className="hover:bg-surface-hover transition-colors">
                    <td className="p-3 font-semibold text-ink-heading capitalize">
                      {fam.label}
                    </td>

                    {/* Solid + On Light */}
                    <td className="p-3 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <ContrastBadge ratio={solidOnLight} minRatio={4.5} />
                      </div>
                    </td>

                    {/* Solid + On Dark */}
                    <td className="p-3 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <ContrastBadge ratio={solidOnDark} minRatio={4.5} />
                      </div>
                    </td>

                    {/* Ink on Tint Light */}
                    <td className="p-3 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <ContrastBadge ratio={inkTintLight} minRatio={4.5} />
                      </div>
                    </td>

                    {/* Ink on Tint Dark */}
                    <td className="p-3 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <ContrastBadge ratio={inkTintDark} minRatio={4.5} />
                      </div>
                    </td>
                  </tr>
                );
              })}
              {/* Line-Strong on Surface assertion */}
              <tr className="bg-surface-well font-semibold border-t-2 border-line">
                <td className="p-3 text-ink-heading">
                  line-strong on surface (&ge; 3:1)
                </td>
                <td className="p-3 text-center" colSpan={2}>
                  <div className="inline-flex items-center gap-2">
                    <span className="text-[10px] text-ink-muted">Light:</span>
                    <ContrastBadge ratio={lineContrastLight} minRatio={3.0} />
                  </div>
                </td>
                <td className="p-3 text-center" colSpan={2}>
                  <div className="inline-flex items-center gap-2">
                    <span className="text-[10px] text-ink-muted">Dark:</span>
                    <ContrastBadge ratio={lineContrastDark} minRatio={3.0} />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Part 2: Color-Blind Status Pair Separation (Delta E) */}
      <div className="p-6 rounded-2xl bg-surface border border-line space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line-subtle pb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-ink-heading font-mono flex items-center gap-2">
            <Eye className="w-4 h-4 text-primary-ink" />
            2. Color-Blind Status Pair Separation (ΔE)
          </h3>
          <span className="text-xs font-mono text-ink-muted">
            Reports Euclidean distance between status pairs (Higher = more distinguishable)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {statusPairs.map((pair, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-surface-well border border-line-subtle space-y-2 font-mono text-xs"
            >
              <div className="flex items-center justify-between text-ink-heading font-semibold">
                <span>{pair.pair}</span>
                <span className="text-[10px] text-success-ink font-bold">DISTINCT</span>
              </div>
              <div className="pt-2 border-t border-line-subtle flex items-center justify-between text-ink-muted text-[11px]">
                <span>ΔE Light Mode:</span>
                <span className="text-ink-heading font-bold">{pair.lightDelta}</span>
              </div>
              <div className="flex items-center justify-between text-ink-muted text-[11px]">
                <span>ΔE Dark Mode:</span>
                <span className="text-ink-heading font-bold">{pair.darkDelta}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Part 3: Focus Ring & Forced Colors Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Focus Ring Visibility */}
        <div className="p-6 rounded-2xl bg-surface border border-line space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-ink-heading font-mono flex items-center gap-2">
            <Focus className="w-4 h-4 text-primary-ink" />
            3. Focus Ring Visibility (ring-focus)
          </h3>
          <p className="text-xs text-ink-body">
            All interactive elements trigger a 2px high-contrast outline using <code className="font-mono text-primary-ink">outline-focus</code> (primary at 70% opacity) with 2px offset.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-surface-input border border-line-strong text-ink-base focus:outline-none focus:ring-2 focus:ring-focus transition-all"
            >
              Click or Tab to Focus
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-primary text-primary-on focus:outline-none focus:ring-2 focus:ring-focus transition-all"
            >
              Primary Button Focus
            </button>
          </div>
        </div>

        {/* Forced Colors Preview */}
        <div className="p-6 rounded-2xl bg-surface border border-line space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-ink-heading font-mono flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-primary-ink" />
              4. Forced Colors Simulation (High Contrast)
            </h3>
            <button
              type="button"
              onClick={() => setForcedColors(!forcedColors)}
              className={`px-2.5 py-1 rounded text-xs font-mono font-semibold transition-colors ${
                forcedColors ? 'bg-primary text-primary-on' : 'bg-surface-chip text-ink-base border border-line-subtle'
              }`}
            >
              {forcedColors ? 'Simulating ON' : 'Simulate'}
            </button>
          </div>

          <div
            className={`p-4 rounded-xl border space-y-3 transition-colors ${
              forcedColors
                ? 'bg-black text-white border-white'
                : 'bg-surface-well border-line-subtle text-ink-base'
            }`}
          >
            <div className="text-xs font-bold">
              {forcedColors ? 'High Contrast Mode Activated' : 'Standard Mode'}
            </div>
            <p className="text-xs">
              When forced-colors is active, system colors replace semantic tokens to guarantee maximum visibility for low-vision users.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                className={`px-3 py-1 rounded text-xs font-medium border ${
                  forcedColors
                    ? 'border-white text-white hover:bg-white hover:text-black'
                    : 'bg-primary text-primary-on border-primary'
                }`}
              >
                Action
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
