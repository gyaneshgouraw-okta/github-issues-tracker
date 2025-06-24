import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RepositoryProvider } from './context/RepositoryContext';
import { IssueProvider } from './context/IssueContext';
import RequireAuth from './views/components/RequireAuth';
import Login from './views/pages/Login';
import Home from './views/pages/Home';
import IssuesList from './views/pages/IssuesList';
import Settings from './views/pages/Settings';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RepositoryProvider>
          <IssueProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              
              {/* Protected routes */}
              <Route 
                path="/" 
                element={
                  <RequireAuth>
                    <Home />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/repo/:owner/:repo/issues" 
                element={
                  <RequireAuth>
                    <IssuesList />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <RequireAuth>
                    <Settings />
                  </RequireAuth>
                } 
              />
              
              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </IssueProvider>
        </RepositoryProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;