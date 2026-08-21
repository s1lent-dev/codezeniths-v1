import { ENV_CONFIG } from '@/config/config';
import { logger } from '@/service/logging';

const EXTRACTION_PROMPT = `
You are an elite technical recruiter and an advanced AI resume parser with deep knowledge of the software engineering landscape.
Your task is to meticulously analyze the provided resume text and extract a comprehensive, standardized list of technical skills.

SCOPE OF EXTRACTION:
- Programming Languages (e.g., Python, JavaScript, Go, Rust, C++)
- Frameworks & Libraries (e.g., React, Next.js, Spring Boot, Django, TensorFlow)
- Databases (e.g., PostgreSQL, MongoDB, Redis, Cassandra)
- Cloud Providers & Services (e.g., AWS, GCP, Azure, S3, EC2, Lambda)
- DevOps & Tools (e.g., Docker, Kubernetes, CI/CD, Terraform, Git)
- Core Computer Science Concepts (e.g., Data Structures, Algorithms, System Design, Machine Learning, Operating Systems)

CRITICAL RULES AND CONSTRAINTS:
1. OUTPUT FORMAT: You must return *ONLY* a valid JSON object with a single key "skills" containing an array of strings (e.g., {"skills": ["JavaScript", "React", "PostgreSQL"]}).
2. NO MARKDOWN: Absolutely no markdown blocks, backticks (\`\`\`), conversational text, or explanations. Just the raw JSON object.
3. STANDARDIZATION: Clean, normalize, and standardize the skill titles.
   - Use standard capitalizations (e.g., "Node.js" not "node", "React" not "reactjs", "C++" not "c/c++").
   - Expand common acronyms if applicable to standard industry terms (e.g., "K8s" to "Kubernetes", "AWS" to "Amazon Web Services").
4. RELEVANCY: Exclude soft skills (e.g., "Leadership", "Teamwork"), basic computer skills (e.g., "Microsoft Word"), and irrelevant keywords. Focus exclusively on technical software engineering skills.
5. PRECISION: Ensure accuracy and avoid hallucinating skills not present or strongly implied in the text.
`;

/**
 * Extracts technical skills from raw resume text using Gemini 3.6 Flash as primary LLM
 * with automatic fallback to Groq Llama 3.3 70B if rate limit or errors occur.
 */
export async function extractSkillsWithAI(resumeText: string): Promise<string[]> {
    logger.info('[ai-skill-extractor] Starting AI skill extraction', { textLength: resumeText.length });

    // Truncate resume text if excessively long to stay within token limits
    const truncatedText = resumeText.slice(0, 15000);

    // 1. Try Primary LLM: Google Gemini API (@google/genai)
    if (ENV_CONFIG.GEMINI_API_KEY) {
        try {
            logger.info('[ai-skill-extractor] Attempting primary extraction via Google Gemini API...');
            const { GoogleGenAI } = await import('@google/genai');
            const ai = new GoogleGenAI({ apiKey: ENV_CONFIG.GEMINI_API_KEY });

            const response = await ai.models.generateContent({
                model: 'gemini-3.6-flash',
                contents: [
                    { role: 'user', parts: [{ text: `${EXTRACTION_PROMPT}\n\nRESUME TEXT:\n${truncatedText}` }] },
                ],
                config: {
                    responseMimeType: 'application/json',
                    temperature: 0.1,
                },
            });

            const content = response.text || '';
            const parsed = parseJsonSkillArray(content);
            if (parsed.length > 0) {
                logger.info('[ai-skill-extractor] Successfully extracted skills via Gemini API', { count: parsed.length });
                return parsed;
            }
        } catch (geminiErr: any) {
            logger.warn('[ai-skill-extractor] Gemini API rate limit or error encountered. Falling back to Groq SDK.', {
                error: geminiErr?.message || String(geminiErr),
                status: geminiErr?.status || geminiErr?.code,
            });
        }
    } else {
        logger.warn('[ai-skill-extractor] GEMINI_API_KEY not configured. Skipping Gemini and using Groq.');
    }

    // 2. Try Fallback LLM: Groq API (groq-sdk)
    if (ENV_CONFIG.GROQ_API_KEY) {
        try {
            logger.info('[ai-skill-extractor] Attempting fallback extraction via Groq SDK (Llama 3.3 70B)...');
            const { Groq } = await import('groq-sdk');
            const groq = new Groq({ apiKey: ENV_CONFIG.GROQ_API_KEY });

            const completion = await groq.chat.completions.create({
                messages: [
                    { role: 'system', content: EXTRACTION_PROMPT },
                    { role: 'user', content: `RESUME TEXT:\n${truncatedText}` },
                ],
                model: 'llama-3.3-70b-versatile',
                response_format: { type: 'json_object' },
                temperature: 0.1,
            });

            const content = completion.choices[0]?.message?.content || '';
            const parsed = parseJsonSkillArray(content);
            if (parsed.length > 0) {
                logger.info('[ai-skill-extractor] Successfully extracted skills via Groq SDK', { count: parsed.length });
                return parsed;
            }
        } catch (groqErr: any) {
            logger.error('[ai-skill-extractor] Groq SDK extraction failed as well', { error: groqErr?.message || String(groqErr) });
        }
    } else {
        logger.warn('[ai-skill-extractor] GROQ_API_KEY not configured.');
    }

    logger.warn('[ai-skill-extractor] AI LLM extraction failed on both primary and fallback models. Returning empty array.');
    return [];
}

/**
 * Safely parses string content into a array of skill strings.
 */
function parseJsonSkillArray(raw: string): string[] {
    try {
        let cleaned = raw.trim();
        if (cleaned.startsWith('```json')) {
            cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
        } else if (cleaned.startsWith('```')) {
            cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();
        }

        const parsed = JSON.parse(cleaned);
        if (Array.isArray(parsed)) {
            return parsed.map((item) => String(item).trim()).filter(Boolean);
        } else if (parsed && typeof parsed === 'object') {
            // Handle cases where LLM returns {"skills": ["JS", "React"]}
            const arrayField = Object.values(parsed).find((val) => Array.isArray(val));
            if (Array.isArray(arrayField)) {
                return arrayField.map((item) => String(item).trim()).filter(Boolean);
            }
        }
    } catch (err) {
        logger.warn('[ai-skill-extractor] Failed to parse JSON array from LLM response', { raw, error: String(err) });
    }
    return [];
}