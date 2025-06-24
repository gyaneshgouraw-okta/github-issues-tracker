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
}

// Create singleton instance
const githubService = new GitHubService();

export default githubService;