import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const REDIS_CLIENT = Symbol('REDIS_CLIENT');

function createRedisClient(config: ConfigService): Redis | null {
  if (!config.get<boolean>('REDIS_ENABLED')) return null;

  return new Redis({
    host: config.get<string>('REDIS_HOST', '127.0.0.1'),
    port: config.get<number>('REDIS_PORT', 6379),
    username: config.get<string>('REDIS_USER', 'default'),
    password: config.get<string>('REDIS_PASSWORD', ''),
  });
}

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: createRedisClient,
      inject: [ConfigService],
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}