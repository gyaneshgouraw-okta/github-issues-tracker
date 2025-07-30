import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import styled from 'styled-components';

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding-top: 60px; /* Account for fixed header */
`;

const MainContent = styled.main`
  display: flex;
  flex: 1;
  overflow-x: hidden;
  position: relative;
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-left: ${props => props.sidebarOpen ? '280px' : '80px'};
  min-height: calc(100vh - 60px);
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 16px 0 0 0;
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.05),
    0 4px 12px rgba(0, 0, 0, 0.03);
  margin-top: 8px;
  margin-right: 8px;

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 1rem;
    border-radius: 0;
    margin-top: 0;
    margin-right: 0;
    background: rgba(255, 255, 255, 0.9);
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