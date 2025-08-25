# EvalHub

**A simple async feedback collection platform for academic demonstration**

EvalHub is a clean, academic-focused web application that demonstrates fundamental full-stack development concepts. Built with Ruby on Rails for the backend API and React for the frontend interface, it provides basic async feedback collection functionality suitable for CS50x submission.

## 🚀 Features

### Core Functionality
- **Simple Evaluation Creation**: Instructors can create feedback evaluations with basic details
- **Anonymous Participation**: Students join evaluations using access codes (no authentication required)
- **Basic Question Types**: Support for text responses and multiple choice questions only
- **Async Response Collection**: Students submit responses at their own pace
- **Simple Response Viewing**: Instructors can view all submitted responses
- **QR Code Access**: Evaluations accessible via QR codes for easy mobile access

### Technical Features
- **Clean Architecture**: Institution → Evaluation → Question → Answer structure
- **RESTful API**: Simple Rails API with JSON responses
- **UUID Session Tokens**: Basic session management for temporary user identification
- **Responsive Design**: Mobile-friendly interface using React and SCSS
- **SQLite Database**: Simple database setup for development and academic use
- **Centralized Styling**: SCSS architecture with design tokens and accessible colors
- **Dynamic Resource Handling**: Advanced patterns for join tables and resource hierarchies

## 🏗️ Architecture

EvalHub follows a modern full-stack architecture with centralized backend patterns:

### Backend (Ruby on Rails 6.1)
- **API-only Rails application** serving JSON responses
- **SQLite3 database** for simplicity
- **Advanced nested routing** for institutions/evaluations/questions with join table support
- **Comprehensive validations** for data integrity
- **Session-based authentication** with UUID tokens
- **Rails Concerns**: ErrorHandler, Authenticatable, ResourceFindable for cross-cutting functionality
- **Dynamic Resource Finding**: Runtime method generation for flexible resource access
- **Join Table Configuration**: Centralized handling for many-to-many relationships
- **Resource Hierarchy System**: Automated parent-child relationship management
- **Environment-Specific Seeding**: Development, test, and production data management

### Frontend (React 18)
- **Functional components** with React hooks
- **Centralized API Services**: Axios-based service layer with error handling
- **Component-based routing** for instructor and student views
- **SCSS Design System**: Centralized variables, accessible brand colors (WCAG AA compliant)
- **Mobile responsive** design with semantic color naming
- **Environment Configuration**: Build-time environment variable management

### Data Flow
1. **Institution**: Contains evaluations and questions
2. **Evaluation**: Has access code, contains questions via join tables, collects answers
3. **Question**: Text, multiple choice, or composite question types
4. **EvaluationQuestion**: Join table linking evaluations to questions
5. **Answer**: User responses linked to evaluation questions

### Advanced Backend Patterns
- **Resource Hierarchy**: Automatic parent validation and parameter injection
- **Join Table Resources**: Special handling for composite key operations (CRUD)
- **Dynamic Method Generation**: Runtime creation of finder methods based on resource relationships
- **Test Helpers**: Automated creation of complex resource hierarchies in tests

## 📋 Requirements

### System Requirements
- **Ruby**: 3.0.0 or higher
- **Node.js**: 14.0.0 or higher  
- **npm**: 6.0.0 or higher
- **SQLite3**: 3.x
- **Git**: For version control

### Development Environment
- Text editor or IDE (VSCode, RubyMine, etc.)
- Terminal/Command line access
- Web browser (Chrome, Firefox, Safari, Edge)

## 🛠️ Installation

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd evalhub-django/backend
   ```

2. **Install Ruby dependencies**
   ```bash
   bundle install --path vendor/bundle
   ```

3. **Database setup**
   ```bash
   rails db:create
   rails db:migrate
   rails db:seed  # Loads environment-specific data
   ```

4. **Start the Rails server**
   ```bash
   rails server -p 3000
   ```

The backend API will be available at `http://localhost:3000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd evalhub-django/frontend
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

The frontend application will be available at `http://localhost:3001`

### Environment Configuration

Create a `.env` file in the backend directory:
```env
FRONTEND_URL=http://localhost:3001
RAILS_ENV=development
SECRET_KEY_BASE=your-secret-key-here
```

Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:3000
```

## 📚 API Documentation

### Authentication
The API uses session-based authentication with UUID tokens. Users must authenticate to access protected endpoints.

**Authenticate User**
```
POST /api/institutions/:institution_id/users/authenticate
Content-Type: application/json

{
  "name": "User Name"
}
```

### Institutions
**List Institutions**
```
GET /api/institutions
```

**Get Institution Details**
```
GET /api/institutions/:id
```

**Create Institution**
```
POST /api/institutions
Content-Type: application/json

{
  "name": "Institution Name",
  "description": "Institution description"
}
```

### Evaluations
**List Institution Evaluations**
```
GET /api/institutions/:institution_id/evaluations
```

**Create Evaluation**
```
POST /api/institutions/:institution_id/evaluations
Content-Type: application/json

{
  "name": "Evaluation Name",
  "description": "Evaluation description"
}
```

**Join Evaluation**
```
GET /api/institutions/:institution_id/evaluations/:id/join?code=ACCESS_CODE
```

### Questions
**List Questions**
```
GET /api/institutions/:institution_id/questions
```

**Create Question**
```
POST /api/institutions/:institution_id/questions
Content-Type: application/json

{
  "question_text": "How would you rate this evaluation?",
  "question_type": "multiple_choice_single",
  "multiple_choice_options": ["Excellent", "Good", "Fair", "Poor"]
}
```

### Evaluation Questions (Join Table)
**Add Question to Evaluation**
```
POST /api/institutions/:institution_id/evaluations/:evaluation_id/questions
Content-Type: application/json

{
  "question_id": 123
}
```

### Responses
**Submit Responses**
```
POST /api/institutions/:institution_id/evaluations/:evaluation_id/answers/bulk_create
Content-Type: application/json

{
  "answers": [
    {
      "evaluation_question_id": 1,
      "answer_text": "Great evaluation!"
    }
  ]
}
```

## 🎯 Usage Guide

### For Instructors

1. **Create Evaluation**: Use the dashboard to create a new feedback evaluation
2. **Add Questions**: Create simple text or multiple choice questions
3. **Link Questions**: Associate questions with evaluations via the join table system
4. **Share Access**: Give students the access code or QR code URL
5. **View Responses**: Check submitted responses in real-time

### For Students

1. **Join Evaluation**: Visit the URL or scan QR code and enter access code
2. **Provide Name**: Enter your name (no password required)
3. **Answer Questions**: Complete the feedback form
4. **Submit**: Submit your responses when finished

## 🧪 Testing

### Backend Testing
```bash
cd backend
bundle exec rspec
```

The test suite includes:
- **Model Tests**: Basic validations and associations
- **API Endpoint Tests**: Request/response testing
- **Resource Hierarchy Helper**: Automated creation of complex test data

### Frontend Testing
```bash
cd frontend
npm test
```

### Integration Testing
Run both backend and frontend servers, then navigate to the application to test end-to-end functionality.

## 🎨 Design System

### Brand Colors (WCAG AA Compliant)
- **Forest Green**: `#2D5A27` - Primary brand color
- **Sage Green**: `#4A7C59` - Secondary actions
- **Coral**: `#C65D47` - Accent and warnings  
- **Amber**: `#D4A574` - Highlights and success states

### SCSS Architecture
- **Variables**: Centralized design tokens in `_variables.scss`
- **Components**: Modular component styles
- **Utilities**: Helper classes for common patterns
- **Responsive**: Mobile-first design approach

## 🚢 Deployment

### Production Setup

1. **Environment Variables**: Configure production environment variables
2. **Database**: Set up production database (PostgreSQL recommended)
3. **Asset Compilation**: Build frontend assets for production
4. **Server Configuration**: Configure web server (Nginx, Apache)
5. **SSL Certificate**: Set up HTTPS for secure communication

### Environment-Specific Seeds
```bash
# Development - comprehensive test data
RAILS_ENV=development rails db:seed

# Production - minimal essential data only
RAILS_ENV=production rails db:seed

# Test - minimal data for test consistency
RAILS_ENV=test rails db:seed
```

### Docker Deployment (Optional)

A `docker-compose.yml` file can be created to containerize both applications:
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - RAILS_ENV=production
  
  frontend:
    build: ./frontend
    ports:
      - "3001:3001"
    depends_on:
      - backend
```

## 🏛️ Architecture Highlights

### Centralized Backend Patterns
1. **Join Table Resources**: Automatic handling of many-to-many relationships with composite key support
2. **Resource Hierarchy**: Parent-child relationship management with recursive validation
3. **Dynamic Resource Finding**: Runtime method generation for flexible resource access patterns
4. **Test Infrastructure**: Comprehensive helpers for complex resource creation in tests

### Frontend Centralization
1. **API Services**: Centralized Axios configuration with error handling
2. **Component Institution**: Logical separation of instructor/student components
3. **Design System**: Consistent styling with accessible color palette
4. **Environment Management**: Build-time configuration for different environments

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch** (`git checkout -b feature/new-feature`)
3. **Make changes** following the project's coding standards
4. **Add tests** for new functionality
5. **Commit changes** (`git commit -am 'Add new feature'`)
6. **Push to branch** (`git push origin feature/new-feature`)
7. **Create Pull Request** with detailed description

### Code Style Guidelines
- **Ruby**: Follow RuboCop recommendations
- **JavaScript**: Follow Prettier and ESLint configurations
- **SCSS**: Use BEM methodology for CSS class naming
- **Commits**: Use conventional commit messages

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🆘 Support

For questions, issues, or support:
- **Documentation**: Check this README and inline code documentation
- **Issues**: Report bugs and feature requests via GitHub Issues
- **Email**: Contact the development team at [support@evalhub.com]

---

**EvalHub** - A modern, accessible async feedback platform demonstrating advanced full-stack development patterns.