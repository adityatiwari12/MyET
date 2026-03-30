import { ApiService } from './apiService';

/**
 * Speaks text using Web Speech API (browser-native TTS)
 * This is the reliable fallback — works in all modern browsers
 */
function speakWithWebSpeech(text: string, lang = 'en-IN'): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Web Speech API not supported'));
      return;
    }
    window.speechSynthesis.cancel(); // stop any ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Try to use an Indian English voice if available
    const voices = window.speechSynthesis.getVoices();
    const indiaVoice = voices.find(v => v.lang.includes('en-IN') || v.lang.includes('hi-IN') || v.name.includes('India'));
    if (indiaVoice) utterance.voice = indiaVoice;

    utterance.onend = () => resolve();
    utterance.onerror = (e) => reject(e);
    window.speechSynthesis.speak(utterance);
  });
}

export const geminiService = {
  async chat(message: string, sessionId?: number, context?: any) {
    try {
      const resp = await ApiService.chat(message, sessionId || Date.now(), context);
      return typeof resp === 'object' && 'reply' in resp ? (resp as any).reply : resp;
    } catch (e) {
      console.error('Chat error:', e);
      return "I'm having trouble connecting right now. Please try again later.";
    }
  },

  async searchGrounding(query: string) {
    try {
      const resp = await ApiService.searchGrounding(query);
      return {
        text: resp.answer,
        sources: [],
      };
    } catch (e) {
      console.error('Search error:', e);
      return { text: "Search temporarily unavailable", sources: [] };
    }
  },

  async analyzeComplex(content: string) {
    try {
      const resp = await ApiService.summarize(`Analyze the following financial content and provide a bento-style impact analysis with key drivers and strategic shifts: ${content}`);
      return resp.analysis;
    } catch (e) {
      console.error('Analysis error:', e);
      return "Analysis temporarily unavailable";
    }
  },

  /**
   * Text-to-Speech with Gemini → Web Speech API fallback
   * Returns a data URL (Gemini) OR null (Web Speech ongoing) OR null (failed)
   */
  async textToSpeech(text: string, lang = 'en'): Promise<string | null> {
    // Override: Immediately use Web Speech API to guarantee instant playback
    // and prevent browsers blocking audio due to async gaps from hitting 429 rate limit APIs.
    try {
      const speechLang = lang === 'hi' ? 'hi-IN' : 'en-IN';
      await speakWithWebSpeech(text, speechLang);
      return null;
    } catch (e) {
      console.error('[TTS] Web Speech failed:', e);
      return null;
    }
  },

  /**
   * Stop any currently playing speech (Web Speech API)
   */
  stopSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  },

  // Transcribe is not implemented server-side — return empty
  async transcribeAudio(base64Audio: string, mimeType: string) {
    return "";
  },

  // Live audio remains stubbed
  connectLive(callbacks: any) {
    console.warn("Live Audio not supported via backend proxy yet");
    return {
      disconnect() {},
      send() {}
    };
  }
};
