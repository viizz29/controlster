import fs from 'fs-extra';

export async function moveFileCustom(
  source: string,
  destination: string,
): Promise<void> {
  try {
    await fs.move(source, destination, {
      overwrite: false,
    });
    console.log(`File moved from ${source} to ${destination}`);
  } catch (error) {
    console.error('Error moving file:', error);
    throw error;
  }
}
