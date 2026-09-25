import { WorkerRegistryService } from './worker-registry.service';

describe('WorkerRegistryService', () => {
  let registry: WorkerRegistryService;

  beforeEach(() => {
    registry = new WorkerRegistryService();
  });

  describe('allocate', () => {
    it('should issue worker id 0 to the first service', () => {
      expect(registry.allocate('service-a')).toBe(0);
    });

    it('should issue the next available worker id to a new service', () => {
      registry.allocate('service-a');
      registry.allocate('service-b');
      registry.allocate('service-c');

      expect(registry.getWorkerId('service-a')).toBe(0);
      expect(registry.getWorkerId('service-b')).toBe(1);
      expect(registry.getWorkerId('service-c')).toBe(2);
    });

    it('should return the last allocated id for a known service id', () => {
      const first = registry.allocate('service-a');
      const second = registry.allocate('service-a');

      expect(second).toBe(first);
    });

    it('should not consume a new id on repeat allocation', () => {
      registry.allocate('service-a');
      registry.allocate('service-a');
      registry.allocate('service-b');

      expect(registry.getWorkerId('service-b')).toBe(1);
    });
  });

  describe('getAllocations', () => {
    it('should return an empty list initially', () => {
      expect(registry.getAllocations()).toEqual([]);
    });

    it('should return all allocated worker ids', () => {
      registry.allocate('service-a');
      registry.allocate('service-b');

      expect(registry.getAllocations()).toEqual([
        { serviceInstanceId: 'service-a', workerId: 0 },
        { serviceInstanceId: 'service-b', workerId: 1 },
      ]);
    });
  });
});
