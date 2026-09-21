// socket-io.adapter.ts

import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ServerOptions } from 'socket.io';

export class SocketIoAdapter extends IoAdapter {
  constructor(
    app: INestApplication,
    private readonly configService: ConfigService,
  ) {
    super(app);
  }

  override createIOServer(port: number, options: ServerOptions) {
    const path = this.configService.getOrThrow<string>('SOCKETIO_ENDPOINT');

    // console.log({ path });
    const serverOptions: ServerOptions = {
      ...options,

      path,

      cors: {
        origin:
          this.configService.getOrThrow<string>('CORS_ORIGIN') ??
          'http://localhost:3000',
        credentials: true,
      },
    };

    return super.createIOServer(port, serverOptions);
  }
}
