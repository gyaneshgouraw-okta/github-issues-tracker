import { Octokit } from "@octokit/rest";
import axios from "axios";

/**
 * Service for interacting with GitHub API
 */
class GitHubService {
  constructor() {
    this.octokit = null;
    this.token = null;
  }

  /**
   * Initialize the Octokit client with a token
   * @param {string} token - GitHub personal access token
   */
  initialize(token) {
    this.token = token;
    this.octokit = new Octokit({ auth: token });
  }

  /**
   * Check if the token is valid by fetching the authenticated user
   * @returns {Promise<Object>} - User information if token is valid
   * @throws {Error} - If token is invalid
   */
  async validateToken() {
    try {
      const { data } = await this.octokit.users.getAuthenticated();
      return data;
    } catch (error) {
      throw new Error("Invalid token or network error");
    }
  }

  /**
   * Get token information including scopes and rate limit
   * @returns {Promise<Object>} - Token information
   */
  async getTokenInfo() {
    try {
      // Make a request to get rate limit info which includes token scopes
      const response = await this.octokit.request('GET /rate_limit');
      
      // Get token scopes from headers (if available)
      const scopes = response.headers['x-oauth-scopes'] ? 
        response.headers['x-oauth-scopes'].split(', ').filter(s => s.trim()) : [];
      
      // Get rate limit information
      const rateLimit = response.data.rate;
      
      // Calculate token age (GitHub tokens don't expose creation date directly)
      // We'll use a different approach - check if we can get app info
      let tokenType = 'personal_access_token';
      let expiresAt = null;
      
      try {
        // Try to get app info - this will work for OAuth apps but not PATs
        await this.octokit.request('GET /applications/{client_id}/grant', {
          client_id: 'dummy'
        });
      } catch (error) {
        // Expected for PATs - this is fine
      }
      
      return {
        type: tokenType,
        scopes,
        rateLimit: {
          limit: rateLimit.limit,
          remaining: rateLimit.remaining,
          reset: new Date(rateLimit.reset * 1000),
          used: rateLimit.used
        },
        expiresAt, // Will be null for most tokens as GitHub doesn't expose this
        lastChecked: new Date()
      };
    } catch (error) {
      throw new Error('Failed to get token information');
    }
  }

  /**
   * Get repositories for the authenticated user
   * @returns {Promise<Array>} - List of repositories
   */
  async getUserRepositories() {
    try {
      const { data } = await this.octokit.repos.listForAuthenticatedUser({
        sort: "updated",
        per_page: 100,
      });
      return data;
    } catch (error) {
      throw new Error("Failed to fetch repositories");
    }
  }

  /**
   * Get a specific repository
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @returns {Promise<Object>} - Repository information
   */
  async getRepository(owner, repo) {
    try {
      const { data } = await this.octokit.repos.get({
        owner,
        repo,
      });
      return data;
    } catch (error) {
      throw new Error(`Failed to fetch repository: ${owner}/${repo}`);
    }
  }
  
  /**
   * Get closed issues for a repository
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @returns {Promise<Array>} - List of closed issues
   */
  async getClosedIssues(owner, repo) {
    try {
      const { data } = await this.octokit.issues.listForRepo({
        owner,
        repo,
        state: "closed",
        per_page: 100,
      });
      return data.filter(issue => !issue.pull_request); // Filter out PRs
    } catch (error) {
      throw new Error(`Failed to fetch closed issues for ${owner}/${repo}`);
    }
  }

  /**
   * Get comments for a specific issue
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @param {number} issue_number - Issue number
   * @returns {Promise<Array>} - List of comments
   */
  async getIssueComments(owner, repo, issue_number) {
    try {
      const { data } = await this.octokit.issues.listComments({
        owner,
        repo,
        issue_number,
      });
      return data;
    } catch (error) {
      throw new Error(`Failed to fetch comments for issue #${issue_number}`);
    }
  }
  
  /**
   * Get issues with comments after closure
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @returns {Promise<Array>} - List of issues with post-closure comments
   */
  async getIssuesWithPostClosureComments(owner, repo) {
    try {
      // Get all closed issues
      const issues = await this.getClosedIssues(owner, repo);
      
      // Get comments for each issue and check if any were posted after closure
      const issuesWithComments = await Promise.all(
        issues.map(async (issue) => {
          const comments = await this.getIssueComments(owner, repo, issue.number);
          
          // Filter comments posted after issue closure
          const postClosureComments = comments.filter(
            comment => new Date(comment.created_at) > new Date(issue.closed_at)
          );
          
          // Only return issues that have comments after closure
          if (postClosureComments.length > 0) {
            return {
              ...issue,
              postClosureComments,
            };
          }
          
          return null;
        })
      );
      
      // Filter out nulls (issues without post-closure comments)
      return issuesWithComments.filter(Boolean);
    } catch (error) {
      throw new Error(`Failed to fetch issues with post-closure comments for ${owner}/${repo}`);
    }
  }

  /**
   * Get repositories for a specific organization with license information
   * @param {string} org - Organization name
   * @returns {Promise<Array>} - List of repositories with license info
   */
  async getOrganizationRepositories(org) {
    try {
      const { data } = await this.octokit.repos.listForOrg({
        org,
        sort: "updated",
        per_page: 100,
      });
      
      // Fetch license information for each repository
      const reposWithLicense = await Promise.all(
        data.map(async (repo) => {
          try {
            // Get license information
            let licenseInfo = null;
            if (repo.license) {
              licenseInfo = {
                name: repo.license.name,
                spdx_id: repo.license.spdx_id,
                url: repo.license.url,
                html_url: `https://github.com/${repo.full_name}/blob/${repo.default_branch}/LICENSE`
              };
            }
            
            return {
              id: repo.id,
              name: repo.name,
              full_name: repo.full_name,
              description: repo.description,
              html_url: repo.html_url,
              private: repo.private,
              fork: repo.fork,
              created_at: repo.created_at,
              updated_at: repo.updated_at,
              pushed_at: repo.pushed_at,
              stargazers_count: repo.stargazers_count,
              watchers_count: repo.watchers_count,
              forks_count: repo.forks_count,
              language: repo.language,
              license: licenseInfo,
              default_branch: repo.default_branch
            };
          } catch (error) {
            // If there's an error fetching license info, return repo without license
            return {
              ...repo,
              license: null
            };
          }
        })
      );
      
      return reposWithLicense;
    } catch (error) {
      throw new Error(`Failed to fetch repositories for organization: ${org}`);
    }
  }
}

// Create singleton instance
const githubService = new GitHubService();

export default githubService;