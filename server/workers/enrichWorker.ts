/**
 * Enrichment Worker
 * Calls Gemini Flash to extract structured intelligence from each article
 * Runs ONCE per article — results are cached in the DB
 */

import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';
dotenv.config();

import { db } from '../db';
import { articles } from '../db/schema';
import { eq, isNull, lte, sql } from 'drizzle-orm';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

interface ArticleEnrichment {
  summary: string;
  summaryHi: string;
  insights: string[];
  insightsHi: string[];
  entities: string[];
  category: 'markets' | 'policy' | 'startups' | 'personal-finance' | 'macro' | 'commodities';
  sentiment: 'positive' | 'negative' | 'neutral';
  impactTags: string[];
  mattersToYou: string;
  readTime: string;
}

const ENRICHMENT_PROMPT = (title: string, text: string) => `
You are MyET's intelligence engine analyzing Indian financial news. Analyze this article and return ONLY valid JSON.

Article Title: ${title}
Article Text: ${text.slice(0, 3000)}

Return this exact JSON structure:
{
  "summary": "2-3 sentence summary. Be specific, not generic. Include numbers/percentages where present.",
  "summaryHi": "Hindi explanation (NOT word-for-word translation). Explain in simple Hindi for Indian retail investor. 2-3 sentences.",
  "insights": [
    "Specific data point or fact (include numbers)",
    "Market implication or cause-effect",
    "What experts/analysts say or predict",
    "Secondary impact on related sectors"
  ],
  "insightsHi": [
    "Hindi insight 1 - contextual explanation for retail investor",
    "Hindi insight 2",
    "Hindi insight 3"
  ],
  "entities": ["entity1", "entity2"],
  "category": "markets|policy|startups|personal-finance|macro|commodities",
  "sentiment": "positive|negative|neutral",
  "impactTags": ["RBI", "EMI", "stocks", "SIP", "startup", "inflation", "rupee", "gold"],
  "mattersToYou": "One sentence: why a retail Indian investor should care. Be direct and actionable.",
  "readTime": "X MIN READ"
}

Rules:
- insights must be 3-5 items, each specific and data-driven
- insightsHi must be 3-4 items, contextual Hindi (not literal translation)
- entities: named companies, indices, govt bodies, policies (e.g., "RBI", "NIFTY 50", "SEBI", "Zomato")
- impactTags: from this list only: stocks, SIPs, startups, inflation, EMI, rupee, gold, bonds, real-estate, crypto, budget, tax
- category: pick exactly one from the enum options
- DO NOT include markdown, only raw JSON
`;

/**
 * Enrich a single article with LLM-generated intelligence
 */
export async function enrichArticle(articleId: number, retries = 2): Promise<void> {
  const [article] = await db.select().from(articles).where(eq(articles.id, articleId));
  if (!article || article.enrichedAt) return; // skip if already enriched

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const prompt = ENRICHMENT_PROMPT(article.title, article.rawText || '');

      const result = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          temperature: 0.2, // low temp for consistent structured output
          maxOutputTokens: 1500,
        },
      });

      const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      // Extract JSON from response (handle code blocks)
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON found in enrichment response');

      const enrichment: ArticleEnrichment = JSON.parse(jsonMatch[0]);

      // Store enrichment results
      await db.update(articles)
        .set({
          summary: enrichment.summary || null,
          summaryHi: enrichment.summaryHi || null,
          insights: enrichment.insights || [],
          insightsHi: enrichment.insightsHi || [],
          entities: enrichment.entities || [],
          category: enrichment.category || null,
          sentiment: enrichment.sentiment || null,
          impactTags: enrichment.impactTags || [],
          mattersToYou: enrichment.mattersToYou || null,
          readTime: enrichment.readTime || '3 MIN READ',
          enrichedAt: new Date(),
        })
        .where(eq(articles.id, articleId));

      console.log(`[Enrich] ✓ Article ${articleId}: ${article.title.slice(0, 50)}...`);
      return;

    } catch (err: any) {
      console.error(`[Enrich] Attempt ${attempt + 1} failed for article ${articleId}:`, err.message);
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, 1000 * (attempt + 1))); // exponential backoff
      } else {
        // Increment retry count to track persistent failures
        await db.update(articles)
          .set({ retryCount: sql`${articles.retryCount} + 1` })
          .where(eq(articles.id, articleId));
      }
    }
  }
}

/**
 * Process batch of unenriched articles
 * Called periodically to catch any articles missed during ingestion
 */
export async function enrichPendingArticles(limit = 10): Promise<void> {
  const pending = await db.select({ id: articles.id, title: articles.title })
    .from(articles)
    .where(isNull(articles.enrichedAt))
    .limit(limit);

  if (pending.length === 0) return;
  
  console.log(`[Enrich] Processing ${pending.length} pending articles...`);

  for (const article of pending) {
    await enrichArticle(article.id).catch(err =>
      console.error(`[Enrich] Failed ${article.id}: ${err.message}`)
    );
    await new Promise(r => setTimeout(r, 500)); // rate limiting
  }
}
