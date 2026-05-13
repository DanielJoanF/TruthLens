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
      temperature: 0.4,
      maxOutputTokens: 4096,
    },
  });

  const result = await model.generateContent(userPrompt);
  const response = result.response;
  const responseText = response.text();

  // Parse the JSON response
  let parsed;
  try {
    parsed = JSON.parse(responseText);
  } catch (parseErr) {
    // Try to extract JSON from markdown fences if model wraps it
    const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[1].trim());
    } else {
      console.error('[Gemini] Failed to parse response:', responseText.slice(0, 500));
      throw new Error('Gemini returned invalid JSON');
    }
  }

  return parsed;
}
