import { parse, wcagContrast, formatHex, interpolate, differenceEuclidean } from 'culori';

export interface ColorDef {
  raw: string;
  oklchStr: string;
  hex: string;
  l: number;
  c: number;
  h: number;
  alpha?: number;
}

/**
 * Normalizes CSS oklch strings into clean Culori parseable strings.
 * e.g., "oklch(96.0% 0.018 282.0)" -> "oklch(0.96 0.018 282.0)"
 */
export function normalizeOklch(str: string): string {
  if (!str) return 'oklch(0 0 0)';
  
  // Replace percentage lightness like 96.0% with decimal 0.96
  return str.replace(/oklch\(\s*([\d.]+)%\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+%?))?\s*\)/gi, 
    (_match, l, c, h, a) => {
      const lDec = parseFloat(l) / 100;
      let alphaStr = '';
      if (a) {
        const aVal = a.endsWith('%') ? parseFloat(a) / 100 : parseFloat(a);
        alphaStr = ` / ${aVal}`;
      }
      return `oklch(${lDec} ${c} ${h}${alphaStr})`;
    }
  );
}

/**
 * Parse an OKLCH CSS string and return components and HEX.
 */
export function parseOklch(cssStr: string): ColorDef {
  try {
    const normalized = normalizeOklch(cssStr);
    const parsed = parse(normalized);
    if (!parsed) {
      return { raw: cssStr, oklchStr: cssStr, hex: '#000000', l: 0, c: 0, h: 0 };
    }
    const hex = formatHex(parsed) || '#000000';
    const l = 'l' in parsed ? (parsed.l as number) : 0;
    const c = 'c' in parsed ? (parsed.c as number) : 0;
    const h = 'h' in parsed ? (parsed.h as number) : 0;
    const alpha = parsed.alpha !== undefined ? parsed.alpha : 1;

    return {
      raw: cssStr,
      oklchStr: `oklch(${(l * 100).toFixed(1)}% ${c.toFixed(3)} ${h.toFixed(1)}${alpha < 1 ? ` / ${(alpha * 100).toFixed(0)}%` : ''})`,
      hex,
      l,
      c,
      h,
      alpha,
    };
  } catch (err) {
    console.error(`Failed to parse color: ${cssStr}`, err);
    return { raw: cssStr, oklchStr: cssStr, hex: '#888888', l: 0.5, c: 0, h: 0 };
  }
}

/**
 * Calculates WCAG 2.1 contrast ratio between two colors.
 */
export function calculateContrast(fgCss: string, bgCss: string): number {
  try {
    const fgNorm = normalizeOklch(fgCss);
    const bgNorm = normalizeOklch(bgCss);
    const fg = parse(fgNorm);
    const bg = parse(bgNorm);
    if (!fg || !bg) return 1;
    const ratio = wcagContrast(fg, bg);
    return isNaN(ratio) ? 1 : Number(ratio.toFixed(2));
  } catch {
    return 1;
  }
}

/**
 * Simulates color vision deficiencies (CVD) using standard Brettel/Viénot models.
 */
export type CvdType = 'normal' | 'protan' | 'deutan' | 'tritan';

export function simulateCvdColor(cssColor: string, type: CvdType): string {
  if (type === 'normal') return cssColor;
  try {
    const norm = normalizeOklch(cssColor);
    const color = parse(norm);
    if (!color) return cssColor;

    // Approximate deficiency simulation via culori RGB matrix
    const hex = formatHex(color);
    if (!hex) return cssColor;

    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    let nr = r, ng = g, nb = b;
    if (type === 'protan') {
      nr = 0.56667 * r + 0.43333 * g;
      ng = 0.55833 * r + 0.44167 * g;
      nb = 0.24167 * g + 0.75833 * b;
    } else if (type === 'deutan') {
      nr = 0.625 * r + 0.375 * g;
      ng = 0.70 * r + 0.30 * g;
      nb = 0.30 * g + 0.70 * b;
    } else if (type === 'tritan') {
      nr = 0.95 * r + 0.05 * g;
      ng = 0.43333 * g + 0.56667 * b;
      nb = 0.475 * g + 0.525 * b;
    }

    const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v * 255)));
    return `rgb(${clamp(nr)}, ${clamp(ng)}, ${clamp(nb)})`;
  } catch {
    return cssColor;
  }
}

/**
 * Calculate perceptual color difference between two colors in OKLCH or Lab.
 */
export function calculateDeltaE(color1: string, color2: string): number {
  try {
    const c1 = parse(normalizeOklch(color1));
    const c2 = parse(normalizeOklch(color2));
    if (!c1 || !c2) return 0;
    const delta = differenceEuclidean('oklab')(c1, c2);
    return Number((delta * 100).toFixed(1));
  } catch {
    return 0;
  }
}

/**
 * Color mix approximation in oklab (e.g. 15% tint over surface).
 */
export function blendWithBackground(fgCss: string, bgCss: string, fgAlpha: number): string {
  try {
    const fg = parse(normalizeOklch(fgCss));
    const bg = parse(normalizeOklch(bgCss));
    if (!fg || !bg) return fgCss;
    const interpolator = interpolate([bg, fg], 'oklab');
    const blended = interpolator(fgAlpha);
    return formatHex(blended) || fgCss;
  } catch {
    return fgCss;
  }
}
