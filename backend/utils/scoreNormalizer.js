/**
 * Normalize and validate the Gemini response to ensure it matches
 * the exact data shape that the frontend React components expect.
 *
 * Frontend components expect:
 *  - score: number (0-100)
 *  - techniques: [{ id: string, label: string, color: string, score: number }]
 *  - highlights: [{ text: string, highlighted: boolean, type?, color?, label? }]
 *  - rhetoric: { emotional: number, bias: number, propaganda: number, fallacies: number }
 *  - neutralRewrite: string
 */

const VALID_COLORS = ['red', 'orange', 'purple', 'yellow', 'indigo', 'green'];
const VALID_TYPES = ['emotional', 'fear', 'loaded', 'selective', 'usvsthem', 'propaganda', 'fallacy'];

// Maps technique type to a sensible default color
const TYPE_COLOR_MAP = {
  emotional: 'red',
  fear: 'orange',
  loaded: 'purple',
  selective: 'yellow',
  usvsthem: 'indigo',
  propaganda: 'purple',
  fallacy: 'indigo',
  emotional_exaggeration: 'red',
  fear_framing: 'orange',
  loaded_language: 'purple',
  bias_framing: 'yellow',
  us_vs_them: 'indigo',
};

/**
 * Clamp a number between min and max, defaulting to fallback if not a number.
 */
function clampScore(value, fallback = 0) {
  const n = Number(value);
  if (isNaN(n)) return fallback;
  return Math.max(0, Math.min(100, Math.round(n)));
}

/**
 * Ensure a color string is valid for the frontend.
 */
function normalizeColor(color, type) {
  if (typeof color === 'string' && VALID_COLORS.includes(color.toLowerCase())) {
    return color.toLowerCase();
  }
  // Derive from type
  if (type && TYPE_COLOR_MAP[type]) {
    return TYPE_COLOR_MAP[type];
  }
  return 'indigo';
}

/**
 * Normalize techniques array to match frontend shape.
 */
function normalizeTechniques(techniques) {
  if (!Array.isArray(techniques)) return [];

  return techniques
    .filter((t) => t && (t.label || t.id))
    .map((t, idx) => {
      const id = t.id || t.type || `technique_${idx}`;
      const normalizedId = id.toLowerCase().replace(/\s+/g, '_');
      return {
        id: normalizedId,
        label: t.label || t.name || id,
        color: normalizeColor(t.color, normalizedId),
        score: clampScore(t.score, 50),
      };
    });
}

/**
 * Normalize highlights array.
 * The highlights must be an array of { text, highlighted, type?, color?, label? }
 * where concatenating all text values reproduces the original text.
 */
function normalizeHighlights(highlights, originalText) {
  if (!Array.isArray(highlights) || highlights.length === 0) {
    // Fallback: return entire text as un-highlighted
    return [{ text: originalText, highlighted: false }];
  }

  // Validate the concatenation matches original text
  const reconstructed = highlights.map((h) => h.text || '').join('');

  if (reconstructed === originalText) {
    // Segments match — normalize individual fields
    return highlights.map((h) => {
      if (h.highlighted) {
        return {
          text: h.text,
          highlighted: true,
          type: h.type || 'emotional',
          color: normalizeColor(h.color, h.type),
          label: h.label || h.type || 'Manipulation Detected',
        };
      }
      return { text: h.text, highlighted: false };
    });
  }

  // Segments don't match the original — rebuild from word-level highlights
  // This handles cases where Gemini returns { word, type } style highlights
  return rebuildHighlightsFromWords(highlights, originalText);
}

/**
 * Fallback: rebuild segment-based highlights from word-level highlight objects.
 * Handles Gemini responses that return highlights as { word, type } pairs
 * instead of the segment-based format.
 */
function rebuildHighlightsFromWords(rawHighlights, originalText) {
  // Extract word-level highlights
  const wordHighlights = rawHighlights
    .filter((h) => h.word || (h.text && h.highlighted))
    .map((h) => ({
      word: h.word || h.text,
      type: h.type || 'emotional',
      color: normalizeColor(h.color, h.type),
      label: h.label || h.type || 'Manipulation Detected',
    }));

  if (wordHighlights.length === 0) {
    return [{ text: originalText, highlighted: false }];
  }

  // Build regex from all highlighted words/phrases, sorted longest first
  const sortedWords = [...wordHighlights].sort((a, b) => b.word.length - a.word.length);

  // Create a map of word -> highlight info
  const wordMap = {};
  sortedWords.forEach((wh) => {
    wordMap[wh.word.toLowerCase()] = wh;
  });

  // Build segments by finding highlighted words in the text
  const segments = [];
  let remaining = originalText;

  while (remaining.length > 0) {
    let found = false;

    for (const wh of sortedWords) {
      const idx = remaining.toLowerCase().indexOf(wh.word.toLowerCase());
      if (idx === 0) {
        // Highlighted word at the start
        const matchedText = remaining.slice(0, wh.word.length);
        segments.push({
          text: matchedText,
          highlighted: true,
          type: wh.type,
          color: wh.color,
          label: wh.label,
        });
        remaining = remaining.slice(wh.word.length);
        found = true;
        break;
      } else if (idx > 0) {
        // Non-highlighted text before the word
        segments.push({ text: remaining.slice(0, idx), highlighted: false });
        const matchedText = remaining.slice(idx, idx + wh.word.length);
        segments.push({
          text: matchedText,
          highlighted: true,
          type: wh.type,
          color: wh.color,
          label: wh.label,
        });
        remaining = remaining.slice(idx + wh.word.length);
        found = true;
        break;
      }
    }

    if (!found) {
      // No more highlighted words found in remaining text
      segments.push({ text: remaining, highlighted: false });
      remaining = '';
    }
  }

  return segments;
}

/**
 * Normalize rhetoric breakdown scores.
 */
function normalizeRhetoric(rhetoric) {
  if (!rhetoric || typeof rhetoric !== 'object') {
    return { emotional: 30, bias: 20, propaganda: 25, fallacies: 15 };
  }

  return {
    emotional: clampScore(rhetoric.emotional || rhetoric.emotion, 20),
    bias: clampScore(rhetoric.bias || rhetoric.biasFraming, 15),
    propaganda: clampScore(rhetoric.propaganda || rhetoric.propagandaSignals, 20),
    fallacies: clampScore(rhetoric.fallacies || rhetoric.logicFallacy || rhetoric.logicalFallacies, 10),
  };
}

/**
 * Main normalization function — takes raw Gemini JSON and returns
 * a response that exactly matches what the frontend expects.
 */
export function normalizeResponse(raw, originalText) {
  return {
    score: clampScore(raw.score, 50),
    techniques: normalizeTechniques(raw.techniques),
    highlights: normalizeHighlights(raw.highlights, originalText),
    rhetoric: normalizeRhetoric(raw.rhetoric || raw.rhetoricBreakdown),
    neutralRewrite: raw.neutralRewrite || raw.neutral_rewrite || originalText,
  };
}
