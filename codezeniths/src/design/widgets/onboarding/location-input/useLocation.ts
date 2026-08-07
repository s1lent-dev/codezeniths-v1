'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDebouncedValue } from '@/hooks/performance-hooks/useDebounce';

export interface LocationOption {
    label: string;
    city: string;
    state?: string;
    country: string;
}

export interface LocationInputProps {
    value?: string;
    onChange?: (value: string) => void;
    onBlur?: () => void;
    placeholder?: string;
    className?: string;
    id?: string;
    name?: string;
    error?: boolean;
}

export interface UseLocationProps {
    value?: string;
    onChange?: (value: string) => void;
}

// Curated list of major world cities for instant suggestions & offline fallback
export const FAMOUS_WORLD_CITIES: LocationOption[] = [
    { label: 'Bengaluru, Karnataka, India', city: 'Bengaluru', state: 'Karnataka', country: 'India' },
    { label: 'Mumbai, Maharashtra, India', city: 'Mumbai', state: 'Maharashtra', country: 'India' },
    { label: 'Delhi, India', city: 'Delhi', country: 'India' },
    { label: 'Hyderabad, Telangana, India', city: 'Hyderabad', state: 'Telangana', country: 'India' },
    { label: 'Pune, Maharashtra, India', city: 'Pune', state: 'Maharashtra', country: 'India' },
    { label: 'San Francisco, California, USA', city: 'San Francisco', state: 'California', country: 'United States' },
    { label: 'New York, New York, USA', city: 'New York', state: 'New York', country: 'United States' },
    { label: 'Seattle, Washington, USA', city: 'Seattle', state: 'Washington', country: 'United States' },
    { label: 'Austin, Texas, USA', city: 'Austin', state: 'Texas', country: 'United States' },
    { label: 'London, England, United Kingdom', city: 'London', state: 'England', country: 'United Kingdom' },
    { label: 'Toronto, Ontario, Canada', city: 'Toronto', state: 'Ontario', country: 'Canada' },
    { label: 'Vancouver, British Columbia, Canada', city: 'Vancouver', state: 'British Columbia', country: 'Canada' },
    { label: 'Tokyo, Japan', city: 'Tokyo', country: 'Japan' },
    { label: 'Berlin, Germany', city: 'Berlin', country: 'Germany' },
    { label: 'Paris, Île-de-France, France', city: 'Paris', state: 'Île-de-France', country: 'France' },
    { label: 'Sydney, New South Wales, Australia', city: 'Sydney', state: 'New South Wales', country: 'Australia' },
    { label: 'Singapore', city: 'Singapore', country: 'Singapore' },
    { label: 'Dubai, United Arab Emirates', city: 'Dubai', country: 'United Arab Emirates' },
    { label: 'Amsterdam, Netherlands', city: 'Amsterdam', country: 'Netherlands' },
    { label: 'Zurich, Switzerland', city: 'Zurich', country: 'Switzerland' },
];

export const useLocation = ({ value = '', onChange }: UseLocationProps = {}) => {
    const [inputValue, setInputValue] = useState(value || '');
    const [suggestions, setSuggestions] = useState<LocationOption[]>(FAMOUS_WORLD_CITIES.slice(0, 6));
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    // Debounce the input value using project's performance hook
    const debouncedSearchQuery = useDebouncedValue(inputValue, 250);

    // Sync input state with external form value
    useEffect(() => {
        setInputValue(value || '');
    }, [value]);

    // Fetch live worldwide city suggestions from Photon OpenStreetMap API
    const fetchLocations = useCallback(async (query: string) => {
        if (!query || query.trim().length < 2) {
            setSuggestions(FAMOUS_WORLD_CITIES.slice(0, 6));
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const trimmed = query.toLowerCase().trim();
            const localMatches = FAMOUS_WORLD_CITIES.filter((loc) =>
                loc.label.toLowerCase().includes(trimmed) || loc.city.toLowerCase().includes(trimmed)
            );

            // API request with correct layer=city parameter
            const response = await fetch(
                `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&layer=city&limit=7`
            );

            if (response.ok) {
                const data = await response.json();
                const apiResults: LocationOption[] = (data.features || [])
                    .map((feat: any) => {
                        const props = feat.properties || {};
                        const city = props.name || props.city || '';
                        const state = props.state || props.county || '';
                        const country = props.country || '';

                        if (!city) return null;

                        const parts = [city, state, country].filter(Boolean);
                        const label = parts.join(', ');

                        return {
                            label,
                            city,
                            state,
                            country,
                        };
                    })
                    .filter((item: LocationOption | null): item is LocationOption => item !== null);

                // Merge API results with local matches (prevent duplicates)
                const combined = [...apiResults];
                for (const match of localMatches) {
                    if (!combined.some((c) => c.label.toLowerCase() === match.label.toLowerCase())) {
                        combined.push(match);
                    }
                }

                setSuggestions(combined.slice(0, 8));
            } else {
                setSuggestions(localMatches.slice(0, 6));
            }
        } catch {
            const trimmed = query.toLowerCase().trim();
            const fallback = FAMOUS_WORLD_CITIES.filter((loc) =>
                loc.label.toLowerCase().includes(trimmed)
            );
            setSuggestions(fallback);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Trigger search when debounced value changes
    useEffect(() => {
        if (isOpen) {
            fetchLocations(debouncedSearchQuery);
        }
    }, [debouncedSearchQuery, fetchLocations, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        onChange?.(newValue);
        setIsOpen(true);
    };

    const handleSelectOption = (option: LocationOption) => {
        setInputValue(option.label);
        onChange?.(option.label);
        setIsOpen(false);
        setActiveIndex(-1);
    };

    const handleFocus = () => {
        setIsOpen(true);
        if (!suggestions.length) {
            fetchLocations(inputValue);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isOpen) {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                setIsOpen(true);
            }
            return;
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (activeIndex >= 0 && suggestions[activeIndex]) {
                handleSelectOption(suggestions[activeIndex]);
            }
        } else if (e.key === 'Escape') {
            setIsOpen(false);
            setActiveIndex(-1);
        }
    };

    return {
        inputValue,
        suggestions,
        isOpen,
        isLoading,
        activeIndex,
        setIsOpen,
        setActiveIndex,
        handleInputChange,
        handleSelectOption,
        handleFocus,
        handleKeyDown,
    };
};
