// Import dotenv first
import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import storyRoutes from './routes/stories';
import interactionRoutes from './routes/interactions';
import chatRoutes from './routes/chat';
import aiRoutes from './routes/ai';
import feedRoutes from './routes/feed';
import behaviorRoutes from './routes/behavior';
import ingestRoutes from './routes/ingest';

// Scheduler
import { startScheduler } from './workers/scheduler';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.CORS_ORIGIN || ''
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stories', storyRoutes);       // Legacy seed stories
app.use('/api/feed', feedRoutes);           // NEW: RAG-powered narrative feed
app.use('/api/interactions', interactionRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/ai', aiRoutes);               // Upgraded: RAG-powered chat
app.use('/api/behavior', behaviorRoutes);   // NEW: behavior tracking
app.use('/api/ingest', ingestRoutes);       // NEW: ingestion pipeline control

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    environment: process.env.NODE_ENV,
    version: '2.0-rag',
  });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════╗
║   MyET Server v2.0 (RAG)            ║
║   Running on port ${PORT}             ║
╚══════════════════════════════════════╝
  `);
  
  // Start the ingestion + enrichment scheduler
  startScheduler();
});
