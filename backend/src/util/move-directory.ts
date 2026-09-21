import { promises as fs } from 'fs';
import path from 'path';

export async function moveDirectory(src: string, dest: string): Promise<void> {
  try {
    await fs.rename(src, dest);
    console.log(`Moved ${src} to ${dest}`);
  } catch (error) {
    console.error('Error moving directory:', error);
  }
}
