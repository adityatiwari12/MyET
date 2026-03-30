/**
 * Narrative Service
 * Synthesizes multiple articles into a single, personalized narrative
 * This is the DIFFERENTIATOR — not a summarizer, but a financial intelligence engine
 */

import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';
dotenv.config();

import { db } from '../db';
import { articles } from '../db/schema';
import { eq, inArray } from 'drizzle-orm';
import { RetrievedChunk, UserContext } from './retrievalService';
import { cacheService, hashString } from './cacheService';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface Narrative {
  id: string;
  title: string;
  narrative: string;
  insights: string[];
  insightsHi?: string[];
  mattersToYou: string;
  mattersToYouHi?: string;
  watchNext: string;
  category: string;
  sentiment: string;
  sources: { title: string; url: string; source: string }[];
  articleIds: number[];
  generatedAt: string;
}

const NARRATIVE_PROMPT = (
  articles: { title: string; summary: string; insights: string[]; entities: string[] }[],
  userCtx: UserContext,
  language: string
) => `
You are MyET — India's smartest financial intelligence engine. NOT a news summarizer.

Your job: Synthesize these ${articles.length} news articles into ONE clear, personalized narrative for this specific user.

USER PROFILE:
- Interests: ${userCtx.interests.join(', ')}
- Location: ${userCtx.city || 'India'}
- Language preference: ${language}

ARTICLES TO SYNTHESIZE:
${articles.map((a, i) => `
[Article ${i + 1}]: ${a.title}
Summary: ${a.summary}
Key Points: ${a.insights?.slice(0, 2).join(' | ')}
Entities: ${a.entities?.join(', ')}
`).join('\n')}

Now create a synthesized narrative. Return ONLY valid JSON:
{
  "title": "A human headline that connects the themes. NOT a news headline. Like 'Why the RBI's pause is both good and bad news for your wallet'",
  "narrative": "2-3 paragraph narrative that CONNECTS the articles, explains cause-effect, and tells the broader story. No generic language. Be specific. Write for a financially aware Indian.",
  "insights": [
    "Data-driven insight 1 — connect multiple articles if possible",
    "Market implication or systemic effect",
    "What this means for retail investors/startups/consumers",
    "Forward-looking signal or risk"
  ],
  "insightsHi": [
    "Hindi insight 1 — contextual for Indian retail investor (NOT translation)",
    "Hindi insight 2",
    "Hindi insight 3"
  ],
  "mattersToYou": "1-2 sentences: DIRECTLY connects to this user's interests (${userCtx.interests.slice(0, 3).join(', ')}). Be specific and actionable.",
  "mattersToYouHi": "Same but in Hindi. Contextual, not literal.",
  "watchNext": "What signal or event should the user watch for next? 1 sentence.",
  "category": "markets|policy|startups|personal-finance|macro",
  "sentiment": "positive|negative|neutral|mixed"
}

Critical rules:
- DO NOT just summarize individual articles. SYNTHESIZE them into ONE story.
- Find the connecting thread between articles.
- Use specific numbers, entities, percentages from the articles.
- mattersToYou MUST reference the user's actual interests listed above.
`;

/**
 * Generate a personalized narrative from retrieved chunks
 */
export async function generateNarrative(
  chunks: RetrievedChunk[],
  userCtx: UserContext,
  language = 'en'
): Promise<Narrative | null> {
  if (chunks.length === 0) return null;

  // Get unique articles (max 6 for narrative synthesis)
  const uniqueArticleIds = [...new Set(chunks.map(c => c.articleId))].slice(0, 6);

  // Cache check
  const cacheKey = `narrative:${userCtx.userId}:${hashString(uniqueArticleIds.sort().join(',') + userCtx.interests.join(','))}`;
  const cached = cacheService.getNarrative(cacheKey);
  if (cached) return cached;

  // Fetch full article data for synthesis
  const fullArticles = await db.select({
    id: articles.id,
    title: articles.title,
    url: articles.url,
    source: articles.source,
    summary: articles.summary,
    insights: articles.insights,
    entities: articles.entities,
    category: articles.category,
    sentiment: articles.sentiment,
  })
  .from(articles)
  .where(inArray(articles.id, uniqueArticleIds));

  if (fullArticles.length === 0) return null;

  // Deduplicate by category — prefer diverse sources
  const articlesForPrompt = fullArticles
    .filter(a => a.summary) // only enriched articles
    .slice(0, 5);

  if (articlesForPrompt.length === 0) {
    // Fallback: return a simple narrative from chunk content
    return buildFallbackNarrative(chunks, userCtx);
  }

  try {
    const prompt = NARRATIVE_PROMPT(
      articlesForPrompt.map(a => ({
        title: a.title,
        summary: a.summary || '',
        insights: a.insights || [],
        entities: a.entities || [],
      })),
      userCtx,
      language
    );

    const result = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        temperature: 0.4,
        maxOutputTokens: 2000,
      },
    });

    const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in narrative response');

    const parsed = JSON.parse(jsonMatch[0]);
    
    const narrative: Narrative = {
      id: cacheKey,
      title: parsed.title || 'Today\'s Financial Intelligence',
      narrative: parsed.narrative || '',
      insights: parsed.insights || [],
      insightsHi: parsed.insightsHi || [],
      mattersToYou: parsed.mattersToYou || '',
      mattersToYouHi: parsed.mattersToYouHi || '',
      watchNext: parsed.watchNext || '',
      category: parsed.category || 'markets',
      sentiment: parsed.sentiment || 'neutral',
      sources: fullArticles.map(a => ({
        title: a.title,
        url: a.url,
        source: a.source || 'Unknown',
      })),
      articleIds: uniqueArticleIds,
      generatedAt: new Date().toISOString(),
    };

    cacheService.setNarrative(cacheKey, narrative);
    return narrative;

  } catch (err: any) {
    console.error('[Narrative] Generation failed:', err.message);
    return buildFallbackNarrative(chunks, userCtx);
  }
}

/**
 * Fallback narrative when LLM generation fails or no enriched articles
 */
function buildFallbackNarrative(chunks: RetrievedChunk[], userCtx: UserContext): Narrative {
  const topChunks = chunks.slice(0, 4);
  const uniqueArticles = [...new Map(chunks.map(c => [c.articleId, c])).values()].slice(0, 5);

  return {
    id: `fallback_${Date.now()}`,
    title: 'Latest Financial News for You',
    narrative: topChunks.map(c => c.content).join('\n\n'),
    insights: topChunks.map(c => c.articleTitle),
    mattersToYou: `Based on your interests in ${userCtx.interests.slice(0, 2).join(' and ')}, these stories are most relevant to you today.`,
    watchNext: 'Stay tuned for more updates on these developing stories.',
    category: 'markets',
    sentiment: 'neutral',
    sources: uniqueArticles.map(a => ({
      title: a.articleTitle,
      url: a.articleUrl,
      source: a.source,
    })),
    articleIds: uniqueArticles.map(a => a.articleId),
    generatedAt: new Date().toISOString(),
  };
}
