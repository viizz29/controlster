import axios, { AxiosError } from 'axios';
import { CustomLogger } from '../lib/logging-helper';

interface CommitInfo {
  sha: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
    tree: {
      sha: string;
      url: string;
    };
  };
  stats: {
    total: number;
    additions: number;
    deletions: number;
  };
  files: {
    sha: string;
    filename: string;
    status: string;
  }[];
}

export const getCommitDetails = async (
  token: string,
  repo_owner: string,
  repo_name: string,
  commitId: string,
): Promise<CommitInfo> => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(
        `https://api.github.com/repos/${repo_owner}/${repo_name}/commits/${commitId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3+json',
          },
        },
      );

      CustomLogger.t('Commit Details:', response.data);
      resolve(response.data);
    } catch (err) {
      const error = err as AxiosError;
      console.error(
        'Error fetching commit details:',
        error?.response ? error?.response.data : error.message,
      );
      reject(error);
    }
  });
};
