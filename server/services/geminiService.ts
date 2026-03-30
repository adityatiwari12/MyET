import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.warn("⚠️ GEMINI_API_KEY environment variable is not set. AI features will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || '' });

/**
 * Text-to-Speech using Gemini TTS
 * Returns base64-encoded WAV audio as a data URL
 */
export async function generateTTS(text: string): Promise<string> {
  // Truncate text to reasonable length
  const truncatedText = text.slice(0, 1000);
  
  try {
    // Try Gemini TTS first (gemini-2.5-flash with AUDIO modality)
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: [{ parts: [{ text: truncatedText }] }],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: 'Aoede',
            }
          }
        }
      }
    });

    const inlineData = result.candidates?.[0]?.content?.parts?.[0]?.inlineData;
    if (inlineData?.data) {
      return `data:audio/wav;base64,${inlineData.data}`;
    }

    throw new Error('No audio data returned from Gemini TTS');
  } catch (err: any) {
    console.warn('[TTS] Gemini TTS failed:', err.message, '— returning null for frontend fallback');
    throw new Error('TTS_FALLBACK_NEEDED');
  }
}

/**
 * Chat Response (legacy, used by non-RAG paths)
 */
export async function generateChatResponse(message: string, context?: any): Promise<string> {
  let prompt = message;
  if (context && context.category) {
    prompt = `Context category: ${context.category}\n\n${message}`;
  }

  const result = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
  });

  return result.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate response';
}

/**
 * Grounded Search Proxy
 */
export async function executeSearchGrounding(query: string): Promise<string> {
  const result = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: [{ role: 'user', parts: [{ text: `Answer this financial question accurately using current information: ${query}` }] }],
    config: {
      tools: [{ googleSearch: {} }],
      temperature: 0.2
    }
  });

  return result.candidates?.[0]?.content?.parts?.[0]?.text || 'Search unavailable';
}

/**
 * Analysis proxy
 */
export async function performDeepAnalysis(prompt: string): Promise<string> {
  const result = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: {
      temperature: 0.7,
    }
  });

  return result.candidates?.[0]?.content?.parts?.[0]?.text || 'Analysis unavailable';
}
