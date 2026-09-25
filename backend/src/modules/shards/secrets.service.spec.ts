import { ConfigService } from '@nestjs/config';
import { SecretsService } from './secrets.service';

const TEST_KEY = Buffer.alloc(32, 7).toString('base64');

function createSecretsService(): SecretsService {
  return new SecretsService({
    getOrThrow: () => TEST_KEY,
  } as unknown as ConfigService);
}

describe('SecretsService', () => {
  let secrets: SecretsService;

  beforeEach(() => {
    secrets = createSecretsService();
  });

  describe('encrypt/decrypt', () => {
    it('should round-trip the plaintext', () => {
      const encrypted = secrets.encrypt('sup3r-secret');

      expect(encrypted).not.toContain('sup3r-secret');
      expect(secrets.decrypt(encrypted)).toBe('sup3r-secret');
    });

    it('should produce different ciphertext on each call', () => {
      const first = secrets.encrypt('same');
      const second = secrets.encrypt('same');

      expect(first).not.toBe(second);
    });

    it('should round-trip with the same aad', () => {
      const encrypted = secrets.encrypt('secret', 'host:db');

      expect(secrets.decrypt(encrypted, 'host:db')).toBe('secret');
    });

    it('should throw when decrypting with a different aad', () => {
      const encrypted = secrets.encrypt('secret', 'host:db');

      expect(() => secrets.decrypt(encrypted, 'other:db')).toThrow();
    });

    it('should throw on a tampered ciphertext', () => {
      const encrypted = secrets.encrypt('secret');

      const [iv, tag] = encrypted.split('.');
      const corrupted = [
        iv,
        tag,
        Buffer.from('YWRtfg==').toString('base64'),
      ].join('.');

      expect(() => secrets.decrypt(corrupted)).toThrow();
    });
  });
});
