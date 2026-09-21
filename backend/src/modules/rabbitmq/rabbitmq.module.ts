import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RabbitMqController } from './rabbitmq.controller';
import { RabbitMqService } from './rabbitmq.service';
import { RABBITMQ_SERVICE } from './rabbitmq.constants';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: RABBITMQ_SERVICE,
        inject: [ConfigService],
        useFactory: (config: ConfigService) => {

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
            },
          }
        },
      },
    ]),
  ],
  controllers: [RabbitMqController],
  providers: [RabbitMqService],
  exports: [RabbitMqService],
})
export class RabbitMqModule { }
