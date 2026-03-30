const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export class ApiService {
  private static getToken() {
    return localStorage.getItem('token');
  }

  private static getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_URL}/api${endpoint}`, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || `Request failed with status ${response.status}`);
    }

    return response.json();
  }

  // Auth
  static async register(data: any): Promise<{ token: string; user: any }> {
    return this.request('/auth/register', { method: 'POST', body: JSON.stringify(data) });
  }

  static async login(data: any): Promise<{ token: string; user: any }> {
    return this.request('/auth/login', { method: 'POST', body: JSON.stringify(data) });
  }

  static async getMe(): Promise<any> {
    return this.request('/auth/me');
  }

  // Users
  static async updateProfile(data: any): Promise<any> {
    return this.request('/users/profile', { method: 'PUT', body: JSON.stringify(data) });
  }

  static async getStats(): Promise<any> {
    return this.request('/users/stats');
  }

  // Stories
  static async getStories(limit = 10, offset = 0): Promise<any> {
    return this.request(`/stories?limit=${limit}&offset=${offset}`);
  }

  static async getStory(id: number): Promise<any> {
    return this.request(`/stories/${id}`);
  }

  // Interactions
  static async toggleInteraction(storyId: number, type: string): Promise<any> {
    return this.request('/interactions', {
      method: 'POST',
      body: JSON.stringify({ storyId, type })
    });
  }

  static async getUserInteractions(): Promise<any> {
    return this.request('/interactions/user');
  }

  // Chat
  static async getChatHistory(): Promise<any> {
    return this.request('/chat/history');
  }

  static async clearChatHistory(): Promise<any> {
    return this.request('/chat/clear', { method: 'POST' });
  }

  // AI Proxy
  static async chat(message: string, sessionId: number, context?: any): Promise<{ reply: string }> {
    return this.request('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, sessionId, context })
    });
  }

  static async tts(text: string): Promise<{ audioDataUrl: string }> {
    return this.request('/ai/tts', {
      method: 'POST',
      body: JSON.stringify({ text })
    });
  }

  static async searchGrounding(query: string): Promise<{ answer: string }> {
    return this.request('/ai/search', {
      method: 'POST',
      body: JSON.stringify({ query })
    });
  }

  static async summarize(prompt: string): Promise<{ analysis: string }> {
    return this.request('/ai/summarize', {
      method: 'POST',
      body: JSON.stringify({ prompt })
    });
  }

  static async transcribeAudio(audioData: string, mimeType: string): Promise<{ text: string }> {
    return this.request('/ai/transcribe', {
      method: 'POST',
      body: JSON.stringify({ audioData, mimeType })
    });
  }

  // === RAG Feed ===
  static async getFeed(): Promise<{ narratives: any[]; totalArticles: number; generatedAt: string; isWarmingUp?: boolean }> {
    return this.request('/feed');
  }

  static async getTrending(): Promise<{ articles: any[]; generatedAt: string }> {
    // Public endpoint — no auth needed
    const response = await fetch(`${API_URL}/api/feed/trending`);
    return response.json();
  }

  // === Behavior Tracking ===
  static async trackBehavior(action: string, articleId?: number, durationSeconds?: number, query?: string): Promise<void> {
    this.request('/behavior', {
      method: 'POST',
      body: JSON.stringify({ action, articleId, durationSeconds, query })
    }).catch(() => {}); // Fire and forget
  }

  // === Ingest Pipeline (Admin) ===
  static async getIngestStatus(): Promise<any> {
    return this.request('/ingest/status');
  }

  static async triggerIngest(): Promise<any> {
    return this.request('/ingest/trigger', { method: 'POST' });
  }
}
