import * as fs from 'fs';
import axios from 'axios';

export const downloadRepoByCommitId = async (
  token: string,
  repo_owner: string,
  repo_name: string,
  commitId: string,
  outputFilePath: string,
) => {
  const url = `https://github.com/${repo_owner}/${repo_name}/archive/${commitId}.zip`;

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Node.js',
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
      responseType: 'stream', // Important for handling file downloads
    });

    const writer = fs.createWriteStream(outputFilePath);
    response.data.pipe(writer);

    return new Promise<void>((resolve, reject) => {
      writer.on('finish', () => {
        console.log(`Downloaded ZIP file to: ${outputFilePath}`);
        resolve();
      });
      writer.on('error', reject);
    });
  } catch (error: any) {
    console.error(`Error downloading file: ${error.message}`);
    throw error;
  }
};
