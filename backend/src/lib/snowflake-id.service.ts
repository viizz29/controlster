import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const DEFAULT_EPOCH = 1609459200000;
const SEQUENCE_MASK = 0xfff;
const MAX_WORKER_ID = 1023;

@Injectable()
export class SnowflakeIdService {
  private readonly epoch: number;
  private readonly workerId: number;
  private sequence = 0;
  private lastTimestamp = -1n;

  constructor(configService: ConfigService) {
    const workerId = Number(
      configService.get<string>('SNOWFLAKE_WORKER_ID', '0'),
    );
    if (
      !Number.isInteger(workerId) ||
      workerId < 0 ||
      workerId > MAX_WORKER_ID
    ) {
      throw new Error(`Invalid SNOWFLAKE_WORKER_ID: ${workerId}`);
    }

    this.epoch = Number(
      configService.get<string>('SNOWFLAKE_EPOCH', String(DEFAULT_EPOCH)),
    );
    this.workerId = workerId;
  }

  private waitNextTimestamp(timestamp: bigint): bigint {
    let next = BigInt(Date.now()) - BigInt(this.epoch);
    while (next <= timestamp) {
      next = BigInt(Date.now()) - BigInt(this.epoch);
    }
    return next;
  }

  nextId(): string {
    let timestamp = BigInt(Date.now()) - BigInt(this.epoch);

    if (timestamp < this.lastTimestamp) {
      timestamp = this.waitNextTimestamp(this.lastTimestamp);
    }

    if (timestamp === this.lastTimestamp) {
      this.sequence = (this.sequence + 1) & SEQUENCE_MASK;
      if (this.sequence === 0) {
        timestamp = this.waitNextTimestamp(this.lastTimestamp);
      }
    } else {
      this.sequence = 0;
    }

    this.lastTimestamp = timestamp;

    const id =
      (timestamp << 22n) |
      (BigInt(this.workerId) << 12n) |
      BigInt(this.sequence);

    return id.toString();
  }
}
