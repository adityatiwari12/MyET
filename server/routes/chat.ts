import express from 'express';
import { db } from '../db';
import { chatSessions, chatMessages } from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get recent chat history
router.get('/history', authMiddleware, async (req: AuthRequest, res) => {
  try {
    // Find the most recent session for this user
    const [latestSession] = await db.select()
      .from(chatSessions)
      .where(eq(chatSessions.userId, req.userId!))
      .orderBy(desc(chatSessions.updatedAt))
      .limit(1);

    let session = latestSession;
    if (!session) {
      const [newSession] = await db.insert(chatSessions).values({
        userId: req.userId!
      }).returning();
      session = newSession;
    }

    // Get messages for this session
    const messages = await db.select()
      .from(chatMessages)
      .where(eq(chatMessages.sessionId, session.id))
      .orderBy(chatMessages.createdAt);

    res.status(200).json({
      sessionId: session.id,
      messages: messages.map(m => ({ role: m.role, text: m.content, timestamp: m.createdAt }))
    });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

// Clear chat history (create new session)
router.post('/clear', authMiddleware, async (req: AuthRequest, res) => {
  try {
    // Create new empty session
    const [newSession] = await db.insert(chatSessions).values({
      userId: req.userId!
    }).returning();
    
    res.status(201).json({ sessionId: newSession.id, messages: [] });
  } catch (error) {
    console.error('Error clearing chat history:', error);
    res.status(500).json({ error: 'Failed to clear chat' });
  }
});

export default router;
