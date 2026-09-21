import os from 'os';

export const isLinux = () => {
  const platform = os.platform();

  console.log({ platform });

  return platform === 'linux' || platform == 'android';
};
