/**
 * News Ingestion Worker v2
 * Primary Source: NewsData.io API (structured Indian financial news with images)
 * Fallback: RSS feeds (Economic Times, Moneycontrol, Business Standard, Hindu Business Line)
 */

import Parser from 'rss-parser';
import * as cheerio from 'cheerio';
import * as crypto from 'crypto';
import * as dotenv from 'dotenv';
dotenv.config();

import { db } from '../db';
import { articles, articleChunks } from '../db/schema';
import { eq, isNull } from 'drizzle-orm';
import { chunkText, embedBatch } from '../services/embeddingService';
import { cacheService } from '../services/cacheService';
import { enrichArticle } from './enrichWorker';

const NEWSDATA_API_KEY = process.env.NEWSDATA_API_KEY;
const parser = new Parser({
  timeout: 12000,
  headers: { 'User-Agent': 'MyET-NewsBot/2.0' },
});

// ─── RSS Fallback Sources ────────────────────────────────────────────────────
const RSS_FEEDS = [
  { name: 'Economic Times Markets',  url: 'https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms' },
  { name: 'Economic Times Economy',  url: 'https://economictimes.indiatimes.com/news/economy/rssfeeds/1373380680.cms' },
  { name: 'Moneycontrol Business',   url: 'https://www.moneycontrol.com/rss/business.xml' },
  { name: 'Business Standard',       url: 'https://www.business-standard.com/rss/finance-22.rss' },
  { name: 'Hindu Business Line',     url: 'https://www.thehindubusinessline.com/feeder/default.rss' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function hashUrl(url: string): string {
  return crypto.createHash('sha256').update(url).digest('hex');
}

function cleanHtml(html: string): string {
  if (!html) return '';
  try {
    const $ = cheerio.load(html);
    $('script, style, nav, footer, header, .ad').remove();
    return $.text().replace(/\s+/g, ' ').trim();
  } catch {
    return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }
}

async function upsertArticle(data: {
  url: string;
  title: string;
  rawText: string;
  source: string;
  imageUrl?: string | null;
  publishedAt?: Date;
  category?: string | null;
}): Promise<'inserted' | 'skipped' | 'error'> {
  const urlHash = hashUrl(data.url);

  const existing = await db.select({ id: articles.id })
    .from(articles)
    .where(eq(articles.urlHash, urlHash))
    .limit(1);

  if (existing.length > 0) return 'skipped';
  if (data.rawText.length < 80) return 'skipped';

  try {
    const [newArticle] = await db.insert(articles).values({
      urlHash,
      url: data.url,
      source: data.source,
      title: data.title,
      rawText: data.rawText,
      imageUrl: data.imageUrl || null,
      category: data.category || null,
      publishedAt: data.publishedAt || new Date(),
    }).returning({ id: articles.id });

    // Chunk + embed (non-blocking)
    chunkAndEmbedArticle(newArticle.id, data.rawText).catch(() => {});

    // Enrich with Gemini (500ms delay to avoid rate limiting)
    setTimeout(() => {
      enrichArticle(newArticle.id).catch(e =>
        console.warn(`[Ingest] Enrichment deferred for ${newArticle.id}: ${e.message}`)
      );
    }, 1000 + Math.random() * 2000);

    console.log(`[Ingest] ✓ ${data.source}: ${data.title.slice(0, 65)}`);
    return 'inserted';
  } catch (err: any) {
    console.error(`[Ingest] DB error: ${err.message.slice(0, 100)}`);
    return 'error';
  }
}

// ─── NewsData.io Fetcher ──────────────────────────────────────────────────────
/**
 * Fetch Indian financial news from NewsData.io API
 * Docs: https://newsdata.io/documentation
 * Returns structured articles with title, description, content, image_url, categories, etc.
 */
async function fetchNewsDataIO(page?: string): Promise<{ articles: any[]; nextPage?: string }> {
  if (!NEWSDATA_API_KEY) {
    console.warn('[NewsData] No API key configured');
    return { articles: [] };
  }

  const params = new URLSearchParams({
    apikey: NEWSDATA_API_KEY,
    country: 'in',
    category: 'business',
    language: 'en',
    size: '50',  // max per call
  });

  if (page) params.set('page', page);

  const url = `https://newsdata.io/api/1/news?${params.toString()}`;
  const cacheKey = `newsdata:${page || 'latest'}`;
  const cached = cacheService.getRss(cacheKey);
  if (cached) return cached;

  try {
    const resp = await fetch(url, {
      headers: { 'User-Agent': 'MyET-NewsBot/2.0' },
      signal: AbortSignal.timeout(15000),
    });

    if (!resp.ok) {
      const body = await resp.text();
      console.warn(`[NewsData] API error ${resp.status}: ${body.slice(0, 200)}`);
      return { articles: [] };
    }

    const data = await resp.json() as {
      status: string;
      results: any[];
      nextPage?: string;
      totalResults?: number;
    };

    if (data.status !== 'success') {
      console.warn('[NewsData] Non-success status:', data.status);
      return { articles: [] };
    }

    const result = { articles: data.results || [], nextPage: data.nextPage };
    cacheService.setRss(cacheKey, result);  // cache for 5 min
    console.log(`[NewsData] Fetched ${result.articles.length} articles (total: ${data.totalResults || '?'})`);
    return result;
  } catch (err: any) {
    console.warn('[NewsData] Fetch error:', err.message);
    return { articles: [] };
  }
}

/**
 * Also fetch Hindi business news for bilingual coverage
 */
async function fetchNewsDataIOHindi(): Promise<{ articles: any[] }> {
  if (!NEWSDATA_API_KEY) return { articles: [] };

  const params = new URLSearchParams({
    apikey: NEWSDATA_API_KEY,
    country: 'in',
    category: 'business',
    language: 'hi',
    size: '25',
  });

  try {
    const resp = await fetch(`https://newsdata.io/api/1/news?${params}`, {
      signal: AbortSignal.timeout(15000),
    });
    const data = await resp.json();
    if (data.status !== 'success') return { articles: [] };
    console.log(`[NewsData/Hindi] Fetched ${(data.results || []).length} articles`);
    return { articles: data.results || [] };
  } catch (err: any) {
    console.warn('[NewsData/Hindi] Fetch error:', err.message);
    return { articles: [] };
  }
}

/**
 * Process a single NewsData.io article into our DB format
 */
async function ingestNewsDataArticle(item: any): Promise<'inserted' | 'skipped' | 'error'> {
  const url = item.link;
  if (!url) return 'skipped';

  // Build rich text: description + full content (NewsData.io provides full content!)
  const description = item.description || '';
  const content = cleanHtml(item.content || '');
  const rawText = `${item.title || ''}\n\n${description}\n\n${content}`.trim();

  // Map NewsData category to our schema
  const categoryMap: Record<string, string> = {
    business: 'markets',
    finance: 'markets',
    economy: 'macro',
    technology: 'startups',
    politics: 'policy',
    top: 'markets',
  };
  const cats = item.category || [];
  const category = categoryMap[cats[0]] || 'markets';

  return upsertArticle({
    url,
    title: item.title || 'Financial Update',
    rawText,
    source: item.source_id || item.source_name || 'NewsData',
    imageUrl: item.image_url || null,
    publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
    category,
  });
}

// ─── RSS Fallback ─────────────────────────────────────────────────────────────
async function fetchFeed(feed: typeof RSS_FEEDS[0]): Promise<any[]> {
  const cacheKey = `rss:${feed.name}`;
  const cached = cacheService.getRss(cacheKey);
  if (cached) return cached;
  try {
    const result = await parser.parseURL(feed.url);
    const items = result.items || [];
    cacheService.setRss(cacheKey, items);
    return items;
  } catch (err: any) {
    console.warn(`[Ingest/RSS] Failed ${feed.name}: ${err.message}`);
    return [];
  }
}

async function ingestRSSArticle(item: any, sourceName: string): Promise<'inserted' | 'skipped' | 'error'> {
  const url = item.link || item.guid;
  if (!url) return 'skipped';

  let rawText = '';
  if (item.content) rawText = cleanHtml(item.content);
  else if (item.contentSnippet) rawText = item.contentSnippet;
  else if (item.summary) rawText = cleanHtml(item.summary);

  const fullText = `${item.title || ''}\n\n${rawText}`.trim();

  return upsertArticle({
    url,
    title: item.title || 'Untitled',
    rawText: fullText,
    source: sourceName,
    imageUrl: item.enclosure?.url || null,
    publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
  });
}

// ─── Main Ingestion Pipeline ──────────────────────────────────────────────────
export async function runIngestion(): Promise<{ ingested: number; skipped: number; errors: number }> {
  console.log('[Ingest] Starting ingestion cycle v2...');
  let ingested = 0, skipped = 0, errors = 0;

  // === PRIMARY: NewsData.io ===
  if (NEWSDATA_API_KEY) {
    // English business news
    const { articles: enArticles } = await fetchNewsDataIO();
    for (const item of enArticles) {
      const result = await ingestNewsDataArticle(item);
      if (result === 'inserted') ingested++;
      else if (result === 'skipped') skipped++;
      else errors++;
    }

    // Hindi business news (bilingual coverage)
    const { articles: hiArticles } = await fetchNewsDataIOHindi();
    for (const item of hiArticles) {
      const result = await ingestNewsDataArticle(item);
      if (result === 'inserted') ingested++;
      else if (result === 'skipped') skipped++;
      else errors++;
    }
  } else {
    console.warn('[Ingest] No NEWSDATA_API_KEY — falling back to RSS only');
  }

  // === FALLBACK/SUPPLEMENT: RSS Feeds ===
  for (const feed of RSS_FEEDS) {
    const items = await fetchFeed(feed);
    if (items.length > 0) console.log(`[Ingest] RSS ${feed.name}: ${items.length} items`);

    for (const item of items) {
      const result = await ingestRSSArticle(item, feed.name);
      if (result === 'inserted') ingested++;
      else if (result === 'skipped') skipped++;
      else errors++;
    }
  }

  console.log(`[Ingest] ✅ Done. New: ${ingested} | Skipped: ${skipped} | Errors: ${errors}`);
  return { ingested, skipped, errors };
}

// ─── Chunk + Embed ────────────────────────────────────────────────────────────
export async function chunkAndEmbedArticle(articleId: number, text: string): Promise<void> {
  const chunks = chunkText(text, 400, 50);
  if (chunks.length === 0) return;

  let embeddings: number[][] = [];
  try {
    embeddings = await embedBatch(chunks, 3);
  } catch {
    embeddings = chunks.map(() => []);
  }

  await db.insert(articleChunks).values(
    chunks.map((content, i) => ({
      articleId,
      chunkIndex: i,
      content,
      embeddingJson: embeddings[i]?.length > 0 ? JSON.stringify(embeddings[i]) : null,
      tokenCount: Math.ceil(content.length / 4),
    }))
  );
}
