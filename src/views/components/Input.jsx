import { forwardRef } from 'react';
import styled from 'styled-components';

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${props => props.noMargin ? '0' : '1rem'};
`;

const StyledLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: #24292e;
`;

const StyledInput = styled.input`
  padding: 0.5rem 0.75rem;
  border: 1px solid ${props => props.error ? '#d73a49' : '#e1e4e8'};
  border-radius: 6px;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #24292e;
  background-color: ${props => props.disabled ? '#f6f8fa' : '#fff'};
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  
  &:focus {
    outline: none;
    border-color: #0366d6;
    box-shadow: 0 0 0 3px rgba(3, 102, 214, 0.3);
  }
  
  &::placeholder {
    color: #6a737d;
  }
  
  &:disabled {
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  font-size: 0.75rem;
  color: #d73a49;
  margin-top: 0.25rem;
`;

const HelperText = styled.div`
  font-size: 0.75rem;
  color: #6a737d;
  margin-top: 0.25rem;
`;

/**
 * Input component
 * @param {Object} props - Component props
 * @param {string} [props.id] - Input ID
 * @param {string} [props.label] - Input label
 * @param {string} [props.placeholder] - Input placeholder
 * @param {string} [props.type='text'] - Input type
 * @param {boolean} [props.disabled=false] - Whether input is disabled
 * @param {string} [props.error] - Error message
 * @param {string} [props.helperText] - Helper text
 * @param {boolean} [props.noMargin=false] - Remove bottom margin
 */
const Input = forwardRef(({
  id,
  label,
  placeholder,
  type = 'text',
  disabled = false,
  error,
  helperText,
  noMargin = false,
  ...rest
}, ref) => {
  return (
    <InputContainer noMargin={noMargin}>
      {label && <StyledLabel htmlFor={id}>{label}</StyledLabel>}
      <StyledInput
        id={id}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        error={error}
        ref={ref}
        {...rest}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {!error && helperText && <HelperText>{helperText}</HelperText>}
    </InputContainer>
  );
});

export default Input;