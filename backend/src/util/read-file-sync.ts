import * as fs from 'fs';
import { CustomLogger } from '../lib/logging-helper';

export function readFileSync(filePath: string): string | null {
  CustomLogger.i('trying to read the file: ', filePath);

  if (!fs.existsSync(filePath)) {
    CustomLogger.e(`File not found: ${filePath}`);
    throw Error('file not found.');
  }

  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    CustomLogger.e(`Error reading file: ${(error as Error).message}`);
    throw error;
  }
}
