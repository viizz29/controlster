import { Global, Module } from '@nestjs/common';
import { ShardDirectory } from './shard-directory';
import { ShardManager } from './shard-manager';
import { ShardRouter } from './shard-router';
import { SnowflakeIdService } from './snowflake-id.service';

@Global()
@Module({
  providers: [ShardManager, ShardDirectory, ShardRouter, SnowflakeIdService],
  exports: [ShardManager, ShardDirectory, ShardRouter, SnowflakeIdService],
})
export class ShardingModule {}
