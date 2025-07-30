import { useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { RepositoryContext } from '../../context/RepositoryContext';
import { Search, Home, Settings, BookOpen, Star, GitBranch, Clock, Info } from 'lucide-react';

const SidebarContainer = styled.aside`
  position: fixed;
  left: ${props => props.isOpen ? '0' : '-280px'};
  top: 60px;
  width: 300px;
  height: calc(100vh - 60px);
  background: linear-gradient(180deg, 
    rgba(255, 255, 255, 0.98) 0%, 
    rgba(248, 250, 252, 0.95) 100%
  );
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(226, 232, 240, 0.6);
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  z-index: 999;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
  padding: 1.5rem 0;
  box-shadow: 
    0 10px 25px -5px rgba(0, 0, 0, 0.08),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(156, 163, 175, 0.3);
    border-radius: 3px;
    
    &:hover {
      background: rgba(156, 163, 175, 0.5);
    }
  }
`;

const SectionTitle = styled.h3`
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 2rem 0 1rem;
  padding: 0 1.5rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:first-child {
    margin-top: 0;
  }
  
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, rgba(148, 163, 184, 0.2), transparent);
  }
`;

const RepoList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const RepoCard = styled.li`
  margin: 0 1rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  background: ${props => props.active 
    ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(59, 130, 246, 0.05) 100%)'
    : 'rgba(255, 255, 255, 0.4)'
  };
  border: 1px solid ${props => props.active 
    ? 'rgba(99, 102, 241, 0.2)' 
    : 'rgba(226, 232, 240, 0.5)'
  };
  backdrop-filter: blur(8px);
  
  &:hover {
    transform: translateY(-1px);
    background: ${props => props.active 
      ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(59, 130, 246, 0.08) 100%)'
      : 'rgba(255, 255, 255, 0.7)'
    };
    border-color: ${props => props.active 
      ? 'rgba(99, 102, 241, 0.3)' 
      : 'rgba(99, 102, 241, 0.2)'
    };
    box-shadow: 
      0 4px 12px -2px rgba(0, 0, 0, 0.08),
      0 2px 6px -1px rgba(0, 0, 0, 0.04);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const RepoCardContent = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const RepoHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const RepoIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${props => props.active 
    ? 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)'
    : 'linear-gradient(135deg, #64748b 0%, #475569 100%)'
  };
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  flex-shrink: 0;
`;

const RepoInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const RepoName = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.active ? '#6366f1' : '#1e293b'};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
`;

const RepoMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #64748b;
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const NavMenu = styled.nav`
  margin-bottom: 1rem;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const NavItem = styled.li`
  margin: 0 1rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  background: ${props => props.active 
    ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(59, 130, 246, 0.08) 100%)'
    : 'transparent'
  };
  
  &:hover {
    background: ${props => props.active 
      ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(59, 130, 246, 0.12) 100%)'
      : 'rgba(255, 255, 255, 0.5)'
    };
    transform: translateX(2px);
  }
`;

const NavLink = styled.div`
  display: flex;
  align-items: center;
  padding: 0.875rem 1rem;
  color: ${props => props.active ? '#6366f1' : '#475569'};
  font-size: 0.875rem;
  font-weight: ${props => props.active ? '600' : '500'};
  gap: 0.75rem;
  border-radius: 10px;
  
  svg {
    width: 18px;
    height: 18px;
    opacity: ${props => props.active ? '1' : '0.7'};
  }
`;

const SearchContainer = styled.div`
  position: relative;
  margin: 0 1rem 1rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 2.75rem;
  border: 1px solid rgba(226, 232, 240, 0.6);
  border-radius: 12px;
  font-size: 0.875rem;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  box-sizing: border-box;
  
  &::placeholder {
    color: #94a3b8;
    font-weight: 400;
  }
  
  &:focus {
    outline: none;
    border-color: rgba(99, 102, 241, 0.4);
    background: rgba(255, 255, 255, 0.9);
    box-shadow: 
      0 0 0 3px rgba(99, 102, 241, 0.1),
      0 4px 12px -2px rgba(0, 0, 0, 0.08);
    transform: translateY(-1px);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  pointer-events: none;
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

// Helper function to get language colors
const getLanguageColor = (language) => {
  const colors = {
    JavaScript: '#f1e05a',
    TypeScript: '#2b7489',
    Python: '#3572A5',
    Java: '#b07219',
    HTML: '#e34c26',
    CSS: '#563d7c',
    PHP: '#4F5D95',
    Ruby: '#701516',
    Go: '#00ADD8',
    Rust: '#dea584',
    Swift: '#ffac45',
    Kotlin: '#F18E33',
    C: '#555555',
    'C++': '#f34b7d',
    'C#': '#239120',
    Shell: '#89e051',
    Vue: '#2c3e50',
    React: '#61dafb',
    default: '#64748b'
  };
  return colors[language] || colors.default;
};

// Helper function to format dates
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return '1d ago';
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)}w ago`;
  if (diffDays < 365) return `${Math.ceil(diffDays / 30)}mo ago`;
  return `${Math.ceil(diffDays / 365)}y ago`;
};

/**
 * Sidebar component for navigation and repository selection
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the sidebar is visible
 */
function Sidebar({ isOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { repositories, selectedRepo, selectRepository } = useContext(RepositoryContext);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelectRepo = (owner, name) => {
    selectRepository(owner, name);
    navigate(`/repo/${owner}/${name}/issues`);
  };
  
  // Filter repositories based on search term
  const filteredRepos = searchTerm 
    ? repositories.filter(repo => 
        repo.full_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : repositories;

  return (
    <SidebarContainer isOpen={isOpen}>
      <NavMenu>
        <NavList>
          <NavItem active={location.pathname === '/'} onClick={() => navigate('/')}>
            <NavLink active={location.pathname === '/'}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path fillRule="evenodd" d="M8.156 1.835a.25.25 0 00-.312 0l-5.25 4.2a.25.25 0 00-.094.196v7.019c0 .138.112.25.25.25H5.5V8.25a.75.75 0 01.75-.75h3.5a.75.75 0 01.75.75v5.25h2.75a.25.25 0 00.25-.25V6.23a.25.25 0 00-.094-.195l-5.25-4.2zM6.906.664a1.75 1.75 0 012.187 0l5.25 4.2c.415.332.657.835.657 1.367v7.019A1.75 1.75 0 0113.25 15h-3.5a.75.75 0 01-.75-.75V8.25H7v6a.75.75 0 01-.75.75h-3.5A1.75 1.75 0 011 13.25V6.23c0-.531.242-1.034.657-1.366l5.25-4.2z"></path>
              </svg>
              Home
            </NavLink>
          </NavItem>
          <NavItem active={location.pathname.includes('/settings')} onClick={() => navigate('/settings')}>
            <NavLink active={location.pathname.includes('/settings')}>
              <Settings />
              Settings
            </NavLink>
          </NavItem>
          <NavItem active={location.pathname.includes('/auth0-repos')} onClick={() => navigate('/auth0-repos')}>
            <NavLink active={location.pathname.includes('/auth0-repos')}>
              <BookOpen />
              Auth0 Repos
            </NavLink>
          </NavItem>
          <NavItem active={location.pathname.includes('/about')} onClick={() => navigate('/about')}>
            <NavLink active={location.pathname.includes('/about')}>
              <Info />
              About
            </NavLink>
          </NavItem>
        </NavList>
      </NavMenu>

      {repositories.length > 0 && (
        <>
          <SectionTitle>
            <GitBranch size={14} />
            Repositories
          </SectionTitle>
          <SearchContainer>
            <SearchIcon>
              <Search />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Search repositories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>
          <RepoList>
            {filteredRepos.map(repo => {
              const isActive = selectedRepo && selectedRepo.id === repo.id;
              const repoInitials = repo.name
                .split('-')
                .map(word => word.charAt(0).toUpperCase())
                .join('')
                .substring(0, 2);
              
              return (
                <RepoCard 
                  key={repo.id} 
                  active={isActive}
                  onClick={() => handleSelectRepo(repo.owner.login, repo.name)}
                >
                  <RepoCardContent>
                    <RepoHeader>
                      <RepoIcon active={isActive}>
                        {repoInitials}
                      </RepoIcon>
                      <RepoInfo>
                        <RepoName active={isActive}>
                          {repo.name}
                        </RepoName>
                        <RepoMeta>
                          {repo.stargazers_count > 0 && (
                            <MetaItem>
                              <Star size={12} />
                              {repo.stargazers_count}
                            </MetaItem>
                          )}
                          {repo.language && (
                            <MetaItem>
                              <div style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: getLanguageColor(repo.language)
                              }} />
                              {repo.language}
                            </MetaItem>
                          )}
                          <MetaItem>
                            <Clock size={12} />
                            {formatDate(repo.updated_at)}
                          </MetaItem>
                        </RepoMeta>
                      </RepoInfo>
                    </RepoHeader>
                  </RepoCardContent>
                </RepoCard>
              );
            })}
          </RepoList>
        </>
      )}
    </SidebarContainer>
  );
}

export default Sidebar;