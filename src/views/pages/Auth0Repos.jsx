import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { jsPDF } from 'jspdf';
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

function Auth0Repos() {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

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

  const downloadPDF = async () => {
    try {
      setDownloadingPdf(true);
      
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.text('Auth0 Organization Repositories', 14, 22);
      
      // Add subtitle with date
      doc.setFontSize(12);
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 32);
      
      // Add stats summary
      doc.setFontSize(10);
      const statsText = `Total: ${stats.total} | With License: ${stats.withLicense} | Private: ${stats.private} | Forks: ${stats.forks}`;
      doc.text(statsText, 14, 42);
      
      // Add table header
      doc.setFontSize(8);
      doc.setFont(undefined, 'bold');
      let yPosition = 55;
      const lineHeight = 6;
      const leftMargin = 14;
      
      // Table headers
      doc.text('#', leftMargin, yPosition);
      doc.text('Repository', leftMargin + 15, yPosition);
      doc.text('License', leftMargin + 80, yPosition);
      doc.text('Language', leftMargin + 130, yPosition);
      doc.text('Stars', leftMargin + 160, yPosition);
      doc.text('Forks', leftMargin + 180, yPosition);
      
      // Draw header line
      yPosition += 2;
      doc.line(leftMargin, yPosition, 195, yPosition);
      yPosition += 4;
      
      // Add table rows
      doc.setFont(undefined, 'normal');
      repositories.forEach((repo, index) => {
        // Check if we need a new page
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        
        const rowNumber = (index + 1).toString();
        const repoName = repo.name; // Show full repository name
        const license = repo.license ? (repo.license.name.length > 18 ? repo.license.name.substring(0, 18) + '...' : repo.license.name) : 'No license';
        const language = repo.language ? (repo.language.length > 12 ? repo.language.substring(0, 12) + '...' : repo.language) : 'N/A';
        const stars = repo.stargazers_count.toLocaleString();
        const forks = repo.forks_count.toLocaleString();
        
        // Add row number
        doc.text(rowNumber, leftMargin, yPosition);
        
        // Add repository name as hyperlink
        doc.setTextColor(0, 105, 218); // Blue color for links
        doc.textWithLink(repoName, leftMargin + 15, yPosition, { url: repo.html_url });
        
        // Add license as hyperlink (if available) or regular text
        if (repo.license) {
          doc.textWithLink(license, leftMargin + 80, yPosition, { url: repo.license.html_url });
        } else {
          doc.setTextColor(0, 0, 0); // Black color for non-links
          doc.text(license, leftMargin + 80, yPosition);
        }
        
        // Reset color to black for other columns
        doc.setTextColor(0, 0, 0);
        doc.text(language, leftMargin + 130, yPosition);
        doc.text(stars, leftMargin + 160, yPosition);
        doc.text(forks, leftMargin + 180, yPosition);
        
        yPosition += lineHeight;
      });
      
      // Add footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Page ${i} of ${pageCount}`, 14, 285);
        doc.text('Generated by GitHub Issues Tracker', 150, 285);
      }
      
      // Save the PDF
      doc.save(`auth0-repositories-${new Date().toISOString().split('T')[0]}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      // You could show an error message to the user here
    } finally {
      setDownloadingPdf(false);
    }
  };

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
            <HeaderSection>
              <HeaderContent>
                <Title>Auth0 Organization Repositories</Title>
                <Subtitle>
                  Overview of all repositories under the Auth0 organization with license information.
                </Subtitle>
              </HeaderContent>
              <DownloadButton 
                onClick={downloadPDF} 
                disabled={downloadingPdf || repositories.length === 0}
                variant="primary"
              >
                {downloadingPdf ? (
                  <>
                    <SpinnerIcon width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 11-6.219-8.56"/>
                    </SpinnerIcon>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '0.5rem' }}>
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </>
                )}
              </DownloadButton>
            </HeaderSection>
            
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
