import { runGeminiAnalysis } from '../services/geminiAnalyzer.js';
import { normalizeResponse } from '../utils/scoreNormalizer.js';

/**
 * POST /api/analyze
 * Accepts { text: string } and returns a full manipulation analysis.
 */
export async function handleAnalyze(req, res) {
  try {
    const { text } = req.body;

    // ── Input validation ──────────────────────────────────────
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid "text" field' });
    }

    const trimmed = text.trim();

    if (trimmed.length < 10) {
      return res.status(400).json({ error: 'Text must be at least 10 characters long' });
    }

    if (trimmed.length > 5000) {
      return res.status(400).json({ error: 'Text must not exceed 5000 characters' });
    }

    // ── Call Gemini AI ────────────────────────────────────────
    console.log(`[Analyze] Incoming request — ${trimmed.length} chars`);
    const rawResult = await runGeminiAnalysis(trimmed);

    // ── Normalize & validate the response to match frontend ──
    const normalized = normalizeResponse(rawResult, trimmed);

    console.log(`[Analyze] Score: ${normalized.score} — Techniques: ${normalized.techniques.length}`);
    return res.json(normalized);

  } catch (err) {
    console.error('[Analyze] Error:', err.message);
    return res.status(500).json({ error: 'Analysis failed' });
  }
}
