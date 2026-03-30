/**
 * In-memory LRU Cache Service
 * Falls back to DB-backed narrative_cache for persistence
 */

import { LRUCache } from 'lru-cache';

// Short-lived cache for narrative results (30 min)
const narrativeCache = new LRUCache<string, any>({
  max: 200,
  ttl: 30 * 60 * 1000, // 30 minutes
});

// Medium-lived cache for RAG query results (15 min)
const queryCache = new LRUCache<string, any>({
  max: 500,
  ttl: 15 * 60 * 1000, // 15 minutes
});

// Short-lived cache for RSS fetch results (5 min)
const rssCache = new LRUCache<string, any>({
  max: 50,
  ttl: 5 * 60 * 1000, // 5 minutes
});

export const cacheService = {
  // Narrative cache
  getNarrative: (key: string) => narrativeCache.get(key),
  setNarrative: (key: string, value: any) => narrativeCache.set(key, value),

  // Query results cache
  getQuery: (key: string) => queryCache.get(key),
  setQuery: (key: string, value: any) => queryCache.set(key, value),

  // RSS cache
  getRss: (key: string) => rssCache.get(key),
  setRss: (key: string, value: any) => rssCache.set(key, value),

  // Helper: generate consistent cache keys
  narrativeKey: (userId: number, interestHash: string) =>
    `narrative:${userId}:${interestHash}`,

  queryKey: (userId: number, query: string) =>
    `query:${userId}:${Buffer.from(query).toString('base64').slice(0, 32)}`,

  // Statistics
  stats: () => ({
    narrativeSize: narrativeCache.size,
    querySize: queryCache.size,
    rssSize: rssCache.size,
  }),
};

/**
 * Simple hash for cache keys
 */
export function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
}
