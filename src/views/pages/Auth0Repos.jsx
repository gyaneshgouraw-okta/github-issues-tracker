import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Loading from '../components/Loading';
import Alert from '../components/Alert';
import githubService from '../../services/github-service';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
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

const TableContainer = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
`;

const TableHeader = styled.th`
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
  color: #24292f;
  border-bottom: 1px solid #d0d7de;
  background-color: #f6f8fa;
  
  &:first-child {
    border-top-left-radius: 6px;
  }
  
  &:last-child {
    border-top-right-radius: 6px;
  }
`;

const TableRow = styled.tr`
  &:hover {
    background-color: #f6f8fa;
  }
  
  &:last-child td {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid #d0d7de;
  vertical-align: top;
`;

const RepoName = styled.a`
  font-weight: 600;
  color: #0969da;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Description = styled.div`
  color: #656d76;
  font-size: 0.8125rem;
  margin-top: 0.25rem;
  max-width: 300px;
  word-wrap: break-word;
`;

const LicenseBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 12px;
  background-color: #ddf4ff;
  color: #0969da;
  border: 1px solid #54aeff;
`;

const LicenseLink = styled.a`
  color: #0969da;
  text-decoration: none;
  font-size: 0.75rem;
  margin-left: 0.5rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const NoLicense = styled.span`
  color: #656d76;
  font-style: italic;
  font-size: 0.8125rem;
`;

const PrivateBadge = styled.span`
  display: inline-block;
  padding: 0.125rem 0.375rem;
  font-size: 0.6875rem;
  font-weight: 500;
  border-radius: 12px;
  background-color: #fff8c5;
  color: #9a6700;
  border: 1px solid #d4a72c;
  margin-left: 0.5rem;
`;

const StatsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const StatCard = styled(Card)`
  flex: 1;
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: #24292f;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #656d76;
  margin-top: 0.25rem;
`;

function Auth0Repos() {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuth0Repos = async () => {
      try {
        setLoading(true);
        const repos = await githubService.getOrganizationRepositories('auth0');
        setRepositories(repos);
      } catch (err) {
        setError(err.message || 'Failed to fetch Auth0 repositories');
      } finally {
        setLoading(false);
      }
    };

    fetchAuth0Repos();
  }, []);

  const stats = {
    total: repositories.length,
    withLicense: repositories.filter(repo => repo.license).length,
    private: repositories.filter(repo => repo.private).length,
    forks: repositories.filter(repo => repo.fork).length,
  };

  if (loading) {
    return (
      <Layout>
        <Container>
          <Loading message="Loading Auth0 repositories..." />
        </Container>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Container>
          <Alert
            variant="error"
            title="Error"
            message={error}
          />
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container>
        <Card>
          <Card.Body>
            <Title>Auth0 Organization Repositories</Title>
            <Subtitle>
              Overview of all repositories under the Auth0 organization with license information.
            </Subtitle>
            
            <StatsContainer>
              <StatCard>
                <Card.Body>
                  <StatNumber>{stats.total}</StatNumber>
                  <StatLabel>Total Repos</StatLabel>
                </Card.Body>
              </StatCard>
              <StatCard>
                <Card.Body>
                  <StatNumber>{stats.withLicense}</StatNumber>
                  <StatLabel>With License</StatLabel>
                </Card.Body>
              </StatCard>
              <StatCard>
                <Card.Body>
                  <StatNumber>{stats.private}</StatNumber>
                  <StatLabel>Private</StatLabel>
                </Card.Body>
              </StatCard>
              <StatCard>
                <Card.Body>
                  <StatNumber>{stats.forks}</StatNumber>
                  <StatLabel>Forks</StatLabel>
                </Card.Body>
              </StatCard>
            </StatsContainer>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <TableContainer>
              <Table>
                <thead>
                  <tr>
                    <TableHeader>Repository</TableHeader>
                    <TableHeader>License</TableHeader>
                    <TableHeader>Language</TableHeader>
                    <TableHeader>Stars</TableHeader>
                    <TableHeader>Forks</TableHeader>
                    <TableHeader>Updated</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  {repositories.map(repo => (
                    <TableRow key={repo.id}>
                      <TableCell>
                        <div>
                          <RepoName 
                            href={repo.html_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            {repo.name}
                          </RepoName>
                          {repo.private && <PrivateBadge>Private</PrivateBadge>}
                          {repo.fork && <PrivateBadge>Fork</PrivateBadge>}
                          {repo.description && (
                            <Description>{repo.description}</Description>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {repo.license ? (
                          <div>
                            <LicenseBadge>{repo.license.name}</LicenseBadge>
                            <LicenseLink 
                              href={repo.license.html_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              View License
                            </LicenseLink>
                          </div>
                        ) : (
                          <NoLicense>No license</NoLicense>
                        )}
                      </TableCell>
                      <TableCell>
                        {repo.language || <NoLicense>Not specified</NoLicense>}
                      </TableCell>
                      <TableCell>{repo.stargazers_count.toLocaleString()}</TableCell>
                      <TableCell>{repo.forks_count.toLocaleString()}</TableCell>
                      <TableCell>
                        {new Date(repo.updated_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            </TableContainer>
          </Card.Body>
        </Card>
      </Container>
    </Layout>
  );
}

export default Auth0Repos;
