import { useState, useCallback } from 'react';
import githubService from '../services/github-service';

/**
 * Repository ViewModel - Manages repository data and operations
 * @returns {Object} Repository state and methods
 */
export function useRepositoryViewModel() {
  const [repositories, setRepositories] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Load repositories for the authenticated user
   * @returns {Promise<Array>} - List of repositories
   */
  const loadUserRepositories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const repos = await githubService.getUserRepositories();
      setRepositories(repos);
      
      return repos;
    } catch (error) {
      setError(error.message || 'Failed to load repositories');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Select a repository by owner and name
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @returns {Promise<Object>} - Repository information
   */
  const selectRepository = useCallback(async (owner, repo) => {
    try {
      setLoading(true);
      setError(null);
      
      const repository = await githubService.getRepository(owner, repo);
      setSelectedRepo(repository);
      
      return repository;
    } catch (error) {
      setError(error.message || `Failed to select repository: ${owner}/${repo}`);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Search for a repository by owner/name string
   * @param {string} repoString - Repository string in format "owner/name"
   * @returns {Promise<Object>} - Repository information
   */
  const searchRepository = useCallback(async (repoString) => {
    try {
      setLoading(true);
      setError(null);
      
      // Parse owner and repo name from the input string
      const [owner, repo] = repoString.split('/');
      
      if (!owner || !repo) {
        throw new Error('Invalid repository format. Use "owner/repo"');
      }
      
      // Use the existing getRepository method to fetch the repo
      const repository = await githubService.getRepository(owner, repo);
      
      // Don't add it to the repositories list since it's just a search result
      setSelectedRepo(repository);
      
      return repository;
    } catch (error) {
      setError(error.message || `Failed to find repository: ${repoString}`);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clear the selected repository
   */
  const clearSelectedRepository = useCallback(() => {
    setSelectedRepo(null);
  }, []);

  /**
   * Clear any repository errors
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    repositories,
    selectedRepo,
    loading,
    error,
    loadUserRepositories,
    selectRepository,
    searchRepository,
    clearSelectedRepository,
    clearError,
  };
}

export default useRepositoryViewModel;