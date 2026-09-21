import { Injectable } from '@nestjs/common';
import { ShardRouter } from '../../lib/shard-router';
import { PasswordResetToken } from './password-reset-token.model';

@Injectable()
export class PasswordResetTokenRepository {
  constructor(private readonly shardRouter: ShardRouter) {}

  async create(
    shardUserId: number | string,
    values: Partial<PasswordResetToken>,
  ): Promise<PasswordResetToken> {
    const model = await this.shardRouter.getModelForUser(
      shardUserId,
      PasswordResetToken,
    );
    return model.create(values as any);
  }

  async findByToken(
    shardUserId: number | string,
    token: string,
    raw: boolean = true,
  ): Promise<PasswordResetToken | null> {
    const model = await this.shardRouter.getModelForUser(
      shardUserId,
      PasswordResetToken,
    );
    return model.findOne({ where: { token }, raw });
  }

  async markUsed(
    shardUserId: number | string,
    userOtp: PasswordResetToken,
  ): Promise<void> {
    const { userId, sn } = userOtp;
    const model = await this.shardRouter.getModelForUser(
      shardUserId,
      PasswordResetToken,
    );
    await model.update({ usedAt: new Date() }, { where: { userId, sn } });
  }

  async invalidatePreviousTokens(shardUserId: number | string): Promise<void> {
    const model = await this.shardRouter.getModelForUser(
      shardUserId,
      PasswordResetToken,
    );
    await model.update(
      { usedAt: new Date() },
      { where: { userId: shardUserId, usedAt: null } },
    );
  }
}
