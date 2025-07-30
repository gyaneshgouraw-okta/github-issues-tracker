import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../../context/AuthContext';
import { Github, Menu, LogOut, User } from 'lucide-react';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: linear-gradient(135deg, 
    rgba(30, 41, 59, 0.95) 0%, 
    rgba(51, 65, 85, 0.9) 50%,
    rgba(71, 85, 105, 0.85) 100%
  );
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 
    0 8px 32px -8px rgba(0, 0, 0, 0.3),
    0 4px 16px -4px rgba(0, 0, 0, 0.2);
  height: 60px;
  box-sizing: border-box;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(255, 255, 255, 0.2) 50%, 
      transparent 100%
    );
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const Logo = styled.div`
  font-size: 1.125rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  cursor: pointer;
  padding: 0.5rem 0;
  
  &:hover {
    filter: brightness(1.1);
  }
  
  svg {
    width: 24px;
    height: 24px;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  }
`;

const MenuButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  color: white;
  cursor: pointer;
  padding: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  backdrop-filter: blur(8px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.25);
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserCard = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 0.5rem 1rem;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  backdrop-filter: blur(8px);
  cursor: pointer;
  
  &:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.2);
  }
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  
  &:hover {
    border-color: rgba(255, 255, 255, 0.4);
  }
`;

const AvatarFallback = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1 0%, #3b82f6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  
  &:hover {
    border-color: rgba(255, 255, 255, 0.4);
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.2;
  color: rgba(255, 255, 255, 0.95);
`;

const UserRole = styled.span`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 400;
`;

const LogoutButton = styled.button`
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 10px;
  color: #fca5a5;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  font-weight: 500;
  font-size: 0.875rem;
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: rgba(239, 68, 68, 0.25);
    border-color: rgba(239, 68, 68, 0.4);
    color: #fecaca;
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

/**
 * Application header component
 * @param {Object} props - Component props
 * @param {Function} props.toggleSidebar - Function to toggle sidebar visibility
 */
function Header({ toggleSidebar }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  return (
    <HeaderContainer>
      <LeftSection>
        <MenuButton onClick={toggleSidebar}>
          <Menu />
        </MenuButton>
        
        <Logo>
          <Github />
          GitHub Issue Tracker
        </Logo>
      </LeftSection>
      
      {user && (
        <UserSection>
          <UserCard onClick={() => navigate('/about')}>
            {user.avatar_url ? (
              <Avatar src={user.avatar_url} alt={user.login} />
            ) : (
              <AvatarFallback>
                <User size={16} />
              </AvatarFallback>
            )}
            <UserInfo>
              <Username>{user.login}</Username>
              <UserRole>Developer</UserRole>
            </UserInfo>
          </UserCard>
          <LogoutButton onClick={logout}>
            <LogOut />
            Logout
          </LogoutButton>
        </UserSection>
      )}
    </HeaderContainer>
  );
}

export default Header;