import styled from 'styled-components';

/**
 * Button variants
 * @typedef {'primary'|'secondary'|'danger'|'ghost'} ButtonVariant
 */

/**
 * Button sizes
 * @typedef {'small'|'medium'|'large'} ButtonSize
 */

const StyledButton = styled.button`
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  /* Size styles */
  font-size: ${props => {
    switch (props.size) {
      case 'large': return '1rem';
      case 'small': return '0.75rem';
      default: return '0.875rem';
    }
  }};
  
  padding: ${props => {
    switch (props.size) {
      case 'large': return '0.625rem 1.25rem';
      case 'small': return '0.25rem 0.75rem';
      default: return '0.5rem 1rem';
    }
  }};
  
  /* Variant styles */
  background-color: ${props => {
    switch (props.variant) {
      case 'primary': return '#2ea44f';
      case 'secondary': return '#fafbfc';
      case 'danger': return '#d73a49';
      case 'ghost': return 'transparent';
      default: return '#2ea44f';
    }
  }};
  
  color: ${props => {
    switch (props.variant) {
      case 'primary': return 'white';
      case 'secondary': return '#24292e';
      case 'danger': return 'white';
      case 'ghost': return '#586069';
      default: return 'white';
    }
  }};
  
  border: ${props => {
    switch (props.variant) {
      case 'primary': return '1px solid rgba(27, 31, 35, 0.15)';
      case 'secondary': return '1px solid rgba(27, 31, 35, 0.15)';
      case 'danger': return '1px solid rgba(27, 31, 35, 0.15)';
      case 'ghost': return 'none';
      default: return '1px solid rgba(27, 31, 35, 0.15)';
    }
  }};
  
  /* Hover styles */
  &:hover {
    background-color: ${props => {
      switch (props.variant) {
        case 'primary': return '#2c974b';
        case 'secondary': return '#f3f4f6';
        case 'danger': return '#cb2431';
        case 'ghost': return 'rgba(27, 31, 35, 0.05)';
        default: return '#2c974b';
      }
    }};
  }
  
  /* Disabled styles */
  opacity: ${props => props.disabled ? 0.6 : 1};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  pointer-events: ${props => props.disabled ? 'none' : 'auto'};
  
  /* Full width */
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  
  /* Icon spacing */
  svg {
    margin-right: ${props => props.iconOnly ? '0' : '0.5rem'};
  }
`;

/**
 * Button component
 * @param {Object} props - Component props
 * @param {ButtonVariant} [props.variant='primary'] - Button variant
 * @param {ButtonSize} [props.size='medium'] - Button size
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {boolean} [props.fullWidth=false] - Full width button
 * @param {boolean} [props.iconOnly=false] - Button only contains an icon
 * @param {React.ReactNode} props.children - Button content
 * @param {Function} props.onClick - Click handler
 */
function Button({ 
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  iconOnly = false,
  children,
  onClick,
  ...rest
}) {
  return (
    <StyledButton
      variant={variant}
      size={size}
      disabled={disabled}
      fullWidth={fullWidth}
      iconOnly={iconOnly}
      onClick={onClick}
      {...rest}
    >
      {children}
    </StyledButton>
  );
}

export default Button;