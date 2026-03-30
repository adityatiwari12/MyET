import express from 'express';
import { db } from '../db';
import { users, interactions, stories } from '../db/schema';
import { eq, sql } from 'drizzle-orm';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

router.put('/profile', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const updateData = req.body;
    
    // Don't allow password updates through this route
    delete updateData.passwordHash;
    delete updateData.id;
    delete updateData.email;
    
    updateData.updatedAt = new Date();

    const [updatedUser] = await db.update(users)
      .set(updateData)
      .where(eq(users.id, req.userId!))
      .returning();

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { passwordHash: _, ...userWithoutPassword } = updatedUser;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

router.get('/stats', authMiddleware, async (req: AuthRequest, res) => {
  try {
    // Get total insights read (based on total 'content_view' or similar interactions, or just a fun metric for now based on read stories)
    const [readsResult] = await db.select({ count: sql<number>`count(*)` })
      .from(interactions)
      .where(sql`${interactions.userId} = ${req.userId!} AND ${interactions.type} IN ('read', 'like', 'save')`);
      
    // For now, if no real interactions, return the demo stats scaled by their actual activity if present
    const readCount = Number(readsResult?.count || 0);
    
    res.status(200).json({
      briefsPerWeek: "12",
      insightsRead: readCount > 0 ? readCount.toString() : "482", 
      networkRank: "Top " + (Math.max(1, 100 - (readCount * 2))) + "%"
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch user stats' });
  }
});

export default router;
