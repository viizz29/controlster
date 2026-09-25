import { Controller, Get } from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  SequelizeHealthIndicator,
} from '@nestjs/terminus';
import { RedisHealthIndicator } from './redis-health-indicator';
import { Public } from '../../common/decorators/public.decorator';
import { ShardHealthIndicator } from 'src/lib/shard-health-indicator';
import { RabbitMqHealthIndicator } from './rabbitmq-health-indicator';

@Public()
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private sequelize: SequelizeHealthIndicator,
    // @Optional() private redisIndicator: RedisHealthIndicator,
    private redisIndicator: RedisHealthIndicator,
    private readonly rabbitMqIndicator: RabbitMqHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
    private readonly shardHealth: ShardHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    const checks = [
      () => this.shardHealth.isHealthy(),
      () => this.memory.checkHeap('memory_heap', 300 * 1024 * 1024),
      () => this.memory.checkRSS('memory_rss', 500 * 1024 * 1024),
      () =>
        this.disk.checkStorage('storage', {
          path: '/',
          thresholdPercent: 0.9,
        }),
    ];

    

    if (this.redisIndicator) {
      checks.splice(1, 0, () => this.redisIndicator.isHealthy());
    }

    if (this.rabbitMqIndicator) {
      checks.splice(2, 0, () => this.rabbitMqIndicator.isHealthy());
    }

    return this.health.check(checks);
  }

  @Get('live')
  live() {
    return {
      status: 'ok',
    };
  }

  @Get('ready')
  @HealthCheck()
  ready() {
    // const checks = [() => this.sequelize.pingCheck('database')];

    const checks = [() => this.shardHealth.isHealthy()];

    // console.log({ redisEnabled: process.env.REDIS_ENABLED });

    if (this.redisIndicator) {
      checks.push(() => this.redisIndicator.isHealthy());
    }

    if (this.rabbitMqIndicator) {
      checks.push(() => this.rabbitMqIndicator.isHealthy());
    }

    return this.health.check(checks);
  }
}
