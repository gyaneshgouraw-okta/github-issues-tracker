# GitHub Issue Tracker

A modern React application that helps you track GitHub issues that have received comments after they were closed. Built with React, this tool follows the MVVM (Model-View-ViewModel) architecture pattern to maintain a clean separation of concerns.

## Features

- 🔒 **Secure Authentication**: Authenticate with your GitHub personal access token
- 🔍 **Repository Selection**: Choose from your accessible repositories
- 📊 **Issue Tracking**: Find closed issues that have received comments after closure
- 🔄 **Filtering & Sorting**: Filter issues by minimum comment count, closure date, and more
- 💾 **Data Persistence**: Save your preferences and settings between sessions

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Requirements](#requirements)
- [Application Structure](#application-structure)
- [API Integration](#api-integration)
- [Authentication](#authentication)
- [Contributing](#contributing)
- [License](#license)

## Installation

Follow these steps to set up the project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/github-issue-tracker.git
   cd github-issue-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Usage

### Getting Started

1. **Obtain a GitHub Token**:
   - Visit [GitHub Personal Access Tokens](https://github.com/settings/tokens)
   - Create a new token with `repo` scope
   - Copy your new token

2. **Sign In**:
   - Launch the application
   - Enter your GitHub token when prompted
   - The app will validate your token and retrieve your user information

3. **Select a Repository**:
   - Choose a repository from the sidebar
   - Or use the search function to find a specific repository

4. **View Issues with Post-Closure Comments**:
   - The app will automatically fetch closed issues with comments after closure
   - Issues are displayed in cards with essential information

### Features

#### Filtering Issues

- **Minimum Comments**: Set a threshold for the minimum number of post-closure comments
- **Date Filter**: Show only issues closed after a specific date
- **Sorting**: Sort issues by:
  - Closed date (newest/oldest)
  - Number of post-closure comments (most/fewest)

#### Viewing Issue Details

- Click on an issue title to view the full issue on GitHub
- Toggle "Show comments" to view post-closure comments inline
- See comment authors and timestamps

#### User Settings

- Update your GitHub token if necessary
- View your GitHub profile information
- Sign out when finished

## Requirements

- Node.js 14.0 or newer
- GitHub account with personal access token
- Modern web browser (Chrome, Firefox, Safari, Edge)

## Application Structure

The application follows the MVVM (Model-View-ViewModel) architecture pattern:

### Models

- Located in `/src/models/`
- Define data structures and types for GitHub entities
- Handle data validation and transformation

### Views

- Located in `/src/views/`
- React components that render the UI
- Separated into pages and reusable components

### ViewModels

- Located in `/src/viewmodels/`
- Connect models to views
- Manage application state and business logic
- Handle data processing and transformation

### Services

- Located in `/src/services/`
- Encapsulate API calls and external integrations
- Manage GitHub API communication

## API Integration

The application uses the GitHub REST API v3 to:

1. Verify user authentication
2. Fetch user repositories
3. Get closed issues from repositories
4. Retrieve issue comments
5. Compare issue closed date with comment creation dates

Rate limiting is automatically handled to prevent API usage limits.

## Authentication

Authentication is implemented using GitHub personal access tokens, which provides:

- Secure access to GitHub APIs
- No need to store user passwords
- Fine-grained permission control
- Ability to revoke access at any time

Tokens are stored securely in the browser's localStorage for persistence between sessions.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.