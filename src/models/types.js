/**
 * Type definitions for the application
 */

/**
 * @typedef {Object} Repository
 * @property {number} id - Repository ID
 * @property {string} name - Repository name
 * @property {string} full_name - Full repository name (owner/name)
 * @property {string} description - Repository description
 * @property {string} html_url - URL to the repository on GitHub
 */

/**
 * @typedef {Object} User
 * @property {string} login - GitHub username
 * @property {number} id - User ID
 * @property {string} avatar_url - URL to user's avatar
 * @property {string} html_url - URL to user profile on GitHub
 */

/**
 * @typedef {Object} Issue
 * @property {number} id - Issue ID
 * @property {number} number - Issue number
 * @property {string} title - Issue title
 * @property {string} state - Issue state (open, closed)
 * @property {string} html_url - URL to the issue on GitHub
 * @property {User} user - User who created the issue
 * @property {string} created_at - Creation date
 * @property {string} updated_at - Last update date
 * @property {string} closed_at - Closing date
 * @property {number} comments - Number of comments
 * @property {Array<Comment>} [postClosureComments] - Comments added after issue was closed
 * @property {boolean} [reviewed] - Whether the issue has been marked as reviewed
 */

/**
 * @typedef {Object} Comment
 * @property {number} id - Comment ID
 * @property {User} user - User who created the comment
 * @property {string} created_at - Creation date
 * @property {string} updated_at - Last update date
 * @property {string} body - Comment content
 * @property {string} html_url - URL to the comment on GitHub
 */

/**
 * @typedef {Object} AuthState
 * @property {string|null} token - GitHub access token
 * @property {User|null} user - Authenticated user information
 * @property {boolean} isAuthenticated - Whether user is authenticated
 * @property {boolean} isLoading - Whether authentication is in progress
 * @property {string|null} error - Authentication error message
 */

export {};