import { useState } from 'react';
import { SceneHeader } from '../components/shell/SceneHeader.tsx';
import { CHART_SERIES } from '../lib/tokens.ts';
import { simulateCvdColor, type CvdType } from '../lib/culori-math.ts';
import { BarChart3, LineChart, PieChart, Eye } from 'lucide-react';

export function Scene10_DataViz() {
  const [cvdMode, setCvdMode] = useState<CvdType>('normal');

  const barValues = [65, 82, 45, 90, 72, 58, 88, 76];

  return (
    <section className="space-y-10">
      <SceneHeader
        number={10}
        title="Data Visualization & CVD Perception"
        purpose="Verification of chart-1 through chart-8 series tokens across line graphs, bar charts, and donut gauges, with real-time Color Vision Deficiency (CVD) simulation (Protanopia, Deuteranopia, Tritanopia)."
        tokens={[
          '--chart-1',
          '--chart-2',
          '--chart-3',
          '--chart-4',
          '--chart-5',
          '--chart-6',
          '--chart-7',
          '--chart-8',
        ]}
      />

      {/* CVD Control Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-surface border border-line">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-primary-ink" />
          <span className="text-xs font-mono font-bold text-ink-heading uppercase">
            Color Blindness Simulation:
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'normal', label: 'Standard Vision' },
            { id: 'protan', label: 'Protanopia (Red-Blind)' },
            { id: 'deutan', label: 'Deuteranopia (Green-Blind)' },
            { id: 'tritan', label: 'Tritanopia (Blue-Blind)' },
          ].map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setCvdMode(mode.id as CvdType)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                cvdMode === mode.id
                  ? 'bg-primary text-primary-on font-semibold shadow-sm'
                  : 'bg-surface-chip text-ink-base hover:bg-surface-chip-hover border border-line-subtle'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Part 1: Grouped Bar Chart & Line Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grouped Bar Chart */}
        <div className="p-6 rounded-2xl bg-surface border border-line space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-ink-heading font-mono flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary-ink" />
              1. Chart Series Bar Distribution
            </h3>
            <span className="text-xs font-mono text-ink-muted">chart-1..8</span>
          </div>

          <div className="h-64 flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-line-subtle bg-surface-well rounded-xl">
            {CHART_SERIES.map((s, idx) => {
              const height = barValues[idx];
              const cssColor = `var(--${s.id})`;
              const displayColor = cvdMode === 'normal' ? cssColor : simulateCvdColor(cssColor, cvdMode);

              return (
                <div key={s.id} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-mono text-ink-muted opacity-0 group-hover:opacity-100 transition-opacity">
                    {height}%
                  </span>
                  <div
                    className="w-full max-w-[32px] rounded-t-md transition-all duration-300"
                    style={{
                      height: `${height}%`,
                      backgroundColor: displayColor,
                    }}
                  />
                  <span className="text-[10px] font-mono text-ink-muted">
                    {idx + 1}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* SVG Multi-Line Chart */}
        <div className="p-6 rounded-2xl bg-surface border border-line space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-ink-heading font-mono flex items-center gap-2">
              <LineChart className="w-4 h-4 text-primary-ink" />
              2. Multi-Line Continuous Trends
            </h3>
            <span className="text-xs font-mono text-ink-muted">3 Overlapping Series</span>
          </div>

          <div className="h-64 rounded-xl bg-surface-well p-4 flex flex-col justify-between border border-line-subtle">
            <svg viewBox="0 0 400 180" className="w-full h-full overflow-visible">
              {/* Grid Lines */}
              <line x1="0" y1="45" x2="400" y2="45" stroke="var(--line-subtle)" strokeDasharray="3 3" />
              <line x1="0" y1="90" x2="400" y2="90" stroke="var(--line-subtle)" strokeDasharray="3 3" />
              <line x1="0" y1="135" x2="400" y2="135" stroke="var(--line-subtle)" strokeDasharray="3 3" />

              {/* Line 1 (Series 1) */}
              <path
                d="M 10 130 Q 80 40, 160 90 T 320 30 T 390 60"
                fill="none"
                stroke="var(--chart-1)"
                strokeWidth="3"
                className="transition-colors duration-300"
              />
              {/* Line 2 (Series 2) */}
              <path
                d="M 10 160 Q 90 120, 180 140 T 310 80 T 390 110"
                fill="none"
                stroke="var(--chart-2)"
                strokeWidth="3"
                className="transition-colors duration-300"
              />
              {/* Line 3 (Series 3) */}
              <path
                d="M 10 80 Q 110 140, 200 60 T 300 120 T 390 40"
                fill="none"
                stroke="var(--chart-3)"
                strokeWidth="3"
                className="transition-colors duration-300"
              />
            </svg>

            <div className="flex items-center justify-between text-[11px] font-mono text-ink-muted pt-2 border-t border-line-subtle">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>24:00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Part 2: Donut Gauge & Color Legend */}
      <div className="p-6 rounded-2xl bg-surface border border-line space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-ink-heading font-mono flex items-center gap-2">
          <PieChart className="w-4 h-4 text-primary-ink" />
          3. Donut Composition & Legend Spectrum
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Donut Gauge */}
          <div className="flex items-center justify-center p-4 bg-surface-well rounded-xl border border-line-subtle">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" stroke="var(--surface-track)" strokeWidth="14" fill="none" />
                <circle cx="50" cy="50" r="40" stroke="var(--chart-1)" strokeWidth="14" strokeDasharray="80 251" fill="none" />
                <circle cx="50" cy="50" r="40" stroke="var(--chart-2)" strokeWidth="14" strokeDasharray="55 251" strokeDashoffset="-80" fill="none" />
                <circle cx="50" cy="50" r="40" stroke="var(--chart-3)" strokeWidth="14" strokeDasharray="45 251" strokeDashoffset="-135" fill="none" />
                <circle cx="50" cy="50" r="40" stroke="var(--chart-4)" strokeWidth="14" strokeDasharray="35 251" strokeDashoffset="-180" fill="none" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs font-mono text-ink-muted">TOTAL</span>
                <span className="text-xl font-bold font-mono text-ink-heading">100%</span>
              </div>
            </div>
          </div>

          {/* Interactive Series Legend */}
          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CHART_SERIES.map((s) => (
              <div
                key={s.id}
                className="p-3 rounded-lg bg-surface-well border border-line-subtle space-y-1.5"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: `var(--${s.id})` }}
                  />
                  <span className="text-xs font-mono font-semibold text-ink-heading">
                    {s.label}
                  </span>
                </div>
                <div className="text-[10px] font-mono text-ink-muted flex flex-col">
                  <span>Var: --{s.id}</span>
                  <span className="text-primary-ink capitalize">
                    Mapped: {s.lightRef}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
