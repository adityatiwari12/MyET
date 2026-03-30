/**
 * Feed Route — Serves personalized article feed
 * Primary: RAW articles with extracted intelligence (immediate, no LLM wait)
 * Enhanced: LLM-enriched narratives when available
 */

import express from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { getUserContext } from '../services/retrievalService';
import { getArticlesForFeed, RawStory } from '../services/storyBuilder';
import { db } from '../db';
import { articles, users } from '../db/schema';
import { desc, isNotNull, eq } from 'drizzle-orm';

const router = express.Router();

// GET /api/feed  — personalized article feed
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;

    // Get user interests
    const [user] = await db.select({ interests: users.interests }).from(users).where(eq(users.id, userId));
    const interests = user?.interests || [];

    // Fetch articles with story builder (works with raw+enriched)
    const stories = await getArticlesForFeed(interests, 20, 72);

    if (stories.length === 0) {
      return res.status(200).json({
        narratives: [],
        message: 'No articles yet. Fetching live news now — refresh in 30 seconds.',
        isWarmingUp: true,
      });
    }

    // Convert to narrative format the frontend expects
    const narratives = stories.map(story => ({
      id: `story_${story.id}`,
      title: story.title,
      narrative: story.summary,
      insights: story.insights,
      insightsHi: story.insights,   // Hindi will be added once enriched
      mattersToYou: story.mattersToYou,
      mattersToYouHi: story.mattersToYou,
      watchNext: story.enriched
        ? 'Check back for the latest updates on this developing story.'
        : 'This story is being analyzed — refresh for AI-enhanced insights.',
      category: story.category,
      sentiment: story.sentiment,
      sources: [{
        title: story.title,
        url: story.url,
        source: story.source,
      }],
      articleIds: [story.id],
      generatedAt: new Date().toISOString(),
      enriched: story.enriched,
    }));

    return res.status(200).json({
      narratives,
      totalArticles: stories.length,
      generatedAt: new Date().toISOString(),
      isWarmingUp: false,
    });
  } catch (err: any) {
    console.error('[Feed] Error:', err.message);
    return res.status(500).json({ error: 'Failed to generate feed', detail: err.message });
  }
});

// GET /api/feed/trending — no auth, returns latest enriched or raw articles
router.get('/trending', async (req, res) => {
  try {
    const stories = await getArticlesForFeed([], 10, 72);

    return res.status(200).json({
      articles: stories.map(s => ({
        id: s.id,
        title: s.title,
        category: s.category,
        insights: s.insights,
        summary: s.summary,
        imageUrl: s.imageUrl,
        source: s.source,
        publishedAt: s.publishedAt,
        impactTags: s.impactTags,
        sentiment: s.sentiment,
      })),
      generatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[Feed/Trending] Error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch trending articles' });
  }
});

export default router;
