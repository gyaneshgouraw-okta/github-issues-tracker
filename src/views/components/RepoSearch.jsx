import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Button from './Button';
import Input from './Input';

const SearchContainer = styled.div`
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
`;

const Form = styled.form`
  display: flex;
  gap: 0.75rem;
  width: 100%;
  align-items: flex-start;
  
  @media (max-width: 576px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const SearchLabel = styled.div`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &::before {
    content: '🔍';
    font-size: 1.1em;
  }
`;

const SearchTip = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border-left: 3px solid #3b82f6;
  margin-top: 0.5rem;
  
  kbd {
    background: #1e293b;
    color: white;
    padding: 0.125rem 0.375rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 600;
    margin: 0 0.125rem;
  }
`;

const StyledInput = styled(Input)`
  flex: 1;
  font-size: 1rem;
  min-height: 48px;
  
  input {
    font-family: 'SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', monospace;
    letter-spacing: 0.025em;
  }
`;

const SuggestionsList = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
  margin-top: 0.25rem;
`;

const SuggestionItem = styled.div`
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-bottom: 1px solid #f1f5f9;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f8fafc;
    color: #3b82f6;
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  .repo-name {
    font-weight: 600;
    font-family: 'SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', monospace;
  }
  
  .repo-desc {
    font-size: 0.875rem;
    color: #64748b;
    margin-top: 0.25rem;
  }
`;

/**
 * Repository search component
 * @param {Object} props
 * @param {Function} props.onSearch - Function called with the search term when form is submitted
 */
function RepoSearch({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef(null);
  
  // Popular repository suggestions
  const popularRepos = [
    { name: 'auth0/auth0-react', desc: 'Auth0 SDK for React Single Page Applications' },
    { name: 'auth0/nextjs-auth0', desc: 'Auth0 SDK for Next.js applications' },
  ];
  
  // Filter suggestions based on search term
  const filteredSuggestions = popularRepos.filter(repo => 
    repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repo.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const validateInput = (value) => {
    // Basic validation for owner/repo format
    return /^[\w.-]+\/[\w.-]+$/.test(value);
  };
  
  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsValid(value === '' || validateInput(value));
    setShowSuggestions(value.length > 0 && filteredSuggestions.length > 0);
  };
  
  const handleSuggestionClick = (repoName) => {
    setSearchTerm(repoName);
    setIsValid(true);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };
  
  const handleFocus = () => {
    if (searchTerm.length > 0 && filteredSuggestions.length > 0) {
      setShowSuggestions(true);
    }
  };
  
  const handleBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => setShowSuggestions(false), 200);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!searchTerm) {
      return;
    }
    
    if (validateInput(searchTerm)) {
      setIsSearching(true);
      setShowSuggestions(false);
      try {
        await onSearch(searchTerm);
      } finally {
        setIsSearching(false);
      }
    } else {
      setIsValid(false);
    }
  };
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && e.target !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  return (
    <SearchContainer>
      <SearchLabel>Search for any GitHub repository:</SearchLabel>
      <Form onSubmit={handleSubmit}>
        <div style={{ flex: 1, position: 'relative' }}>
          <StyledInput
            ref={inputRef}
            placeholder="owner/repository (e.g. auth0/auth0-react) - Press '/' to focus"
            value={searchTerm}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            error={!isValid ? 'Please use the format "owner/repository"' : ''}
          />
          {showSuggestions && filteredSuggestions.length > 0 && (
            <SuggestionsList>
              {filteredSuggestions.slice(0, 4).map((repo) => (
                <SuggestionItem
                  key={repo.name}
                  onClick={() => handleSuggestionClick(repo.name)}
                >
                  <div className="repo-name">{repo.name}</div>
                  <div className="repo-desc">{repo.desc}</div>
                </SuggestionItem>
              ))}
            </SuggestionsList>
          )}
        </div>
        <Button 
          type="submit" 
          disabled={!searchTerm || !isValid || isSearching}
          variant={isSearching ? 'secondary' : 'primary'}
        >
          {isSearching ? 'Searching...' : 'Search'}
        </Button>
      </Form>
      <SearchTip>
        💡 Enter any GitHub repository in the format "owner/repository" to view its issues. Press <kbd>/</kbd> to quickly focus the search field.
      </SearchTip>
    </SearchContainer>
  );
}

export default RepoSearch;