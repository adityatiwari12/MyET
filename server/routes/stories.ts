import express from 'express';
import { db } from '../db';
import { stories, users } from '../db/schema';
import { desc, eq, inArray, sql } from 'drizzle-orm';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get personalized feed
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    
    // Get user's interests for personalization
    const [user] = await db.select({ interests: users.interests }).from(users).where(eq(users.id, req.userId!));
    
    const userInterests: string[] = user?.interests || [];

    // The logic below would be more complex in production (ranking model)
    // For now, if they have interests, try to match categories, otherwise return latest
    
    let feed;
    
    if (userInterests.length > 0) {
      // Very basic personalization: sort by whether tags overlap with user interests
      // In PostgreSQL we could use array overlap, but Drizzle array operations are sometimes tricky
      // We'll just fetch recent stories and let the order be somewhat random or matched
      feed = await db.select().from(stories)
        .orderBy(desc(stories.publishedAt))
        .limit(limit)
        .offset(offset);
        
      // In-memory rudimentary sort for personalization
      feed.sort((a, b) => {
        const aTags = a.tags || [];
        const bTags = b.tags || [];
        const aMatch = aTags.some(t => userInterests.includes(t)) ? 1 : 0;
        const bMatch = bTags.some(t => userInterests.includes(t)) ? 1 : 0;
        return bMatch - aMatch;
      });
    } else {
      feed = await db.select().from(stories)
        .orderBy(desc(stories.publishedAt))
        .limit(limit)
        .offset(offset);
    }
    
    res.status(200).json({
      stories: feed,
      hasMore: feed.length === limit,
      nextOffset: offset + feed.length
    });
  } catch (error) {
    console.error('Error fetching stories:', error);
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
});

// Get single story
router.get('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const storyId = parseInt(req.params.id);
    if (isNaN(storyId)) {
      return res.status(400).json({ error: 'Invalid story ID' });
    }

    const [story] = await db.select().from(stories).where(eq(stories.id, storyId));
    
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }
    
    res.status(200).json(story);
  } catch (error) {
    console.error('Error fetching story:', error);
    res.status(500).json({ error: 'Failed to fetch story' });
  }
});

export default router;
