import { Injectable } from '@nestjs/common';
import { Model, ModelStatic, Sequelize } from 'sequelize';
import { ShardDirectory } from './shard-directory';
import { ShardManager } from './shard-manager';

export const ANONYMOUS_USER_ID = 0;

@Injectable()
export class ShardRouter {
  constructor(
    private readonly shardDirectory: ShardDirectory,
    private readonly shardManager: ShardManager,
  ) {}

  async getConnectionForUser(userId: number | string): Promise<Sequelize> {
    const shardId = await this.shardDirectory.getShard(userId);
    return this.shardManager.getConnection(shardId);
  }

  async getModelForUser<T extends ModelStatic<Model>>(
    userId: number | string,
    model: T,
  ): Promise<T> {
    const connection = await this.getConnectionForUser(userId);
    return connection.model(model.name) as T;
  }
}
