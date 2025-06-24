import { createContext, useMemo } from 'react';
import useRepositoryViewModel from '../viewmodels/RepositoryViewModel';

/**
 * Context for repository state and functions
 * @type {React.Context}
 */
export const RepositoryContext = createContext({
  repositories: [],
  selectedRepo: null,
  loading: false,
  error: null,
  loadUserRepositories: () => {},
  selectRepository: () => {},
  clearSelectedRepository: () => {},
  clearError: () => {},
});

/**
 * Provider component for repository context
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const RepositoryProvider = ({ children }) => {
  // Use the repository ViewModel
  const repositoryViewModel = useRepositoryViewModel();
  
  // Memoize the context value to prevent unnecessary renders
  const contextValue = useMemo(() => ({
    ...repositoryViewModel,
  }), [
    repositoryViewModel.repositories,
    repositoryViewModel.selectedRepo,
    repositoryViewModel.loading,
    repositoryViewModel.error,
  ]);

  return (
    <RepositoryContext.Provider value={contextValue}>
      {children}
    </RepositoryContext.Provider>
  );
};

export default RepositoryProvider;