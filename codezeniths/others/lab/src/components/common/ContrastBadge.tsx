interface ContrastBadgeProps {
  ratio: number;
  minRatio?: number;
  largeText?: boolean;
}

export function ContrastBadge({ ratio, minRatio = 4.5, largeText = false }: ContrastBadgeProps) {
  const passesThreshold = ratio >= minRatio;
  const isAaa = largeText ? ratio >= 4.5 : ratio >= 7.0;
  const isAa = largeText ? ratio >= 3.0 : ratio >= 4.5;

  let badgeColor = 'bg-destructive-tint text-destructive-ink border-destructive-line';
  let badgeLabel = 'FAIL';

  if (isAaa) {
    badgeColor = 'bg-success-tint text-success-ink border-success-line';
    badgeLabel = 'AAA';
  } else if (isAa && passesThreshold) {
    badgeColor = 'bg-info-tint text-info-ink border-info-line';
    badgeLabel = 'AA';
  } else if (passesThreshold) {
    badgeColor = 'bg-warning-tint text-warning-ink border-warning-line';
    badgeLabel = 'PASS';
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-mono font-semibold border ${badgeColor}`}
      title={`Contrast Ratio: ${ratio.toFixed(2)}:1 (Required: ${minRatio}:1)`}
    >
      <span>{ratio.toFixed(1)}:1</span>
      <span className="opacity-75 font-sans uppercase text-[9px] tracking-wide">[{badgeLabel}]</span>
    </span>
  );
}
