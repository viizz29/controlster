import { Injectable } from '@nestjs/common';

export interface WorkerAllocation {
  serviceInstanceId: string;
  workerId: number;
}

@Injectable()
export class WorkerRegistryService {
  private readonly allocations = new Map<string, number>();

  allocate(serviceInstanceId: string): number {
    const existing = this.allocations.get(serviceInstanceId);

    if (existing !== undefined) {
      return existing;
    }

    const workerId = this.nextAvailableWorkerId();
    this.allocations.set(serviceInstanceId, workerId);

    return workerId;
  }

  getWorkerId(serviceInstanceId: string): number | undefined {
    return this.allocations.get(serviceInstanceId);
  }

  getAllocations(): WorkerAllocation[] {
    return Array.from(
      this.allocations.entries(),
      ([serviceInstanceId, workerId]) => ({ serviceInstanceId, workerId }),
    );
  }

  private nextAvailableWorkerId(): number {
    const used = new Set(this.allocations.values());
    let candidate = 0;

    while (used.has(candidate)) {
      candidate += 1;
    }

    return candidate;
  }
}
