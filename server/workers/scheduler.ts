/**
 * Scheduler
 * Runs ingestion + enrichment on a schedule using node-cron
 * Runs every 8 minutes for ingestion, every 2 minutes for enrichment catch-up
 */

import cron from 'node-cron';
import { runIngestion } from './ingestWorker';
import { enrichPendingArticles } from './enrichWorker';

let isIngesting = false;
let isEnriching = false;

export function startScheduler() {
  console.log('[Scheduler] Starting ingestion scheduler...');

  // Ingestion: every 8 minutes
  cron.schedule('*/8 * * * *', async () => {
    if (isIngesting) {
      console.log('[Scheduler] Ingestion already running, skipping...');
      return;
    }
    isIngesting = true;
    try {
      await runIngestion();
    } catch (err: any) {
      console.error('[Scheduler] Ingestion error:', err.message);
    } finally {
      isIngesting = false;
    }
  });

  // Enrichment catch-up: every 2 minutes (processes any missed articles)
  cron.schedule('*/2 * * * *', async () => {
    if (isEnriching) return;
    isEnriching = true;
    try {
      await enrichPendingArticles(5);
    } catch (err: any) {
      console.error('[Scheduler] Enrichment error:', err.message);
    } finally {
      isEnriching = false;
    }
  });

  // Run ingestion immediately on startup after a short delay
  setTimeout(async () => {
    console.log('[Scheduler] Running initial ingestion...');
    try {
      await runIngestion();
    } catch (err: any) {
      console.error('[Scheduler] Initial ingestion error:', err.message);
    }
  }, 5000); // 5 second delay to let server fully start

  console.log('[Scheduler] ✓ Scheduler started. Ingestion every 8 min, enrichment every 2 min.');
}
