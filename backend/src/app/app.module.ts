import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../modules/auth/auth.module';
import { UsersModule } from '../modules/users/users.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { LoggerModule } from 'nestjs-pino';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import envValueValidations from 'src/lib/env-value-validations';
import { MailModule } from 'src/modules/mail/mail.module';
import { CacheModule } from '@nestjs/cache-manager';
import { HealthModule } from 'src/modules/health/health.module';
import { ThrottlerModule, ThrottlerGuard, seconds } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { EmailVerifiedGuard } from 'src/common/guards/email-verified.guard';
import { redisStore } from 'cache-manager-redis-yet';
import { ChatModule } from 'src/modules/chat/chat.module';
import { ShardingModule } from 'src/lib/sharding.module';
import { RabbitMqModule } from 'src/modules/rabbitmq/rabbitmq.module';
import { RedisModule } from 'src/modules/redis/redis.module';

export const logLevelNameForPino = [
  'silent',
  'fatal',
  'error',
  'warn',
  'info',
  'debug',
  'trace',
];

const imports = [
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: `.env.${process.env.NODE_ENV}`,
    ignoreEnvFile: process.env.NODE_ENV === 'production',
    validationSchema: envValueValidations,
  }),
  AuthModule,
  UsersModule,
  MailModule,
  LoggerModule.forRoot({
    pinoHttp: {
      // Use pino-pretty only when NOT in production
      transport:
        process.env.NODE_ENV !== 'production'
          ? { target: 'pino-pretty', options: { colorize: true } }
          : undefined,

      // Optional: Customize log level based on environment
      level: logLevelNameForPino[Number(process.env.LOG_LEVEL)],
    },
  }),
  ServeStaticModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (config: ConfigService) => {
      const frontendBuildPath = process.env.FRONTEND_BUILD_PATH;
      // console.log({ frontendBuildPath });
      return [
        {
          rootPath: frontendBuildPath,
          renderPath: '/{*path}',
        },
      ];
    },
  }),
  CacheModule.registerAsync({
    isGlobal: true,
    useFactory: async () => {
      if (process.env.REDIS_ENABLED === 'true') {
        const { REDIS_HOST, REDIS_PORT, REDIS_USER, REDIS_PASSWORD } =
          process.env;
        const url = `redis://${REDIS_USER}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`;
        return {
          store: await redisStore({
            url,
          }),
        };
      }
      return {};
    },
  }),
  HealthModule,
  ThrottlerModule.forRootAsync({
    useFactory: () => {
      const throttlers = [
        {
          ttl: seconds(60),
          limit: 20,
        },
      ];

      if (process.env.REDIS_ENABLED === 'true') {
        const { REDIS_HOST, REDIS_PORT, REDIS_USER, REDIS_PASSWORD } =
          process.env;
        const url = `redis://${REDIS_USER}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`;
        return {
          throttlers,
          storage: new ThrottlerStorageRedisService(url),
        };
      }

      return { throttlers };
    },
  }),
  ChatModule,
  ShardingModule,
  RabbitMqModule,
  RedisModule,
];

@Module({
  imports,
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: EmailVerifiedGuard },
  ],
})
export class AppModule {}
