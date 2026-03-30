import express from 'express';
import { db } from '../db';
import { interactions } from '../db/schema';
import { and, eq } from 'drizzle-orm';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all interactions for current user
router.get('/user', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userInteractions = await db.select().from(interactions).where(eq(interactions.userId, req.userId!));
    res.status(200).json(userInteractions);
  } catch (error) {
    console.error('Error fetching interactions:', error);
    res.status(500).json({ error: 'Failed to fetch interactions' });
  }
});

// Toggle an interaction (like/unlike, save/unsave)
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { storyId, type } = req.body;
    
    if (!storyId || !type) {
      return res.status(400).json({ error: 'Story ID and type are required' });
    }
    
    // Check if interaction already exists
    const [existing] = await db.select()
      .from(interactions)
      .where(and(
        eq(interactions.userId, req.userId!),
        eq(interactions.storyId, storyId),
        eq(interactions.type, type)
      ));
      
    if (existing) {
      // Toggle off (delete)
      await db.delete(interactions).where(eq(interactions.id, existing.id));
      return res.status(200).json({ status: 'removed' });
    } else {
      // Toggle on (insert)
      const [newInteraction] = await db.insert(interactions).values({
        userId: req.userId!,
        storyId,
        type
      }).returning();
      return res.status(201).json({ status: 'added', interaction: newInteraction });
    }
  } catch (error) {
    console.error('Error toggling interaction:', error);
    res.status(500).json({ error: 'Failed to record interaction' });
  }
});

export default router;
