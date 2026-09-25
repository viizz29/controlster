import { RabbitMqHealthIndicator } from './rabbitmq-health-indicator';
import { HealthCheckError } from '@nestjs/terminus';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';

jest.mock('amqplib', () => ({
  connect: jest.fn(),
}));

const mockedAmqpConnect = amqp.connect as jest.Mock;

describe('RabbitMqHealthIndicator', () => {
  let indicator: RabbitMqHealthIndicator;
  let mockConfig: { get: jest.Mock; getOrThrow: jest.Mock };

  beforeEach(() => {
    mockedAmqpConnect.mockReset();
    mockConfig = {
      get: jest.fn(),
      getOrThrow: jest.fn().mockImplementation((key: string) => {
        switch (key) {
          case 'RABBITMQ_HOST':
            return '127.0.0.1';
          case 'RABBITMQ_USER':
            return 'guest';
          case 'RABBITMQ_PASSWORD':
            return 'guest';
          default:
            throw new Error(`Missing value for ${key}`);
        }
      }),
    };
    indicator = new RabbitMqHealthIndicator(
      mockConfig as unknown as ConfigService,
    );
  });

  describe('isHealthy', () => {
    it('should return status disabled when rabbitmq is disabled', async () => {
      mockConfig.get.mockImplementation((key: string) =>
        key === 'RABBITMQ_ENABLED' ? false : undefined,
      );

      const result = await indicator.isHealthy();

      expect(mockedAmqpConnect).not.toHaveBeenCalled();
      expect(result).toEqual({ rabbitmq: { status: 'disabled' } });
    });

    it('should return status up when connection succeeds', async () => {
      mockConfig.get.mockImplementation((key: string) =>
        key === 'RABBITMQ_ENABLED' ? true : undefined,
      );
      const close = jest.fn().mockResolvedValue(undefined);
      mockedAmqpConnect.mockResolvedValue({ close });

      const result = await indicator.isHealthy();

      expect(mockedAmqpConnect).toHaveBeenCalledWith(
        'amqp://guest:guest@127.0.0.1:5672',
        expect.objectContaining({ timeout: 5000 }),
      );
      expect(close).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ rabbitmq: { status: 'up' } });
    });

    it('should throw HealthCheckError when connection fails', async () => {
      mockConfig.get.mockImplementation((key: string) =>
        key === 'RABBITMQ_ENABLED' ? true : undefined,
      );
      mockedAmqpConnect.mockRejectedValue(new Error('ECONNREFUSED'));

      await expect(indicator.isHealthy()).rejects.toThrow(HealthCheckError);
    });

    it('should include status down in the error details', async () => {
      mockConfig.get.mockImplementation((key: string) =>
        key === 'RABBITMQ_ENABLED' ? true : undefined,
      );
      mockedAmqpConnect.mockRejectedValue(new Error('ECONNREFUSED'));

      try {
        await indicator.isHealthy();
      } catch (error) {
        expect(error).toBeInstanceOf(HealthCheckError);
        const checkError = error as HealthCheckError;
        expect(checkError.message).toBe('RabbitMQ health check failed');
        expect(checkError.causes).toEqual({
          rabbitmq: { status: 'down', error: 'ECONNREFUSED' },
        });
      }
    });
  });
});
