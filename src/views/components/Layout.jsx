import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import styled from 'styled-components';

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f6f8fa;
`;

const MainContent = styled.main`
  display: flex;
  flex: 1;
  overflow-x: hidden;
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  transition: margin-left 0.3s;
  margin-left: ${props => props.sidebarOpen ? '250px' : '0'};

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 1rem;
  }
`;

/**
 * Main application layout component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child content
 */
function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <LayoutContainer>
      <Header toggleSidebar={toggleSidebar} />
      <MainContent>
        <Sidebar isOpen={sidebarOpen} />
        <ContentArea sidebarOpen={sidebarOpen}>
          {children}
        </ContentArea>
      </MainContent>
    </LayoutContainer>
  );
}

export default Layout;