import cron, { ScheduledTask, ScheduleOptions } from 'node-cron';
import { DateTime } from 'luxon';
import { CustomLogger } from 'src/lib/logging-helper';

/**
 * Global job manager for node-cron
 */
class CronManager {
  private jobs: ScheduledTask[] = [];

  /**
   * Schedule a cron job and track it automatically.
   */
  schedule(
    expression: string,
    func: () => void,
    options?: ScheduleOptions,
  ): ScheduledTask {
    const job = cron.schedule(expression, func, options);
    this.jobs.push(job);
    return job;
  }

  scheduleOnIndianTime(timeTuple: [number, number, number], task: () => void) {
    // Convert 9:14:50 Asia/Kolkata to UTC

    const [hour, minute, second] = timeTuple;

    const localTime = DateTime.fromObject(
      { hour, minute, second },
      { zone: 'Asia/Kolkata' },
    );

    const utc = localTime.setZone('UTC');
    const [sec, min, hr] = [utc.second, utc.minute, utc.hour];

    this.schedule(`${sec} ${min} ${hr} * * *`, task);
  }

  /**
   * Stop all active cron jobs.
   */
  stopAll(): void {
    for (const job of this.jobs) {
      job.stop();
    }
    CustomLogger.i(`[CronManager] Stopped ${this.jobs.length} job(s).`);
  }

  /**
   * Start all cron jobs that were previously stopped.
   */
  startAll(): void {
    for (const job of this.jobs) {
      job.start();
    }
    CustomLogger.i(`[CronManager] Started ${this.jobs.length} job(s).`);
  }

  /**
   * Completely clear and remove all jobs.
   */
  clearAll(): void {
    this.stopAll();
    this.jobs = [];
    CustomLogger.i(`[CronManager] Cleared all jobs.`);
  }

  /**
   * Get current job count.
   */
  count(): number {
    return this.jobs.length;
  }
}

// Create a global singleton instance
export const cronManager = new CronManager();

// Optional default export
export default cronManager;
