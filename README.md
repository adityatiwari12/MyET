
# MyET (AskMyET)
### AI-Powered Conversational Intelligence for Financial News & Insights

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.45-C5F015?logo=drizzle&logoColor=black)](https://orm.drizzle.team/)
[![Gemini](https://img.shields.io/badge/Google_Gemini-AI-4285F4?logo=google-gemini&logoColor=white)](https://ai.google.dev/)

</div>

---

## 🌟 Overview

**MyET** (AskMyET) is a next-generation news intelligence platform that transforms raw financial data and RSS feeds into actionable insights. By leveraging advanced **Retrieval-Augmented Generation (RAG)** and real-time AI enrichment, MyET provides users with a personalized briefing experience and a powerful conversational assistant to deep-dive into complex market narratives.

---

## ✨ Key Features

- 📰 **AI-Driven Briefing**: Personalized daily news feeds curated from multiple RSS sources with automated AI enrichment.
- 💬 **AskMyET (Conversational AI)**: A high-performance chatbot powered by **Groq** and **Gemini**, capable of real-time web search and context-aware financial discussion.
- 🏗️ **Smart Narrative Builder**: An automated ingestion pipeline that cleans, enriches, and categorizes news using LLMs and Regex-based intelligence.
- 🔍 **RAG-Powered Search**: Advanced retrieval capabilities using vector-like patterns and DuckDuckGo search fallbacks for up-to-the-minute data.
- ⚡ **Real-time Updates**: Live news ingestion with a robust scheduler and WebSocket-driven UI notifications.
- 🎨 **Modern Aesthetics**: Built with **Tailwind CSS 4** and **Framer Motion** for a premium, glassmorphic UI/UX.

---

## 🚀 Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS 4, Lucide Icons
- **Animations**: Framer Motion
- **State Management**: React Contexts

### Backend
- **Runtime**: Node.js (tsx)
- **Framework**: Express.js
- **Database**: PostgreSQL (Neon) with Drizzle ORM
- **Intelligence**: Google Gemini API, Groq SDK

### Tools & APIs
- **Ingestion**: RSS Parser, Cheerio (Web Scraping)
- **Search**: Duck-Duck-Scrape
- **Auth**: JWT, bcryptjs
- **Scheduler**: node-cron

---

## 🛠️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [PostgreSQL](https://www.postgresql.org/) (or a Neon database URI)
- API Keys for Google Gemini and/or Groq

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/MyET.git
   cd MyET
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env.local` file in the root directory and add the following:
   ```env
   # Database
   DATABASE_URL=your_postgres_uri

   # AI Keys
   GEMINI_API_KEY=your_gemini_key
   GROQ_API_KEY=your_groq_key

   # Server Config
   PORT=5000
   JWT_SECRET=your_secret_key
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Database Migration:**
   ```bash
   npm run db:push
   ```

### Running the App

- **Start Frontend (Vite):**
  ```bash
  npm run dev
  ```

- **Start Backend Server:**
  ```bash
  npm run server:dev
  ```

---

## 📂 Project Structure

```bash
├── server/             # Express backend, routes, and AI services
│   ├── routes/         # API endpoints (Auth, Chat, Feed, etc.)
│   ├── services/       # Core logic (RAG, Story Builder, AI)
│   ├── workers/        # Background scheduler for news ingestion
│   └── db/             # Drizzle schema and database config
├── src/                # React frontend
│   ├── components/     # UI components (AskMyET, Briefing, etc.)
│   ├── contexts/       # Global state management
│   └── constants/      # App-wide constants and types
└── package.json        # Build scripts and dependencies
```

---

## ⚖️ License

Distributed under the **Apache-2.0 License**. See `LICENSE` (if exists) or the header of `App.tsx` for more information.

---

<div align="center">
Built with ❤️ by the MyET Team
</div>
