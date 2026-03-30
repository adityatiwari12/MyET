/**
 * Lightweight Story Builder
 * Converts raw articles (no LLM enrichment needed) into story cards
 * This ensures the feed always has content, even before enrichment
 */

import { db } from '../db';
import { articles } from '../db/schema';
import { desc, isNotNull, isNull, count, or } from 'drizzle-orm';

export interface RawStory {
  id: number;
  title: string;
  summary: string;
  insights: string[];
  mattersToYou: string;
  category: string;
  sentiment: string;
  source: string;
  url: string;
  imageUrl: string | null;
  impactTags: string[];
  readTime: string;
  publishedAt: string | null;
  enriched: boolean;
}

/**
 * Extract key sentences from raw text (no LLM needed)
 * Returns up to 3 meaningful sentences as "insights"
 */
function extractInsights(text: string, title: string): string[] {
  if (!text) return [title];
  
  // Split into sentences
  const sentences = text
    .replace(/\n+/g, ' ')
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 40 && s.length < 300);
  
  // Remove sentences that are just the title
  const filtered = sentences.filter(s => 
    !s.toLowerCase().includes(title.toLowerCase().slice(0, 20))
  );
  
  return (filtered.length > 0 ? filtered : sentences).slice(0, 4);
}

/**
 * Generate a simple "matters to you" from article content
 */
function extractMattersToYou(text: string, category: string | null): string {
  const cat = category || 'financial';
  const mattersMap: Record<string, string> = {
    markets: 'This may directly impact your stock portfolio and investment decisions.',
    policy: 'This regulatory change could affect your savings, taxes, and investment options.',
    startups: 'This signals changing dynamics in the Indian startup and venture ecosystem.',
    'personal-finance': 'This could directly impact your budget, EMIs, or financial planning.',
    macro: 'This macroeconomic shift affects the overall investment climate in India.',
    commodities: 'This commodity movement could affect your inflation expectations and costs.',
  };
  
  return mattersMap[cat] || 'This development is relevant to your financial decisions as an Indian investor.';
}

/**
 * Detect category from title + content
 */
function detectCategory(title: string, text: string): string {
  const combined = (title + ' ' + text.slice(0, 500)).toLowerCase();
  
  if (/nifty|sensex|bse|nse|stock|share|equity|market|ipo|trading/i.test(combined)) return 'markets';
  if (/rbi|sebi|budget|policy|rate|repo|regulation|government|ministry/i.test(combined)) return 'policy';
  if (/startup|unicorn|funding|venture|series[- ][abc]/i.test(combined)) return 'startups';
  if (/emi|sip|mutual fund|insurance|loan|tax|income|salary|fd |ppf/i.test(combined)) return 'personal-finance';
  if (/gold|silver|oil|crude|commodit/i.test(combined)) return 'commodities';
  if (/gdp|inflation|cpi|wpi|rupee|dollar|forex|macro/i.test(combined)) return 'macro';
  
  return 'markets'; // default
}

/**
 * Detect sentiment from title
 */
function detectSentiment(title: string): 'positive' | 'negative' | 'neutral' {
  const t = title.toLowerCase();
  if (/rise|gain|surges|rally|up|high|beat|boost|growth|record|strong/i.test(t)) return 'positive';
  if (/fall|drop|crash|low|weak|down|loss|decline|concern|worry|risk/i.test(t)) return 'negative';
  return 'neutral';
}

/**
 * Detect impact tags from title + text
 */
function detectImpactTags(title: string, text: string): string[] {
  const combined = (title + ' ' + text.slice(0, 300)).toLowerCase();
  const allTags: Record<string, RegExp> = {
    stocks: /stock|share|equity|nifty|sensex/i,
    SIPs: /sip|mutual fund|mf |fund/i,
    inflation: /inflation|cpi|price rise|cost/i,
    EMI: /emi|loan|home loan|car loan|interest rate/i,
    rupee: /rupee|inr|forex|dollar/i,
    gold: /gold|silver/i,
    startups: /startup|funding|valuati/i,
    tax: /tax|gst|income tax/i,
    bonds: /bond|gilt|g-sec|debt/i,
    'real-estate': /real estate|property|housing|realty/i,
  };
  
  return Object.entries(allTags)
    .filter(([, regex]) => regex.test(combined))
    .map(([tag]) => tag)
    .slice(0, 4);
}

/**
 * Get articles for the feed — prefers enriched, falls back to raw
 * This ensures the feed always has content
 */
export async function getArticlesForFeed(
  interests: string[] = [],
  limit = 20,
  _hoursBack = 72  // kept for API compat, no longer used as hard filter
): Promise<RawStory[]> {
  // Fetch the most recent articles (both enriched and raw)
  // Sort by publishedAt first, then createdAt as fallback
  const rows = await db.select().from(articles)
    .orderBy(desc(articles.createdAt))
    .limit(limit * 4); // Fetch extra to allow scoring

  if (rows.length === 0) {
    // Try any articles at all
    const any = await db.select().from(articles)
      .orderBy(desc(articles.createdAt))
      .limit(limit);
    return buildStories(any, interests, limit);
  }

  return buildStories(rows, interests, limit);
}

function buildStories(rows: any[], interests: string[], limit: number): RawStory[] {
  // Score articles by interest relevance
  const scored = rows.map(article => {
    const combined = ((article.title || '') + ' ' + (article.rawText || '').slice(0, 200)).toLowerCase();
    let score = 0;
    for (const interest of interests) {
      if (combined.includes(interest.toLowerCase().split(' ')[0])) score += 2;
    }
    // Recency boost
    if (article.publishedAt) {
      const ageHours = (Date.now() - new Date(article.publishedAt).getTime()) / 3600000;
      score += Math.max(0, 5 - ageHours / 12);
    }
    if (article.enrichedAt) score += 3; // prefer enriched
    return { article, score };
  });

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(({ article }) => {
    // Use enriched data if available, otherwise extract from raw
    const category = article.category || detectCategory(article.title || '', article.rawText || '');
    const sentiment = article.sentiment || detectSentiment(article.title || '');
    const rawInsights = extractInsights(article.rawText || '', article.title || '');

    return {
      id: article.id,
      title: article.title || 'Financial Update',
      summary: article.summary || article.rawText?.slice(0, 200) || '',
      insights: article.insights?.length > 0 ? article.insights : rawInsights,
      mattersToYou: article.mattersToYou || extractMattersToYou(article.rawText || '', category),
      category,
      sentiment,
      source: article.source || 'Indian Financial News',
      url: article.url || '',
      imageUrl: article.imageUrl,
      impactTags: article.impactTags?.length > 0 ? article.impactTags : detectImpactTags(article.title || '', article.rawText || ''),
      readTime: article.readTime || `${Math.max(1, Math.ceil((article.rawText?.length || 500) / 1200))} MIN READ`,
      publishedAt: article.publishedAt?.toISOString() || null,
      enriched: !!article.enrichedAt,
    };
  });
}
