import * as fs from 'fs';

export function renameDirectory(oldPath: string, newPath: string): void {
  if (!fs.existsSync(oldPath)) {
    console.error(`Directory not found: ${oldPath}`);
    return;
  }

  try {
    fs.renameSync(oldPath, newPath);
    console.log(`Directory renamed from "${oldPath}" to "${newPath}"`);
  } catch (error) {
    console.error(`Error renaming directory: ${(error as Error).message}`);
  }
}
