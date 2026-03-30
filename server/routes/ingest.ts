/**
 * Ingest Route — Admin controls for the ingestion pipeline
 */

import express from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { runIngestion } from '../workers/ingestWorker';
import { enrichPendingArticles } from '../workers/enrichWorker';
import { db } from '../db';
import { articles, articleChunks } from '../db/schema';
import { isNull, isNotNull, count } from 'drizzle-orm';
import { cacheService } from '../services/cacheService';

const router = express.Router();

let lastIngestionResult: any = null;
let isRunning = false;

// GET /api/ingest/status
router.get('/status', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const [totalArticles] = await db.select({ count: count() }).from(articles);
    const [enrichedArticles] = await db.select({ count: count() }).from(articles).where(isNotNull(articles.enrichedAt));
    const [pendingArticles] = await db.select({ count: count() }).from(articles).where(isNull(articles.enrichedAt));
    const [totalChunks] = await db.select({ count: count() }).from(articleChunks);

    return res.status(200).json({
      status: isRunning ? 'running' : 'idle',
      articles: {
        total: totalArticles.count,
        enriched: enrichedArticles.count,
        pending: pendingArticles.count,
      },
      chunks: totalChunks.count,
      cache: cacheService.stats(),
      lastIngestion: lastIngestionResult,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/ingest/trigger — manual trigger
router.post('/trigger', authMiddleware, async (req: AuthRequest, res) => {
  if (isRunning) {
    return res.status(429).json({ error: 'Ingestion already in progress' });
  }

  // Non-blocking — return immediately and run in background
  res.status(202).json({ message: 'Ingestion triggered' });

  isRunning = true;
  try {
    lastIngestionResult = await runIngestion();
    console.log('[Ingest] Manual trigger complete:', lastIngestionResult);
  } catch (err: any) {
    console.error('[Ingest] Manual trigger error:', err.message);
  } finally {
    isRunning = false;
  }
});

// POST /api/ingest/enrich — trigger enrichment of pending articles
router.post('/enrich', authMiddleware, async (req: AuthRequest, res) => {
  const limit = parseInt(req.body?.limit) || 10;
  res.status(202).json({ message: `Enrichment triggered for up to ${limit} articles` });
  
  enrichPendingArticles(limit).catch(err =>
    console.error('[Ingest] Enrichment error:', err.message)
  );
});

export default router;
