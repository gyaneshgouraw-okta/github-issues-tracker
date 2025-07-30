import { useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { RepositoryContext } from '../../context/RepositoryContext';

const SidebarContainer = styled.aside`
  position: fixed;
  left: ${props => props.isOpen ? '0' : '-250px'};
  top: 60px; /* Exactly below header */
  width: 250px;
  height: calc(100vh - 60px);
  background-color: #f6f8fa;
  border-right: 1px solid #e1e4e8;
  transition: left 0.3s ease;
  z-index: 999;
  overflow-y: auto;
  padding-bottom: 2rem;
  box-sizing: border-box;
  margin: 0;
  padding-top: 0;
`;

const SectionTitle = styled.h3`
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  margin: 1rem 0 0.5rem;
  padding: 0 1rem;
  color: #586069;
`;

const RepoList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const RepoItem = styled.li`
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-left: 3px solid ${props => props.active ? '#0366d6' : 'transparent'};
  background-color: ${props => props.active ? 'rgba(3, 102, 214, 0.05)' : 'transparent'};
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.active ? 'rgba(3, 102, 214, 0.05)' : '#eaecef'};
  }
`;

const RepoName = styled.span`
  font-size: 0.9rem;
  color: ${props => props.active ? '#0366d6' : '#24292e'};
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`;

const NavMenu = styled.nav`
  margin-top: 1rem;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-left: 3px solid ${props => props.active ? '#0366d6' : 'transparent'};
  background-color: ${props => props.active ? 'rgba(3, 102, 214, 0.05)' : 'transparent'};
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.active ? 'rgba(3, 102, 214, 0.05)' : '#eaecef'};
  }
`;

const NavLink = styled.div`
  display: flex;
  align-items: center;
  color: ${props => props.active ? '#0366d6' : '#24292e'};
  font-size: 0.9rem;
  
  svg {
    margin-right: 0.75rem;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e1e4e8;
  border-radius: 4px;
  margin: 0.5rem 0;
  font-size: 0.85rem;
`;

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
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path fillRule="evenodd" d="M7.429 1.525a6.593 6.593 0 011.142 0c.036.003.108.036.137.146l.289 1.105c.147.56.55.967.997 1.189.174.086.341.183.501.29.417.278.97.423 1.53.27l1.102-.303c.11-.03.175.016.195.046.219.31.41.641.573.989.014.031.022.11-.059.19l-.815.806c-.411.406-.562.957-.53 1.456a4.588 4.588 0 010 .582c-.032.499.119 1.05.53 1.456l.815.806c.08.08.073.159.059.19a6.494 6.494 0 01-.573.99c-.02.029-.086.074-.195.045l-1.103-.303c-.559-.153-1.112-.008-1.529.27-.16.107-.327.204-.5.29-.449.222-.851.628-.998 1.189l-.289 1.105c-.029.11-.101.143-.137.146a6.613 6.613 0 01-1.142 0c-.036-.003-.108-.037-.137-.146l-.289-1.105c-.147-.56-.55-.967-.997-1.189a4.502 4.502 0 01-.501-.29c-.417-.278-.97-.423-1.53-.27l-1.102.303c-.11.03-.175-.016-.195-.046a6.492 6.492 0 01-.573-.989c-.014-.031-.022-.11.059-.19l.815-.806c.411-.406.562-.957.53-1.456a4.587 4.587 0 010-.582c.032-.499-.119-1.05-.53-1.456l-.815-.806c-.08-.08-.073-.159-.059-.19a6.44 6.44 0 01.573-.99c.02-.029.086-.075.195-.045l1.103.303c.559.153 1.112.008 1.529-.27.16-.107.327-.204.5-.29.449-.222.851-.628.998-1.189l.289-1.105c.029-.11.101-.143.137-.146zM8 0c-.236 0-.47.01-.701.03-.743.065-1.29.615-1.458 1.261l-.29 1.106c-.017.066-.078.158-.211.224a5.994 5.994 0 00-.668.386c-.123.082-.233.09-.3.071L3.27 2.776c-.644-.177-1.392.02-1.82.63a7.977 7.977 0 00-.704 1.217c-.315.675-.111 1.422.363 1.891l.815.806c.05.048.098.147.088.294a6.084 6.084 0 000 .772c.01.147-.038.246-.088.294l-.815.806c-.474.469-.678 1.216-.363 1.891.2.428.436.835.704 1.218.428.609 1.176.806 1.82.63l1.103-.303c.066-.019.176-.011.299.071.213.143.436.272.668.386.133.066.194.158.212.224l.289 1.106c.169.646.715 1.196 1.458 1.26a8.094 8.094 0 001.402 0c.743-.064 1.29-.614 1.458-1.26l.29-1.106c.017-.066.078-.158.211-.224a5.98 5.98 0 00.668-.386c.123-.082.233-.09.3-.071l1.102.302c.644.177 1.392-.02 1.82-.63.268-.382.505-.789.704-1.217.315-.675.111-1.422-.364-1.891l-.814-.806c-.05-.048-.098-.147-.088-.294a6.1 6.1 0 000-.772c-.01-.147.039-.246.088-.294l.814-.806c.475-.469.679-1.216.364-1.891a7.992 7.992 0 00-.704-1.218c-.428-.609-1.176-.806-1.82-.63l-1.103.303c-.066.019-.176.011-.299-.071a5.991 5.991 0 00-.668-.386c-.133-.066-.194-.158-.212-.224L10.16 1.29C9.99.645 9.444.095 8.701.031A8.094 8.094 0 008 0zm1.5 8a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM11 8a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              Settings
            </NavLink>
          </NavItem>
          <NavItem active={location.pathname.includes('/auth0-repos')} onClick={() => navigate('/auth0-repos')}>
            <NavLink active={location.pathname.includes('/auth0-repos')}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path fillRule="evenodd" d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 10.5v-8zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"></path>
              </svg>
              Auth0 Repos
            </NavLink>
          </NavItem>
        </NavList>
      </NavMenu>

      {repositories.length > 0 && (
        <>
          <SectionTitle>Repositories</SectionTitle>
          <div style={{ padding: '0 1rem' }}>
            <SearchInput
              type="text"
              placeholder="Search repositories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <RepoList>
            {filteredRepos.map(repo => (
              <RepoItem 
                key={repo.id} 
                active={selectedRepo && selectedRepo.id === repo.id}
                onClick={() => handleSelectRepo(repo.owner.login, repo.name)}
              >
                <RepoName active={selectedRepo && selectedRepo.id === repo.id}>
                  {repo.full_name}
                </RepoName>
              </RepoItem>
            ))}
          </RepoList>
        </>
      )}
    </SidebarContainer>
  );
}

export default Sidebar;