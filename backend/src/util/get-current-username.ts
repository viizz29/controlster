import os from 'os';

export function getCurrentUsername(): string {
  try {
    // Preferred: Use os.userInfo()
    return os.userInfo().username;
  } catch (err) {
    // Fallback: Use environment variables
    const username =
      process.env.USER || process.env.USERNAME || process.env.LOGNAME;

    if (username) {
      return username;
    }

    throw new Error('Unable to determine current username');
  }
}
