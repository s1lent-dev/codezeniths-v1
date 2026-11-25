import { SceneHeader } from '../components/shell/SceneHeader.tsx';
import { HUE_FAMILIES } from '../lib/tokens.ts';
import {
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Info,
  TrendingUp,
  TrendingDown,
  Flame,
  Code2,
  Activity,
  Sparkles,
} from 'lucide-react';

const HUE_CLASSES: Record<
  string,
  {
    bgSolid: string;
    textOn: string;
    bgTint: string;
    textInk: string;
    borderLine: string;
  }
> = {
  primary: {
    bgSolid: 'bg-primary',
    textOn: 'text-primary-on',
    bgTint: 'bg-primary-tint',
    textInk: 'text-primary-ink',
    borderLine: 'border-primary-line',
  },
  secondary: {
    bgSolid: 'bg-secondary',
    textOn: 'text-secondary-on',
    bgTint: 'bg-secondary-tint',
    textInk: 'text-secondary-ink',
    borderLine: 'border-secondary-line',
  },
  success: {
    bgSolid: 'bg-success',
    textOn: 'text-success-on',
    bgTint: 'bg-success-tint',
    textInk: 'text-success-ink',
    borderLine: 'border-success-line',
  },
  warning: {
    bgSolid: 'bg-warning',
    textOn: 'text-warning-on',
    bgTint: 'bg-warning-tint',
    textInk: 'text-warning-ink',
    borderLine: 'border-warning-line',
  },
  destructive: {
    bgSolid: 'bg-destructive',
    textOn: 'text-destructive-on',
    bgTint: 'bg-destructive-tint',
    textInk: 'text-destructive-ink',
    borderLine: 'border-destructive-line',
  },
  info: {
    bgSolid: 'bg-info',
    textOn: 'text-info-on',
    bgTint: 'bg-info-tint',
    textInk: 'text-info-ink',
    borderLine: 'border-info-line',
  },
  orange: {
    bgSolid: 'bg-orange',
    textOn: 'text-orange-on',
    bgTint: 'bg-orange-tint',
    textInk: 'text-orange-ink',
    borderLine: 'border-orange-line',
  },
  olive: {
    bgSolid: 'bg-olive',
    textOn: 'text-olive-on',
    bgTint: 'bg-olive-tint',
    textInk: 'text-olive-ink',
    borderLine: 'border-olive-line',
  },
  teal: {
    bgSolid: 'bg-teal',
    textOn: 'text-teal-on',
    bgTint: 'bg-teal-tint',
    textInk: 'text-teal-ink',
    borderLine: 'border-teal-line',
  },
  purple: {
    bgSolid: 'bg-purple',
    textOn: 'text-purple-on',
    bgTint: 'bg-purple-tint',
    textInk: 'text-purple-ink',
    borderLine: 'border-purple-line',
  },
};

export function Scene05_StatusAndAccents() {
  const getIcon = (id: string) => {
    switch (id) {
      case 'success': return CheckCircle2;
      case 'warning': return AlertTriangle;
      case 'destructive': return AlertOctagon;
      case 'info': return Info;
      case 'orange': return Flame;
      case 'olive': return Code2;
      case 'teal': return Activity;
      case 'purple': return Sparkles;
      default: return Activity;
    }
  };

  return (
    <section className="space-y-10">
      <SceneHeader
        number={5}
        title="Status & Accent Hues"
        purpose="Visual verification for all 10 color families across chips, badges (solid, tint, outline), standalone dots, alerts, banners, inline validation, progress bars, and stat deltas."
        tokens={[
          'bg-primary',
          'text-primary-on',
          'bg-secondary',
          'text-secondary-on',
          'bg-success',
          'text-success-on',
          'bg-success-tint',
          'text-success-ink',
          'border-success-line',
          'bg-warning',
          'text-warning-on',
          'bg-warning-tint',
          'text-warning-ink',
          'border-warning-line',
          'bg-destructive',
          'text-destructive-on',
          'bg-destructive-tint',
          'text-destructive-ink',
          'border-destructive-line',
          'bg-info',
          'text-info-on',
          'bg-info-tint',
          'text-info-ink',
          'border-info-line',
          'bg-orange',
          'text-orange-on',
          'bg-orange-tint',
          'text-orange-ink',
          'border-orange-line',
          'bg-olive',
          'text-olive-on',
          'bg-olive-tint',
          'text-olive-ink',
          'border-olive-line',
          'bg-teal',
          'text-teal-on',
          'bg-teal-tint',
          'text-teal-ink',
          'border-teal-line',
          'bg-purple',
          'text-purple-on',
          'bg-purple-tint',
          'text-purple-ink',
          'border-purple-line',
        ]}
      />

      {/* Part 1: All 10 Hues Matrix (Solid, Tint, Outline, Dot) */}
      <div className="p-6 rounded-2xl bg-surface border border-line space-y-6">
        <div className="flex items-center justify-between border-b border-line-subtle pb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-ink-heading font-mono">
            1. The 10 Hues Container & Foreground Spectrum
          </h3>
          <span className="text-xs font-mono text-ink-muted">
            Solid + On | Tint + Ink | Outline + Ink | Standalone Dot
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {HUE_FAMILIES.map((fam) => {
            const Icon = getIcon(fam.id);
            // Statically mapped Tailwind classes so Tailwind compiler can extract them
            const { bgSolid, textOn, bgTint, textInk, borderLine } = HUE_CLASSES[fam.id] ?? {
              bgSolid: 'bg-surface-chip',
              textOn: 'text-ink-base',
              bgTint: 'bg-surface-well',
              textInk: 'text-ink-base',
              borderLine: 'border-line',
            };

            return (
              <div
                key={fam.id}
                className="p-4 rounded-xl bg-surface-well border border-line-subtle space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-ink-heading capitalize">
                      {fam.label}
                    </span>
                    <span className="text-[10px] font-mono text-ink-muted uppercase">
                      {fam.role}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {/* 1. Solid Badge carrying on text */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-ink-muted">Solid:</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${bgSolid} ${textOn}`}>
                        <Icon className="w-3 h-3" />
                        Solid
                      </span>
                    </div>

                    {/* 2. Soft Tint Chip carrying ink text & line border */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-ink-muted">Tint:</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${bgTint} ${textInk} ${borderLine}`}>
                        <Icon className="w-3 h-3" />
                        Tint
                      </span>
                    </div>

                    {/* 3. Outline Tag */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-ink-muted">Outline:</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${borderLine} ${textInk}`}>
                        Outline
                      </span>
                    </div>

                    {/* 4. Standalone Dot / Icon (Job rule: uses text-*-ink or bg-*) */}
                    <div className="flex items-center justify-between pt-1 border-t border-line-subtle">
                      <span className="text-[10px] text-ink-muted">Standalone:</span>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${bgSolid}`} />
                        <Icon className={`w-3.5 h-3.5 ${textInk}`} />
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-ink-muted leading-tight pt-2 border-t border-line-subtle">
                  {fam.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Part 2: Alerts & Notification Banners */}
      <div className="p-6 rounded-2xl bg-surface border border-line space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-ink-heading font-mono">
          2. Status Banners & Alert Callouts
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Success Alert */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-success-tint border border-success-line text-success-ink">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs">
              <h4 className="font-semibold text-success-ink">Test Suite Completed (142 Passed)</h4>
              <p className="mt-1 text-ink-base">
                All 142 accessibility contrast assertions and color unit tests passed without regressions.
              </p>
            </div>
          </div>

          {/* Warning Banner */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-warning-tint border border-warning-line text-warning-ink">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs">
              <h4 className="font-semibold text-warning-ink">Token Deprecation Notice</h4>
              <p className="mt-1 text-ink-base">
                Legacy hex values are deprecated. Migrate all components to OKLCH semantic role utilities.
              </p>
            </div>
          </div>

          {/* Destructive Alert */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive-tint border border-destructive-line text-destructive-ink">
            <AlertOctagon className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs">
              <h4 className="font-semibold text-destructive-ink">Judge Sandbox Connection Lost</h4>
              <p className="mt-1 text-ink-base">
                Worker node #tsk_091 stopped responding to heartbeat pings. Automated failover initiated.
              </p>
            </div>
          </div>

          {/* Info Banner */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-info-tint border border-info-line text-info-ink">
            <Info className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs">
              <h4 className="font-semibold text-info-ink">Planned Database Maintenance</h4>
              <p className="mt-1 text-ink-base">
                Cluster maintenance window scheduled for Sunday at 02:00 UTC. Zero downtime expected.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Part 3: Progress Bars & KPI Stat Deltas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Progress Bars */}
        <div className="p-6 rounded-2xl bg-surface border border-line space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-ink-heading font-mono">
            3. Progress Bars (Surface Track)
          </h3>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-ink-heading">Memory Pool (Healthy)</span>
                <span className="text-success-ink font-semibold">45%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-track overflow-hidden">
                <div className="h-full bg-success rounded-full" style={{ width: '45%' }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-ink-heading">Disk Allocation (Warning)</span>
                <span className="text-warning-ink font-semibold">78%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-track overflow-hidden">
                <div className="h-full bg-warning rounded-full" style={{ width: '78%' }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-ink-heading">CPU Load (Critical)</span>
                <span className="text-destructive-ink font-semibold">92%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-track overflow-hidden">
                <div className="h-full bg-destructive rounded-full" style={{ width: '92%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* KPI Stat Deltas */}
        <div className="p-6 rounded-2xl bg-surface border border-line space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-ink-heading font-mono">
            4. Metric Stat Deltas
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-surface-well border border-line-subtle space-y-1.5">
              <span className="text-xs text-ink-muted">Throughput</span>
              <div className="text-2xl font-bold font-mono text-ink-heading">14.2k/s</div>
              <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-success-tint text-success-ink border border-success-line">
                <TrendingUp className="w-3 h-3" />
                +18.4%
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-well border border-line-subtle space-y-1.5">
              <span className="text-xs text-ink-muted">Error Rate</span>
              <div className="text-2xl font-bold font-mono text-ink-heading">0.08%</div>
              <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-destructive-tint text-destructive-ink border border-destructive-line">
                <TrendingDown className="w-3 h-3" />
                -3.2%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Part 5: Accent Hues in Production UI Components */}
      <div className="p-6 rounded-2xl bg-surface border border-line space-y-4">
        <div className="flex items-center justify-between border-b border-line-subtle pb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-ink-heading font-mono flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-ink" />
            5. Accent Hues in Production UI Context
          </h3>
          <span className="text-xs font-mono text-ink-muted">
            Solid (bg + on) · Tint (bg + ink + border) · Outline (border + ink)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Orange: Fire streak & hot topic */}
          <div className="p-4 rounded-xl bg-surface-well border border-line-subtle space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-ink-heading">Orange</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-orange text-orange-on">
                <Flame className="w-3 h-3" />
                Solid
              </span>
            </div>
            <p className="text-xs text-ink-muted">Streak badges, hot topics, fire counters</p>
            <div className="flex flex-wrap gap-2 pt-2 border-t border-line-subtle">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-orange-tint text-orange-ink border border-orange-line">
                <Flame className="w-3 h-3" />
                14-Day Streak
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border border-orange-line text-orange-ink">
                Trending
              </span>
            </div>
          </div>

          {/* Olive: Syntax highlighting & parameters */}
          <div className="p-4 rounded-xl bg-surface-well border border-line-subtle space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-ink-heading">Olive</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-olive text-olive-on">
                <Code2 className="w-3 h-3" />
                Solid
              </span>
            </div>
            <p className="text-xs text-ink-muted">Syntax highlighting, code tokens, parameters</p>
            <div className="flex flex-wrap gap-2 pt-2 border-t border-line-subtle">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-olive-tint text-olive-ink border border-olive-line">
                param: O(n log n)
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border border-olive-line text-olive-ink">
                --optimized
              </span>
            </div>
          </div>

          {/* Teal: Network & latency */}
          <div className="p-4 rounded-xl bg-surface-well border border-line-subtle space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-ink-heading">Teal</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-teal text-teal-on">
                <Activity className="w-3 h-3" />
                Solid
              </span>
            </div>
            <p className="text-xs text-ink-muted">Network metrics, throughput, latency</p>
            <div className="flex flex-wrap gap-2 pt-2 border-t border-line-subtle">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-teal-tint text-teal-ink border border-teal-line">
                12ms RTT
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border border-teal-line text-teal-ink">
                Edge Region
              </span>
            </div>
          </div>

          {/* Purple: AI & Pro */}
          <div className="p-4 rounded-xl bg-surface-well border border-line-subtle space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-ink-heading">Purple</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-purple text-purple-on">
                <Sparkles className="w-3 h-3" />
                Solid
              </span>
            </div>
            <p className="text-xs text-ink-muted">AI features, smart hints, premium tags</p>
            <div className="flex flex-wrap gap-2 pt-2 border-t border-line-subtle">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-purple-tint text-purple-ink border border-purple-line">
                AI Explained
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border border-purple-line text-purple-ink">
                Smart Hint
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
