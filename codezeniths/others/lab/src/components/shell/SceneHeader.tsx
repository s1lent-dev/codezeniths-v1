interface SceneHeaderProps {
  number: number;
  title: string;
  purpose: string;
  tokens: string[];
}

export function SceneHeader({ number, title, purpose, tokens }: SceneHeaderProps) {
  return (
    <div className="mb-8 pb-6 border-b border-line">
      <div className="flex flex-wrap items-center gap-2.5 mb-2">
        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-primary-tint text-primary-ink border border-primary-line">
          Scene {String(number).padStart(2, '0')}
        </span>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-ink-heading">
          {title}
        </h2>
      </div>

      <p className="text-sm text-ink-body mb-4 max-w-3xl leading-relaxed">
        {purpose}
      </p>

      {/* Token Annotations */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs font-mono text-ink-muted mr-1">Tokens:</span>
        {tokens.map((token) => (
          <code
            key={token}
            className="px-2 py-0.5 rounded-md text-xs font-mono bg-surface-chip text-ink-base border border-line-subtle"
          >
            {token}
          </code>
        ))}
      </div>
    </div>
  );
}
