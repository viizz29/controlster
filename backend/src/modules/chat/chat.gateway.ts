import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;
  private readonly terminalSubscriptions = new Map<
    string,
    Map<string, () => void>
  >();

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      // Extract token from cookie, handshake auth or Authorization header
      // (mirrors JwtStrategy's fromExtractors)
      const token =
        this.extractTokenFromCookie(client) ||
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.split(' ')[1];

      if (!token) {
        throw new UnauthorizedException('No token provided');
      }

      // Verify the JWT
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      });

      // Attach user data to the client object for later use
      client.data.user = {
        userId: Number(payload.sub),
      };
      console.log(`Client connected: ${client.id} (User: ${payload.sub})`);
    } catch (e) {
      console.log(`Connection rejected: ${e.message}`);
      client.disconnect(); // Terminate connection if unauthorized
    }
  }

  handleDisconnect(client: Socket) {
    this.cleanupTerminalSubscriptions(client.id);
    console.log(`Client disconnected: ${client.id}`);
  }

  // 1. Listen for the "hello" event
  @SubscribeMessage('hello')
  handleHello(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): string {
    // This logs on your terminal
    console.log(`Received hello from ${client.id}:`, data);

    // 2. This returns a response ONLY to the sender (Acknowledgement)
    return 'Hello from the WebSocket server!';
  }

  // 3. Alternatively, emit a message to everyone
  @SubscribeMessage('broadcast-hello')
  handleBroadcast(@MessageBody() data: { name: string }) {
    return this.server.emit('greetings', {
      message: `Hello ${data.name}! Welcome to the world.`,
    });
  }

  private extractTokenFromCookie(client: Socket): string | undefined {
    const cookieHeader = client.handshake.headers?.cookie;

    if (!cookieHeader) {
      return undefined;
    }

    for (const part of cookieHeader.split(';')) {
      const separatorIndex = part.indexOf('=');

      if (separatorIndex === -1) {
        continue;
      }

      const name = part.slice(0, separatorIndex).trim();

      if (name === 'access_token') {
        return decodeURIComponent(part.slice(separatorIndex + 1).trim());
      }
    }

    return undefined;
  }

  private getSocketUserId(client: Socket): number {
    const userId = client.data.user?.userId;

    if (!userId) {
      throw new UnauthorizedException('Socket user is not authenticated');
    }

    return userId;
  }

  private assertStringPayload(
    value: unknown,
    message: string,
  ): asserts value is string {
    if (typeof value !== 'string') {
      throw new BadRequestException(message);
    }
  }

  private storeTerminalSubscription(
    socketId: string,
    sessionId: string,
    unsubscribe: () => void,
  ) {
    const subscriptions = this.terminalSubscriptions.get(socketId) ?? new Map();
    subscriptions.set(sessionId, unsubscribe);
    this.terminalSubscriptions.set(socketId, subscriptions);
  }

  private cleanupTerminalSubscription(socketId: string, sessionId: string) {
    const subscriptions = this.terminalSubscriptions.get(socketId);
    const unsubscribe = subscriptions?.get(sessionId);

    unsubscribe?.();
    subscriptions?.delete(sessionId);

    if (subscriptions?.size === 0) {
      this.terminalSubscriptions.delete(socketId);
    }
  }

  private cleanupTerminalSubscriptions(socketId: string) {
    const subscriptions = this.terminalSubscriptions.get(socketId);

    if (!subscriptions) {
      return;
    }

    for (const unsubscribe of subscriptions.values()) {
      unsubscribe();
    }

    this.terminalSubscriptions.delete(socketId);
  }
}
