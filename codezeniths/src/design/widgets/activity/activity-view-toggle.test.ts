import { describe, it, expect, vi } from 'vitest';
import {
    TOGGLE_OPTIONS,
    getNextViewMode,
    type ActivityViewMode,
} from './activity-view-toggle';

describe('ActivityViewToggle configuration & logic', () => {
    it('defines flat and terrain toggle options with correct labels and keys', () => {
        expect(TOGGLE_OPTIONS).toHaveLength(2);
        expect(TOGGLE_OPTIONS.map((o) => o.key)).toEqual(['flat', 'terrain']);
        expect(TOGGLE_OPTIONS.map((o) => o.label)).toEqual(['Flat', 'Terrain']);
    });

    it('toggles correctly between modes using getNextViewMode helper', () => {
        expect(getNextViewMode('flat')).toBe('terrain');
        expect(getNextViewMode('terrain')).toBe('flat');
    });

    it('calls onChange with the alternative mode when triggered', () => {
        const onChange = vi.fn();
        const currentMode: ActivityViewMode = 'flat';
        const next = getNextViewMode(currentMode);
        onChange(next);

        expect(onChange).toHaveBeenCalledWith('terrain');
    });
});
