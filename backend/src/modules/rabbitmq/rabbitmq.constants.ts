import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import type { MicroserviceOptions } from '@nestjs/microservices';

export const RABBITMQ_SERVICE = 'RABBITMQ_SERVICE';
export const SAMPLE_EVENT = 'sample.event';
export const SAMPLE_QUEUE = 'sample_queue';
export const WORKER_CONFIG_ALLOCATION_REQUEST_EVENT =
  'worker-config.allocation.request';
export const WORKER_CONFIG_ALLOCATION_EVENT = 'worker-config.allocation';

export function getRmqServerOptions(
  config: ConfigService,
): MicroserviceOptions {

  const hostName = config.getOrThrow('RABBITMQ_HOST');
  const userName = config.getOrThrow('RABBITMQ_USER');
  const password = config.getOrThrow('RABBITMQ_PASSWORD');
  const port = 5672; // config.getOrThrow('RABBITMQ_PORT');



  const url = `amqp://${userName}:${password}@${hostName}:${port}`;

  return {
    transport: Transport.RMQ,
    options: {
      urls: [url],
      queue: config.getOrThrow<string>('RABBITMQ_QUEUE'),
      queueOptions: {
        durable: true,
      },
      noAck: false,
    },
  };
}
