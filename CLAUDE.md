# GitHub Issue Tracker - Memory Bank

## Application Overview

GitHub Issue Tracker is a React application that helps users track GitHub issues that have received comments after they were closed. The application follows the MVVM (Model-View-ViewModel) architecture pattern to maintain a clean separation of concerns.

## Key Components and Their Functionality

### Services
- **github-service.js**: Core service that communicates with the GitHub API, providing methods to:
  - Authenticate with GitHub tokens
  - Fetch repositories for the authenticated user
  - Get closed issues for a repository
  - Get comments for specific issues
  - Identify issues with post-closure comments

### ViewModels
- **AuthViewModel.js**: Handles authentication state and operations
- **RepositoryViewModel.js**: Manages repository data and selection
- **IssueViewModel.js**: Manages issue data, filtering, sorting, and operations like marking issues as reviewed
- **useAuthStore.js**: State management store for authentication data

### Context Providers
- **AuthContext.jsx**: Provides authentication state and methods to components
- **RepositoryContext.jsx**: Provides repository state and selection methods
- **IssueContext.jsx**: Provides issue state, filtering, and operations

### Views
- **Components**:
  - **IssueCard.jsx**: Displays issue details, including post-closure comments
  - **Header.jsx**: Application header with navigation
  - **Sidebar.jsx**: Side navigation with repository selection
  - **RepoSearch.jsx**: Search functionality for repositories
  - **Layout.jsx**: Main application layout
  - **Loading.jsx**, **Alert.jsx**, **Button.jsx**, **Input.jsx**, **Card.jsx**: UI utility components

- **Pages**:
  - **Login.jsx**: Authentication page
  - **Home.jsx**: Dashboard/landing page
  - **IssuesList.jsx**: Main page displaying issues with post-closure comments
  - **Settings.jsx**: User settings page

## Data Flow

1. **Authentication Flow**:
   - User provides GitHub token
   - Token is validated with GitHub API
   - On successful validation, user information is stored
   - Token is saved in localStorage for session persistence

2. **Repository Selection Flow**:
   - Repositories are fetched for the authenticated user
   - User selects a repository to analyze
   - Selected repository is stored in state

3. **Issue Tracking Flow**:
   - Application fetches closed issues for the selected repository
   - For each closed issue, comments are retrieved
   - Issues with comments after closure are identified and displayed
   - Issues can be filtered by minimum comment count and closure date
   - Issues can be sorted by closure date or number of post-closure comments

4. **Review Status Flow**:
   - Users can mark issues as reviewed
   - Review status is stored in localStorage for persistence
   - Reviewed issues are visually marked in the UI

## Relevant Commands

Based on the application's package.json and file structure:

- Development server: `npm run dev`
- Build for production: `npm run build`

## Implementation Details: Marking Issues as Reviewed

The application includes functionality to mark issues as reviewed, which helps users keep track of which issues they've already looked at. This feature is implemented as follows:

### Storage
- Reviewed issue IDs are stored in localStorage under the key `github_unread_reviewed_issues`
- This ensures persistence across browser sessions

### UI Implementation
- Each issue card has a "Mark as Reviewed" button
- Once reviewed, the button changes to a green "Reviewed" indicator
- Reviewed issues remain in the list but are visually distinguished

### Code Implementation
- The `markIssueAsReviewed` function in `IssueViewModel.js` handles the logic:
  - Updates the issue state with the reviewed status
  - Stores the issue ID in localStorage
  - Triggers re-filtering and re-rendering of the issue list

### State Management
- The review status is loaded from localStorage when:
  - The application initializes
  - New issues are fetched
- This ensures the review status persists across page reloads and sessions

This memory bank provides an overview of the GitHub Issue Tracker application structure, functionality, and implementation details. It can be used as a reference for future development and understanding of the application architecture.