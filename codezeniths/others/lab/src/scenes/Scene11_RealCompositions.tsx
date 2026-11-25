import { useState } from 'react';
import { SceneHeader } from '../components/shell/SceneHeader.tsx';
import {
  Briefcase,
  MapPin,
  Clock,
  User,
  Send,
  Kanban,
  LayoutDashboard,
  Target,
  TrendingUp,
  TrendingDown,
  Check,
} from 'lucide-react';

export function Scene11_RealCompositions() {
  const [activeTab, setActiveTab] = useState<'feed' | 'profile' | 'chat' | 'kanban' | 'dashboard' | 'ar'>('feed');

  return (
    <section className="space-y-10">
      <SceneHeader
        number={11}
        title="Real Compositions"
        purpose="Production-grade mock compositions assembling all role tokens and stacking rules simultaneously: job card feed, developer profile header, live chat thread, application tracker Kanban board, KPI analytics dashboard, and AR nearby-match overlay."
        tokens={[
          'bg-surface',
          'bg-surface-well',
          'bg-surface-chip',
          'bg-primary',
          'text-primary-on',
          'bg-secondary',
          'bg-success-tint',
          'bg-destructive-tint',
          'border-line',
          'shadow-float',
          'shadow-dialog',
        ]}
      />

      {/* Composition Switcher Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-surface border border-line">
        {[
          { id: 'feed', label: '1. Job Feed', icon: Briefcase },
          { id: 'profile', label: '2. Profile Header', icon: User },
          { id: 'chat', label: '3. Chat Thread', icon: Send },
          { id: 'kanban', label: '4. Tracker Board', icon: Kanban },
          { id: 'dashboard', label: '5. Analytics Dashboard', icon: LayoutDashboard },
          { id: 'ar', label: '6. AR Spatial HUD', icon: Target },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSel = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                isSel
                  ? 'bg-primary text-primary-on shadow-sm'
                  : 'text-ink-muted hover:text-ink-heading hover:bg-surface-hover'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. Job Card Feed */}
      {activeTab === 'feed' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              role: 'Staff Distributed Systems Engineer',
              company: 'CodeZeniths Infrastructure',
              location: 'Remote · US / EU',
              salary: '$220k - $270k',
              tags: ['Rust', 'Distributed Consensus', 'Raft', 'Kubernetes'],
              time: '2h ago',
              featured: true,
            },
            {
              role: 'Senior Design Systems Engineer',
              company: 'Atmospheric Labs',
              location: 'San Francisco, CA / Remote',
              salary: '$180k - $230k',
              tags: ['Tailwind v4', 'OKLCH', 'React 19', 'Accessibility'],
              time: '5h ago',
              featured: false,
            },
          ].map((job, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-surface border border-line hover:border-line-hover transition-colors space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-base font-bold text-ink-heading">{job.role}</h4>
                    <p className="text-xs text-ink-muted mt-0.5">{job.company}</p>
                  </div>
                  {job.featured && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-secondary-tint text-secondary-ink border border-secondary-line">
                      Featured
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-ink-muted">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-ink-subtle" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-ink-subtle" />
                    {job.time}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {job.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-surface-chip text-ink-base border border-line-subtle"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-line-subtle flex items-center justify-between">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-success-tint text-success-ink border border-success-line">
                  {job.salary}
                </span>
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-primary text-primary-on hover:bg-primary-hover active:bg-primary-active transition-colors shadow-sm"
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. Developer Profile Header */}
      {activeTab === 'profile' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-surface border border-line space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-on font-bold text-xl shadow-float">
                  AD
                </div>
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-success border-2 border-surface" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-ink-heading">Alexandre Dubois</h3>
                <p className="text-xs text-primary-ink font-mono font-medium">@adubois · Principal Systems Architect</p>
                <p className="text-xs text-ink-muted mt-1">Zurich, Switzerland · Available for Advisory</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="px-4 py-2 rounded-lg text-xs font-semibold border border-primary-line text-primary-ink hover:bg-primary-tint transition-colors"
              >
                Send Message
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-primary text-primary-on hover:bg-primary-hover transition-colors shadow-sm"
              >
                Follow
              </button>
            </div>
          </div>

          <p className="text-xs text-ink-body leading-relaxed max-w-3xl">
            Passionate about deterministic consensus algorithms, high-concurrency event loops, and accessible design engines. Creator of several open-source libraries in Rust and TypeScript.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-surface-well border border-line-subtle">
            <div>
              <span className="text-[10px] font-mono text-ink-muted uppercase block">Commits (2026)</span>
              <span className="text-lg font-bold font-mono text-ink-heading">1,842</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-ink-muted uppercase block">Repositories</span>
              <span className="text-lg font-bold font-mono text-ink-heading">48</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-ink-muted uppercase block">Stars Earned</span>
              <span className="text-lg font-bold font-mono text-ink-heading">9.4k</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-ink-muted uppercase block">Review Score</span>
              <span className="text-lg font-bold font-mono text-success-ink">99.8%</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Live Chat Thread */}
      {activeTab === 'chat' && (
        <div className="p-6 rounded-2xl bg-surface border border-line space-y-4 max-w-2xl mx-auto">
          <div className="flex items-center justify-between border-b border-line-subtle pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-secondary text-secondary-on font-bold flex items-center justify-center text-xs">
                AI
              </div>
              <div>
                <h4 className="text-xs font-bold text-ink-heading">Claude Architect</h4>
                <p className="text-[10px] text-success-ink">Active now · Nightglass Engine</p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-ink-muted">Thread #8942</span>
          </div>

          <div className="space-y-4 py-4 min-h-[220px]">
            {/* Incoming message */}
            <div className="flex items-start gap-3 max-w-[85%]">
              <div className="p-3.5 rounded-2xl rounded-tl-sm bg-surface-well border border-line-subtle text-xs text-ink-base leading-relaxed space-y-1">
                <p>
                  I've completed the contrast matrix calculations for all 14 surface roles in both modes. Every heading and base text role satisfies the strict 7.0:1 AAA standard!
                </p>
                <span className="text-[9px] font-mono text-ink-subtle block">14:02 UTC</span>
              </div>
            </div>

            {/* Outgoing message */}
            <div className="flex items-start justify-end">
              <div className="p-3.5 rounded-2xl rounded-tr-sm bg-primary text-primary-on text-xs leading-relaxed space-y-1 shadow-sm max-w-[85%]">
                <p>
                  Sensational! Does the cut-through effect hold mathematically with zero delta?
                </p>
                <div className="flex items-center justify-end gap-1 text-[9px] opacity-80 font-mono">
                  <span>14:03 UTC</span>
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              </div>
            </div>
          </div>

          {/* Message Input Box */}
          <div className="flex items-center gap-2 p-2 rounded-xl bg-surface-input border border-line-strong">
            <input
              type="text"
              placeholder="Write a message..."
              defaultValue=""
              className="flex-1 bg-transparent text-xs text-ink-base placeholder:text-ink-subtle outline-none px-2"
            />
            <button
              type="button"
              className="p-2 rounded-lg bg-primary text-primary-on hover:bg-primary-hover transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 4. Application Tracker Board (Kanban) */}
      {activeTab === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              title: 'Applied (4)',
              color: 'border-line-subtle',
              items: ['Distributed DB Architect', 'Staff Frontend'],
            },
            {
              title: 'Technical Screen (2)',
              color: 'border-info-line',
              items: ['Platform Eng Lead', 'Design Systems Eng'],
            },
            {
              title: 'Final Round (1)',
              color: 'border-warning-line',
              items: ['Core Kernel Developer'],
            },
            {
              title: 'Offer Extended (1)',
              color: 'border-success-line',
              items: ['Principal Systems Lead'],
            },
          ].map((col, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-surface border border-line space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-line-subtle">
                <span className="text-xs font-mono font-bold text-ink-heading">{col.title}</span>
                <span className="w-2 h-2 rounded-full bg-primary" />
              </div>
              <div className="space-y-2">
                {col.items.map((card, cIdx) => (
                  <div
                    key={cIdx}
                    className="p-3 rounded-lg bg-surface-well border border-line-subtle hover:border-line-hover transition-colors space-y-2 cursor-grab"
                  >
                    <span className="text-xs font-medium text-ink-heading block">{card}</span>
                    <div className="flex items-center justify-between text-[10px] text-ink-muted font-mono">
                      <span>#AP-{idx}0{cIdx}</span>
                      <span className="text-primary-ink font-semibold">Priority 1</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. Analytics KPI Dashboard */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-surface border border-line space-y-2">
              <span className="text-xs font-mono text-ink-muted">TOTAL REVENUE (MRR)</span>
              <div className="text-3xl font-bold font-mono text-ink-heading">$184,920</div>
              <div className="flex items-center gap-1.5 text-xs text-success-ink font-semibold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+24.8% vs last month</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-surface border border-line space-y-2">
              <span className="text-xs font-mono text-ink-muted">ACTIVE WORKERS</span>
              <div className="text-3xl font-bold font-mono text-ink-heading">1,482</div>
              <div className="flex items-center gap-1.5 text-xs text-success-ink font-semibold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>99.98% uptime SLA</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-surface border border-line space-y-2">
              <span className="text-xs font-mono text-ink-muted">LATENCY P99</span>
              <div className="text-3xl font-bold font-mono text-ink-heading">18.4ms</div>
              <div className="flex items-center gap-1.5 text-xs text-destructive-ink font-semibold">
                <TrendingDown className="w-3.5 h-3.5" />
                <span>-4.2ms faster response</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. AR Nearby-Match Overlay */}
      {activeTab === 'ar' && (
        <div className="relative rounded-2xl p-10 overflow-hidden bg-background-deep border border-line min-h-[380px] flex items-center justify-center">
          {/* Spatial Target Node with glow rings */}
          <div className="absolute top-1/3 left-1/3 w-32 h-32 rounded-full bg-glow-secondary blur-2xl pointer-events-none" />
          <div className="absolute top-1/3 left-1/3 w-4 h-4 rounded-full bg-secondary animate-ping" />

          {/* AR Glass HUD Panel */}
          <div className="relative z-10 w-full max-w-sm rounded-2xl p-6 bg-glass-strong backdrop-blur-glass border border-glass-edge shadow-dialog space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-secondary-ink" />
                <span className="text-xs font-mono font-bold text-ink-heading uppercase">
                  Spatial Node Detected
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-secondary-tint text-secondary-ink border border-secondary-line font-semibold">
                98% Match
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-bold text-ink-heading">Quantum Relay Satellite 04</h4>
              <p className="text-xs text-ink-base leading-relaxed">
                Optical laser downlink aligned at azimuth 42.8°. Bandwidth 40 Gbps available.
              </p>
            </div>

            <div className="pt-3 border-t border-glass-line flex items-center justify-between">
              <span className="text-xs font-mono text-ink-muted">Distance: 4.8m</span>
              <button
                type="button"
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-secondary text-secondary-on hover:bg-secondary-hover transition-colors shadow-sm"
              >
                Connect Beam
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
