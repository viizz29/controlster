import { Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';
import { Sequelize } from 'sequelize-typescript';
import { ShardManager } from './shard-manager';

@Injectable()
export class ShardHealthIndicator extends HealthIndicator {
  constructor(
    private readonly shardManager: ShardManager,
  ) {
    super();
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    const shards = this.shardManager.getConnections();

    const results: Record<string, any> = {};
    let healthy = true;

    for (const [shardId, sequelize] of shards) {
      try {
        await sequelize.authenticate();

        results[shardId] = {
          status: 'up',
        };
      } catch (error) {
        healthy = false;

        results[shardId] = {
          status: 'down',
          error: error instanceof Error ? error.message : String(error),
        };
      }
    }

    const result = this.getStatus('database-shards', healthy, results);

    if (!healthy) {
      throw new HealthCheckError(
        'Database shards are unhealthy',
        result,
      );
    }

    return result;
  }
}