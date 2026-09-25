import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';
import { SecretsService } from './secrets.service';
import { Shard } from './shard.model';
import { CONTROL_PLANE_DB } from './shards.constants';
import { ShardsController } from './shards.controller';
import { ShardsService } from './shards.service';

@Module({
  controllers: [ShardsController],
  providers: [
    ShardsService,
    SecretsService,
    {
      provide: CONTROL_PLANE_DB,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const sequelize = new Sequelize({
          host: config.getOrThrow<string>('DB_HOST'),
          port: config.get<number>('DB_PORT', 5432),
          username: config.getOrThrow<string>('DB_USERNAME'),
          password: config.getOrThrow<string>('DB_PASSWORD'),
          database: config.getOrThrow<string>('DB_DATABASE'),
          dialect: 'postgres',
          logging: false,
          timezone: '+00:00',
        });

        sequelize.addModels([Shard]);

        return sequelize;
      },
    },
  ],
  exports: [ShardsService, SecretsService],
})
export class ShardsModule {}
