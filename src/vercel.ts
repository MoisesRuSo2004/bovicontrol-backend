/**
 * vercel.ts — Serverless entry point for Vercel deployment.
 * NestJS bootstraps once and the express instance is reused across warm invocations.
 * Local development still uses main.ts (nest start:dev).
 */
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { AppModule } from './app.module';

const expressApp = express();
let isBootstrapped = false;

async function bootstrap() {
  if (isBootstrapped) return expressApp;

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
    { logger: ['error', 'warn'] },
  );

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.init();
  isBootstrapped = true;
  return expressApp;
}

// Vercel calls this function for every request
export default async function handler(
  req: express.Request,
  res: express.Response,
) {
  const server = await bootstrap();
  server(req, res);
}
