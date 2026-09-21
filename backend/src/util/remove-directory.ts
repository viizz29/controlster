import * as fs from 'fs';

export function removeDirectory(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    console.error(`Directory not found: ${dirPath}`);
    return;
  }

  try {
    fs.rmSync(dirPath, { recursive: true, force: true });
    console.log(`Directory removed: ${dirPath}`);
  } catch (error) {
    console.error(`Error removing directory: ${(error as Error).message}`);
  }
}
