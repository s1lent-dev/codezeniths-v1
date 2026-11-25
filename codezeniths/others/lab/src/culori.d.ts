declare module 'culori' {
  export function parse(color: string): any;
  export function formatHex(color: any): string;
  export function wcagContrast(c1: any, c2: any): number;
  export function interpolate(colors: any[], mode?: string): (t: number) => any;
  export function differenceEuclidean(mode?: string): (c1: any, c2: any) => number;
}
