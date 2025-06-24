import { useState, useCallback, useMemo, useEffect } from 'react';
import githubService from '../services/github-service';

/**
 * Issue ViewModel - Manages issue data and operations
 * @returns {Object} Issue state and methods
 */
export function useIssueViewModel() {
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState('closed_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filters, setFilters] = useState({
    minComments: 1,
    afterDate: null,
    showReviewed: true,
  });
  
  // Load reviewed issues from localStorage on initialization
  useEffect(() => {
    const loadReviewedIssues = () => {
      try {
        const storedReviewed = localStorage.getItem('github_unread_reviewed_issues');
        if (storedReviewed) {
          const reviewedIssueIds = JSON.parse(storedReviewed);
          
          // Apply reviewed status to any already loaded issues
          if (issues.length > 0 && reviewedIssueIds.length > 0) {
            setIssues(prevIssues => 
              prevIssues.map(issue => ({
                ...issue,
                reviewed: reviewedIssueIds.includes(issue.id)
              }))
            );
          }
        }
      } catch (error) {
        console.error('Error loading reviewed issues from localStorage:', error);
      }
    };
    
    loadReviewedIssues();
  }, []);

  /**
   * Load issues with post-closure comments for the selected repository
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @returns {Promise<Array>} - List of issues with post-closure comments
   */
  const loadIssuesWithPostClosureComments = useCallback(async (owner, repo) => {
    try {
      setLoading(true);
      setError(null);
      
      const issuesWithComments = await githubService.getIssuesWithPostClosureComments(owner, repo);
      
      // Apply any previously marked reviews from localStorage
      try {
        const storedReviewed = localStorage.getItem('github_unread_reviewed_issues');
        if (storedReviewed) {
          const reviewedIssueIds = JSON.parse(storedReviewed);
          
          // Apply the reviewed status to newly loaded issues
          const issuesWithReviewStatus = issuesWithComments.map(issue => ({
            ...issue,
            reviewed: reviewedIssueIds.includes(issue.id)
          }));
          
          setIssues(issuesWithReviewStatus);
          
          // Apply any active filters/sorting
          applyFiltersAndSort(issuesWithReviewStatus);
          
          return issuesWithReviewStatus;
        } else {
          setIssues(issuesWithComments);
          
          // Apply any active filters/sorting
          applyFiltersAndSort(issuesWithComments);
          
          return issuesWithComments;
        }
      } catch (error) {
        console.error('Error applying reviewed status from localStorage:', error);
        setIssues(issuesWithComments);
        
        // Apply any active filters/sorting
        applyFiltersAndSort(issuesWithComments);
        
        return issuesWithComments;
      }
    } catch (error) {
      setError(error.message || `Failed to load issues for ${owner}/${repo}`);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Apply filters and sorting to issues
   * @param {Array} issuesList - Optional list of issues to filter (uses state if not provided)
   */
  const applyFiltersAndSort = useCallback((issuesList = null) => {
    const issuesToFilter = issuesList || issues;
    
    // Apply filters
    let filtered = issuesToFilter;
    
    // Filter by minimum comment count
    if (filters.minComments > 1) {
      filtered = filtered.filter(issue => 
        issue.postClosureComments.length >= filters.minComments
      );
    }
    
    // Filter by date
    if (filters.afterDate) {
      const afterDate = new Date(filters.afterDate);
      filtered = filtered.filter(issue =>
        new Date(issue.closed_at) >= afterDate
      );
    }
    
    // We show all issues regardless of reviewed status when showReviewed is true
    // If showReviewed is false, we'd filter them out here, but that's not needed
    // per requirements (they should continue showing in results)
    
    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      // Handle nested fields like 'user.login'
      const fieldParts = sortField.split('.');
      
      let valueA = a;
      let valueB = b;
      
      for (const part of fieldParts) {
        valueA = valueA[part];
        valueB = valueB[part];
      }
      
      // Determine sort order
      if (sortDirection === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
    
    setFilteredIssues(sorted);
  }, [issues, sortField, sortDirection, filters]);
  
  /**
   * Update filters and apply them
   * @param {Object} newFilters - New filter values
   */
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => {
      const updated = { ...prev, ...newFilters };
      return updated;
    });
    
    // Apply updated filters on next render cycle
    setTimeout(() => applyFiltersAndSort(), 0);
  }, [applyFiltersAndSort]);
  
  /**
   * Update sorting and apply it
   * @param {string} field - Field to sort by
   * @param {string} direction - Sort direction ('asc' or 'desc')
   */
  const updateSorting = useCallback((field, direction) => {
    setSortField(field);
    setSortDirection(direction);
    
    // Apply updated sorting on next render cycle
    setTimeout(() => applyFiltersAndSort(), 0);
  }, [applyFiltersAndSort]);
  
  /**
   * Clear loaded issues
   */
  const clearIssues = useCallback(() => {
    setIssues([]);
    setFilteredIssues([]);
  }, []);
  
  /**
   * Clear any issue errors
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  /**
   * Mark an issue as reviewed
   * @param {number} issueId - ID of the issue to mark as reviewed
   */
  const markIssueAsReviewed = useCallback((issueId) => {
    // Update issues state
    setIssues(prev => {
      const updatedIssues = prev.map(issue => 
        issue.id === issueId ? { ...issue, reviewed: true } : issue
      );
      return updatedIssues;
    });
    
    // Store in localStorage for persistence
    try {
      // Get existing reviewed issues
      const storedReviewed = localStorage.getItem('github_unread_reviewed_issues');
      let reviewedIssueIds = storedReviewed ? JSON.parse(storedReviewed) : [];
      
      // Add current issue if not already in the list
      if (!reviewedIssueIds.includes(issueId)) {
        reviewedIssueIds.push(issueId);
        localStorage.setItem('github_unread_reviewed_issues', JSON.stringify(reviewedIssueIds));
      }
    } catch (error) {
      console.error('Error saving reviewed status to localStorage:', error);
    }
    
    // Apply updated status on next render cycle
    setTimeout(() => applyFiltersAndSort(), 0);
  }, [applyFiltersAndSort]);

  // Export only the filtered issues
  const displayedIssues = useMemo(() => filteredIssues, [filteredIssues]);

  return {
    issues: displayedIssues,
    totalCount: issues.length,
    filteredCount: filteredIssues.length,
    loading,
    error,
    filters,
    sortField,
    sortDirection,
    loadIssuesWithPostClosureComments,
    updateFilters,
    updateSorting,
    clearIssues,
    clearError,
    markIssueAsReviewed,
  };
}

export default useIssueViewModel;