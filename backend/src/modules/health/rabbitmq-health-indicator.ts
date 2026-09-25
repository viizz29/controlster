import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMqHealthIndicator extends HealthIndicator {
  constructor(private readonly config: ConfigService) {
    super();
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    // RabbitMQ is intentionally disabled
    if (!this.config.get<boolean>('RABBITMQ_ENABLED')) {
      return this.getStatus('rabbitmq', true, {
        status: 'disabled',
      });
    }

    const hostName = this.config.getOrThrow<string>('RABBITMQ_HOST');
    const userName = this.config.getOrThrow<string>('RABBITMQ_USER');
    const password = this.config.getOrThrow<string>('RABBITMQ_PASSWORD');
    const port = 5672;

    const url = `amqp://${userName}:${password}@${hostName}:${port}`;

    let connection: amqp.ChannelModel | undefined;

    try {
      connection = await amqp.connect(url, { timeout: 5000 });
      await connection.close();

      return this.getStatus('rabbitmq', true, {
        status: 'up',
      });
    } catch (error) {
      if (connection) {
        try {
          await connection.close();
        } catch {
          // ignore close errors on a failed connection
        }
      }

      const result = this.getStatus('rabbitmq', false, {
        status: 'down',
        error: error instanceof Error ? error.message : String(error),
      });

      throw new HealthCheckError('RabbitMQ health check failed', result);
    }
  }
}
