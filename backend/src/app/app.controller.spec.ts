import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { REDIS_CLIENT } from 'src/modules/redis/redis.module';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const mockRedis = {
      set: jest.fn().mockResolvedValue('OK'),
      get: jest.fn().mockResolvedValue('Hello from ioredis!'),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        { provide: REDIS_CLIENT, useValue: mockRedis },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  describe('redisTest', () => {
    it('should store and retrieve a value from Redis', async () => {
      const result = await appController.redisTest();
      expect(result).toContain('Retrieved: Hello from ioredis!');
    });
  });
});
