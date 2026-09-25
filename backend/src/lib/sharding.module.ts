import { Global, Module } from '@nestjs/common';
import { ShardDirectory } from './shard-directory';
import { ShardManager } from './shard-manager';
import { ShardRouter } from './shard-router';
import { SnowflakeIdService } from './snowflake-id.service';
import { ShardHealthIndicator } from './shard-health-indicator';

@Global()
@Module({
  providers: [ShardManager, ShardDirectory, ShardRouter, SnowflakeIdService, ShardHealthIndicator],
  exports: [ShardManager, ShardDirectory, ShardRouter, SnowflakeIdService, ShardHealthIndicator],
})
export class ShardingModule {}
