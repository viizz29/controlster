import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { Sequelize } from 'sequelize-typescript';
import { User } from '../modules/users/user.model';
import { PasswordResetToken } from '../modules/auth/password-reset-token.model';
import { UserOtp } from '../modules/auth/user-otp.model';

interface ShardConfig {
  id: string;
  host: string;
  port: number;
  userName: string;
  password: string;
  dbName: string;
}

@Injectable()
export class ShardManager implements OnModuleInit, OnModuleDestroy {
  private readonly shardConfigs: ShardConfig[] = [];
  private readonly connections = new Map<string, Sequelize>();

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {}

  async onModuleInit() {
    this.logger.log('Initializing shard connections...');

    if (this.shardConfigs.length === 0) {
      this.shardConfigs.push({
        id: 'shard1',
        host: this.configService.getOrThrow<string>('DB_HOST'),
        port: this.configService.get<number>('DB_PORT', 5432),
        userName: this.configService.getOrThrow<string>('DB_USERNAME'),
        password: this.configService.getOrThrow<string>('DB_PASSWORD'),
        dbName: this.configService.getOrThrow<string>('DB_DATABASE'),
      });
    }

    await Promise.all(
      this.shardConfigs.map(async (shard) => {
        try {
          const sequelize = new Sequelize({
            host: shard.host,
            port: shard.port,
            username: shard.userName,
            password: shard.password,
            database: shard.dbName,
            dialect: 'postgres',
            logging: false,
            timezone: '+00:00',
            define: {
              underscored: true,
            },
          });

          sequelize.addModels([User, PasswordResetToken, UserOtp]);
          await sequelize.authenticate();
          this.connections.set(shard.id, sequelize);
          this.logger.log(`Initialized connection for shard: ${shard.id}`);
        } catch (error) {
          this.logger.error(
            `Failed to initialize connection for shard ${shard.id}`,
            error,
          );
        }
      }),
    );
  }

  getConnection(shardId: string): Sequelize {
    const sequelize = this.connections.get(shardId);

    if (!sequelize) {
      throw new Error(`Unknown shard: ${shardId}`);
    }

    return sequelize;
  }

  async onModuleDestroy() {
    for (const [shardId, sequelize] of this.connections) {
      await sequelize.close();
      this.logger.log(`Closed connection for shard: ${shardId}`);
    }
    this.connections.clear();
  }
}
