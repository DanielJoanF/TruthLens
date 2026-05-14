import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildAnalysisPrompt } from '../prompts/analysisPrompt.js';

/**
 * Send text to Gemini 1.5 Flash and get structured manipulation analysis.
 * Returns raw parsed JSON from the model.
 */
export async function runGeminiAnalysis(text) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const { systemInstruction, userPrompt } = buildAnalysisPrompt(text);

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction,
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.2, // Reduced temperature for more consistent JSON
      maxOutputTokens: 4096,
    },
  });

  const result = await model.generateContent(userPrompt);
  const responseText = result.response.text().trim();

  // Parse the JSON response
  try {
    // If the model wrapped it in markdown code blocks even with responseMimeType
    const cleaned = responseText.replace(/^```json\s*|```$/g, '').trim();
    return JSON.parse(cleaned);
  } catch (parseErr) {
    console.error('[Gemini] Failed to parse response:', responseText.slice(0, 500));
    throw new Error('Gemini returned invalid JSON');
  }

  return parsed;
}
