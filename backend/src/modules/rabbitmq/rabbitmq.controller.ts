import { Controller, Get, Inject, Post } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';
import {
  SAMPLE_EVENT,
  WORKER_CONFIG_ALLOCATION_EVENT,
  WORKER_CONFIG_ALLOCATION_REQUEST_EVENT,
} from './rabbitmq.constants';
import { RabbitMqService } from './rabbitmq.service';
import { WorkerRegistryService } from './worker-registry.service';
import { SecretsService, shardPasswordAad } from '../shards/secrets.service';
import { ShardsService } from '../shards/shards.service';
import { Public } from 'src/common/decorators/public.decorator';
import { REDIS_CLIENT } from '../redis/redis.module';
import Redis from 'ioredis';

export interface SampleEventPayload {
  eventId?: string;
  message?: string;
  [key: string]: unknown;
}

export interface WorkerConfig {
  serviceInstanceId: string;
  workerId: number;
  shards: {
    [shardId: string]: {
      host: string;
      port: number;
      userName: string;
      password: string;
      database: string;
    };
  };
}

export interface WorkerConfigAllocationRequestEventPayload {
  serviceInstanceId: string;
}

@Controller()
export class RabbitMqController {
  constructor(
    private readonly eventsService: RabbitMqService,
    private readonly logger: Logger,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    private readonly workerRegistry: WorkerRegistryService,
    private readonly shardsService: ShardsService,
    private readonly secrets: SecretsService,
  ) {}

  @EventPattern(WORKER_CONFIG_ALLOCATION_REQUEST_EVENT)
  async handleWorkerConfigAllocationRequestEvent(
    @Payload() data: WorkerConfigAllocationRequestEventPayload,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef() as {
      ack(message: unknown): void;
    };
    const originalMessage = context.getMessage() as unknown;

    channel.ack(originalMessage);

    const { serviceInstanceId } = data;

    this.logger.fatal(
      `Received "${WORKER_CONFIG_ALLOCATION_REQUEST_EVENT}" for service id: ${serviceInstanceId}`,
    );

    const workerId = this.workerRegistry.allocate(serviceInstanceId);

    const shards = await this.shardsService.findAll();

    const key = `worker-config:${serviceInstanceId}`;
    const value: WorkerConfig = {
      serviceInstanceId,
      workerId,
      shards: Object.fromEntries(
        shards.map((shard) => [
          String(shard.id),
          {
            host: shard.host,
            port: shard.port,
            userName: shard.userName,
            password: this.secrets.decrypt(
              shard.password,
              shardPasswordAad(shard.host, shard.database),
            ),
            database: shard.database,
          },
        ]),
      ),
    };

    await this.redis.set(key, JSON.stringify(value), 'EX', 60);

    this.eventsService.emitEvent(WORKER_CONFIG_ALLOCATION_EVENT, {
      serviceInstanceId,
      workerId,
    });
  }

  @EventPattern(SAMPLE_EVENT)
  handleSampleEvent(
    @Payload() data: SampleEventPayload,
    @Ctx() context: RmqContext,
  ): void {
    const channel = context.getChannelRef() as {
      ack(message: unknown): void;
    };
    const originalMessage = context.getMessage() as unknown;

    this.logger.fatal(
      `Received "${SAMPLE_EVENT}" event: ${JSON.stringify(data)}`,
    );

    channel.ack(originalMessage);
  }

  @Public()
  @Post('sample')
  dispatchSampleEvent() {
    const event = {
      id: 'event-123',
      type: 'SAMPLE_EVENT',
      timestamp: new Date().toISOString(),
      data: {
        message: 'Hello from control plane',
      },
    };
    return this.eventsService.emitSampleEvent(event);
  }

  @Public()
  @Get('worker-ids')
  listWorkerIds() {
    return this.workerRegistry.getAllocations();
  }
}
