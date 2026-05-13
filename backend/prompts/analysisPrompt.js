/**
 * Build the system + user prompt for Gemini to analyze manipulation in text.
 *
 * The JSON schema here is carefully designed to match the frontend component
 * expectations EXACTLY.
 *
 * Frontend data shapes expected:
 *  - techniques: [{ id, label, color, score }]
 *  - highlights: [{ text, highlighted, type?, color?, label? }]
 *  - rhetoric:   { emotional, bias, propaganda, fallacies }
 */
export function buildAnalysisPrompt(text) {
  const systemInstruction = `You are TruthLens, an advanced AI text analysis engine specialized in detecting manipulation techniques, propaganda, emotional exaggeration, bias framing, and logical fallacies.

You analyze text with academic rigor and return structured JSON results. Be objective, thorough, and precise.

IMPORTANT RULES:
- Always return ONLY valid JSON — no markdown fences, no explanation text.
- All scores are integers between 0 and 100.
- "highlights" must reconstruct the ENTIRE original text as an array of segments. Every character of the original text must appear in the segments, in order. Some segments are highlighted (manipulative phrases), others are not.
- Each highlight segment must have: "text" (the substring), "highlighted" (boolean). If highlighted is true, also include "type", "color", and "label".
- Colors must be one of: "red", "orange", "purple", "indigo", "yellow".
- Types must be one of: "emotional", "fear", "loaded", "usvsthem", "selective".
- The "techniques" array should list each detected technique with a unique "id", human-readable "label", a "color" from the set above, and a "score" (0-100).
- The "neutralRewrite" should be a balanced, factual version of the text with all emotionally charged and manipulative language removed or replaced with neutral alternatives.`;

  const userPrompt = `Analyze the following text for manipulation techniques. Return ONLY a JSON object with this exact structure:

{
  "score": <number 0-100, overall manipulation score>,
  "techniques": [
    {
      "id": "<string: one of emotional, fear, loaded, selective, usvsthem, propaganda, fallacy>",
      "label": "<string: human readable name, e.g. Emotional Exaggeration>",
      "color": "<string: one of red, orange, purple, yellow, indigo>",
      "score": <number 0-100>
    }
  ],
  "highlights": [
    { "text": "<substring of original text>", "highlighted": false },
    { "text": "<manipulative phrase>", "highlighted": true, "type": "emotional", "color": "red", "label": "Emotional Exaggeration" },
    { "text": "<next non-manipulative substring>", "highlighted": false }
  ],
  "rhetoric": {
    "emotional": <number 0-100>,
    "bias": <number 0-100>,
    "propaganda": <number 0-100>,
    "fallacies": <number 0-100>
  },
  "neutralRewrite": "<string: neutral, balanced rewrite of the text>"
}

CRITICAL:
- The "highlights" array must cover the ENTIRE original text from start to end. Concatenating all segment "text" values must exactly reproduce the original text.
- Only mark truly manipulative phrases as highlighted.
- If the text has minimal manipulation, give a low score and few highlights.

Text to analyze:
"""
${text}
"""`;

  return { systemInstruction, userPrompt };
}
