/**
 * Embedding Service
 * Uses Gemini text-embedding-004 (768 dimensions)
 * Stores as JSON-serialized float array for compatibility without pgvector
 */

import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

/**
 * Compute cosine similarity between two vectors
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

/**
 * Generate embedding for text using Gemini text-embedding-004
 * Returns 768-dimensional float array
 */
export async function embedText(text: string): Promise<number[]> {
  const result = await ai.models.embedContent({
    model: 'text-embedding-004',
    contents: [{ parts: [{ text: text.slice(0, 8000) }] }] // truncate at 8k chars
  });

  const embedding = result.embeddings?.[0]?.values;
  if (!embedding) {
    throw new Error('No embedding returned from Gemini');
  }
  return embedding;
}

/**
 * Generate embeddings for multiple texts in parallel (with rate limiting)
 */
export async function embedBatch(texts: string[], concurrency = 3): Promise<number[][]> {
  const results: number[][] = [];
  for (let i = 0; i < texts.length; i += concurrency) {
    const batch = texts.slice(i, i + concurrency);
    const batchResults = await Promise.all(batch.map(t => embedText(t).catch(() => [] as number[])));
    results.push(...batchResults);
    if (i + concurrency < texts.length) {
      await new Promise(r => setTimeout(r, 200)); // rate-limit pause
    }
  }
  return results;
}

/**
 * Split text into chunks of ~400 tokens (approx 4 chars/token)
 */
export function chunkText(text: string, targetTokens = 400, overlap = 50): string[] {
  const TARGET_CHARS = targetTokens * 4;
  const OVERLAP_CHARS = overlap * 4;
  
  if (text.length <= TARGET_CHARS) return [text];
  
  const chunks: string[] = [];
  let start = 0;
  
  while (start < text.length) {
    let end = start + TARGET_CHARS;
    
    // Try to break at a sentence boundary
    if (end < text.length) {
      const sentenceEnd = text.lastIndexOf('.', end);
      if (sentenceEnd > start + TARGET_CHARS * 0.5) {
        end = sentenceEnd + 1;
      }
    }
    
    chunks.push(text.slice(start, end).trim());
    start = end - OVERLAP_CHARS;
  }
  
  return chunks.filter(c => c.length > 50);
}
