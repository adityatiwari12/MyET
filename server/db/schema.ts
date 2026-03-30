import { pgTable, serial, varchar, text, boolean, timestamp, integer, jsonb } from 'drizzle-orm/pg-core';

// ============ USERS ============
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }),
  state: varchar('state', { length: 100 }),
  city: varchar('city', { length: 100 }),
  occupation: varchar('occupation', { length: 100 }),
  familyStatus: varchar('family_status', { length: 50 }),
  language: varchar('language', { length: 5 }).default('en'),
  financialGoal: varchar('financial_goal', { length: 100 }),
  investments: text('investments').array(),
  riskTolerance: varchar('risk_tolerance', { length: 20 }),
  investmentHorizon: varchar('investment_horizon', { length: 20 }),
  incomeRange: varchar('income_range', { length: 50 }),
  interests: text('interests').array(),
  onboardingComplete: boolean('onboarding_complete').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ============ STORIES (legacy seed data) ============
export const stories = pgTable('stories', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  titleHi: text('title_hi'),
  category: varchar('category', { length: 100 }),
  categoryHi: varchar('category_hi', { length: 100 }),
  content: text('content'),
  contentHi: text('content_hi'),
  insights: text('insights').array(),
  insightsHi: text('insights_hi').array(),
  mattersToYou: text('matters_to_you'),
  mattersToYouHi: text('matters_to_you_hi'),
  readTime: varchar('read_time', { length: 30 }),
  readTimeHi: varchar('read_time_hi', { length: 30 }),
  updateInfo: varchar('update_info', { length: 100 }),
  updateInfoHi: varchar('update_info_hi', { length: 100 }),
  tags: text('tags').array(),
  imageUrl: text('image_url'),
  isBreaking: boolean('is_breaking').default(false),
  publishedAt: timestamp('published_at').defaultNow(),
});

// ============ INTERACTIONS ============
export const interactions = pgTable('interactions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  storyId: integer('story_id').references(() => stories.id, { onDelete: 'cascade' }).notNull(),
  type: varchar('type', { length: 20 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// ============ CHAT ============
export const chatSessions = pgTable('chat_sessions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const chatMessages = pgTable('chat_messages', {
  id: serial('id').primaryKey(),
  sessionId: integer('session_id').references(() => chatSessions.id, { onDelete: 'cascade' }).notNull(),
  role: varchar('role', { length: 10 }).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// ============ RAG PIPELINE ============

// Raw + enriched articles from news sources
export const articles = pgTable('articles', {
  id: serial('id').primaryKey(),
  urlHash: varchar('url_hash', { length: 64 }).unique().notNull(),
  url: text('url').notNull(),
  source: varchar('source', { length: 100 }),
  title: text('title').notNull(),
  rawText: text('raw_text'),
  imageUrl: text('image_url'),

  // LLM enrichment fields (populated by enrichWorker)
  summary: text('summary'),
  summaryHi: text('summary_hi'),
  insights: text('insights').array(),
  insightsHi: text('insights_hi').array(),
  entities: text('entities').array(),
  category: varchar('category', { length: 50 }),
  sentiment: varchar('sentiment', { length: 10 }),
  impactTags: text('impact_tags').array(),
  mattersToYou: text('matters_to_you'),
  readTime: varchar('read_time', { length: 20 }),

  publishedAt: timestamp('published_at'),
  enrichedAt: timestamp('enriched_at'),
  retryCount: integer('retry_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// Chunked article content with serialized embeddings
export const articleChunks = pgTable('article_chunks', {
  id: serial('id').primaryKey(),
  articleId: integer('article_id').references(() => articles.id, { onDelete: 'cascade' }).notNull(),
  chunkIndex: integer('chunk_index').notNull(),
  content: text('content').notNull(),
  embeddingJson: text('embedding_json'),   // JSON-serialized float[] (768-dim)
  tokenCount: integer('token_count'),
  createdAt: timestamp('created_at').defaultNow(),
});

// User behavioral signals for personalization
export const userBehavior = pgTable('user_behavior', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  articleId: integer('article_id').references(() => articles.id, { onDelete: 'set null' }),
  action: varchar('action', { length: 20 }).notNull(),
  durationSeconds: integer('duration_seconds'),
  query: text('query'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Cached narratives to avoid regeneration on every request
export const narrativeCache = pgTable('narrative_cache', {
  id: serial('id').primaryKey(),
  cacheKey: varchar('cache_key', { length: 255 }).unique().notNull(),
  userId: integer('user_id'),
  narrative: jsonb('narrative').notNull(),
  articleIds: text('article_ids').array(),
  generatedAt: timestamp('generated_at').defaultNow(),
  expiresAt: timestamp('expires_at').notNull(),
});
