import { Inject, Injectable } from '@nestjs/common';
import { Repository, Sequelize } from 'sequelize-typescript';
import { CreateShardDto } from './dto/create-shard.dto';
import { SecretsService, shardPasswordAad } from './secrets.service';
import { Shard } from './shard.model';
import { CONTROL_PLANE_DB } from './shards.constants';

@Injectable()
export class ShardsService {
  constructor(
    @Inject(CONTROL_PLANE_DB)
    private readonly sequelize: Sequelize,
    private readonly secrets: SecretsService,
  ) {}

  private get model(): Repository<Shard> {
    return this.sequelize.getRepository(Shard);
  }

  async findAll(): Promise<Shard[]> {
    return this.model.findAll({ raw: true });
  }

  async create(dto: CreateShardDto): Promise<Shard> {
    const password = this.secrets.encrypt(
      dto.password,
      shardPasswordAad(dto.host, dto.database),
    );

    const shard = await this.model.create({ ...dto, password });
    return shard.get({ plain: true }) as Shard;
  }
}
