# Backend Setup Guide

This guide walks you through setting up the EvalHub backend Rails application.

## Prerequisites

- Ruby 3.0.0 or higher
- SQLite3
- Bundler gem
- Git

## Installation Steps

### 1. Clone and Navigate
```bash
git clone <repository-url>
cd evalhub-django/backend
```

### 2. Install Dependencies
```bash
# Install gems locally to avoid permission issues
bundle install --path vendor/bundle
```

### 3. Database Setup
```bash
# Create database
rails db:create

# Run migrations
rails db:migrate

# Load sample data (optional)
rails db:seed
```

### 4. Configuration

Create a `.env` file in the backend directory:
```env
FRONTEND_URL=http://localhost:3001
RAILS_ENV=development
SECRET_KEY_BASE=your-secret-key-here
```

### 5. Start the Server
```bash
rails server -p 3000
```

The API will be available at `http://localhost:3000`

## Troubleshooting

### Common Issues

**Bundle install fails with permissions**
```bash
bundle install --path vendor/bundle
```

**Database creation fails**
```bash
# Ensure SQLite3 is installed
sudo apt-get install sqlite3 libsqlite3-dev  # Ubuntu/Debian
brew install sqlite3  # macOS
```

**Spring/Bootsnap errors**
These gems have been disabled due to compatibility issues. The application will run normally without them.

### Verification

Test the API is running:
```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{"status":"ok","service":"EvalHub API"}
```

## API Endpoints

### Authentication
- `POST /api/institutions/:id/users/authenticate` - User login
- `DELETE /api/institutions/:id/users/logout` - User logout

### Institutions
- `GET /api/institutions` - List institutions
- `POST /api/institutions` - Create institution
- `GET /api/institutions/:id/stats` - Institution statistics

### Evaluations
- `GET /api/institutions/:id/evaluations` - List evaluations
- `POST /api/institutions/:id/evaluations` - Create evaluation
- `PATCH /api/institutions/:id/evaluations/:id/activate` - Activate evaluation

### Questions & Responses
- `GET /api/institutions/:id/questions` - List questions
- `POST /api/institutions/:id/evaluations/:id/answers/bulk_create` - Submit responses

## Database Schema

### Core Models
- **Institution**: Multi-tenant container
- **User**: Authentication and authorization
- **Evaluation**: Feedback collection session  
- **Question**: Reusable question definitions
- **EvaluationQuestion**: Questions assigned to evaluations
- **Answer**: Participant responses

### Key Relationships
- Institution has_many Evaluations, Users, Questions
- Evaluation has_many EvaluationQuestions through Questions
- User has_many Answers
- EvaluationQuestion has_many Answers

## Development Commands

```bash
# Run console
rails console

# Run tests
bundle exec rspec

# Generate migration
rails generate migration MigrationName

# Rollback migration
rails db:rollback

# Reset database
rails db:drop db:create db:migrate db:seed
```