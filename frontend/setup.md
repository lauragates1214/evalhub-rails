# Frontend Setup Guide

This guide walks you through setting up the EvalHub frontend React application.

## Prerequisites

- Node.js 14.0.0 or higher
- npm 6.0.0 or higher
- Git

## Installation Steps

### 1. Navigate to Frontend Directory
```bash
cd evalhub-django/frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:3000
REACT_APP_FRONTEND_URL=http://localhost:3001
```

### 4. Start Development Server
```bash
npm start
```

The application will be available at `http://localhost:3001`

## Available Scripts

### Development
```bash
npm start          # Start development server
npm test           # Run test suite
npm run build      # Build for production
npm run eject      # Eject from Create React App (permanent)
```

### Styling
```bash
npm run sass       # Compile SCSS files (if setup)
```

## Project Structure

```
src/
├── components/           # React components
│   ├── instructor/       # Organizer interface components
│   ├── student/     # Participant interface components
│   └── common/          # Shared components
├── services/            # API and utility services
├── styles/              # SCSS stylesheets
│   ├── main.scss       # Main stylesheet with variables
│   └── components/      # Component-specific styles
├── App.js              # Main application component
└── index.js            # Application entry point
```

## Component Overview

### Organizer Components
- **InstitutionDashboard**: Main instructor interface
- **EvaluationCreator**: Evaluation creation and management
- **QuestionManager**: Question library management
- **ResponseViewer**: Response analytics and export

### Participant Components
- **EvaluationAccess**: Evaluation joining and authentication
- **QuestionDisplay**: Question answering interface

### API Service
- **api.js**: Centralized API communication with automatic token handling

## Styling System

The application uses a comprehensive SCSS-based design system:

### Design Tokens
- **Colors**: Primary, secondary, semantic colors
- **Spacing**: Consistent spacing scale (xs, sm, md, lg, xl)
- **Typography**: Font sizes and weights
- **Border Radius**: Consistent corner rounding
- **Shadows**: Elevation system

### Component Styles
Each component has its own SCSS file following BEM methodology:
```scss
.component-name {
  &__element {
    &--modifier { }
  }
}
```

## API Integration

### Service Configuration
The `api.js` service handles all backend communication:
- Automatic token injection
- Error handling and retries
- Response data normalization

### Authentication Flow
1. User authenticates via `/authenticate` endpoint
2. Session token stored in localStorage
3. Token automatically included in subsequent requests
4. Automatic logout on 401 responses

## Routing

Uses React Router for client-side navigation:
- `/instructor/:orgId` - Organizer dashboard
- `/student/:orgId/:evaluationId` - Participant question interface
- QR code scanning directs to appropriate routes

## State Management

Currently uses React hooks for state management:
- `useState` for component state
- `useEffect` for side effects and API calls
- Context API for global state (future enhancement)

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

### Test Structure
- Unit tests for components
- Integration tests for API service
- End-to-end tests for user flows

## Build and Deployment

### Development Build
```bash
npm run build:dev
```

### Production Build
```bash
npm run build
```

Output in `build/` directory ready for static hosting.

### Environment Variables for Production
```env
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_FRONTEND_URL=https://yourdomain.com
```

## Troubleshooting

### Common Issues

**npm install fails**
```bash
# Clear cache
npm cache clean --force
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**CORS errors in development**
Ensure backend CORS is configured for `http://localhost:3001`

**API connection issues**
- Verify backend is running on correct port
- Check `.env` file configuration
- Confirm network connectivity

**Styling not loading**
- Verify SCSS files are imported in `main.scss`
- Check for syntax errors in SCSS files
- Ensure proper file extensions (`.scss`)

### Browser Development Tools

Enable React Developer Tools for debugging:
1. Install React DevTools browser extension
2. Use Components tab to inspect component state
3. Use Profiler to identify performance issues

## Performance Optimization

### Production Optimizations
- Code splitting with React.lazy()
- Bundle analysis with webpack-bundle-analyzer
- Image optimization and lazy loading
- Service worker for caching (future enhancement)

### Development Tools
- Hot module replacement for fast development
- Source maps for debugging
- ESLint and Prettier for code quality

## Contributing

### Code Style
- Use functional components with hooks
- Follow React best practices
- Use TypeScript for type safety (future enhancement)
- Maintain consistent file naming

### Component Guidelines
- Keep components small and focused
- Use props for data, callbacks for evaluations
- Implement proper error boundaries
- Add PropTypes for prop validation

### Styling Guidelines
- Use SCSS variables for consistency
- Follow BEM naming convention
- Mobile-first responsive design
- Maintain accessibility standards