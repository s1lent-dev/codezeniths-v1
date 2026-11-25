import { SceneHeader } from '../components/shell/SceneHeader.tsx';
import { Sparkles, ArrowRight, Play, Check } from 'lucide-react';

export function Scene04_BrandAndButtons() {
  const families = [
    { id: 'primary', label: 'Primary (Electric Blue-Violet)', isPrimary: true },
    { id: 'secondary', label: 'Secondary (Vibrant Orchid)', isPrimary: false },
  ];

  return (
    <section className="space-y-10">
      <SceneHeader
        number={4}
        title="Brand & Buttons"
        purpose="Comprehensive state matrix for brand color families (Primary & Secondary) across Solid, Tint, Outline, and Ghost button archetypes, plus the dual-source brand gradient."
        tokens={[
          'bg-primary',
          'text-primary-on',
          'bg-primary-hover',
          'bg-primary-active',
          'bg-primary-tint',
          'text-primary-ink',
          'border-primary-line',
          'bg-secondary',
          'text-secondary-on',
          'outline-focus',
        ]}
      />

      {/* Part 1: Button Archetypes & Interactive States */}
      <div className="space-y-8">
        {families.map((fam) => {
          const isPri = fam.isPrimary;
          return (
            <div key={fam.id} className="p-6 rounded-2xl bg-surface border border-line space-y-6">
              <div className="flex items-center justify-between border-b border-line-subtle pb-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-ink-heading font-mono flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${isPri ? 'bg-primary' : 'bg-secondary'}`} />
                  {fam.label}
                </h3>
                <span className="text-xs font-mono text-ink-muted">
                  Solid: {isPri ? 'bg-primary' : 'bg-secondary'} | On: {isPri ? 'text-primary-on' : 'text-secondary-on'}
                </span>
              </div>

              {/* Archetypes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* 1. Solid Filled Button */}
                <div className="space-y-3">
                  <span className="text-xs font-mono text-ink-muted block font-semibold">
                    1. Solid (High Emphasis)
                  </span>
                  <div className="space-y-2">
                    <button
                      type="button"
                      className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-focus shadow-sm ${
                        isPri
                          ? 'bg-primary text-primary-on hover:bg-primary-hover active:bg-primary-active'
                          : 'bg-secondary text-secondary-on hover:bg-secondary-hover active:bg-secondary-active'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Deploy Now
                    </button>
                    <button
                      disabled
                      type="button"
                      className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold opacity-50 cursor-not-allowed ${
                        isPri ? 'bg-primary text-primary-on' : 'bg-secondary text-secondary-on'
                      }`}
                    >
                      Disabled State
                    </button>
                  </div>
                </div>

                {/* 2. Tinted / Soft Button */}
                <div className="space-y-3">
                  <span className="text-xs font-mono text-ink-muted block font-semibold">
                    2. Tint (Medium Emphasis)
                  </span>
                  <div className="space-y-2">
                    <button
                      type="button"
                      className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold border transition-colors focus-visible:outline-2 focus-visible:outline-focus ${
                        isPri
                          ? 'bg-primary-tint text-primary-ink border-primary-line hover:bg-primary-tint-hover active:bg-primary-tint-active'
                          : 'bg-secondary-tint text-secondary-ink border-secondary-line hover:bg-secondary-tint-hover active:bg-secondary-tint-active'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      View Insights
                    </button>
                    <button
                      disabled
                      type="button"
                      className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold border opacity-50 cursor-not-allowed ${
                        isPri
                          ? 'bg-primary-tint text-primary-ink border-primary-line'
                          : 'bg-secondary-tint text-secondary-ink border-secondary-line'
                      }`}
                    >
                      Disabled Tint
                    </button>
                  </div>
                </div>

                {/* 3. Outline Button */}
                <div className="space-y-3">
                  <span className="text-xs font-mono text-ink-muted block font-semibold">
                    3. Outline (Subtle Border)
                  </span>
                  <div className="space-y-2">
                    <button
                      type="button"
                      className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold border transition-colors focus-visible:outline-2 focus-visible:outline-focus ${
                        isPri
                          ? 'border-primary-line text-primary-ink hover:bg-primary-tint'
                          : 'border-secondary-line text-secondary-ink hover:bg-secondary-tint'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      Configure
                    </button>
                    <button
                      disabled
                      type="button"
                      className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold border opacity-50 cursor-not-allowed ${
                        isPri
                          ? 'border-primary-line text-primary-ink'
                          : 'border-secondary-line text-secondary-ink'
                      }`}
                    >
                      Disabled Outline
                    </button>
                  </div>
                </div>

                {/* 4. Ghost Button */}
                <div className="space-y-3">
                  <span className="text-xs font-mono text-ink-muted block font-semibold">
                    4. Ghost (Flat Action)
                  </span>
                  <div className="space-y-2">
                    <button
                      type="button"
                      className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-focus ${
                        isPri
                          ? 'text-primary-ink hover:bg-primary-tint active:bg-primary-tint-active'
                          : 'text-secondary-ink hover:bg-secondary-tint active:bg-secondary-tint-active'
                      }`}
                    >
                      Learn More →
                    </button>
                    <button
                      disabled
                      type="button"
                      className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold opacity-50 cursor-not-allowed ${
                        isPri ? 'text-primary-ink' : 'text-secondary-ink'
                      }`}
                    >
                      Disabled Ghost
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Part 2: The Primary to Secondary Brand Gradient */}
      <div className="p-6 rounded-2xl bg-surface border border-line space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-ink-heading font-mono flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary-ink" />
          Brand Gradient: Electric Blue-Violet to Vibrant Orchid
        </h3>
        <p className="text-xs text-ink-body max-w-2xl">
          The two foundational light sources of the Nightglass system working in harmony. Constructed strictly via Tailwind utility: <code className="font-mono text-primary-ink">bg-gradient-to-r from-primary to-secondary</code>.
        </p>

        {/* Gradient Container Banner */}
        <div className="rounded-xl p-8 bg-gradient-to-r from-primary to-secondary text-primary-on shadow-float flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs uppercase font-mono tracking-wider opacity-90 font-semibold">
              Atmospheric Metaphor
            </span>
            <h4 className="text-xl sm:text-2xl font-bold tracking-tight">
              Midnight Engine 2.0 Released
            </h4>
            <p className="text-xs opacity-90 max-w-md">
              Harness the cold electric blue-violet primary and warm orchid secondary across all interfaces.
            </p>
          </div>
          <button
            type="button"
            className="px-5 py-2.5 rounded-lg text-xs font-bold bg-surface text-ink-heading shadow-md hover:bg-surface-hover transition-colors shrink-0 flex items-center gap-2"
          >
            <span>Explore Release</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Gradient Typography Specimen */}
        <div className="p-6 rounded-xl bg-surface-well border border-line-subtle text-center">
          <span className="text-2xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Continuous Optical Harmony Across Both Modes
          </span>
        </div>
      </div>
    </section>
  );
}
