import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { cleanupOpenApiDoc } from 'nestjs-zod';

async function bootstrap() {
  initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: process.env.CORS_ORIGIN,
      methods: process.env.CORS_METHODS?.split(',') ?? [
        'GET',
        'POST',
        'PATCH',
        'PUT',
        'DELETE',
        'OPTIONS',
      ],
      credentials: true,
    },
  });

  app.setGlobalPrefix('api');

  app.use(cookieParser());

  const swagger = new DocumentBuilder()
    .setVersion('1.0')
    .setTitle('NestJS Starter Template')
    .addCookieAuth('AccessToken')
    .build();

  const documentation = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup('swagger', app, cleanupOpenApiDoc(documentation), {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
