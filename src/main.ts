import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';

async function bootstrap() {
  // Load .env variables
  dotenv.config();

  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Optional: Set global API prefix
  app.setGlobalPrefix('api');


  const port = process.env.PORT || 3000;
  await app.listen(port);

  Logger.log(`🚀 Server is running on http://localhost:${port}/api`);
}
bootstrap();
