import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';
import { AppModule } from './app.module';

async function bootstrap() {
  const configService = new ConfigService();
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors({ origin: '*' });

  const proyect = 'testing';
  app.setGlobalPrefix(`api/v1/${proyect}`);

  const username = configService.get<string>('SWAGGER_USER');
  const password = configService.get<string>('SWAGGER_PASS');

  app.use(
    `/api/v1/${proyect}/docs`,
    basicAuth({
      challenge: true,
      users: {
        [username]: password,
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle(`${proyect}`)
    .setDescription('API documentation')
    .setVersion('1.0.0')
    .addBasicAuth()
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`/api/v1/${proyect}/docs`, app, document, {
    swaggerOptions: {
      filter: true,
      showRequestDuration: true,
    },
  });

  const port = configService.get<number>('HTTP_SERVER_PORT', 3000);
  const logger = new Logger('main.ts');
  await app.listen(port, '0.0.0.0', () => {
    logger.log(`${proyect} is running on http://localhost:${port}`);
    logger.debug(
      `Swagger is running on http://localhost:${port}/api/v1/${proyect}/docs`,
    );
  });
}

bootstrap();
