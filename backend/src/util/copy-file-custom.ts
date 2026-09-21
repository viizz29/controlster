import fs from 'fs-extra';

export async function copyFileCustom(
  source: string,
  destination: string,
): Promise<void> {
  try {
    await fs.copy(source, destination);
    console.log(`File copied from ${source} to ${destination}`);
  } catch (error) {
    console.error('Error copying file:', error);
    throw error;
  }
}
