import {
    CountryCode,
    parsePhoneNumberFromString,
    isValidPhoneNumber,
} from 'libphonenumber-js';

// ==========================================
// 1. STANDARDIZED COUNTRY OPTIONS REGISTRY
// ==========================================

export interface CountryOption {
    code: CountryCode;
    value: string; // e.g. "+91"
    label: string; // e.g. "IN (+91)"
    name: string;  // e.g. "India"
}

export const COUNTRY_OPTIONS: CountryOption[] = [
    { code: 'IN', value: '+91', label: 'IN (+91)', name: 'India' },
    { code: 'US', value: '+1', label: 'US/CA (+1)', name: 'United States' },
    { code: 'GB', value: '+44', label: 'UK (+44)', name: 'United Kingdom' },
    { code: 'AU', value: '+61', label: 'AU (+61)', name: 'Australia' },
    { code: 'DE', value: '+49', label: 'DE (+49)', name: 'Germany' },
    { code: 'FR', value: '+33', label: 'FR (+33)', name: 'France' },
    { code: 'SG', value: '+65', label: 'SG (+65)', name: 'Singapore' },
    { code: 'AE', value: '+971', label: 'AE (+971)', name: 'United Arab Emirates' },
    { code: 'JP', value: '+81', label: 'JP (+81)', name: 'Japan' },
    { code: 'CN', value: '+86', label: 'CN (+86)', name: 'China' },
    { code: 'BR', value: '+55', label: 'BR (+55)', name: 'Brazil' },
    { code: 'CA', value: '+1', label: 'CA (+1)', name: 'Canada' },
    { code: 'NL', value: '+31', label: 'NL (+31)', name: 'Netherlands' },
    { code: 'SE', value: '+46', label: 'SE (+46)', name: 'Sweden' },
    { code: 'CH', value: '+41', label: 'CH (+41)', name: 'Switzerland' },
    { code: 'IT', value: '+39', label: 'IT (+39)', name: 'Italy' },
    { code: 'ES', value: '+34', label: 'ES (+34)', name: 'Spain' },
    { code: 'NZ', value: '+64', label: 'NZ (+64)', name: 'New Zealand' },
    { code: 'ZA', value: '+27', label: 'ZA (+27)', name: 'South Africa' },
    { code: 'PK', value: '+92', label: 'PK (+92)', name: 'Pakistan' },
    { code: 'BD', value: '+880', label: 'BD (+880)', name: 'Bangladesh' },
    { code: 'LK', value: '+94', label: 'LK (+94)', name: 'Sri Lanka' },
];

export const DEFAULT_COUNTRY_CODE = '+91';

/**
 * Finds the matching country option by calling code (e.g. '+91' -> 'IN').
 */
export function getCountryByCallingCode(callingCode: string): CountryOption | undefined {
    const normalizedCode = callingCode.startsWith('+') ? callingCode : `+${callingCode}`;
    return COUNTRY_OPTIONS.find((c) => c.value === normalizedCode);
}

// ==========================================
// 2. PARSING & NORMALIZATION UTILITIES
// ==========================================

/**
 * Strips formatting characters (spaces, dashes, parens) except leading '+'.
 */
export function cleanPhoneNumber(phone: string): string {
    return phone.replace(/[^\d+]/g, '');
}

/**
 * Combines country code and national number and parses with libphonenumber-js.
 */
export function parsePhone(countryCode?: string, nationalNumber?: string) {
    const rawCountry = (countryCode || DEFAULT_COUNTRY_CODE).trim();
    const rawNational = (nationalNumber || '').trim();

    if (!rawNational) return null;

    const cleanedCountry = rawCountry.startsWith('+') ? rawCountry : `+${rawCountry}`;
    const cleanedNational = rawNational.replace(/[^\d]/g, '');

    if (!cleanedNational) return null;

    const countryOption = getCountryByCallingCode(cleanedCountry);
    const combined = `${cleanedCountry}${cleanedNational}`;

    const parsed = countryOption
        ? parsePhoneNumberFromString(cleanedNational, countryOption.code) || parsePhoneNumberFromString(combined)
        : parsePhoneNumberFromString(combined);

    return parsed;
}

/**
 * Splits a full E.164 phone string (e.g. "+919876543210") into separate countryCode and nationalNumber.
 */
export function splitE164(
    fullPhone?: string | null,
    defaultCode = DEFAULT_COUNTRY_CODE
): { countryCode: string; nationalNumber: string; country?: CountryCode } {
    if (!fullPhone || typeof fullPhone !== 'string' || fullPhone.trim() === '') {
        return { countryCode: defaultCode, nationalNumber: '' };
    }

    const trimmed = fullPhone.trim();
    const withPlus = trimmed.startsWith('+') ? trimmed : `+${trimmed}`;
    const parsed = parsePhoneNumberFromString(withPlus);

    if (parsed) {
        return {
            countryCode: `+${parsed.countryCallingCode}`,
            nationalNumber: parsed.nationalNumber,
            country: parsed.country,
        };
    }

    // Fallback: Check if string starts with any known calling code
    for (const option of COUNTRY_OPTIONS) {
        if (withPlus.startsWith(option.value)) {
            return {
                countryCode: option.value,
                nationalNumber: withPlus.slice(option.value.length).trim(),
                country: option.code,
            };
        }
    }

    return { countryCode: defaultCode, nationalNumber: withPlus.replace(/^\+/, '').trim() };
}

/**
 * Formats a phone number to standard E.164 (e.g. "+919876543210").
 */
export function formatToE164(countryCode: string, nationalNumber: string): string | null {
    const parsed = parsePhone(countryCode, nationalNumber);
    if (parsed && parsed.isValid()) {
        return parsed.number;
    }
    return null;
}

/**
 * Formats phone number for clean international display (e.g. "+91 98765 43210").
 */
export function formatPhoneDisplay(fullPhone?: string | null): string {
    if (!fullPhone) return '';
    const withPlus = fullPhone.startsWith('+') ? fullPhone : `+${fullPhone}`;
    const parsed = parsePhoneNumberFromString(withPlus);
    if (parsed && parsed.isValid()) {
        return parsed.formatInternational();
    }
    return fullPhone;
}

// ==========================================
// 3. STRICT COUNTRY-SPECIFIC VALIDATION
// ==========================================

export interface ValidatePhoneParams {
    countryCode: string;
    nationalNumber: string;
    isRequired?: boolean;
}

export interface ValidatePhoneResult {
    isValid: boolean;
    error?: string;
    normalizedE164?: string;
    country?: CountryCode;
}

/**
 * Validates country code and national phone number according to exact ITU-T country standards.
 * Enforces correct digit count (e.g. exactly 10 digits for India/US, 10-11 for UK, etc.).
 */
export function validatePhoneNumber({
    countryCode,
    nationalNumber,
    isRequired = false,
}: ValidatePhoneParams): ValidatePhoneResult {
    const trimmedCode = (countryCode || '').trim();
    const trimmedNational = (nationalNumber || '').trim().replace(/[\s-]/g, '');

    // Case 1: Empty input
    if (!trimmedNational) {
        if (isRequired) {
            return {
                isValid: false,
                error: 'Phone number is required',
            };
        }
        return {
            isValid: true,
        };
    }

    // Case 2: Must contain only digits
    if (!/^\d+$/.test(trimmedNational)) {
        return {
            isValid: false,
            error: 'Phone number must contain only numbers',
        };
    }

    // Case 3: Missing country code
    if (!trimmedCode) {
        return {
            isValid: false,
            error: 'Please select a country code',
        };
    }

    const countryOption = getCountryByCallingCode(trimmedCode);
    const parsed = parsePhone(trimmedCode, trimmedNational);

    if (!parsed || !parsed.isValid()) {
        const countryName = countryOption?.name || 'the selected country';
        return {
            isValid: false,
            error: `Please enter a valid phone number for ${countryName}`,
        };
    }

    return {
        isValid: true,
        normalizedE164: parsed.number,
        country: parsed.country,
    };
}

/**
 * Validates combined single identifier string (e.g. "+91 9876543210" or "+12025550123").
 */
export function validateCombinedPhone(
    combinedPhone?: string | null,
    isRequired = false
): ValidatePhoneResult {
    if (!combinedPhone || combinedPhone.trim() === '') {
        if (isRequired) {
            return { isValid: false, error: 'Phone number is required' };
        }
        return { isValid: true };
    }

    const parts = combinedPhone.trim().split(/\s+/);
    let countryCode = DEFAULT_COUNTRY_CODE;
    let nationalNumber = '';

    if (parts.length > 1) {
        countryCode = parts[0];
        nationalNumber = parts.slice(1).join('');
    } else if (parts[0].startsWith('+')) {
        const split = splitE164(parts[0]);
        countryCode = split.countryCode;
        nationalNumber = split.nationalNumber;
    } else {
        nationalNumber = parts[0];
    }

    return validatePhoneNumber({ countryCode, nationalNumber, isRequired });
}
