import { PasswordStrength, PasswordRequirements } from './signup.types';

export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export const getPasswordStrength = (password: string): { status: PasswordStrength, reqs: PasswordRequirements } => {
    const reqs = {
        length: password.length >= 8,
        casing: /[a-z]/.test(password) && /[A-Z]/.test(password),
        number: /\d/.test(password),
        symbol: /[^A-Za-z0-9]/.test(password)
    };

    if (!password) return { status: 'none', reqs };

    let score = Object.values(reqs).filter(Boolean).length;
    
    let status: PasswordStrength = 'weak';
    if (score === 2) status = 'fair';
    else if (score === 3) status = 'good';
    else if (score === 4) status = 'strong';

    return { status, reqs };
};

/**
 * Username Recommendation Engine
 * Generates highly relevant and aesthetic username suggestions based on a 3-layer approach:
 * Layer 1: Leetspeak / Visual character replacements (e.g. i -> 1, e -> 3)
 * Layer 2: Popular number suffixes (e.g. 99, 07, 69)
 * Layer 3: Professional prefixes/suffixes (e.g. real_, the_, _official)
 */
export const generateUsernameSuggestions = (baseUsername: string, limit: number = 15): string[] => {
    if (!baseUsername || baseUsername.length < 3) return [];
    
    const suggestions = new Set<string>();
    const lowerBase = baseUsername.toLowerCase();
    
    // LAYER 1: Leetspeak Combinations (Bi-directional)
    const leetMap: Record<string, string[]> = { 
        'a': ['4'], '4': ['a'],
        'b': ['8'], '8': ['b'],
        'e': ['3'], '3': ['e'],
        'g': ['6', '9'], '6': ['g'], '9': ['g'],
        'i': ['1'], '1': ['i'],
        'o': ['0'], '0': ['o'],
        's': ['5'], '5': ['s'],
        't': ['7'], '7': ['t']
    };

    // Find all replaceable indices
    const replaceableIndices: { index: number; options: string[] }[] = [];
    for (let i = 0; i < lowerBase.length; i++) {
        const char = lowerBase[i];
        if (leetMap[char]) {
            replaceableIndices.push({ index: i, options: leetMap[char] });
        }
    }

    // Helper to replace characters at specific indices
    const applyReplacements = (indicesToReplace: typeof replaceableIndices) => {
        // Just take the first option for simplicity in combinations
        let newName = lowerBase.split('');
        for (const item of indicesToReplace) {
            newName[item.index] = item.options[0]; // using primary leet char
        }
        return newName.join('');
    };

    // Priority 1A: Single replacements
    for (let i = 0; i < replaceableIndices.length; i++) {
        suggestions.add(applyReplacements([replaceableIndices[i]]));
    }

    // Priority 1B: Double replacements
    if (replaceableIndices.length >= 2) {
        for (let i = 0; i < replaceableIndices.length; i++) {
            for (let j = i + 1; j < replaceableIndices.length; j++) {
                suggestions.add(applyReplacements([replaceableIndices[i], replaceableIndices[j]]));
            }
        }
    }

    // LAYER 2: Popular Numbers (always using the original base name)
    const popularNumbers = ['69', '67', '7', '07', '007', '99', '11', '21', '18', '666', '45', '42', '420', '1', '6'];
    for (const num of popularNumbers) {
        suggestions.add(`${lowerBase}${num}`);
    }

    // LAYER 3: Famous Prefixes
    const prefixes = ['real', 'its', 'itz', 'the', 'official', 'im'];
    for (const prefix of prefixes) {
        suggestions.add(`${prefix}_${lowerBase}`); 
    }
    
    // LAYER 4: Famous Suffixes
    const suffixes = ['ftw', 'btw', 'co', 'irl', 'gg', '.exe', 'afk', 'op'];
    for (const suffix of suffixes) {
        suggestions.add(`${lowerBase}_${suffix}`); 
    }
    
    // Fallback: Add some random 2-digit numbers
    const randomNum = Math.floor(Math.random() * 90) + 10;
    suggestions.add(`${lowerBase}${randomNum}`);

    // Remove the original username if it accidentally got added
    suggestions.delete(lowerBase);

    return Array.from(suggestions).slice(0, limit);
};
