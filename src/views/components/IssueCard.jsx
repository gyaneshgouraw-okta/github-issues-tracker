import { useState, useContext, useCallback, memo } from 'react';
import styled from 'styled-components';
import Card from './Card';
import { formatDate, getTimeDifference } from '../../utils/dateUtils';
import { IssueContext } from '../../context/IssueContext';

const IssueHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  justify-content: space-between;
`;

const IssueTitle = styled.h3`
  font-size: 1rem;
  margin: 0;
  font-weight: 600;
`;

const IssueNumber = styled.span`
  color: #586069;
  font-size: 0.875rem;
  font-weight: normal;
`;

// This styled component was unused and has been removed

const IssueMetadata = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
  gap: 0.25rem 1rem;
  font-size: 0.75rem;
  color: #586069;
`;

const MetadataItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const Avatar = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
`;

const CommentSection = styled.div`
  margin-top: 1rem;
  border-top: 1px solid #eaecef;
  padding-top: 1rem;
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const CommentExpandToggle = styled.button`
  background: none;
  border: none;
  color: #0366d6;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0;
  
  &:hover {
    text-decoration: underline;
  }
`;

const CommentCount = styled.span`
  font-weight: 500;
`;

const Comment = styled.div`
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const CommentHeader2 = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
`;

const CommentAuthor = styled.span`
  font-weight: 600;
`;

const CommentTimestamp = styled.span`
  color: #586069;
  font-size: 0.75rem;
`;

const CommentBody = styled.div`
  padding: 0.5rem;
  background-color: #f6f8fa;
  border-radius: 4px;
  overflow-wrap: break-word;
`;

const IssueUrl = styled.a`
  color: #0366d6;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ReviewButton = styled.button`
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${props => props.reviewed ? '#2da44e' : '#0366d6'};
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  &:hover {
    background-color: ${props => props.reviewed ? '#2c974b' : '#0958d5'};
  }
  
  &:disabled {
    background-color: #6e7781;
    cursor: default;
  }
`;

/**
 * Component to display a GitHub issue with post-closure comments
 * @param {Object} props - Component props
 * @param {Object} props.issue - Issue data
 */
'use memo'; // React Compiler annotation for memoization
function IssueCard({ issue }) {
  const [showComments, setShowComments] = useState(false);
  const { markIssueAsReviewed } = useContext(IssueContext);
  
  // Calculate time elapsed after closure
  const timeAfterClosure = getTimeDifference(issue.closed_at, issue.postClosureComments[0]?.created_at);
  
  // React 19: useCallback for stable references
  const handleMarkAsReviewed = useCallback(() => {
    markIssueAsReviewed(issue.id);
  }, [markIssueAsReviewed, issue.id]);
  
  const toggleComments = useCallback(() => {
    setShowComments(prev => !prev);
  }, []);
  
  return (
    <Card>
      <IssueHeader>
        <TitleContainer>
          <IssueTitle>
            <IssueUrl href={issue.html_url} target="_blank" rel="noopener noreferrer">
              {issue.title}
            </IssueUrl>{' '}
            <IssueNumber>#{issue.number}</IssueNumber>
          </IssueTitle>
        </TitleContainer>
        <ReviewButton 
          reviewed={issue.reviewed} 
          onClick={handleMarkAsReviewed} 
          disabled={issue.reviewed}
        >
          {issue.reviewed ? (
            <>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <path fillRule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path>
              </svg>
              Reviewed
            </>
          ) : 'Mark as Reviewed'}
        </ReviewButton>
      </IssueHeader>
      
      <IssueMetadata>
        <MetadataItem>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path fillRule="evenodd" d="M1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zM8 0a8 8 0 100 16A8 8 0 008 0zm.5 4.75a.75.75 0 00-1.5 0v3.5a.75.75 0 00.471.696l2.5 1a.75.75 0 00.557-1.392L8.5 7.742V4.75z"></path>
          </svg>
          Closed on {formatDate(issue.closed_at)}
        </MetadataItem>
        
        <MetadataItem>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path fillRule="evenodd" d="M1.5 2.75a.25.25 0 01.25-.25h8.5a.25.25 0 01.25.25v5.5a.25.25 0 01-.25.25h-3.5a.75.75 0 00-.53.22L3.5 11.44V9.25a.75.75 0 00-.75-.75h-1a.25.25 0 01-.25-.25v-5.5zM1.75 1A1.75 1.75 0 000 2.75v5.5C0 9.216.784 10 1.75 10H2v1.543a1.457 1.457 0 002.487 1.03L7.061 10h3.189A1.75 1.75 0 0012 8.25v-5.5A1.75 1.75 0 0010.25 1h-8.5zM14.5 4.75a.25.25 0 00-.25-.25h-.5a.75.75 0 110-1.5h.5c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0114.25 12H14v1.543a1.457 1.457 0 01-2.487 1.03L9.22 12.28a.75.75 0 111.06-1.06l2.22 2.22v-2.19a.75.75 0 01.75-.75h1a.25.25 0 00.25-.25v-5.5z"></path>
          </svg>
          {issue.postClosureComments.length} comment{issue.postClosureComments.length !== 1 ? 's' : ''}
          {' '}after closure
        </MetadataItem>
        
        <MetadataItem>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path fillRule="evenodd" d="M5.5 3.5a2 2 0 100 4 2 2 0 000-4zM2 5.5a3.5 3.5 0 115.898 2.549 5.507 5.507 0 013.034 4.084.75.75 0 11-1.482.235 4.001 4.001 0 00-7.9 0 .75.75 0 01-1.482-.236A5.507 5.507 0 013.102 8.05 3.49 3.49 0 012 5.5zM11 4a.75.75 0 100 1.5 1.5 1.5 0 01.666 2.844.75.75 0 00-.416.672v.352a.75.75 0 00.574.73c1.2.289 2.162 1.2 2.522 2.372a.75.75 0 101.434-.44 5.01 5.01 0 00-2.56-3.012A3 3 0 0011 4z"></path>
          </svg>
          Created by {issue.user.login}
        </MetadataItem>
        
        <MetadataItem>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path fillRule="evenodd" d="M5.5 3.5a2 2 0 100 4 2 2 0 000-4zM2 5.5a3.5 3.5 0 115.898 2.549 5.507 5.507 0 013.034 4.084.75.75 0 11-1.482.235 4.001 4.001 0 00-7.9 0 .75.75 0 01-1.482-.236A5.507 5.507 0 013.102 8.05 3.49 3.49 0 012 5.5zM11 4a.75.75 0 100 1.5 1.5 1.5 0 01.666 2.844.75.75 0 00-.416.672v.352a.75.75 0 00.574.73c1.2.289 2.162 1.2 2.522 2.372a.75.75 0 101.434-.44 5.01 5.01 0 00-2.56-3.012A3 3 0 0011 4z"></path>
          </svg>
          First comment {timeAfterClosure} after closure
        </MetadataItem>
      </IssueMetadata>
      
      <CommentSection>
        <CommentHeader>
          <div>
            <CommentCount>{issue.postClosureComments.length} post-closure comment{issue.postClosureComments.length !== 1 ? 's' : ''}</CommentCount>
          </div>
          <CommentExpandToggle onClick={toggleComments}>
            {showComments ? 'Hide comments' : 'Show comments'}
          </CommentExpandToggle>
        </CommentHeader>
        
        {showComments && issue.postClosureComments.map(comment => (
          <Comment key={comment.id}>
            <CommentHeader2>
              <Avatar src={comment.user.avatar_url} alt={comment.user.login} />
              <CommentAuthor>{comment.user.login}</CommentAuthor>
              <CommentTimestamp>commented on {formatDate(comment.created_at)}</CommentTimestamp>
            </CommentHeader2>
            <CommentBody>
              {comment.body.length > 300 
                ? `${comment.body.substring(0, 300)}...`
                : comment.body}
            </CommentBody>
          </Comment>
        ))}
      </CommentSection>
    </Card>
  );
}

// React 19: Memo wrapper for performance optimization
export default memo(IssueCard);