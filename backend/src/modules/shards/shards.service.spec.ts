import { ConfigService } from '@nestjs/config';
import { SecretsService } from './secrets.service';
import { ShardsService } from './shards.service';
import { CreateShardDto } from './dto/create-shard.dto';

const TEST_KEY = Buffer.alloc(32, 7).toString('base64');

describe('ShardsService', () => {
  let service: ShardsService;
  let secrets: SecretsService;
  let mockModel: {
    findAll: jest.Mock;
    create: jest.Mock;
  };

  beforeEach(() => {
    mockModel = {
      findAll: jest.fn(),
      create: jest.fn(),
    };
    const mockSequelize = {
      getRepository: jest.fn().mockReturnValue(mockModel),
    };
    secrets = new SecretsService({
      getOrThrow: () => TEST_KEY,
    } as unknown as ConfigService);
    service = new ShardsService(mockSequelize as never, secrets);
  });

  describe('findAll', () => {
    it('should return shard records', async () => {
      const shards = [
        {
          id: '1',
          host: 'db1.example.com',
          port: 5432,
          userName: 'worker',
          password: 'encrypted-password',
          database: 'app_db',
        },
      ];
      mockModel.findAll.mockResolvedValue(shards);

      const result = await service.findAll();

      expect(mockModel.findAll).toHaveBeenCalledWith({ raw: true });
      expect(result).toEqual(shards);
    });
  });

  describe('create', () => {
    it('should persist the dto with an encrypted password', async () => {
      const dto: CreateShardDto = {
        host: 'db1.example.com',
        port: 5432,
        userName: 'worker',
        password: 'secret',
        database: 'app_db',
      };
      let storedPassword = '';
      mockModel.create.mockImplementation(
        (values: { password: string; [key: string]: unknown }) => {
          storedPassword = values.password;
          return { get: () => ({ id: '2', ...values }) };
        },
      );

      const result = await service.create(dto);

      expect(mockModel.create).toHaveBeenCalledWith(
        expect.objectContaining({ database: 'app_db' }),
      );
      expect(storedPassword).not.toBe('secret');
      expect(
        secrets.decrypt(storedPassword, 'db1.example.com\u0000app_db'),
      ).toBe('secret');
      expect(result.password).not.toBe('secret');
    });
  });
});
