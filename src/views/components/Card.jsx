import styled from 'styled-components';

const CardContainer = styled.div`
  background-color: white;
  border-radius: 6px;
  border: 1px solid #e1e4e8;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  padding: ${props => props.noPadding ? '0' : '1rem'};
  margin-bottom: ${props => props.noMargin ? '0' : '1rem'};
  overflow: hidden;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  display: ${props => props.flex ? 'flex' : 'block'};
  flex-direction: ${props => props.column ? 'column' : 'row'};
`;

const CardHeader = styled.div`
  padding: ${props => props.noPadding ? '0' : '1rem'};
  padding-bottom: 0.75rem;
  margin: ${props => props.noPadding ? '0' : '-1rem -1rem 1rem -1rem'};
  border-bottom: 1px solid #e1e4e8;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h2, h3, h4 {
    margin: 0;
  }
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: ${props => props.size === 'large' ? '1.25rem' : '1rem'};
  font-weight: 600;
  color: #24292e;
`;

const CardBody = styled.div`
  flex: 1;
`;

const CardFooter = styled.div`
  padding: ${props => props.noPadding ? '0' : '1rem'};
  padding-top: 0.75rem;
  margin: ${props => props.noPadding ? '0' : '1rem -1rem -1rem -1rem'};
  border-top: 1px solid #e1e4e8;
  display: flex;
  justify-content: ${props => props.align || 'flex-end'};
  align-items: center;
  gap: 0.5rem;
`;

/**
 * Card component with header, body and footer sections
 * @param {Object} props - Component props
 * @param {boolean} [props.noPadding=false] - Remove padding
 * @param {boolean} [props.noMargin=false] - Remove bottom margin
 * @param {boolean} [props.fullWidth=false] - Set to full width
 * @param {boolean} [props.flex=false] - Use flex layout
 * @param {boolean} [props.column=false] - Use column direction when flex is true
 * @param {React.ReactNode} props.children - Card content
 */
function Card({
  noPadding = false,
  noMargin = false,
  fullWidth = false,
  flex = false,
  column = false,
  children,
  ...rest
}) {
  return (
    <CardContainer
      noPadding={noPadding}
      noMargin={noMargin}
      fullWidth={fullWidth}
      flex={flex}
      column={column}
      {...rest}
    >
      {children}
    </CardContainer>
  );
}

/**
 * Card Header component
 * @param {Object} props - Component props
 * @param {boolean} [props.noPadding=false] - Remove padding
 * @param {React.ReactNode} props.children - Header content
 */
Card.Header = function CardHeaderComponent({
  noPadding = false,
  children,
  ...rest
}) {
  return (
    <CardHeader noPadding={noPadding} {...rest}>
      {children}
    </CardHeader>
  );
};

/**
 * Card Title component
 * @param {Object} props - Component props
 * @param {'default'|'large'} [props.size='default'] - Title size
 * @param {React.ReactNode} props.children - Title content
 */
Card.Title = function CardTitleComponent({
  size = 'default',
  children,
  ...rest
}) {
  return (
    <CardTitle size={size} {...rest}>
      {children}
    </CardTitle>
  );
};

/**
 * Card Body component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Body content
 */
Card.Body = function CardBodyComponent({ children, ...rest }) {
  return <CardBody {...rest}>{children}</CardBody>;
};

/**
 * Card Footer component
 * @param {Object} props - Component props
 * @param {boolean} [props.noPadding=false] - Remove padding
 * @param {'flex-end'|'flex-start'|'center'|'space-between'} [props.align='flex-end'] - Alignment of footer items
 * @param {React.ReactNode} props.children - Footer content
 */
Card.Footer = function CardFooterComponent({
  noPadding = false,
  align = 'flex-end',
  children,
  ...rest
}) {
  return (
    <CardFooter noPadding={noPadding} align={align} {...rest}>
      {children}
    </CardFooter>
  );
};

export default Card;