import { ENV_CONFIG } from '@codezeniths/config/config';
import { 
    TurnstileVerificationInput, 
    TurnstileVerificationOutput, 
    TurnstileVerificationInputSchema,
    TurnstileVerificationOutputSchema
} from '@/schemas/common';

export interface ICaptchaService {
    /**
     * Verifies a CAPTCHA token with the provider.
     * @param input The input containing the token to verify and optionally the user's IP.
     * @returns A promise resolving to the output of the verification, indicating success or failure.
     */
    verifyToken(input: TurnstileVerificationInput): Promise<TurnstileVerificationOutput>;
}


export class TurnstileService implements ICaptchaService {
    private readonly VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

    public async verifyToken(input: TurnstileVerificationInput): Promise<TurnstileVerificationOutput> {
        // Validate input
        const parsedInput = TurnstileVerificationInputSchema.parse(input);

        const formData = new URLSearchParams();
        formData.append('secret', ENV_CONFIG.TURNSTILE_SECRET_KEY);
        formData.append('response', parsedInput.token);
        
        if (parsedInput.ip) {
            formData.append('remoteip', parsedInput.ip);
        }

        try {
            const response = await fetch(this.VERIFY_URL, {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            if (!response.ok) {
                throw new Error(`Turnstile API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            
            // Validate the external API response using Zod to guarantee runtime type safety
            return TurnstileVerificationOutputSchema.parse(data);

        } catch (error: any) {
            console.error('[TurnstileService] Failed to verify token:', error);
            // Default to failure if something completely breaks (fail secure)
            return {
                success: false,
                'error-codes': ['internal-error', error.message]
            };
        }
    }
}

// Singleton instance for injection/usage
export const turnstileService = new TurnstileService();
