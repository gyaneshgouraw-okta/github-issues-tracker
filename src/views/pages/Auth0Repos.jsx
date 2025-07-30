import { useState, useEffect, useActionState, useOptimistic, startTransition } from 'react';
import styled, { keyframes } from 'styled-components';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import Loading from '../components/Loading';
import Alert from '../components/Alert';
import githubService from '../../services/github-service';

// Keyframe animation for spinner
const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

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

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const DownloadButton = styled(Button)`
  margin-left: 1rem;
  flex-shrink: 0;
`;

const SpinnerIcon = styled.svg`
  animation: ${spin} 1s linear infinite;
  margin-right: 0.5rem;
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

// PDF download action for useActionState
async function downloadPDFAction(prevState, formData) {
  try {
    const repositories = formData.get('repositories');
    const stats = formData.get('stats');
    
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Auth0 Organization Repositories', 14, 22);
    
    // Add subtitle with date
    doc.setFontSize(12);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 32);
    
    // Add stats summary
    doc.setFontSize(10);
    const parsedStats = JSON.parse(stats);
    const statsText = `Total: ${parsedStats.total} | With License: ${parsedStats.withLicense} | Private: ${parsedStats.private} | Forks: ${parsedStats.forks}`;
    doc.text(statsText, 14, 42);
    
    // Add table using autoTable for better formatting
    const parsedRepos = JSON.parse(repositories);
    const tableData = parsedRepos.map((repo, index) => [
      index + 1,
      repo.name,
      repo.license ? repo.license.name : 'No license',
      repo.language || 'N/A',
      repo.stargazers_count.toLocaleString(),
      repo.forks_count.toLocaleString(),
      new Date(repo.updated_at).toLocaleDateString(),
      repo.private ? 'Yes' : 'No',
      repo.fork ? 'Yes' : 'No'
    ]);
    
    doc.autoTable({
      head: [['#', 'Repository', 'License', 'Language', 'Stars', 'Forks', 'Updated', 'Private', 'Fork']],
      body: tableData,
      startY: 50,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 40 },
        2: { cellWidth: 30 },
        3: { cellWidth: 20 },
        4: { cellWidth: 15 },
        5: { cellWidth: 15 },
        6: { cellWidth: 25 },
        7: { cellWidth: 15 },
        8: { cellWidth: 15 }
      }
    });
    
    // Save the PDF
    doc.save(`auth0-repositories-${new Date().toISOString().split('T')[0]}.pdf`);
    
    return { success: true, message: 'PDF downloaded successfully!' };
  } catch (error) {
    console.error('Error generating PDF:', error);
    return { success: false, message: 'Failed to generate PDF' };
  }
}

function Auth0Repos() {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // React 19: useActionState for PDF download
  const [downloadState, downloadAction, isPending] = useActionState(downloadPDFAction, {
    success: false,
    message: ''
  });
  
  // React 19: useOptimistic for optimistic UI updates
  const [optimisticRepos, setOptimisticRepos] = useOptimistic(
    repositories,
    (state, optimisticValue) => {
      if (optimisticValue.type === 'loading') {
        return [];
      }
      return optimisticValue.data || state;
    }
  );

  useEffect(() => {
    const fetchAuth0Repos = async () => {
      try {
        setLoading(true);
        
        // React 19: Use startTransition for better UX
        startTransition(() => {
          setOptimisticRepos({ type: 'loading' });
        });
        
        const repos = await githubService.getOrganizationRepositories('auth0');
        
        startTransition(() => {
          setRepositories(repos);
          setOptimisticRepos({ type: 'success', data: repos });
        });
      } catch (err) {
        setError(err.message || 'Failed to fetch Auth0 repositories');
      } finally {
        setLoading(false);
      }
    };

    fetchAuth0Repos();
  }, []);

  // Handle PDF download using the new action
  const handleDownloadPDF = () => {
    const formData = new FormData();
    formData.append('repositories', JSON.stringify(optimisticRepos));
    formData.append('stats', JSON.stringify(stats));
    downloadAction(formData);
  };

  // Use optimistic repos for stats calculation
  const stats = {
    total: optimisticRepos.length,
    withLicense: optimisticRepos.filter(repo => repo.license).length,
    private: optimisticRepos.filter(repo => repo.private).length,
    forks: optimisticRepos.filter(repo => repo.fork).length,
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
            <HeaderSection>
              <HeaderContent>
                <Title>Auth0 Organization Repositories</Title>
                <Subtitle>
                  Overview of all repositories under the Auth0 organization with license information.
                </Subtitle>
              </HeaderContent>
              <DownloadButton
                onClick={handleDownloadPDF}
                disabled={optimisticRepos.length === 0 || isPending}
              >
                {isPending ? (
                  <>
                    <SpinnerIcon width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M21 12a9 9 0 11-6.219-8.56"/>
                    </SpinnerIcon>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ marginRight: '0.5rem' }}>
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </>
                )}
              </DownloadButton>
            </HeaderSection>
            
            {/* React 19: Display action state feedback */}
            {downloadState.message && (
              <Alert
                variant={downloadState.success ? "success" : "error"}
                title={downloadState.success ? "Success" : "Error"}
                message={downloadState.message}
              />
            )}
            
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
                  {optimisticRepos.map(repo => (
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
