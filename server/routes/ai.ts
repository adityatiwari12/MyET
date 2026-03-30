import express from 'express';
import { generateTTS, executeSearchGrounding, performDeepAnalysis } from '../services/geminiService';
import { db } from '../db';
import { chatMessages, chatSessions } from '../db/schema';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { eq, desc } from 'drizzle-orm';
import { ragChat, ChatMessage } from '../services/ragChatService';
import { getUserContext } from '../services/retrievalService';

const router = express.Router();

// RAG-powered Chat Endpoint
router.post('/chat', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || !sessionId) {
      return res.status(400).json({ error: 'Message and sessionId are required' });
    }

    // Save user message
    await db.insert(chatMessages).values({
      sessionId,
      role: 'user',
      content: message,
    });

    // Get conversation history for multi-turn context
    const history = await db.select()
      .from(chatMessages)
      .where(eq(chatMessages.sessionId, sessionId))
      .orderBy(desc(chatMessages.createdAt))
      .limit(10);

    const conversationHistory: ChatMessage[] = history.reverse().map(m => ({
      role: m.role as 'user' | 'model',
      content: m.content,
    }));

    // Get user context for personalization
    const userCtx = await getUserContext(req.userId!);
    if (!userCtx) return res.status(404).json({ error: 'User not found' });

    // RAG-powered response
    const ragResponse = await ragChat(
      sessionId,
      req.userId!,
      userCtx,
      message,
      conversationHistory.slice(0, -1) // exclude the just-added user message
    );

    // Save AI response
    await db.insert(chatMessages).values({
      sessionId,
      role: 'model',
      content: ragResponse.answer,
    });

    return res.status(200).json({
      reply: ragResponse.answer,
      insights: ragResponse.insights,
      sources: ragResponse.sources,
      suggestedFollowUps: ragResponse.suggestedFollowUps,
    });
  } catch (error: any) {
    console.error('AI Chat Error:', error.message);
    return res.status(500).json({ error: 'Failed to process AI chat' });
  }
});

// Text-to-Speech Endpoint
router.post('/tts', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });

    const audioDataUrl = await generateTTS(text);
    res.status(200).json({ audioDataUrl });
  } catch (error) {
    console.error('TTS Error:', error);
    res.status(500).json({ error: 'Failed to generate speech' });
  }
});

// Transcribe audio (placeholder — handled by frontend)
router.post('/transcribe', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { audioBase64 } = req.body;
    if (!audioBase64) return res.status(400).json({ error: 'Audio data is required' });
    // Return placeholder — actual STT handled client-side  
    return res.status(200).json({ text: '' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
});

// Search Grounding Endpoint
router.post('/search', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: 'Query is required' });

    const answer = await executeSearchGrounding(query);
    res.status(200).json({ answer });
  } catch (error) {
    console.error('Search Grounding Error:', error);
    res.status(500).json({ error: 'Failed to execute search' });
  }
});

// Summarize/Deep Analysis Endpoint
router.post('/summarize', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    const analysis = await performDeepAnalysis(prompt);
    res.status(200).json({ analysis });
  } catch (error) {
    console.error('Summarize Error:', error);
    res.status(500).json({ error: 'Failed to generate analysis' });
  }
});

export default router;
