import * as fs from 'fs';
import * as path from 'path';

export function createFile(
  filePath: string,
  content: string,
  createFolders: boolean = false,
): void {
  try {
    if (createFolders) {
      const dir = path.dirname(filePath);
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`File created successfully: ${filePath}`);
  } catch (error) {
    console.error(`Error creating file: ${(error as Error).message}`);
  }
}
