import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { corsOrigins, env } from './config/env';
import { errorHandler, notFoundHandler } from './common/middleware/error.middleware';

import authRoutes from './modules/auth/auth.routes';
import aiRoutes from './modules/ai/ai.routes';
import zatcaRoutes from './modules/zatca/zatca.routes';
import commerceRoutes from './modules/commerce/commerce.routes';

export function createApp() {
  const app = express();

  app.use(helmet({
    contentSecurityPolicy: env.NODE_ENV === 'production',
    crossOriginEmbedderPolicy: false,
  }));

  app.use(cors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Client-Type', 'Accept-Language'],
  }));

  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser());

  app.use((_req, res, next) => {
    res.setHeader('X-Data-Residency', env.DATA_RESIDENCY);
    res.setHeader('X-API-Version', 'v1');
    next();
  });

  // ─── Health Check ──────────────────────────────────────────────────────────
  app.get('/api/v1/health', (_req, res) => {
    res.status(200).json({
      success: true,
      data: {
        status: 'healthy',
        version: '1.0.0',
        region: env.DATA_RESIDENCY,
        timestamp: new Date().toISOString(),
      },
    });
  });

  // ─── Versioned API Routes ──────────────────────────────────────────────────
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/ai', aiRoutes);
  app.use('/api/v1/zatca', zatcaRoutes);
  app.use('/api/v1/commerce', commerceRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
