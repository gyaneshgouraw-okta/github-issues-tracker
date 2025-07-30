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
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const StyledInput = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.error ? '#ef4444' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 8px;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #ffffff;
  background: linear-gradient(135deg, 
    rgba(30, 41, 59, 0.6) 0%, 
    rgba(51, 65, 85, 0.4) 100%
  );
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  font-weight: 500;
  
  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 
      0 0 0 2px rgba(99, 102, 241, 0.2),
      0 4px 12px rgba(0, 0, 0, 0.1);
    background: linear-gradient(135deg, 
      rgba(30, 41, 59, 0.8) 0%, 
      rgba(51, 65, 85, 0.6) 100%
    );
    color: #ffffff;
  }
  
  &:hover {
    border-color: rgba(255, 255, 255, 0.3);
    background: linear-gradient(135deg, 
      rgba(30, 41, 59, 0.7) 0%, 
      rgba(51, 65, 85, 0.5) 100%
    );
    color: #ffffff;
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
    font-weight: 400;
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    color: #ffffff;
    background: linear-gradient(135deg, 
      rgba(30, 41, 59, 0.3) 0%, 
      rgba(51, 65, 85, 0.2) 100%
    );
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
  color: rgba(255, 255, 255, 0.7);
  margin-top: 0.5rem;
  font-weight: 400;
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