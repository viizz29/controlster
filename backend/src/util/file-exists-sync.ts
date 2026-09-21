import * as fs from 'fs';

export function fileOrFolderExistsSync(filePath: string): boolean {
  return fs.existsSync(filePath);
}
