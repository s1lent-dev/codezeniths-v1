import { useState } from 'react';
import { SceneHeader } from '../components/shell/SceneHeader.tsx';
import { ContrastBadge } from '../components/common/ContrastBadge.tsx';
import { calculateContrast } from '../lib/culori-math.ts';
import { ROLE_TOKENS } from '../lib/tokens.ts';
import { Type, ExternalLink } from 'lucide-react';

export function Scene03_TextOnLayers() {
  const [activeTab, setActiveTab] = useState<'matrix' | 'specimens'>('matrix');

  const inkTokens = ROLE_TOKENS.filter((t) => t.category === 'ink');
  const surfaceTokens = ROLE_TOKENS.filter(
    (t) => t.category === 'surface' || (t.category === 'background' && !t.name.includes('hover') && !t.name.includes('selected') && !t.name.includes('active') && !t.name.includes('glass'))
  );

  return (
    <section className="space-y-10">
      <SceneHeader
        number={3}
        title="Text on Layers & Contrast Matrix"
        purpose="Exhaustive Cartesian matrix testing all ink typography roles across all background and surface roles with live WCAG contrast ratios, plus long-form reading specimens and link states."
        tokens={[
          'text-ink-heading',
          'text-ink-base',
          'text-ink-body',
          'text-ink-muted',
          'text-ink-subtle',
          'text-ink-disabled',
          'text-ink-inverse',
          'bg-surface-*',
          'bg-background-*',
        ]}
      />

      {/* Mode / View Selector */}
      <div className="flex items-center gap-2 border-b border-line pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('matrix')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'matrix'
              ? 'bg-primary text-primary-on'
              : 'bg-surface-chip text-ink-base hover:bg-surface-chip-hover border border-line-subtle'
          }`}
        >
          Cartesian Matrix (7 Inks × 14 Surfaces)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('specimens')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'specimens'
              ? 'bg-primary text-primary-on'
              : 'bg-surface-chip text-ink-base hover:bg-surface-chip-hover border border-line-subtle'
          }`}
        >
          Typography Specimens & Long-form
        </button>
      </div>

      {activeTab === 'matrix' ? (
        /* Full Cartesian Matrix Table */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-ink-muted">
              Live contrast evaluated against active mode tokens:
            </span>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded bg-success" />
                AAA (&ge; 7:1)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded bg-info" />
                AA (&ge; 4.5:1)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded bg-destructive" />
                Fail (&lt; 4.5:1)
              </span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-line bg-surface">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-surface-well border-b border-line text-ink-muted font-mono uppercase text-[10px]">
                  <th className="p-3 sticky left-0 z-20 bg-surface-well border-r border-line">
                    Surface Role
                  </th>
                  {inkTokens.map((ink) => (
                    <th key={ink.name} className="p-3 text-center min-w-[130px]">
                      {ink.name.replace('ink-', '')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line-subtle font-mono">
                {surfaceTokens.map((surface) => (
                  <tr key={surface.name} className="hover:bg-surface-hover/30 transition-colors">
                    {/* Surface Header Cell */}
                    <td className="p-3 sticky left-0 z-10 bg-surface font-semibold text-ink-heading border-r border-line truncate max-w-[150px]">
                      {surface.name}
                    </td>

                    {/* Matrix Cells */}
                    {inkTokens.map((ink) => {
                      // Compute contrast in dark and light
                      const ratioDark = calculateContrast(ink.darkVal, surface.darkVal);
                      const ratioLight = calculateContrast(ink.lightVal, surface.lightVal);
                      const minRequired = ink.name.includes('heading') || ink.name.includes('base') ? 7.0 : 4.5;

                      return (
                        <td
                          key={ink.name}
                          className={`p-3 text-center transition-colors ${surface.utility}`}
                        >
                          <div className="flex flex-col items-center gap-1">
                            <span className={`text-xs font-sans font-medium ${ink.utility}`}>
                              Nightglass
                            </span>
                            <div className="flex items-center gap-1">
                              <ContrastBadge ratio={ratioDark} minRatio={minRequired} />
                            </div>
                            <span className="text-[9px] text-ink-muted opacity-80">
                              L:{ratioLight.toFixed(1)} / D:{ratioDark.toFixed(1)}
                            </span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Part 2: Long-Form Reading Specimens & Link States */
        <div className="space-y-8">
          {/* Typography Scale */}
          <div className="p-6 rounded-2xl bg-surface border border-line space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-ink-heading font-mono flex items-center gap-2">
              <Type className="w-4 h-4 text-primary-ink" />
              1. Typography Role Scale
            </h3>

            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono text-ink-muted uppercase block">
                  text-ink-heading — Large Display & Titles
                </span>
                <h1 className="text-3xl font-bold tracking-tight text-ink-heading mt-1">
                  High-Throughput Distributed Cloud Systems
                </h1>
              </div>

              <div>
                <span className="text-[10px] font-mono text-ink-muted uppercase block">
                  text-ink-base — Standard UI Interface Text
                </span>
                <p className="text-base text-ink-base mt-1">
                  The primary UI typography tier for cards, modal dialogs, form labels, and table cells.
                </p>
              </div>

              <div>
                <span className="text-[10px] font-mono text-ink-muted uppercase block">
                  text-ink-body — Long-form Narrative & Documentation
                </span>
                <p className="text-sm text-ink-body leading-relaxed mt-1 max-w-3xl">
                  Distributed consensus mechanisms require strict mathematical consistency guarantees across all consensus nodes in a cluster. When network partitions occur, the CAP theorem dictates that a distributed data store must choose between availability and partition tolerance. Nightglass utilizes a dual-light metaphor to maintain atmospheric harmony while strictly ensuring WCAG 2.1 AAA contrast ratios across all reading tiers.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-line-subtle">
                <div>
                  <span className="text-[10px] font-mono text-ink-muted uppercase block">
                    text-ink-muted — Metadata
                  </span>
                  <p className="text-xs text-ink-muted mt-1">
                    Updated 3 minutes ago · 4.8MB memory · Node us-east-2
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-ink-muted uppercase block">
                    text-ink-subtle — Timestamps
                  </span>
                  <p className="text-xs text-ink-subtle mt-1">
                    YYYY-MM-DD HH:mm:ss UTC · ID: #98412
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-ink-muted uppercase block">
                    text-ink-disabled — Inactive
                  </span>
                  <p className="text-xs text-ink-disabled mt-1">
                    Feature disabled on your current tier
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Hyperlink Rest & Hover States */}
          <div className="p-6 rounded-2xl bg-surface border border-line space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-ink-heading font-mono flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-primary-ink" />
              2. Hyperlinks & Interactive Anchor States
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-surface-well border border-line-subtle space-y-2">
                <span className="text-xs font-mono text-ink-muted block">Primary Blue-Violet Link</span>
                <p className="text-xs text-ink-base leading-relaxed">
                  Review the cluster architecture in the{' '}
                  <a
                    href="#link-test"
                    onClick={(e) => e.preventDefault()}
                    className="text-primary-ink font-medium underline underline-offset-4 hover:text-primary-ink-hover hover:underline transition-colors focus-visible:outline-2 focus-visible:outline-focus rounded"
                  >
                    API Documentation Guide →
                  </a>
                </p>
              </div>

              <div className="p-4 rounded-xl bg-surface-well border border-line-subtle space-y-2">
                <span className="text-xs font-mono text-ink-muted block">Secondary Orchid Link</span>
                <p className="text-xs text-ink-base leading-relaxed">
                  Discover advanced tuning capabilities in the{' '}
                  <a
                    href="#link-test"
                    onClick={(e) => e.preventDefault()}
                    className="text-secondary-ink font-medium underline underline-offset-4 hover:text-secondary-ink-hover hover:underline transition-colors focus-visible:outline-2 focus-visible:outline-focus rounded"
                  >
                    Performance Dashboard →
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
