import { parseOklch } from '../../lib/culori-math.ts';
import type { RoleToken } from '../../lib/tokens.ts';

interface TokenSwatchProps {
  token: RoleToken;
  isDark: boolean;
}

export function TokenSwatch({ token, isDark }: TokenSwatchProps) {
  const activeValue = isDark ? token.darkVal : token.lightVal;
  const parsed = parseOklch(activeValue);

  return (
    <div className="flex flex-col rounded-xl bg-surface border border-line p-3 hover:border-line-hover transition-colors text-ink-base group">
      {/* Visual preview swatch */}
      <div className="relative w-full h-16 rounded-lg border border-line-subtle overflow-hidden flex items-center justify-center">
        {/* Transparent checkerboard background for alpha tokens */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(var(--ink-heading) 1px, transparent 0)',
            backgroundSize: '8px 8px'
          }} 
        />
        {/* Swatch color using CSS variable */}
        <div 
          className="absolute inset-0 transition-transform group-hover:scale-105 duration-200" 
          style={{ backgroundColor: `var(${token.cssVar})` }}
        />
        {/* Contrast indicator label on top */}
        <span className="relative z-10 text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-inverse text-ink-inverse opacity-0 group-hover:opacity-100 transition-opacity">
          {parsed.hex}
        </span>
      </div>

      {/* Token Details */}
      <div className="mt-2.5 space-y-1">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-semibold text-ink-heading">{token.name}</span>
          <span className="text-[10px] font-mono text-ink-muted uppercase">{token.category}</span>
        </div>

        <p className="text-[11px] text-ink-muted line-clamp-1" title={token.description}>
          {token.description}
        </p>

        {/* Live Values */}
        <div className="pt-1.5 border-t border-line-subtle flex flex-col gap-0.5 font-mono text-[10px] text-ink-muted">
          <div className="flex items-center justify-between">
            <span className="text-ink-subtle">OKLCH:</span>
            <span className="text-ink-base select-all truncate max-w-[140px]" title={activeValue}>
              {activeValue}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-ink-subtle">HEX:</span>
            <span className="text-ink-heading font-semibold">{parsed.hex}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-ink-subtle">Utility:</span>
            <span className="text-primary-ink font-mono">{token.utility}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
