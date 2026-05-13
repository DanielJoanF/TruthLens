// TruthLens — AI Analysis Engine
// Calls the backend API at /api/analyze powered by Google Gemini

const API_BASE = 'http://localhost:5000';

/**
 * Send text to the TruthLens backend for AI manipulation analysis.
 * Falls back to the mock engine if the backend is unreachable.
 *
 * @param {string} text — The text to analyze
 * @returns {Promise<object>} — Analysis result matching frontend component shapes
 */
export async function analyzeText(text) {
  try {
    const res = await fetch(`${API_BASE}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `API error: ${res.status}`);
    }

    return await res.json();

  } catch (err) {
    console.warn('[TruthLens] Backend unreachable, falling back to local analysis:', err.message);
    return analyzeTextLocal(text);
  }
}

// ─── Local Fallback Engine ──────────────────────────────────────────────────
// Used when the backend is not running (e.g. offline demo mode)

function analyzeTextLocal(text) {
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  const emotionalWords = ['terrifying', 'horrifying', 'devastating', 'outrageous', 'disgraceful',
    'shocking', 'unbelievable', 'incredible', 'amazing', 'never', 'always', 'everyone',
    'nobody', 'destroy', 'catastrophe', 'crisis', 'disaster', 'elite', 'corrupt',
    'dangerous', 'threat', 'enemy', 'fight', 'battle', 'war', 'chaos', 'collapse'];

  const fearWords = ['danger', 'fear', 'threat', 'risk', 'warning', 'alarm', 'urgent',
    'critical', 'emergency', 'attack', 'terror', 'suffer', 'pain', 'loss', 'fail'];

  const usVsThemWords = ['they', 'them', 'those people', 'their agenda', 'elites', 'the left',
    'the right', 'globalists', 'establishment', 'deep state', 'regime', 'opposition'];

  const loadedWords = ['radical', 'extremist', 'puppet', 'shill', 'regime', 'propaganda',
    'brainwash', 'indoctrinate', 'fake', 'lie', 'hoax', 'conspiracy'];

  const lowerText = text.toLowerCase();

  const countMatches = (words) =>
    words.reduce((count, word) => count + (lowerText.includes(word) ? 1 : 0), 0);

  const emotionalScore = Math.min(100, (countMatches(emotionalWords) / Math.max(wordCount, 1)) * 400 + 20);
  const fearScore = Math.min(100, (countMatches(fearWords) / Math.max(wordCount, 1)) * 350 + 15);
  const loadedScore = Math.min(100, (countMatches(loadedWords) / Math.max(wordCount, 1)) * 400 + 10);
  const biasScore = Math.min(100, (countMatches(usVsThemWords) / Math.max(wordCount, 1)) * 300 + 18);
  const propagandaScore = Math.min(100, (emotionalScore * 0.4 + fearScore * 0.3 + biasScore * 0.3));
  const fallacyScore = Math.min(100, Math.random() * 30 + 20);

  const overallScore = Math.round(
    emotionalScore * 0.25 +
    fearScore * 0.2 +
    biasScore * 0.2 +
    propagandaScore * 0.2 +
    loadedScore * 0.1 +
    fallacyScore * 0.05
  );

  const techniques = [];
  if (emotionalScore > 30) {
    techniques.push({ id: 'emotional', label: 'Emotional Exaggeration', color: 'red', score: Math.round(emotionalScore) });
  }
  if (fearScore > 25) {
    techniques.push({ id: 'fear', label: 'Fear Framing', color: 'orange', score: Math.round(fearScore) });
  }
  if (loadedScore > 20) {
    techniques.push({ id: 'loaded', label: 'Loaded Language', color: 'purple', score: Math.round(loadedScore) });
  }
  if (biasScore > 20) {
    techniques.push({ id: 'selective', label: 'Selective Statistics', color: 'yellow', score: Math.round(biasScore) });
  }
  if (biasScore > 25 || countMatches(usVsThemWords) > 0) {
    techniques.push({ id: 'usvsthem', label: 'Us vs Them Framing', color: 'indigo', score: Math.round(biasScore * 0.9) });
  }

  if (techniques.length === 0) {
    techniques.push(
      { id: 'emotional', label: 'Emotional Exaggeration', color: 'red', score: 42 },
      { id: 'fear', label: 'Fear Framing', color: 'orange', score: 35 },
    );
  }

  const highlights = buildHighlights(text);
  const neutralRewrite = generateNeutralRewrite(text);

  return {
    score: Math.max(20, overallScore),
    techniques,
    highlights,
    neutralRewrite,
    rhetoric: {
      emotional: Math.round(emotionalScore),
      bias: Math.round(biasScore),
      propaganda: Math.round(propagandaScore),
      fallacies: Math.round(fallacyScore),
    },
  };
}

function buildHighlights(text) {
  const patterns = [
    { regex: /\b(terrifying|horrifying|devastating|outrageous|shocking|unbelievable|catastrophic|catastrophe|crisis|disaster|chaos)\b/gi, type: 'emotional', color: 'red', label: 'Emotional Exaggeration' },
    { regex: /\b(danger|dangerous|threat|threatening|warning|alarm|urgent|critical|emergency|terror|fear|risk)\b/gi, type: 'fear', color: 'orange', label: 'Fear Framing' },
    { regex: /\b(radical|extremist|puppet|shill|regime|brainwash|indoctrinate|fake news|hoax|conspiracy|corrupt elite|globalist)\b/gi, type: 'loaded', color: 'purple', label: 'Loaded Language' },
    { regex: /\b(they|them|those people|elites|establishment|deep state|the left|the right)\b/gi, type: 'usvsthem', color: 'indigo', label: 'Us vs Them' },
  ];

  let segments = [{ text, highlighted: false }];

  patterns.forEach(({ regex, type, color, label }) => {
    const newSegments = [];
    segments.forEach((seg) => {
      if (seg.highlighted) {
        newSegments.push(seg);
        return;
      }
      let lastIndex = 0;
      let match;
      regex.lastIndex = 0;
      while ((match = regex.exec(seg.text)) !== null) {
        if (match.index > lastIndex) {
          newSegments.push({ text: seg.text.slice(lastIndex, match.index), highlighted: false });
        }
        newSegments.push({ text: match[0], highlighted: true, type, color, label });
        lastIndex = match.index + match[0].length;
      }
      if (lastIndex < seg.text.length) {
        newSegments.push({ text: seg.text.slice(lastIndex), highlighted: false });
      }
    });
    segments = newSegments;
  });

  return segments;
}

function generateNeutralRewrite(text) {
  const replacements = [
    [/\bterrifying\b/gi, 'concerning'],
    [/\bhorrifying\b/gi, 'troubling'],
    [/\bdevastating\b/gi, 'significant'],
    [/\boutrageous\b/gi, 'notable'],
    [/\bshocking\b/gi, 'unexpected'],
    [/\bcatastrophic\b/gi, 'serious'],
    [/\bcatastrophe\b/gi, 'setback'],
    [/\bchaos\b/gi, 'disruption'],
    [/\bdisaster\b/gi, 'difficulty'],
    [/\bdangerous\b/gi, 'risky'],
    [/\bterror\b/gi, 'concern'],
    [/\bradical\b/gi, 'unconventional'],
    [/\bextremist\b/gi, 'strongly-opinionated'],
    [/\bpuppet\b/gi, 'influenced individual'],
    [/\bcorrupt\b/gi, 'problematic'],
    [/\bfake news\b/gi, 'disputed information'],
    [/\bhoax\b/gi, 'unverified claim'],
    [/\bbrainwash\b/gi, 'influence'],
    [/\bindoctrinate\b/gi, 'educate one-sidedly'],
    [/\bnever\b/gi, 'rarely'],
    [/\balways\b/gi, 'often'],
    [/\beveryone\b/gi, 'many people'],
    [/\bnobody\b/gi, 'few people'],
    [/\bdestroy\b/gi, 'significantly impact'],
    [/\belites\b/gi, 'decision-makers'],
    [/\bdeep state\b/gi, 'government institutions'],
  ];

  let result = text;
  replacements.forEach(([pattern, replacement]) => {
    result = result.replace(pattern, replacement);
  });

  if (result.length < 200) {
    result = 'Based on available information: ' + result;
  }

  return result;
}

// ─── Exported Utilities (used by ScoreCard.jsx) ─────────────────────────────

export function getRiskLabel(score) {
  if (score >= 75) return { label: 'High Manipulation Risk', color: 'text-risk-red' };
  if (score >= 50) return { label: 'Moderate Manipulation Risk', color: 'text-accent-orange' };
  if (score >= 25) return { label: 'Low Manipulation Risk', color: 'text-yellow-400' };
  return { label: 'Minimal Manipulation Detected', color: 'text-risk-green' };
}

export function getRiskColor(score) {
  if (score >= 75) return '#ef4444';
  if (score >= 50) return '#f97316';
  if (score >= 25) return '#eab308';
  return '#22c55e';
}
