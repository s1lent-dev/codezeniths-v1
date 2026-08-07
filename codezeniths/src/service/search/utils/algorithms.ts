import type { FuzzyAlgorithmName, PhoneticAlgorithmName } from '../types/search.types';

export interface FuzzyAlgorithm {
  similarity(a: string, b: string): number;
}

export interface PhoneticAlgorithm {
  encode(input: string): string;
}

const jaroWinklerAlgorithm: FuzzyAlgorithm = {
  similarity(s1: string, s2: string): number {
    if (s1 === s2) return 1.0;
    const len1 = s1.length;
    const len2 = s2.length;
    if (len1 === 0 || len2 === 0) return 0.0;
    
    const matchDistance = Math.floor(Math.max(len1, len2) / 2) - 1;
    const s1Matches = new Array(len1).fill(false);
    const s2Matches = new Array(len2).fill(false);
    
    let matches = 0;
    for (let i = 0; i < len1; i++) {
      const start = Math.max(0, i - matchDistance);
      const end = Math.min(i + matchDistance + 1, len2);
      
      for (let j = start; j < end; j++) {
        if (s2Matches[j]) continue;
        if (s1[i] !== s2[j]) continue;
        s1Matches[i] = true;
        s2Matches[j] = true;
        matches++;
        break;
      }
    }
    
    if (matches === 0) return 0.0;
    
    let t = 0;
    let k = 0;
    for (let i = 0; i < len1; i++) {
      if (!s1Matches[i]) continue;
      while (!s2Matches[k]) k++;
      if (s1[i] !== s2[k]) t++;
      k++;
    }
    t = t / 2;
    
    const jaro = (matches / len1 + matches / len2 + (matches - t) / matches) / 3.0;
    
    let prefix = 0;
    for (let i = 0; i < Math.min(len1, Math.min(len2, 4)); i++) {
      if (s1[i] === s2[i]) prefix++;
      else break;
    }
    
    const p = 0.1;
    return jaro + prefix * p * (1 - jaro);
  }
};

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

const levenshteinAlgorithm: FuzzyAlgorithm = {
  similarity(a: string, b: string): number {
    if (a === b) return 1.0;
    const maxLen = Math.max(a.length, b.length);
    if (maxLen === 0) return 1.0;
    return 1 - (levenshteinDistance(a, b) / maxLen);
  }
};

const metaphoneAlgorithm: PhoneticAlgorithm = {
    encode(input: string): string {
        if (!input || input.length === 0) return '';

        let term = input.toUpperCase().replace(/[^A-Z]/g, '');
        if (term.length === 0) return '';

        let deduplicated = '';
        for (let i = 0; i < term.length; i++) {
            if (term[i] === 'C' || term[i] !== term[i - 1]) {
                deduplicated += term[i];
            }
        }
        term = deduplicated;

        const initialExceptions: Record<string, string> = {
            'KN': 'N', 'GN': 'N', 'PN': 'N', 'AE': 'E', 'WR': 'R'
        };
        const prefix = term.substring(0, 2);
        if (initialExceptions[prefix]) {
            term = initialExceptions[prefix] + term.substring(2);
        } else if (term.charAt(0) === 'X') {
            term = 'S' + term.substring(1);
        } else if (term.startsWith('WH')) {
            term = 'W' + term.substring(2);
        }

        let result = '';
        const isVowel = (c: string) => ['A', 'E', 'I', 'O', 'U'].includes(c);

        for (let i = 0; i < term.length; i++) {
            const c = term.charAt(i);
            const next = i + 1 < term.length ? term.charAt(i + 1) : '';
            const nextNext = i + 2 < term.length ? term.charAt(i + 2) : '';
            const prev = i > 0 ? term.charAt(i - 1) : '';

            if (isVowel(c)) {
                if (i === 0) result += c;
                continue;
            }

            switch (c) {
                case 'B':
                    if (i !== term.length - 1 || prev !== 'M') result += 'B';
                    break;
                case 'C':
                    if (next === 'I' && nextNext === 'A') result += 'X';
                    else if (next === 'H') result += 'X';
                    else if (['I', 'E', 'Y'].includes(next)) result += 'S';
                    else result += 'K';
                    break;
                case 'D':
                    if (next === 'G' && ['E', 'I', 'Y'].includes(nextNext)) result += 'J';
                    else result += 'T';
                    break;
                case 'F':
                case 'J':
                case 'L':
                case 'M':
                case 'N':
                case 'R':
                    result += c;
                    break;
                case 'G':
                    if (next === 'H' && !isVowel(nextNext)) break;
                    // FIX: Only drop G if GN is at the end of the word
                    if (next === 'N' && (i + 1 === term.length - 1 || (nextNext === 'E' && i + 2 === term.length - 1))) break;
                    if (['I', 'E', 'Y'].includes(next)) result += 'J';
                    else result += 'K';
                    break;
                case 'H':
                    if (isVowel(next) && !['C', 'S', 'P', 'T', 'G'].includes(prev)) result += 'H';
                    break;
                case 'K':
                    if (prev !== 'C') result += 'K';
                    break;
                case 'P':
                    if (next === 'H') result += 'F';
                    else result += 'P';
                    break;
                case 'Q':
                    result += 'K';
                    break;
                case 'S':
                    if (next === 'H') result += 'X';
                    else if (next === 'I' && ['O', 'A'].includes(nextNext)) result += 'X';
                    else result += 'S';
                    break;
                case 'T':
                    if (next === 'I' && ['O', 'A'].includes(nextNext)) result += 'X';
                    else if (next === 'H') result += '0';
                    else if (next !== 'C' || nextNext !== 'H') result += 'T';
                    break;
                case 'V':
                    result += 'F';
                    break;
                case 'W':
                case 'Y':
                    if (isVowel(next)) result += c;
                    break;
                case 'X':
                    result += 'KS';
                    break;
                case 'Z':
                    result += 'S';
                    break;
            }
        }

        return result.substring(0, 10);
    }
};

const soundexAlgorithm: PhoneticAlgorithm = {
    encode(input: string): string {
        if (!input) return '';
        let s = input.toUpperCase().replace(/[^A-Z]/g, '');
        if (s.length === 0) return '';
        const firstLetter = s.charAt(0);
        s = s.substring(1);
        s = s.replace(/[BFPV]/g, '1');
        s = s.replace(/[CGJKQSXZ]/g, '2');
        s = s.replace(/[DT]/g, '3');
        s = s.replace(/L/g, '4');
        s = s.replace(/[MN]/g, '5');
        s = s.replace(/R/g, '6');
        s = s.replace(/[AEIOUHWY]/g, '0');
        let deduplicated = firstLetter;
        for (let i = 0; i < s.length; i++) {
            if (s[i] !== '0' && s[i] !== s[i - 1]) {
                deduplicated += s[i];
            }
        }
        deduplicated = deduplicated.replace(/0/g, '');
        return (deduplicated + '0000').substring(0, 4);
    }
};

export const fuzzyAlgorithmRegistry = {
  'jaro-winkler': jaroWinklerAlgorithm,
  levenshtein: levenshteinAlgorithm,
} satisfies Record<FuzzyAlgorithmName, FuzzyAlgorithm>;

export const phoneticAlgorithmRegistry = {
  metaphone: metaphoneAlgorithm,
  soundex: soundexAlgorithm,
} satisfies Record<PhoneticAlgorithmName, PhoneticAlgorithm>;
