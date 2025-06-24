import { createContext, useMemo } from 'react';
import useIssueViewModel from '../viewmodels/IssueViewModel';

/**
 * Context for issue state and functions
 * @type {React.Context}
 */
export const IssueContext = createContext({
  issues: [],
  totalCount: 0,
  filteredCount: 0,
  loading: false,
  error: null,
  filters: {},
  sortField: 'closed_at',
  sortDirection: 'desc',
  loadIssuesWithPostClosureComments: () => {},
  updateFilters: () => {},
  updateSorting: () => {},
  clearIssues: () => {},
  clearError: () => {},
});

/**
 * Provider component for issue context
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const IssueProvider = ({ children }) => {
  // Use the issue ViewModel
  const issueViewModel = useIssueViewModel();
  
  // Memoize the context value to prevent unnecessary renders
  const contextValue = useMemo(() => ({
    ...issueViewModel,
  }), [
    issueViewModel.issues,
    issueViewModel.totalCount,
    issueViewModel.filteredCount,
    issueViewModel.loading,
    issueViewModel.error,
    issueViewModel.filters,
    issueViewModel.sortField,
    issueViewModel.sortDirection,
  ]);

  return (
    <IssueContext.Provider value={contextValue}>
      {children}
    </IssueContext.Provider>
  );
};

export default IssueProvider;