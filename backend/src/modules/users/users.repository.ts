import { Injectable } from '@nestjs/common';
import { ShardRouter } from '../../lib/shard-router';
import { SnowflakeIdService } from '../../lib/snowflake-id.service';
import { User } from './user.model';

@Injectable()
export class UserRepository {
  constructor(
    private readonly shardRouter: ShardRouter,
    private readonly snowflakeIdService: SnowflakeIdService,
  ) {}

  async create(
    shardUserId: number | string,
    values: Partial<User>,
  ): Promise<User> {
    const model = await this.shardRouter.getModelForUser(shardUserId, User);
    return model.create({
      id: this.snowflakeIdService.nextId(),
      ...values,
    } as any);
  }

  async findOne(
    shardUserId: number | string,
    email: string,
  ): Promise<User | null> {
    const model = await this.shardRouter.getModelForUser(shardUserId, User);
    const user = await model.findOne({ where: { email } });
    if (!user) return null;
    return user.get({ plain: true }) as User;
  }

  async findAll(shardUserId: number | string): Promise<User[]> {
    const model = await this.shardRouter.getModelForUser(shardUserId, User);
    return model.findAll({ attributes: ['id', 'name', 'email'] });
  }

  async findById(
    shardUserId: number | string,
    user_id: number | string,
    raw: boolean = true,
  ): Promise<User | null> {
    const model = await this.shardRouter.getModelForUser(shardUserId, User);
    return model.findByPk(user_id, { raw });
  }

  async findByEmail(
    shardUserId: number | string,
    email: string,
    raw: boolean = true,
  ): Promise<User | null> {
    const model = await this.shardRouter.getModelForUser(shardUserId, User);
    return model.findOne({ where: { email }, raw });
  }

  async findByVerificationToken(
    shardUserId: number | string,
    token: string,
    raw: boolean = true,
  ): Promise<User | null> {
    const model = await this.shardRouter.getModelForUser(shardUserId, User);
    return model.findOne({ where: { emailVerificationToken: token }, raw });
  }

  async update(
    shardUserId: number | string,
    user_id: number | string,
    attrs: Partial<User>,
  ): Promise<[number, User[]]> {
    const model = await this.shardRouter.getModelForUser(shardUserId, User);
    return model.update(attrs, {
      where: { id: user_id },
      returning: true,
    });
  }

  async remove(
    shardUserId: number | string,
    user_id: number | string,
  ): Promise<void> {
    const user = await this.findById(shardUserId, user_id);
    if (user) {
      await user.destroy();
    }
  }
}
