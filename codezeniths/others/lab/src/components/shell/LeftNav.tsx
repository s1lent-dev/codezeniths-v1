import {
  Compass,
  Layers,
  Type,
  Sparkle,
  ShieldAlert,
  Sliders,
  TableProperties,
  Copy,
  GlassWater,
  LineChart,
  LayoutGrid,
  CheckCircle2,
} from 'lucide-react';

export interface SceneMeta {
  id: number;
  slug: string;
  title: string;
  icon: typeof Compass;
  category: string;
}

export const SCENES: SceneMeta[] = [
  { id: 1, slug: 'token-explorer', title: 'Token Explorer', icon: Compass, category: 'Foundations' },
  { id: 2, slug: 'layer-stack', title: 'Layer Stack', icon: Layers, category: 'Foundations' },
  { id: 3, slug: 'text-on-layers', title: 'Text on Layers', icon: Type, category: 'Foundations' },
  { id: 4, slug: 'brand-buttons', title: 'Brand & Buttons', icon: Sparkle, category: 'Elements' },
  { id: 5, slug: 'status-accents', title: 'Status & Accents', icon: ShieldAlert, category: 'Elements' },
  { id: 6, slug: 'controls', title: 'Form Controls', icon: Sliders, category: 'Elements' },
  { id: 7, slug: 'navigation-lists', title: 'Navigation & Lists', icon: TableProperties, category: 'Patterns' },
  { id: 8, slug: 'overlays', title: 'Overlays & Modals', icon: Copy, category: 'Patterns' },
  { id: 9, slug: 'glass-glow', title: 'Glass & Glow', icon: GlassWater, category: 'Visual Physics' },
  { id: 10, slug: 'data-viz', title: 'Data Visualization', icon: LineChart, category: 'Visual Physics' },
  { id: 11, slug: 'real-compositions', title: 'Real Compositions', icon: LayoutGrid, category: 'Compositions' },
  { id: 12, slug: 'accessibility-lab', title: 'Accessibility Lab', icon: CheckCircle2, category: 'Verification' },
];

interface LeftNavProps {
  activeSceneId: number;
  onSelectScene: (id: number) => void;
}

export function LeftNav({ activeSceneId, onSelectScene }: LeftNavProps) {
  // Group scenes by category
  const categories = Array.from(new Set(SCENES.map((s) => s.category)));

  return (
    <aside className="w-64 shrink-0 bg-background-shell border-r border-line flex flex-col h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto select-none">
      <div className="p-4 space-y-6">
        {categories.map((category) => (
          <div key={category} className="space-y-1">
            <h3 className="px-2.5 text-[11px] font-mono uppercase tracking-wider text-ink-muted font-bold">
              {category}
            </h3>
            <div className="space-y-0.5">
              {SCENES.filter((s) => s.category === category).map((scene) => {
                const Icon = scene.icon;
                const isSelected = scene.id === activeSceneId;
                return (
                  <button
                    key={scene.id}
                    type="button"
                    onClick={() => onSelectScene(scene.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors text-left ${
                      isSelected
                        ? 'bg-background-selected text-ink-heading font-semibold shadow-sm'
                        : 'text-ink-base hover:bg-background-hover active:bg-background-active'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-primary-ink' : 'text-ink-muted'}`} />
                    <span className="flex-1 truncate">{scene.title}</span>
                    <span className="text-[10px] font-mono text-ink-muted opacity-80">
                      #{String(scene.id).padStart(2, '0')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto p-4 border-t border-line-subtle">
        <div className="rounded-xl bg-background-sunken p-3 text-xs border border-line-subtle space-y-1">
          <div className="flex items-center justify-between text-ink-heading font-semibold">
            <span>Theme Status</span>
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          </div>
          <p className="text-[11px] text-ink-muted leading-tight">
            100% tokenized. Zero hardcoded colors.
          </p>
        </div>
      </div>
    </aside>
  );
}
