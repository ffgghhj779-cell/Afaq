import 'dotenv/config';
import { createApp } from './app';
import { connectDatabase, disconnectDatabase } from './config/database';
import { env } from './config/env';

async function bootstrap() {
  await connectDatabase();
  console.info('[DB] PostgreSQL connected');

  const app = createApp();

  const server = app.listen(env.PORT, () => {
    console.info(`[AFAQ API] Running on port ${env.PORT} | Region: ${env.DATA_RESIDENCY} | Env: ${env.NODE_ENV}`);
    console.info('[AFAQ API] Endpoints:');
    console.info('  POST /api/v1/auth/otp/send');
    console.info('  POST /api/v1/auth/otp/verify');
    console.info('  POST /api/v1/auth/nafath/initiate');
    console.info('  POST /api/v1/auth/oauth');
    console.info('  POST /api/v1/auth/refresh');
    console.info('  GET  /api/v1/auth/me');
    console.info('  POST /api/v1/ai/chat');
    console.info('  POST /api/v1/zatca/invoices');
    console.info('  GET  /api/v1/commerce/plans');
  });

  const shutdown = async (signal: string) => {
    console.info(`[AFAQ API] ${signal} received — shutting down`);
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap().catch((err) => {
  console.error('[AFAQ API] Failed to start:', err);
  process.exit(1);
});
