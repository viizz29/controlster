import path, { join } from 'path';
process.env.TZ = 'America/Danmarkshavn';
process.env.PROJECT_LOCATION = path.dirname(__dirname);
process.env.WORKING_DIRECTORY = process.cwd();
process.env.RESOURCES_LOCATION = `${process.env.PROJECT_LOCATION}/res`;
process.env.FRONTEND_BUILD_PATH = process.env.FRONTEND_BUILD_PATH
  ? process.env.FRONTEND_BUILD_PATH
  : join(__dirname, '..', 'public');

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from 'nestjs-pino';
import { MicroserviceOptions } from '@nestjs/microservices';
import { DecodeIdPipe } from './common/decode-id.pipe';
import { EncodeIdInterceptor } from './common/encode-id.interceptor';
import { ConfigService } from '@nestjs/config';
import { SocketIoAdapter } from './socket-io.adapter';
import { getRmqServerOptions } from './modules/rabbitmq/rabbitmq.constants';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);

  app.use(helmet());
  app.use(cookieParser());

  // Tell NestJS to use Pino as the global system logger
  app.useLogger(app.get(Logger));

  // Define the base URL prefix for all routes
  app.setGlobalPrefix(process.env.API_BASE_URL || '/api/v1');

  //   app.setGlobalPrefix('api', {
  //   exclude: ['health', 'public/webhook'],
  // });

  // This triggers the class-validator logic
  app.useGlobalPipes(
    new DecodeIdPipe(),
    new ValidationPipe({
      whitelist: true, // Strips away properties that don't have decorators in the DTO
      forbidNonWhitelisted: true, // Throws an error if extra properties are sent
      transform: true, // Automatically transforms plain objects to DTO instances
    }),
  );
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('App001 API')
      .setDescription('API description')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'Authorization',
          description: 'Enter JWT token',
          in: 'header',
        },
        'bearerAuth',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup(process.env.DOCS_URL || '/docs', app, document, {
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: `${process.env.APP_NAME} ${process.env.NODE_ENV}`,
      customJs: `/api/swagger-init.js`,
    });
  }

  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
  app.enableCors({
    origin: process.env.NODE_ENV === 'production' ? corsOrigin : true,
    credentials: true,
  });

  app.useGlobalInterceptors(new EncodeIdInterceptor());

  app.enableShutdownHooks();

  app.useWebSocketAdapter(new SocketIoAdapter(app, configService));

  app.connectMicroservice<MicroserviceOptions>(
    getRmqServerOptions(configService),
  );

  await app.startAllMicroservices();

  if (process.env.NODE_ENV == 'production') {
    await app.listen(process.env.PORT || 3000, '0.0.0.0');
  } else {
    await app.listen(process.env.PORT || 3000);
  }

  // console.log({ PROJECT_LOCATION: process.env.PROJECT_LOCATION });
}

bootstrap()
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log(err);
  });
