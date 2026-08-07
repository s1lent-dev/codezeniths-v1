import { logger } from '@/service/logging';

/**
 * Extracts raw text content from a PDF document Buffer.
 */
export async function extractTextFromPdf(pdfBuffer: Buffer): Promise<string> {
    logger.info('[pdf-parser] Starting PDF text extraction', { bufferSize: pdfBuffer.length });

    try {
        const { extractText } = await import('unpdf');
        const { text } = await extractText(new Uint8Array(pdfBuffer));
        const rawText = Array.isArray(text) ? text.join(' ') : String(text || '');

        const cleanedText = rawText.replace(/\s+/g, ' ').trim();

        logger.info('[pdf-parser] PDF text extraction complete', {
            extractedLength: cleanedText.length,
        });

        if (cleanedText.length < 50) {
            logger.warn('[pdf-parser] Extracted text is too short (< 50 chars). Possible image/scanned PDF.');
            throw new Error('Image-based or scanned PDF detected. Text could not be extracted automatically.');
        }

        return cleanedText;
    } catch (error: any) {
        logger.error('[pdf-parser] Failed to parse PDF buffer', { error: error?.message || String(error) });
        if (error?.message?.includes('scanned')) {
            throw error;
        }
        throw new Error(error?.message || 'Could not parse PDF document.');
    }
}
