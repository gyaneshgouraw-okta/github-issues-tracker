import { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import Layout from '../components/Layout';
import { AuthContext } from '../../context/AuthContext';
import { User, Github, Star, GitFork, Calendar, ExternalLink, Code, Users, Activity, Heart } from 'lucide-react';

const AboutContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 1rem;
  
  svg {
    color: #6366f1;
  }
`;

const Section = styled.div`
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(226, 232, 240, 0.6);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 
    0 4px 12px -2px rgba(0, 0, 0, 0.08),
    0 2px 6px -1px rgba(0, 0, 0, 0.04);
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  svg {
    color: #6366f1;
  }
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
`;

const UserAvatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid rgba(99, 102, 241, 0.2);
  box-shadow: 0 8px 32px -8px rgba(0, 0, 0, 0.2);
`;

const AvatarFallback = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1 0%, #3b82f6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  font-weight: 600;
  border: 4px solid rgba(99, 102, 241, 0.2);
  box-shadow: 0 8px 32px -8px rgba(0, 0, 0, 0.2);
`;

const UserDetails = styled.div`
  flex: 1;
`;

const UserName = styled.h3`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
`;

const UserLogin = styled.p`
  font-size: 1.125rem;
  color: #64748b;
  margin: 0 0 1rem 0;
  font-weight: 500;
`;

const UserBio = styled.p`
  font-size: 1rem;
  color: #475569;
  margin: 0 0 1rem 0;
  line-height: 1.6;
`;

const UserStats = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-size: 0.875rem;
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const ProjectInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const InfoCard = styled.div`
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(226, 232, 240, 0.4);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1);
    border-color: rgba(99, 102, 241, 0.3);
  }
`;

const InfoTitle = styled.h4`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: #6366f1;
    width: 18px;
    height: 18px;
  }
`;

const InfoContent = styled.div`
  color: #475569;
  line-height: 1.6;
  
  p {
    margin: 0 0 0.75rem 0;
    
    &:last-child {
      margin: 0;
    }
  }
  
  a {
    color: #6366f1;
    text-decoration: none;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    
    &:hover {
      text-decoration: underline;
    }
    
    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

const TechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const TechBadge = styled.span`
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(59, 130, 246, 0.08) 100%);
  color: #6366f1;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid rgba(99, 102, 241, 0.2);
`;

const CreatorSection = styled.div`
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, 
    rgba(99, 102, 241, 0.05) 0%, 
    rgba(236, 72, 153, 0.05) 50%,
    rgba(59, 130, 246, 0.05) 100%
  );
  border-radius: 16px;
  border: 1px solid rgba(99, 102, 241, 0.1);
  backdrop-filter: blur(8px);
  margin-top: 1rem;
`;

const CreatorText = styled.p`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  .heart {
    color: #ec4899;
    animation: heartbeat 2s ease-in-out infinite;
  }
  
  .creator-name {
    background: linear-gradient(135deg, #6366f1 0%, #ec4899 50%, #3b82f6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 700;
  }
  
  @keyframes heartbeat {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }
`;

function About() {
  const { user } = useContext(AuthContext);
  const [projectData, setProjectData] = useState(null);

  useEffect(() => {
    // Set project data - this could be fetched from GitHub API in a real scenario
    setProjectData({
      name: 'GitHub Issues Tracker',
      description: 'A modern React application for tracking and managing GitHub issues with advanced filtering and analytics capabilities.',
      repository: 'https://github.com/gyaneshgouraw-okta/github-issues-tracker',
      version: '1.0.0',
      technologies: ['React 19', 'Vite', 'Styled Components', 'React Router', 'Lucide React', 'GitHub API'],
      features: [
        'Real-time issue tracking',
        'Advanced search and filtering',
        'Repository management',
        'User authentication with GitHub',
        'Modern glass morphism UI',
        'Responsive design',
        'Dark mode support'
      ]
    });
  }, []);

  if (!user) {
    return (
      <Layout>
        <AboutContainer>
          <PageTitle>
            <User />
            About
          </PageTitle>
          <Section>
            <p>Please log in to view your profile information.</p>
          </Section>
        </AboutContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <AboutContainer>
        <PageTitle>
          <User />
          About
        </PageTitle>

        <Section>
          <SectionTitle>
            <User />
            User Profile
          </SectionTitle>
          
          <UserProfile>
            {user.avatar_url ? (
              <UserAvatar src={user.avatar_url} alt={user.login} />
            ) : (
              <AvatarFallback>
                <User size={48} />
              </AvatarFallback>
            )}
            
            <UserDetails>
              <UserName>{user.name || user.login}</UserName>
              <UserLogin>@{user.login}</UserLogin>
              {user.bio && <UserBio>{user.bio}</UserBio>}
              
              <UserStats>
                {user.public_repos !== undefined && (
                  <StatItem>
                    <Github />
                    {user.public_repos} repositories
                  </StatItem>
                )}
                {user.followers !== undefined && (
                  <StatItem>
                    <Users />
                    {user.followers} followers
                  </StatItem>
                )}
                {user.following !== undefined && (
                  <StatItem>
                    <Activity />
                    {user.following} following
                  </StatItem>
                )}
                {user.created_at && (
                  <StatItem>
                    <Calendar />
                    Joined {new Date(user.created_at).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long' 
                    })}
                  </StatItem>
                )}
              </UserStats>
            </UserDetails>
          </UserProfile>
        </Section>

        {projectData && (
          <Section>
            <SectionTitle>
              <Github />
              Project Information
            </SectionTitle>
            
            <ProjectInfo>
              <InfoCard>
                <InfoTitle>
                  <Code />
                  About This Project
                </InfoTitle>
                <InfoContent>
                  <p><strong>{projectData.name}</strong> v{projectData.version}</p>
                  <p>{projectData.description}</p>
                  <p>
                    <a href={projectData.repository} target="_blank" rel="noopener noreferrer">
                      View on GitHub <ExternalLink />
                    </a>
                  </p>
                </InfoContent>
              </InfoCard>

              <InfoCard>
                <InfoTitle>
                  <Star />
                  Key Features
                </InfoTitle>
                <InfoContent>
                  {projectData.features.map((feature, index) => (
                    <p key={index}>• {feature}</p>
                  ))}
                </InfoContent>
              </InfoCard>

              <InfoCard>
                <InfoTitle>
                  <GitFork />
                  Technology Stack
                </InfoTitle>
                <InfoContent>
                  <p>Built with modern web technologies:</p>
                  <TechStack>
                    {projectData.technologies.map((tech, index) => (
                      <TechBadge key={index}>{tech}</TechBadge>
                    ))}
                  </TechStack>
                </InfoContent>
              </InfoCard>

              <InfoCard>
                <InfoTitle>
                  <Activity />
                  Development
                </InfoTitle>
                <InfoContent>
                  <p>This project demonstrates modern React development practices including:</p>
                  <p>• React 19 with latest hooks and patterns</p>
                  <p>• Component-based architecture</p>
                  <p>• Modern UI/UX design principles</p>
                  <p>• Responsive and accessible design</p>
                  <p>• Integration with GitHub API</p>
                </InfoContent>
              </InfoCard>
            </ProjectInfo>
          </Section>
        )}
        
        <CreatorSection>
          <CreatorText>
            Created with <Heart className="heart" size={20} /> by <span className="creator-name">ಗ್ಯಾನೇಶ್ | ज्ञानेश | Gyanesh Gouraw</span>
          </CreatorText>
        </CreatorSection>
      </AboutContainer>
    </Layout>
  );
}

export default About;
