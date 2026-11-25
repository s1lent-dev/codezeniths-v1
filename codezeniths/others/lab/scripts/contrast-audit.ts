import fs from 'fs';
import path from 'path';
import { ROLE_TOKENS, HUE_FAMILIES } from '../src/lib/tokens.ts';
import { calculateContrast, calculateDeltaE, blendWithBackground } from '../src/lib/culori-math.ts';

interface ContrastResult {
  role: string;
  foreground: string;
  background: string;
  mode: 'light' | 'dark';
  measuredRatio: number;
  requiredRatio: number;
  passed: boolean;
  tier: string;
}

interface CvdResult {
  pair: string;
  mode: 'light' | 'dark';
  deltaE: number;
}

console.log('🌌 Starting Nightglass Automated Contrast & Token Audit...\n');

const results: ContrastResult[] = [];

// 1. Ink on Surfaces Audit
const inkTokens = ROLE_TOKENS.filter((t) => t.category === 'ink');
const surfaceTokens = ROLE_TOKENS.filter(
  (t) => t.category === 'surface' || (t.category === 'background' && !t.name.includes('hover') && !t.name.includes('selected') && !t.name.includes('active') && !t.name.includes('glass'))
);

for (const ink of inkTokens) {
  for (const surface of surfaceTokens) {
    let required = 4.5;
    let tier = 'AA';
    if (ink.name === 'ink-heading' || ink.name === 'ink-base') {
      required = 7.0;
      tier = 'AAA';
    } else if (ink.name === 'ink-disabled' || ink.name === 'ink-subtle') {
      required = 3.0;
      tier = 'Informational';
    }

    // Light mode
    const ratioLight = calculateContrast(ink.lightVal, surface.lightVal);
    results.push({
      role: `${ink.name} on ${surface.name}`,
      foreground: ink.name,
      background: surface.name,
      mode: 'light',
      measuredRatio: ratioLight,
      requiredRatio: required,
      passed: ratioLight >= required,
      tier,
    });

    // Dark mode
    const ratioDark = calculateContrast(ink.darkVal, surface.darkVal);
    results.push({
      role: `${ink.name} on ${surface.name}`,
      foreground: ink.name,
      background: surface.name,
      mode: 'dark',
      measuredRatio: ratioDark,
      requiredRatio: required,
      passed: ratioDark >= required,
      tier,
    });
  }
}

// 2. Solid Container: {name}-on on {name} (Required >= 4.5:1)
for (const fam of HUE_FAMILIES) {
  const lightRatio = calculateContrast(fam.onLight, fam.solidLight);
  results.push({
    role: `${fam.id}-on on ${fam.id} (solid)`,
    foreground: `${fam.id}-on`,
    background: fam.id,
    mode: 'light',
    measuredRatio: lightRatio,
    requiredRatio: 4.5,
    passed: lightRatio >= 4.5,
    tier: 'AA',
  });

  const darkRatio = calculateContrast(fam.onDark, fam.solidDark);
  results.push({
    role: `${fam.id}-on on ${fam.id} (solid)`,
    foreground: `${fam.id}-on`,
    background: fam.id,
    mode: 'dark',
    measuredRatio: darkRatio,
    requiredRatio: 4.5,
    passed: darkRatio >= 4.5,
    tier: 'AA',
  });
}

// 3. Tint Wash: {name}-ink on 15% tint over surface (Required >= 4.5:1 light, >= 7:1 dark)
const surfaceToken = ROLE_TOKENS.find((t) => t.name === 'surface')!;

for (const fam of HUE_FAMILIES) {
  // Light mode: 15% tint over light surface
  const tintLight = blendWithBackground(fam.solidLight, surfaceToken.lightVal, 0.15);
  const inkTintLight = calculateContrast(fam.inkLight, tintLight);
  results.push({
    role: `${fam.id}-ink on 15% ${fam.id}-tint`,
    foreground: `${fam.id}-ink`,
    background: `${fam.id}-tint`,
    mode: 'light',
    measuredRatio: inkTintLight,
    requiredRatio: 4.5,
    passed: inkTintLight >= 4.5,
    tier: 'AA',
  });

  // Dark mode: 15% tint over dark surface
  const tintDark = blendWithBackground(fam.solidDark, surfaceToken.darkVal, 0.15);
  const inkTintDark = calculateContrast(fam.inkDark, tintDark);
  results.push({
    role: `${fam.id}-ink on 15% ${fam.id}-tint`,
    foreground: `${fam.id}-ink`,
    background: `${fam.id}-tint`,
    mode: 'dark',
    measuredRatio: inkTintDark,
    requiredRatio: 7.0, // Dark mode target >= 7:1
    passed: inkTintDark >= 7.0,
    tier: 'AAA',
  });
}

// 4. Line Strong on Surface (Required >= 3:1)
const lineStrongToken = ROLE_TOKENS.find((t) => t.name === 'line-strong')!;
const lineRatioLight = calculateContrast(lineStrongToken.lightVal, surfaceToken.lightVal);
results.push({
  role: 'line-strong on surface',
  foreground: 'line-strong',
  background: 'surface',
  mode: 'light',
  measuredRatio: lineRatioLight,
  requiredRatio: 3.0,
  passed: lineRatioLight >= 3.0,
  tier: 'UI Component boundary',
});

const lineRatioDark = calculateContrast(lineStrongToken.darkVal, surfaceToken.darkVal);
results.push({
  role: 'line-strong on surface',
  foreground: 'line-strong',
  background: 'surface',
  mode: 'dark',
  measuredRatio: lineRatioDark,
  requiredRatio: 3.0,
  passed: lineRatioDark >= 3.0,
  tier: 'UI Component boundary',
});

// 5. Color-Blind Status Pair Separation
const statuses = HUE_FAMILIES.filter((f) => f.role === 'status');
const cvdResults: CvdResult[] = [];

for (let i = 0; i < statuses.length; i++) {
  for (let j = i + 1; j < statuses.length; j++) {
    const s1 = statuses[i];
    const s2 = statuses[j];
    cvdResults.push({
      pair: `${s1.label} ↔ ${s2.label}`,
      mode: 'light',
      deltaE: calculateDeltaE(s1.solidLight, s2.solidLight),
    });
    cvdResults.push({
      pair: `${s1.label} ↔ ${s2.label}`,
      mode: 'dark',
      deltaE: calculateDeltaE(s1.solidDark, s2.solidDark),
    });
  }
}

// Write contrast-report.json
const reportData = {
  timestamp: new Date().toISOString(),
  totalTests: results.length,
  passed: results.filter((r) => r.passed).length,
  failed: results.filter((r) => !r.passed).length,
  contrastResults: results,
  cvdSeparation: cvdResults,
};

const outputPath = path.resolve(import.meta.dirname ?? process.cwd(), '../contrast-report.json');
fs.writeFileSync(outputPath, JSON.stringify(reportData, null, 2), 'utf-8');

console.log(`✅ Contrast audit complete:`);
console.log(`   Total Assertions: ${reportData.totalTests}`);
console.log(`   Passed:           ${reportData.passed}`);
console.log(`   Failed:           ${reportData.failed}`);
console.log(`   Report written to: ${outputPath}\n`);

if (reportData.failed > 0) {
  console.log('⚠️  Findings (Detailed in REPORT.md):');
  for (const f of results.filter((r) => !r.passed).slice(0, 5)) {
    console.log(`   - [${f.mode.toUpperCase()}] ${f.role}: measured ${f.measuredRatio}:1 (required: ${f.requiredRatio}:1)`);
  }
}
