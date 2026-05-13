import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import analyzeRoutes from './routes/analyze.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '50kb' }));

// ─── Routes ─────────────────────────────────────────────────
app.use('/api/analyze', analyzeRoutes);

// ─── Health Check ───────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', engine: 'gemini-1.5-flash', timestamp: new Date().toISOString() });
});

// ─── Start ──────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\nTruthLens API running on http://localhost:${PORT}`);
  console.log(`POST /api/analyze`);
  console.log(`GET  /api/health\n`);
});
