/**
 * RAG Chat Service — Context-aware QA for AskMyET
 * Grounds all responses in real retrieved news articles
 */

import Groq from 'groq-sdk';
import * as dotenv from 'dotenv';
dotenv.config();

import { db } from '../db';
import { chatMessages, userBehavior } from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import { retrieveForUser, UserContext } from './retrievalService';
import { cacheService } from './cacheService';
import { search } from 'duck-duck-scrape';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface RAGResponse {
  answer: string;
  insights: string[];
  sources: { title: string; url: string; source: string }[];
  suggestedFollowUps: string[];
}

const SYSTEM_PROMPT = (userCtx: UserContext, context: string) => `
You are AskMyET — a peak performance financial decision assistant for Indian users. Your job is NOT to explain news; it is to tell the user what is happening AND what they should do.

USER PROFILE:
- Interests: ${userCtx.interests.join(', ')}
- Location: ${userCtx.city || 'India'}
- Language: ${userCtx.language}

REAL NEWS CONTEXT:
${context}

INSTRUCTIONS:
1. Keep the "answer" field SHORT (max 150 words).
2. Be sharp, structured, and useful. Use the EXACT format below.
3. Focus on decision-making. Include inflation, oil, and currency impact if relevant.
4. Do NOT use generic phrases like "it depends" or disclaimers.
5. If user asks in Hindi, respond in Hindi. Otherwise respond in English.

OUTPUT FORMAT (STRICT):
Your "answer" string MUST follow this structure with Markdown headers (###) and double newlines:

### DIRECT ANSWER
(1–2 lines clear answer)

### WHAT’S HAPPENING
* **Geopolitics:** 1-2 bullets
* **Economy:** 1-2 bullets
* **Impact:** 1-2 bullets

### IMPACT ON YOUR PORTFOLIO
* Explain specific asset movements
* Clarify short-term vs long-term

### WHAT YOU SHOULD DO
* **Action:** hold / avoid / partial buy / sell
* No vague advice

### WHAT TO WATCH
* 2–3 key triggers only

### CONFIDENCE
(Low / Medium / High with %)

EXAMPLE (Apply this structure to ALL queries):
User: "How is the Iran vs Israel war affecting my metals portfolio?"
Answer JSON: {
  "answer": "### DIRECT ANSWER\nThe war-driven rally has cooled due to a record-high US Dollar and profit-taking. Your metals portfolio is correcting, but the long-term structural floor remains strong.\n\n### WHAT’S HAPPENING\n* **Geopolitics:** Markets are absorbing the military shock, pricing in a contained conflict.\n* **Economics:** A surging USD and rising yields are suppressing commodity prices despite war risk.\n* **India Impact:** Imported inflation from oil volatility is weakening the Rupee.\n\n### IMPACT ON YOUR PORTFOLIO\n* **Metals Correction:** Investors booked gains from the peak and shifted to high-yield US bonds.\n* **Outlook:** High short-term volatility, but gold remains a key long-term hedge.\n\n### WHAT YOU SHOULD DO\n* **Action:** **HOLD** existing Gold/Silver ETFs. Do not panic-sell into the dip.\n* **Entry:** **PARTIAL BUY** on 5%+ price drops to average out costs.\n* **Caution:** **AVOID** new industrial metal positions until supply chains stabilize.\n\n### WHAT TO WATCH\n* US Dollar Index (DXY) stability.\n* Disruption in the Strait of Hormuz.\n\n### CONFIDENCE\nHigh (95%)",
  "insights": ["USD strength is capping metal gains", "Geopolitical floor exists", "Accumulate on dips"],
  "suggestedFollowUps": ["Is it time to buy silver?", "Impact on Nifty 50?"]
}

Return ONLY valid JSON:
{
  "answer": "The structured response following the Markdown format above.",
  "insights": ["3 key sharp takeaways"],
  "suggestedFollowUps": ["Relevant next questions"]
}
`;

/**
 * RAG-powered chat response
 */
export async function ragChat(
  sessionId: number,
  userId: number,
  userCtx: UserContext,
  userMessage: string,
  conversationHistory: ChatMessage[]
): Promise<RAGResponse> {

  // 1. Track user behavior (non-blocking)
  setImmediate(async () => {
    try {
      await db.insert(userBehavior).values({
        userId,
        action: 'question',
        query: userMessage,
      });
    } catch {/* non-blocking */}
  });

  // 2. Retrieve relevant news chunks — gracefully handle empty index
  let chunks: any[] = [];
  try {
    chunks = await retrieveForUser(userCtx, userMessage, 8, 72);
  } catch (err: any) {
    console.warn('[RAGChat] Retrieval failed, continuing without context:', err.message);
  }

  // 2b. Retrieve live web results
  let webResults: any = null;
  try {
    // Basic search based on user message. Highly efficient.
    webResults = await search(userMessage);
  } catch (err: any) {
    console.warn('[RAGChat] Web Search failed:', err.message);
  }

  // 3. Build context string (combining DB and Web)
  let context = '';
  if (chunks.length > 0) {
    context = chunks.map((c, i) =>
      `[Real-time News DB ${i + 1}] ${c.source} — "${c.articleTitle}"\n${c.content.slice(0, 500)}`
    ).join('\n\n---\n\n');
  }

  if (webResults && webResults.results && webResults.results.length > 0) {
    const webContext = webResults.results.slice(0, 3).map((r: any, i: number) =>
      `[Live Web Search ${i + 1}] ${r.title}\n${r.description}`
    ).join('\n\n---\n\n');
    
    if (context) {
      context += '\n\n=== OVERRIDE LIVE WEB SEARCH RESULTS ===\n\n' + webContext;
    } else {
      context = webContext;
    }
  }

  // Combine sources for UI
  const webSources = webResults?.results?.slice(0, 2).map((r: any) => ({
    title: r.title,
    url: r.url,
    source: 'DuckDuckGo Web Search',
  })) || [];

  // 4. Build conversation history for multi-turn
  const historyForGroq = conversationHistory.slice(-6).map(m => ({
    role: (m.role === 'model' ? 'assistant' : m.role) as 'user' | 'assistant',
    content: m.content,
  }));

  // 5. Build prompt — use combined context
  const systemPrompt = (chunks.length > 0 || webSources.length > 0)
    ? SYSTEM_PROMPT(userCtx, context)
    : `You are AskMyET — India's peak personal financial intelligence assistant.
Answer the following question about Indian finance using the structured format:
DIRECT ANSWER, WHAT’S HAPPENING, IMPACT ON YOUR PORTFOLIO, WHAT YOU SHOULD DO, WHAT TO WATCH, CONFIDENCE.
User interests: ${userCtx.interests.join(', ')}.
Note: Live news data is still loading (first-run warm-up). Answer from your financial knowledge.
Return ONLY valid JSON: {"answer": "your structured response", "insights": ["takeaway1", "takeaway2"], "suggestedFollowUps": ["followup1", "followup2"]}`;

  // 6. Call Groq
  try {
    const result = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        ...historyForGroq,
        { role: 'user', content: userMessage },
      ],
      temperature: 0.3,
      max_completion_tokens: 1500,
    });

    const rawText = result.choices[0]?.message?.content || '';
    
    // Try to parse JSON response
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          answer: parsed.answer || rawText || 'Unable to generate response.',
          insights: parsed.insights || [],
          sources: [
            ...chunks.slice(0, 2).map(c => ({
              title: c.articleTitle,
              url: c.articleUrl,
              source: c.source,
            })),
            ...webSources
          ],
          suggestedFollowUps: parsed.suggestedFollowUps || [],
        };
      } catch {/* fall through to raw text response */}
    }

    // Return raw text if JSON parsing fails
    return {
      answer: rawText || 'I could not generate a response. Please try again.',
      insights: [],
      sources: [
        ...chunks.slice(0, 2).map(c => ({
          title: c.articleTitle,
          url: c.articleUrl,
          source: c.source,
        })),
        ...webSources
      ],
      suggestedFollowUps: [],
    };

  } catch (err: any) {
    console.error('[RAGChat] Groq error:', err.message);
    return {
      answer: 'I am currently loading my knowledge base. The news index is warming up — please try again in 2-3 minutes for personalized responses.',
      insights: [],
      sources: [],
      suggestedFollowUps: [
        'What is the RBI repo rate today?',
        'How is the Nifty 50 performing?',
        'What are good SIP options for 2025?',
      ],
    };
  }
}

