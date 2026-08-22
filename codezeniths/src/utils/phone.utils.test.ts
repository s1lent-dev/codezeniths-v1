import { describe, it, expect } from 'vitest';
import {
    validatePhoneNumber,
    validateCombinedPhone,
    splitE164,
    formatToE164,
    formatPhoneDisplay,
    getCountryByCallingCode,
    COUNTRY_OPTIONS,
} from './phone.utils';

describe('Phone Utilities Unit Tests', () => {
    describe('Country Options Registry', () => {
        it('should have standard country options', () => {
            expect(COUNTRY_OPTIONS.length).toBeGreaterThanOrEqual(10);
            const india = getCountryByCallingCode('+91');
            expect(india?.code).toBe('IN');
            expect(india?.name).toBe('India');

            const us = getCountryByCallingCode('+1');
            expect(us?.code).toBe('US');
        });
    });

    describe('Strict Country-Specific Phone Validation (validatePhoneNumber)', () => {
        it('should validate India (+91) strictly for 10 digits', () => {
            // Valid 10 digits
            const valid = validatePhoneNumber({
                countryCode: '+91',
                nationalNumber: '9876543210',
                isRequired: true,
            });
            expect(valid.isValid).toBe(true);
            expect(valid.normalizedE164).toBe('+919876543210');
            expect(valid.country).toBe('IN');

            // Invalid 9 digits (too short)
            const short = validatePhoneNumber({
                countryCode: '+91',
                nationalNumber: '987654321',
                isRequired: true,
            });
            expect(short.isValid).toBe(false);
            expect(short.error).toContain('India');

            // Invalid 11 digits (too long)
            const long = validatePhoneNumber({
                countryCode: '+91',
                nationalNumber: '98765432100',
                isRequired: true,
            });
            expect(long.isValid).toBe(false);

            // Invalid characters
            const nonDigits = validatePhoneNumber({
                countryCode: '+91',
                nationalNumber: '98765abcde',
                isRequired: true,
            });
            expect(nonDigits.isValid).toBe(false);
            expect(nonDigits.error).toBe('Phone number must contain only numbers');
        });

        it('should validate US/Canada (+1) strictly for 10 digits', () => {
            const valid = validatePhoneNumber({
                countryCode: '+1',
                nationalNumber: '2025550123',
                isRequired: true,
            });
            expect(valid.isValid).toBe(true);
            expect(valid.normalizedE164).toBe('+12025550123');

            const invalid = validatePhoneNumber({
                countryCode: '+1',
                nationalNumber: '202555',
                isRequired: true,
            });
            expect(invalid.isValid).toBe(false);
        });

        it('should validate UK (+44) strictly', () => {
            const valid = validatePhoneNumber({
                countryCode: '+44',
                nationalNumber: '7911123456',
                isRequired: true,
            });
            expect(valid.isValid).toBe(true);
            expect(valid.normalizedE164).toBe('+447911123456');

            const invalid = validatePhoneNumber({
                countryCode: '+44',
                nationalNumber: '12345',
                isRequired: true,
            });
            expect(invalid.isValid).toBe(false);
        });

        it('should handle optional vs required correctly', () => {
            // Optional with empty string -> Valid
            const optionalEmpty = validatePhoneNumber({
                countryCode: '+91',
                nationalNumber: '',
                isRequired: false,
            });
            expect(optionalEmpty.isValid).toBe(true);

            // Required with empty string -> Invalid
            const requiredEmpty = validatePhoneNumber({
                countryCode: '+91',
                nationalNumber: '',
                isRequired: true,
            });
            expect(requiredEmpty.isValid).toBe(false);
            expect(requiredEmpty.error).toBe('Phone number is required');
        });
    });

    describe('validateCombinedPhone', () => {
        it('should reject just country code as incomplete', () => {
            const result = validateCombinedPhone('+91', true);
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Phone number is required');
        });

        it('should validate spaced country code and national number', () => {
            const result = validateCombinedPhone('+91 9876543210', true);
            expect(result.isValid).toBe(true);
            expect(result.normalizedE164).toBe('+919876543210');
        });

        it('should validate concatenated E.164 string', () => {
            const result = validateCombinedPhone('+12025550123', true);
            expect(result.isValid).toBe(true);
            expect(result.normalizedE164).toBe('+12025550123');
        });
    });

    describe('splitE164 and formatToE164', () => {
        it('should split existing E.164 numbers accurately', () => {
            const inSplit = splitE164('+919876543210');
            expect(inSplit.countryCode).toBe('+91');
            expect(inSplit.nationalNumber).toBe('9876543210');

            const usSplit = splitE164('+12025550123');
            expect(usSplit.countryCode).toBe('+1');
            expect(usSplit.nationalNumber).toBe('2025550123');
        });

        it('should format valid numbers to E.164 and display formats', () => {
            expect(formatToE164('+91', '9876543210')).toBe('+919876543210');
            expect(formatToE164('+91', '123')).toBeNull();
            expect(formatPhoneDisplay('+919876543210')).toContain('+91');
        });
    });
});
