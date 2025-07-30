import { forwardRef } from 'react';
import styled from 'styled-components';

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${props => props.noMargin ? '0' : '1rem'};
`;

const StyledLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #ffffff;
  letter-spacing: 0.02em;
`;

const StyledInput = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.error ? '#ef4444' : '#444444'};
  border-radius: 8px;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #ffffff;
  background-color: ${props => props.disabled ? '#1a1a1a' : '#2a2a2a'};
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #ffffff;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2);
    background-color: #333333;
  }
  
  &:hover {
    border-color: #666666;
    background-color: #333333;
  }
  
  &::placeholder {
    color: #999999;
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const ErrorMessage = styled.div`
  font-size: 0.75rem;
  color: #ef4444;
  margin-top: 0.5rem;
  font-weight: 500;
`;

const HelperText = styled.div`
  font-size: 0.75rem;
  color: #cccccc;
  margin-top: 0.5rem;
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