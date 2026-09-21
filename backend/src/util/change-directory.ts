import * as fs from 'fs';

export function changeDirectory(newPath: string): void {
  if (!fs.existsSync(newPath)) {
    console.error(`Directory does not exist: ${newPath}`);
    return;
  }

  try {
    process.chdir(newPath);
    console.log(`Current working directory changed to: ${process.cwd()}`);
  } catch (error) {
    console.error(`Error changing directory: ${(error as Error).message}`);
  }
}
