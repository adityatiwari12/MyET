/**
 * Behavior Tracking Route
 * Tracks user actions to improve personalization
 */

import express from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { db } from '../db';
import { userBehavior } from '../db/schema';

const router = express.Router();

// POST /api/behavior
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { action, articleId, durationSeconds, query, metadata } = req.body;

    const validActions = ['view', 'click', 'read', 'question', 'like', 'share', 'skip'];
    if (!action || !validActions.includes(action)) {
      return res.status(400).json({ error: `Invalid action. Must be one of: ${validActions.join(', ')}` });
    }

    await db.insert(userBehavior).values({
      userId: req.userId!,
      articleId: articleId ? parseInt(articleId) : null,
      action,
      durationSeconds: durationSeconds ? parseInt(durationSeconds) : null,
      query: query || null,
      metadata: metadata || null,
    });

    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error('[Behavior] Error:', err.message);
    return res.status(500).json({ error: 'Failed to record behavior' });
  }
});

export default router;
