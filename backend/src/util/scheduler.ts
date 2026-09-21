import cron from 'node-cron';
import { DateTime } from 'luxon';

const runTaskEveryday = (
  hour: number,
  minute: number,
  second: number,
  task: () => void,
) => {
  // Convert 9:14:50 Asia/Kolkata to UTC
  const localTime = DateTime.fromObject(
    { hour, minute, second },
    { zone: 'Asia/Kolkata' },
  );

  const utc = localTime.setZone('UTC');
  const [sec, min, hr] = [utc.second, utc.minute, utc.hour];

  cron.schedule(`${sec} ${min} ${hr} * * *`, task);
};

const fun = (
  hour: number,
  minute: number,
  second: number,
  task: () => void,
) => {
  // Convert 9:14:50 Asia/Kolkata to UTC
  const localTime = DateTime.fromObject(
    { hour, minute, second },
    { zone: 'Asia/Kolkata' },
  );

  const utc = localTime.setZone('UTC');
  const [sec, min, hr] = [utc.second, utc.minute, utc.hour];

  cron.schedule(`${sec} ${min} ${hr} * * *`, task);
};

export const scheduleThings = () => {
  // fun(9, 14, 0, () => {
  //     say("Sir, this is magic!");
  // });
};
