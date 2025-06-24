import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import Loading from '../components/Loading';
import Alert from '../components/Alert';
import RepoSearch from '../components/RepoSearch';
import { RepositoryContext } from '../../context/RepositoryContext';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  max-width: 960px;
  margin: 0 auto;
`;

const WelcomeCard = styled(Card)`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #586069;
  margin-bottom: 1.5rem;
`;

const SectionDivider = styled.div`
  border-top: 1px solid #e1e4e8;
  margin: 1.5rem 0;
  padding-top: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const RepoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
`;

const RepoCard = styled(Card)`
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const RepoName = styled.h3`
  font-size: 1rem;
  margin: 0;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RepoDescription = styled.p`
  font-size: 0.875rem;
  color: #586069;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  height: 2.6rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
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
 * Home page component
 */
function Home() {
  const navigate = useNavigate();
  const { repositories, loading, error, loadUserRepositories, searchRepository } = useContext(RepositoryContext);
  const [loadingError, setLoadingError] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  
  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        await loadUserRepositories();
      } catch (err) {
        setLoadingError('Failed to load repositories. Please try again later.');
      }
    };
    
    fetchRepositories();
  }, [loadUserRepositories]);
  
  const handleSelectRepo = (owner, name) => {
    navigate(`/repo/${owner}/${name}/issues`);
  };
  
  const handleSearch = async (repoString) => {
    setSearchLoading(true);
    setSearchError(null);
    
    try {
      const repository = await searchRepository(repoString);
      const [owner, repo] = repoString.split('/');
      
      // Navigate to the repository's issues page
      navigate(`/repo/${owner}/${repo}/issues`);
    } catch (err) {
      setSearchError(err.message || 'Failed to find repository');
      setSearchLoading(false);
    }
  };

  return (
    <Layout>
      <Container>
        <WelcomeCard>
          <Card.Body>
            <Title>GitHub Issue Tracker</Title>
            <Subtitle>
              Find closed issues with post-closure comments. Select a repository to get started.
            </Subtitle>
          </Card.Body>
        </WelcomeCard>
        
        {/* Repository Search Section */}
        <Card>
          <Card.Body>
            <SectionTitle>Search Any Repository</SectionTitle>
            <RepoSearch onSearch={handleSearch} />
            {searchLoading && <Loading message="Searching repository..." />}
            {searchError && (
              <Alert
                variant="error"
                title="Search Error"
                message={searchError}
                dismissible
                onDismiss={() => setSearchError(null)}
              />
            )}
          </Card.Body>
        </Card>
        
        <SectionDivider />
        <SectionTitle>Your Repositories</SectionTitle>
        
        {(error || loadingError) && (
          <Alert
            variant="error"
            title="Error"
            message={error || loadingError}
            dismissible
            onDismiss={() => setLoadingError(null)}
          />
        )}
        
        {loading ? (
          <Loading message="Loading repositories..." />
        ) : repositories.length > 0 ? (
          <RepoGrid>
            {repositories.map(repo => (
              <RepoCard 
                key={repo.id}
                onClick={() => handleSelectRepo(repo.owner.login, repo.name)}
              >
                <Card.Body>
                  <RepoName>{repo.name}</RepoName>
                  <div style={{ fontSize: '0.75rem', color: '#586069', marginTop: '0.25rem' }}>
                    {repo.owner.login}
                  </div>
                  {repo.description && (
                    <RepoDescription>{repo.description}</RepoDescription>
                  )}
                  <Button size="small" variant="secondary">
                    View Issues
                  </Button>
                </Card.Body>
              </RepoCard>
            ))}
          </RepoGrid>
        ) : (
          <EmptyState>
            <EmptyStateIcon>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path>
                <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon>
              </svg>
            </EmptyStateIcon>
            <EmptyStateTitle>No repositories found</EmptyStateTitle>
            <p>
              We couldn't find any repositories associated with your account.
              Make sure your token has sufficient permissions.
            </p>
            <Button onClick={() => loadUserRepositories()}>
              Refresh Repositories
            </Button>
          </EmptyState>
        )}
      </Container>
    </Layout>
  );
}

export default Home;