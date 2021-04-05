import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/modules/app.module';
import { loadEnvironmentVariables } from './app/cli/loader';
import { json, urlencoded } from 'express';
async function bootstrap() {
  loadEnvironmentVariables();
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api/v1');
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  await app.listen(5000);
}
bootstrap();
