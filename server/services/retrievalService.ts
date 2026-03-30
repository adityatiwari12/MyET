/**
 * Retrieval Service — Semantic Search Engine
 * Finds the most relevant news chunks for a given user + optional query
 * Uses in-memory cosine similarity against stored embeddings
 */

import { db } from '../db';
import { articles, articleChunks, userBehavior, users } from '../db/schema';
import { eq, desc, isNotNull, sql, and, gte } from 'drizzle-orm';
import { embedText, cosineSimilarity } from './embeddingService';
import { cacheService } from './cacheService';

export interface RetrievedChunk {
  chunkId: number;
  articleId: number;
  articleTitle: string;
  articleUrl: string;
  source: string;
  content: string;
  category: string | null;
  sentiment: string | null;
  impactTags: string[];
  publishedAt: Date | null;
  score: number;
}

export interface UserContext {
  userId: number;
  interests: string[];
  language: string;
  city?: string;
}

/**
 * Main retrieval function
 * Returns top-k relevant chunks for a user
 */
export async function retrieveForUser(
  userCtx: UserContext,
  query?: string,
  limit = 20,
  recencyHours = 48
): Promise<RetrievedChunk[]> {
  const cacheKey = cacheService.queryKey(
    userCtx.userId,
    query || userCtx.interests.join(',')
  );

  const cached = cacheService.getQuery(cacheKey);
  if (cached) return cached;

  // 1. Build query embedding if we have a query, otherwise use interest keywords
  const queryText = query || userCtx.interests.slice(0, 5).join(', ');
  
  let queryEmbedding: number[] = [];
  try {
    queryEmbedding = await embedText(queryText);
  } catch (err) {
    console.warn('[Retrieval] Could not generate query embedding, using keyword fallback');
  }

  // 2. Fetch recent enriched articles with their chunks
  const cutoffTime = new Date(Date.now() - recencyHours * 60 * 60 * 1000);

  const recentArticles = await db.select({
    id: articles.id,
    title: articles.title,
    url: articles.url,
    source: articles.source,
    category: articles.category,
    sentiment: articles.sentiment,
    impactTags: articles.impactTags,
    entities: articles.entities,
    publishedAt: articles.publishedAt,
    summary: articles.summary,
    rawText: articles.rawText,
  })
  .from(articles)
  .where(
    and(
      isNotNull(articles.enrichedAt),
      gte(articles.createdAt, cutoffTime)
    )
  )
  .orderBy(desc(articles.createdAt))
  .limit(100); // Candidate pool

  if (recentArticles.length === 0) {
    // Fallback: return latest articles without recency filter
    const fallback = await db.select({
      id: articles.id,
      title: articles.title,
      url: articles.url,
      source: articles.source,
      category: articles.category,
      sentiment: articles.sentiment,
      impactTags: articles.impactTags,
      entities: articles.entities,
      publishedAt: articles.publishedAt,
      summary: articles.summary,
      rawText: articles.rawText,
    })
    .from(articles)
    // removed strict enrichment barrier so we can answer from raw text if Gemini quota fails
    .orderBy(desc(articles.createdAt))
    .limit(50);

    return scoreAndReturn(fallback, queryEmbedding, userCtx, limit, cacheKey);
  }

  return scoreAndReturn(recentArticles, queryEmbedding, userCtx, limit, cacheKey);
}

async function scoreAndReturn(
  candidateArticles: any[],
  queryEmbedding: number[],
  userCtx: UserContext,
  limit: number,
  cacheKey: string
): Promise<RetrievedChunk[]> {
  // 3. Fetch one representative chunk per article for scoring
  const articleIds = candidateArticles.map(a => a.id);
  
  // Get first chunks only for scoring (most representative)
  const chunks: any[] = [];
  for (const id of articleIds.slice(0, 50)) {
    const [chunk] = await db.select()
      .from(articleChunks)
      .where(and(eq(articleChunks.articleId, id), eq(articleChunks.chunkIndex, 0)))
      .limit(1);
    if (chunk) chunks.push(chunk);
  }

  // 4. Score each article
  const scored: Array<{ article: any; chunk: any; score: number }> = [];

  for (const article of candidateArticles) {
    let score = 0;

    // Interest overlap score (0–3)
    const interestScore = userCtx.interests.some(interest => {
      const lower = interest.toLowerCase();
      // Added article.rawText to interest matching
      return (
        article.title?.toLowerCase().includes(lower) ||
        article.rawText?.toLowerCase().includes(lower) ||
        article.entities?.some((e: string) => e.toLowerCase().includes(lower)) ||
        article.impactTags?.some((t: string) => t.toLowerCase().includes(lower))
      );
    }) ? 3 : 0;

    score += interestScore;

    // Category relevance score (0–2)
    const categoryInterestMap: Record<string, string[]> = {
      markets: ['NSE/BSE', 'Nifty IT', 'IPO Market'],
      policy: ['RBI Policy', 'GST Trends', 'Indian Macro'],
      startups: ['Startup India', 'Indian Fintech'],
      'personal-finance': ['Wealth Management'],
    };
    if (article.category && categoryInterestMap[article.category]) {
      const overlap = categoryInterestMap[article.category].some(c =>
        userCtx.interests.includes(c)
      );
      if (overlap) score += 2;
    }

    // Semantic similarity score (0–5) — if we have query embedding and chunk embedding
    const chunk = chunks.find(c => c.articleId === article.id);
    if (chunk && chunk.embeddingJson && queryEmbedding.length > 0) {
      try {
        const chunkEmbedding = JSON.parse(chunk.embeddingJson) as number[];
        const similarity = cosineSimilarity(queryEmbedding, chunkEmbedding);
        score += similarity * 5; // scale to 0-5
      } catch {
        // Ignore embedding parse errors
      }
    }

    // Recency boost (newer articles score higher)
    if (article.publishedAt) {
      const ageHours = (Date.now() - new Date(article.publishedAt).getTime()) / (1000 * 60 * 60);
      const recencyBoost = Math.max(0, 2 - ageHours / 24); // up to +2 for very recent
      score += recencyBoost;
    }

    scored.push({ article, chunk, score });
  }

  // 5. Sort by score and return top results
  scored.sort((a, b) => b.score - a.score);
  const topResults = scored.slice(0, limit);

  const results: RetrievedChunk[] = topResults.map(({ article, chunk, score }) => ({
    chunkId: chunk?.id || 0,
    articleId: article.id,
    articleTitle: article.title,
    articleUrl: article.url,
    source: article.source || 'Unknown',
    content: chunk?.content || article.summary || article.rawText?.slice(0, 1000) || article.title,
    category: article.category,
    sentiment: article.sentiment,
    impactTags: article.impactTags || [],
    publishedAt: article.publishedAt,
    score,
  }));

  cacheService.setQuery(cacheKey, results);
  return results;
}

/**
 * Get user context from DB
 */
export async function getUserContext(userId: number): Promise<UserContext | null> {
  const [user] = await db.select({
    id: users.id,
    interests: users.interests,
    language: users.language,
    city: users.city,
  }).from(users).where(eq(users.id, userId));

  if (!user) return null;

  return {
    userId: user.id,
    interests: user.interests || [],
    language: user.language || 'en',
    city: user.city || undefined,
  };
}
