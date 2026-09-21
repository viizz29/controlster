import { Injectable } from '@nestjs/common';
import { sleep } from 'src/util/sleep';

@Injectable()
export class ShardDirectory {
  async getShard(userId: number | string) {
    await sleep(100);
    return 'shard1';
  }
}
