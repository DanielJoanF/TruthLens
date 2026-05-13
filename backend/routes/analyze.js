import { Router } from 'express';
import { handleAnalyze } from '../controllers/analyzeController.js';

const router = Router();

// POST /api/analyze
router.post('/', handleAnalyze);

export default router;
