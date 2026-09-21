import * as fs from 'fs';

export function deleteFile(filePath: string) {
  try {
    fs.unlinkSync(filePath);
    console.log('File deleted successfully.');
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      console.log('File does not exist.');
    } else {
      console.error('Error deleting file:', err);
    }
  }
}
