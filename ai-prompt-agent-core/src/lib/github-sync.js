/**
 * github-sync.js — Utility for syncing with GitHub repositories.
 *
 * Handles GitHub API interactions for:
 * - Fetching remote templates from a public repo
 * - Pushing saved prompts to a Gist for backup
 * - Checking for app updates via releases
 *
 * Requires: GITHUB_TOKEN env variable or passed token.
 */

import axios from 'axios';

const GITHUB_API = 'https://api.github.com';

/**
 * Create a configured axios instance for GitHub API calls.
 * @param {string} token - GitHub personal access token
 */
function createClient(token) {
  return axios.create({
    baseURL: GITHUB_API,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: token ? `Bearer ${token}` : undefined,
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
}

/**
 * Fetch the latest release info for a repo.
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} [token] - Optional GitHub token for private repos
 * @returns {Promise<{version: string, url: string, notes: string}>}
 */
export async function getLatestRelease(owner, repo, token) {
  const client = createClient(token);
  const { data } = await client.get(`/repos/${owner}/${repo}/releases/latest`);
  return {
    version: data.tag_name,
    url: data.html_url,
    notes: data.body,
    publishedAt: data.published_at,
  };
}

/**
 * Create or update a GitHub Gist for prompt backup.
 * @param {Object} options
 * @param {string} options.token - GitHub token (required for Gist)
 * @param {string} [options.gistId] - Existing Gist ID to update; omit to create new
 * @param {string} options.filename - Filename in the gist
 * @param {string} options.content - JSON content to store
 * @param {string} [options.description] - Gist description
 * @returns {Promise<{id: string, url: string}>}
 */
export async function syncToGist({ token, gistId, filename, content, description }) {
  const client = createClient(token);
  const payload = {
    description: description || 'PromptMaster Pro — Saved Prompts Backup',
    public: false,
    files: {
      [filename || 'prompts-backup.json']: {
        content: typeof content === 'string' ? content : JSON.stringify(content, null, 2),
      },
    },
  };

  let data;
  if (gistId) {
    ({ data } = await client.patch(`/gists/${gistId}`, payload));
  } else {
    ({ data } = await client.post('/gists', payload));
  }

  return { id: data.id, url: data.html_url };
}

/**
 * Fetch templates from a public GitHub repo directory.
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} path - Directory path in the repo
 * @param {string} [token] - Optional token for private repos
 * @returns {Promise<Array<{name: string, content: string}>>}
 */
export async function fetchRemoteTemplates(owner, repo, path = 'templates', token) {
  const client = createClient(token);

  // List files in the directory
  const { data: files } = await client.get(`/repos/${owner}/${repo}/contents/${path}`);

  const templates = await Promise.all(
    files
      .filter((f) => f.type === 'file' && f.name.endsWith('.json'))
      .map(async (f) => {
        const { data } = await client.get(f.download_url);
        return { name: f.name.replace('.json', ''), content: data };
      })
  );

  return templates;
}

/**
 * Check if the user's current version is outdated.
 * @param {string} currentVersion - Semver string (e.g. "2.0.0")
 * @param {string} owner - Repo owner
 * @param {string} repo - Repo name
 * @returns {Promise<{updateAvailable: boolean, latestVersion: string, url: string} | null>}
 */
export async function checkForUpdates(currentVersion, owner, repo) {
  try {
    const release = await getLatestRelease(owner, repo);
    const latest = release.version.replace(/^v/, '');
    const current = currentVersion.replace(/^v/, '');

    if (latest !== current) {
      return { updateAvailable: true, latestVersion: latest, url: release.url };
    }
    return { updateAvailable: false, latestVersion: latest, url: release.url };
  } catch {
    return null;
  }
}

export default {
  getLatestRelease,
  syncToGist,
  fetchRemoteTemplates,
  checkForUpdates,
};
