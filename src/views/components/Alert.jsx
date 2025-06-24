import { useState } from 'react';
import styled from 'styled-components';

/**
 * Alert variants
 * @typedef {'success'|'info'|'warning'|'error'} AlertVariant
 */

const AlertContainer = styled.div`
  display: ${props => props.visible ? 'flex' : 'none'};
  align-items: flex-start;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 6px;
  
  /* Variant styles */
  background-color: ${props => {
    switch (props.variant) {
      case 'success': return '#f0fff4';
      case 'info': return '#f1f8ff';
      case 'warning': return '#fffbdd';
      case 'error': return '#ffeef0';
      default: return '#f1f8ff';
    }
  }};
  
  border-color: ${props => {
    switch (props.variant) {
      case 'success': return '#34d058';
      case 'info': return '#0366d6';
      case 'warning': return '#ffdf5d';
      case 'error': return '#d73a49';
      default: return '#0366d6';
    }
  }};
`;

const IconContainer = styled.div`
  margin-right: 0.75rem;
  color: ${props => {
    switch (props.variant) {
      case 'success': return '#28a745';
      case 'info': return '#0366d6';
      case 'warning': return '#b08800';
      case 'error': return '#d73a49';
      default: return '#0366d6';
    }
  }};
`;

const AlertContent = styled.div`
  flex: 1;
`;

const AlertTitle = styled.div`
  font-weight: 600;
  margin-bottom: ${props => props.hasMessage ? '0.25rem' : '0'};
`;

const AlertMessage = styled.div`
  font-size: 0.875rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  margin-left: 0.5rem;
  cursor: pointer;
  color: #586069;
  display: flex;
  align-items: center;
  
  &:hover {
    color: #24292e;
  }
  
  &:focus {
    outline: none;
  }
`;

/**
 * Alert component for displaying info, success, warning, or error messages
 * @param {Object} props - Component props
 * @param {AlertVariant} [props.variant='info'] - Alert variant
 * @param {string} [props.title] - Alert title
 * @param {string} [props.message] - Alert message
 * @param {boolean} [props.dismissible=false] - Whether alert can be dismissed
 * @param {boolean} [props.visible=true] - Whether alert is visible
 * @param {Function} [props.onDismiss] - Callback when alert is dismissed
 */
function Alert({
  variant = 'info',
  title,
  message,
  dismissible = false,
  visible = true,
  onDismiss,
  children,
}) {
  const [isVisible, setIsVisible] = useState(visible);
  
  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) onDismiss();
  };
  
  // Render variant-specific icon
  const renderIcon = () => {
    switch (variant) {
      case 'success':
        return (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path fillRule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path>
          </svg>
        );
      case 'info':
        return (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path fillRule="evenodd" d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm6.5-.25A.75.75 0 017.25 7h1a.75.75 0 01.75.75v2.75h.25a.75.75 0 010 1.5h-2a.75.75 0 010-1.5h.25v-2h-.25a.75.75 0 01-.75-.75zM8 6a1 1 0 100-2 1 1 0 000 2z"></path>
          </svg>
        );
      case 'warning':
        return (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path fillRule="evenodd" d="M8.22 1.754a.25.25 0 00-.44 0L1.698 13.132a.25.25 0 00.22.368h12.164a.25.25 0 00.22-.368L8.22 1.754zm-1.763-.707c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0114.082 15H1.918a1.75 1.75 0 01-1.543-2.575L6.457 1.047zM9 11a1 1 0 11-2 0 1 1 0 012 0zm-.25-5.25a.75.75 0 00-1.5 0v2.5a.75.75 0 001.5 0v-2.5z"></path>
          </svg>
        );
      case 'error':
        return (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path fillRule="evenodd" d="M2.343 13.657A8 8 0 1113.657 2.343 8 8 0 012.343 13.657zM6.03 4.97a.75.75 0 00-1.06 1.06L6.94 8 4.97 9.97a.75.75 0 101.06 1.06L8 9.06l1.97 1.97a.75.75 0 101.06-1.06L9.06 8l1.97-1.97a.75.75 0 10-1.06-1.06L8 6.94 6.03 4.97z"></path>
          </svg>
        );
      default:
        return null;
    }
  };
  
  return (
    <AlertContainer variant={variant} visible={isVisible}>
      <IconContainer variant={variant}>
        {renderIcon()}
      </IconContainer>
      
      <AlertContent>
        {title && <AlertTitle hasMessage={Boolean(message || children)}>{title}</AlertTitle>}
        {message && <AlertMessage>{message}</AlertMessage>}
        {children}
      </AlertContent>
      
      {dismissible && (
        <CloseButton onClick={handleDismiss} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path fillRule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path>
          </svg>
        </CloseButton>
      )}
    </AlertContainer>
  );
}

export default Alert;