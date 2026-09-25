import { Inject, Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../redis/redis.module';

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis | null,
  ) {
    super();
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    // Redis is intentionally disabled
    if (!this.redis) {
      return this.getStatus('redis', true, {
        status: 'disabled',
      });
    }

    try {
      const result = await this.redis.ping();

      if (result !== 'PONG') {
        throw new Error(`Unexpected Redis response: ${result}`);
      }

      return this.getStatus('redis', true, {
        status: 'up',
      });
    } catch (error) {
      const result = this.getStatus('redis', false, {
        status: 'down',
        error: error instanceof Error ? error.message : String(error),
      });

      throw new HealthCheckError(
        'Redis health check failed',
        result,
      );
    }
  }
}