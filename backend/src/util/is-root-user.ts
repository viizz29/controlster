export function isRootUser(): boolean {
  if (process.platform === 'win32') {
    // Windows: Check if the process has administrative privileges
    try {
      require('child_process').execSync('net session', { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  } else {
    // Unix-based (Linux/macOS): Check if running as root (UID 0)
    return process.getuid && process.getuid() === 0 ? true : false;
  }
}
