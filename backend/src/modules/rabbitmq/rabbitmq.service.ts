import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RABBITMQ_SERVICE, SAMPLE_EVENT } from './rabbitmq.constants';
import type { SampleEventPayload } from './rabbitmq.controller';
import { Logger } from 'nestjs-pino';

export interface WorkerConfigAllocationPayload {
  serviceInstanceId: string;
  workerId: number;
}

@Injectable()
export class RabbitMqService {
  constructor(
    @Inject(RABBITMQ_SERVICE) private readonly client: ClientProxy,
    private readonly logger: Logger,
  ) {}

  emitSampleEvent(payload: SampleEventPayload) {
    this.logger.fatal(
      `Emitting "${SAMPLE_EVENT}" event: ${JSON.stringify(payload)}`,
    );
    this.client.emit(SAMPLE_EVENT, payload);

    return payload;
  }

  emitEvent(eventId: string, payload: any = null) {
    this.logger.fatal(
      `Emitting "${eventId}" event: ${JSON.stringify(payload)}`,
    );
    this.client.emit(eventId, payload);
  }
}
