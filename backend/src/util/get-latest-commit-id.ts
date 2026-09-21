import axios from 'axios';
import { CustomLogger } from 'src/lib/logging-helper';

interface GitHubInfo {
  owner: string;
  repo: string;
}

/**
 * Extracts the owner and repository name from a GitHub URL.
 * @param url - The GitHub repository URL (e.g., https://github.com/owner/repo)
 * @returns An object containing owner and repo, or null if the URL is invalid.
 */
export function extractRepoInfo(url: string): GitHubInfo | null {
  // Regex breakdown:
  // ^(?:https?:\/\/)?(?:www\.)?github\.com\/([^\/]+)\/([^\/\s?#]+)
  const githubRegex =
    /^(?:https?:\/\/)?(?:www\.)?github\.com\/([^\/]+)\/([^\/\s?#]+)/i;

  const match = url.match(githubRegex);

  if (!match) {
    return null;
  }

  return {
    owner: match[1],
    repo: match[2].replace(/\.git$/, ''), // Clean up .git extension if present
  };
}

export const getLatestCommitId = async (
  token: string,
  repo_owner: string,
  repo_name: string,
  repo_branch: string,
): Promise<string> => {
  const url = `https://api.github.com/repos/${repo_owner}/${repo_name}/commits/${repo_branch}`;

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Node.js',
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    const { data } = response;
    const { sha } = data;

    return sha;
  } catch (error: any) {
    console.error(`Error getting latest commit id: ${error.message}`);
    throw error;
  }
};
