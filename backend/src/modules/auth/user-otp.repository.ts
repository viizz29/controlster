import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { ShardRouter } from '../../lib/shard-router';
import { UserOtp } from './user-otp.model';

@Injectable()
export class UserOtpRepository {
  constructor(private readonly shardRouter: ShardRouter) {}

  async create(
    shardUserId: number | string,
    values: Partial<UserOtp>,
  ): Promise<UserOtp> {
    const model = await this.shardRouter.getModelForUser(shardUserId, UserOtp);
    return model.create(values as any);
  }

  async findValidByUserIdAndOtp(
    shardUserId: number | string,
    userId: string,
    otp: string,
    type: string = 'login_2fa',
  ): Promise<UserOtp | null> {
    const model = await this.shardRouter.getModelForUser(shardUserId, UserOtp);
    return model.findOne({
      where: {
        userId,
        otp,
        type,
        usedAt: null,
        expiresAt: { [Op.gt]: new Date() },
      },
      raw: true,
    });
  }

  async markUsed(
    shardUserId: number | string,
    userOtp: UserOtp,
  ): Promise<void> {
    const { userId, sn } = userOtp;
    const model = await this.shardRouter.getModelForUser(shardUserId, UserOtp);
    await model.update({ usedAt: new Date() }, { where: { userId, sn } });
  }

  async invalidatePrevious(
    shardUserId: number | string,
    type: string,
  ): Promise<void> {
    const model = await this.shardRouter.getModelForUser(shardUserId, UserOtp);
    await model.update(
      { usedAt: new Date() },
      { where: { userId: shardUserId, type, usedAt: null } },
    );
  }
}
