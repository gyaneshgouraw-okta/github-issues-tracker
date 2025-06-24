import { useState } from 'react';
import styled from 'styled-components';
import Button from './Button';
import Input from './Input';

const SearchContainer = styled.div`
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Form = styled.form`
  display: flex;
  gap: 0.5rem;
  width: 100%;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const SearchLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const SearchTip = styled.div`
  font-size: 0.75rem;
  color: #586069;
  margin-top: 0.25rem;
`;

const StyledInput = styled(Input)`
  flex: 1;
`;

/**
 * Repository search component
 * @param {Object} props
 * @param {Function} props.onSearch - Function called with the search term when form is submitted
 */
function RepoSearch({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isValid, setIsValid] = useState(true);
  
  const validateInput = (value) => {
    // Basic validation for owner/repo format
    return /^[\w.-]+\/[\w.-]+$/.test(value);
  };
  
  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsValid(value === '' || validateInput(value));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!searchTerm) {
      return;
    }
    
    if (validateInput(searchTerm)) {
      onSearch(searchTerm);
    } else {
      setIsValid(false);
    }
  };
  
  return (
    <SearchContainer>
      <SearchLabel>Search for any GitHub repository:</SearchLabel>
      <Form onSubmit={handleSubmit}>
        <StyledInput
          placeholder="owner/repository (e.g. auth0/auth0-react)"
          value={searchTerm}
          onChange={handleChange}
          error={!isValid ? 'Please use the format "owner/repository"' : ''}
        />
        <Button type="submit" disabled={!searchTerm || !isValid}>
          Search
        </Button>
      </Form>
      <SearchTip>
        Enter any GitHub repository in the format "owner/repository" to view its issues
      </SearchTip>
    </SearchContainer>
  );
}

export default RepoSearch;