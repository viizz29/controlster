import { promises as fs } from 'fs';

export async function getFileSizeInMB(filePath: string): Promise<number> {
  const stats = await fs.stat(filePath);
  const fileSizeInBytes = stats.size;
  const fileSizeInMB = fileSizeInBytes / (1024 * 1024);
  return parseFloat(fileSizeInMB.toFixed(2));
}
