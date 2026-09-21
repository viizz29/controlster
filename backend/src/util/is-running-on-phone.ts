import { execSync } from 'child_process';

export const isRunningOnPhone = () => {
  const output = execSync('uname -a', { encoding: 'utf8' });
  const x = output.split(' ');
  return x[1] == 'kali';
};
