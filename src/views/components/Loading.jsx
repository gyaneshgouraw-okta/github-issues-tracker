import styled, { keyframes } from 'styled-components';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${props => props.small ? '1rem' : '3rem'};
  width: 100%;
`;

const Spinner = styled.div`
  width: ${props => props.size === 'small' ? '20px' : props.size === 'large' ? '48px' : '32px'};
  height: ${props => props.size === 'small' ? '20px' : props.size === 'large' ? '48px' : '32px'};
  border: ${props => props.size === 'small' ? '2px' : '3px'} solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #0366d6;
  animation: ${rotate} 0.8s linear infinite;
  margin-bottom: ${props => props.message ? '1rem' : '0'};
`;

const Message = styled.p`
  color: #586069;
  font-size: 0.875rem;
  margin: 0;
  text-align: center;
`;

/**
 * Loading spinner component
 * @param {Object} props - Component props
 * @param {'small'|'medium'|'large'} [props.size='medium'] - Spinner size
 * @param {string} [props.message] - Optional loading message
 * @param {boolean} [props.small=false] - Use smaller container padding
 */
function Loading({ size = 'medium', message, small = false }) {
  return (
    <Container small={small}>
      <Spinner size={size} />
      {message && <Message>{message}</Message>}
    </Container>
  );
}

export default Loading;