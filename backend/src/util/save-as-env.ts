import * as fs from 'fs';

export function saveAsEnv(filePath: string, data: any): void {
  try {
    let content = '';
    for (const key of Object.keys(data)) {
      const value = data[key];
      content += `${key}=${value}\n`;
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`File created successfully: ${filePath}`);
  } catch (error) {
    console.error(`Error creating file: ${(error as Error).message}`);
  }
}
