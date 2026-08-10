import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Enables Next.js frontend to talk to NestJS backend
  await app.listen(4000);
  console.log('Backend application is running on: http://localhost:4000');
}
bootstrap();