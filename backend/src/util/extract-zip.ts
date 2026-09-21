import * as fs from 'fs';
import AdmZip from 'adm-zip';

export function extractZip(zipPath: string, outputPath: string): void {
  if (!fs.existsSync(zipPath)) {
    console.error(`ZIP file not found: ${zipPath}`);
    return;
  }

  try {
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(outputPath, true);
    console.log(`Extracted ZIP file to: ${outputPath}`);
  } catch (error) {
    console.error(`Error extracting ZIP: ${(error as Error).message}`);
  }
}
