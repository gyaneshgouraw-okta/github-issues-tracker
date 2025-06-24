import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Loading from '../components/Loading';
import Alert from '../components/Alert';
import IssueCard from '../components/IssueCard';
import { RepositoryContext } from '../../context/RepositoryContext';
import { IssueContext } from '../../context/IssueContext';
import { formatDateForInput } from '../../utils/dateUtils';

const Container = styled.div`
  max-width: 960px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 1.5rem;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
`;

const RepoInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #586069;
`;

const RepoName = styled.span`
  font-weight: 500;
`;

const FilterSection = styled.div`
  margin-bottom: 1.5rem;
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const SortGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SortLabel = styled.label`
  font-size: 0.875rem;
  color: #586069;
`;

const SortSelect = styled.select`
  padding: 0.375rem 0.75rem;
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #24292e;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #0366d6;
    box-shadow: 0 0 0 3px rgba(3, 102, 214, 0.3);
  }
`;

const ResultSummary = styled.div`
  font-size: 0.875rem;
  color: #586069;
  margin-bottom: 1rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
`;

const EmptyStateIcon = styled.div`
  margin-bottom: 1.5rem;
  color: #959da5;
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
`;

/**
 * Issues list page component
 */
function IssuesList() {
  const { owner, repo } = useParams();
  const { selectRepository, selectedRepo } = useContext(RepositoryContext);
  const { 
    issues, 
    loading, 
    error, 
    totalCount,
    filteredCount,
    filters,
    sortField,
    sortDirection,
    loadIssuesWithPostClosureComments,
    updateFilters,
    updateSorting
  } = useContext(IssueContext);
  
  const [initialLoad, setInitialLoad] = useState(true);
  
  // Load repository and issues
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Select repository
        await selectRepository(owner, repo);
        
        // Load issues with post-closure comments
        await loadIssuesWithPostClosureComments(owner, repo);
        
        setInitialLoad(false);
      } catch (err) {
        // Error handling is managed by the contexts
        setInitialLoad(false);
      }
    };
    
    fetchData();
  }, [owner, repo, selectRepository, loadIssuesWithPostClosureComments]);
  
  const handleUpdateMinComments = (value) => {
    const minComments = parseInt(value, 10) || 1;
    updateFilters({ minComments });
  };
  
  const handleUpdateAfterDate = (dateString) => {
    updateFilters({ afterDate: dateString ? new Date(dateString) : null });
  };
  
  const handleUpdateSort = (e) => {
    const [field, direction] = e.target.value.split(':');
    updateSorting(field, direction);
  };

  return (
    <Layout>
      <Container>
        <Header>
          <HeaderRow>
            <Title>Closed Issues with Comments</Title>
          </HeaderRow>
          
          {selectedRepo && (
            <RepoInfo>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path fillRule="evenodd" d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"></path>
              </svg>
              <RepoName>{owner}/{repo}</RepoName>
            </RepoInfo>
          )}
        </Header>
        
        {error && (
          <Alert
            variant="error"
            title="Error"
            message={error}
            dismissible
          />
        )}
        
        <FilterSection>
          <Card>
            <Card.Body>
              <FilterGrid>
                <Input
                  id="min-comments"
                  label="Minimum Comments"
                  type="number"
                  min="1"
                  value={filters.minComments}
                  onChange={(e) => handleUpdateMinComments(e.target.value)}
                  noMargin
                />
                
                <Input
                  id="after-date"
                  label="Closed After Date"
                  type="date"
                  value={filters.afterDate ? formatDateForInput(filters.afterDate) : ''}
                  onChange={(e) => handleUpdateAfterDate(e.target.value)}
                  noMargin
                />
                
                <SortGroup>
                  <SortLabel htmlFor="sort-by">Sort By</SortLabel>
                  <SortSelect 
                    id="sort-by" 
                    value={`${sortField}:${sortDirection}`}
                    onChange={handleUpdateSort}
                  >
                    <option value="closed_at:desc">Closed Date (Newest)</option>
                    <option value="closed_at:asc">Closed Date (Oldest)</option>
                    <option value="postClosureComments.length:desc">Most Post-Closure Comments</option>
                    <option value="postClosureComments.length:asc">Fewest Post-Closure Comments</option>
                  </SortSelect>
                </SortGroup>
              </FilterGrid>
            </Card.Body>
          </Card>
        </FilterSection>
        
        {loading || initialLoad ? (
          <Loading message="Loading issues with post-closure comments..." />
        ) : (
          <>
            {issues.length > 0 ? (
              <>
                <ResultSummary>
                  Showing {filteredCount} issues with post-closure comments
                  {totalCount !== filteredCount && ` (filtered from ${totalCount} total)`}
                </ResultSummary>
                
                {issues.map(issue => (
                  <IssueCard key={issue.id} issue={issue} />
                ))}
              </>
            ) : (
              <EmptyState>
                <EmptyStateIcon>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </EmptyStateIcon>
                <EmptyStateTitle>No issues found</EmptyStateTitle>
                <p>
                  We couldn't find any closed issues with post-closure comments in this repository.
                </p>
                <Button 
                  onClick={() => loadIssuesWithPostClosureComments(owner, repo)}
                  variant="secondary"
                >
                  Refresh Issues
                </Button>
              </EmptyState>
            )}
          </>
        )}
      </Container>
    </Layout>
  );
}

export default IssuesList;