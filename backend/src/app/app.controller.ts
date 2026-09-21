import { Controller, Get, Res, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { join } from 'path';
import { type Response } from 'express';
import { Public } from 'src/common/decorators/public.decorator';
import Redis from 'ioredis';

import { getConfigOrThrow } from 'src/lib/config-utils';
import { REDIS_CLIENT } from 'src/modules/redis/redis.module';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {}

  @Public()
  @Get('')
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get('redis-test')
  async redisTest(): Promise<string> {
    const key = 'control-plane:test';
    const valueToStore = JSON.stringify({
      '192.168.22.1': 1,
    });

    // Store the value with a 60s TTL
    await this.redis.set(key, valueToStore, 'EX', 60);

    // Read it back
    const retrieved = await this.redis.get(key);

    return `Stored: ${valueToStore} | Retrieved: ${retrieved}`;
  }

  @Public()
  @Get('swagger-init.js')
  serveJsFile(@Res() res: Response) {
    const PROJECT_LOCATION = getConfigOrThrow('PROJECT_LOCATION');

    // Resolve the path to your JS file
    const filePath = join(PROJECT_LOCATION, 'assets', 'swagger-init.js');

    // Set the correct Content-Type so the browser executes or interprets it as JavaScript
    res.setHeader('Content-Type', 'application/javascript');

    // console.log({ filePath });

    // console.log('existsCheck', fileOrFolderExistsSync(filePath));

    // try {
    //   console.log(readFileSync(filePath));
    // } catch (e) {
    //   console.error(e);
    // }

    // Send the file
    return res.sendFile(filePath);

    // return res.sendFile(filePath, (err) => {
    //   if (err) {
    //     console.log(err);
    //   }
    // });
  }
}
