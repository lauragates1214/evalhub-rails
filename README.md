# EvalHub

**University Course Course Platform**

EvalHub is a full-stack web application that enables educational institutions to collect student feedback through asynchronous course courses. Built with Ruby on Rails for the backend API and React for the frontend interface, it provides a streamlined solution for gathering and analyzing student answers with minimal friction.

## Features

### For Instructors
- **Course Course Creation**: Set up feedback collection for courses and workshops
- **Question Management**: Create and organize course questions (text answers, multiple choice, rating scales)
- **QR Code Access**: Automatically generate QR codes for easy student access without signup requirements
- **Answer Viewing**: View and analyze submitted student feedback in real-time
- **Data Export**: Export answer data to CSV format for further analysis
- **Anonymous Collection**: Students participate without creating accounts, increasing response rates

### For Students  
- **Frictionless Access**: Join courses via QR code scanning with no downloads or account creation required
- **Anonymous Participation**: Provide honest feedback through UUID-based anonymous access
- **Multiple Question Types**: Respond to text questions, multiple choice selections, and rating scales
- **Mobile Optimized**: Complete courses on any device through responsive web interface
- **Asynchronous Answer**: Complete courses at your own pace without time pressure

### Technical Features
- **RESTful API**: Clean, documented API endpoints following REST conventions
- **UUID Authentication**: Secure anonymous access through unique session tokens
- **PostgreSQL Database**: Robust relational database supporting complex queries and data integrity
- **Responsive Design**: Mobile-first CSS ensuring accessibility across all devices
- **Error Handling**: Comprehensive error handling with user-friendly feedback messages
- **CORS Support**: Properly configured for cross-origin requests in development and production

## Architecture

EvalHub follows a modern full-stack architecture with clear separation of concerns, designed specifically for educational feedback collection:

### Backend (Ruby on Rails 7.0)
- **API-only Rails application** serving JSON responses
- **PostgreSQL database** for production-ready data persistence
- **Nested resource routing** providing logical API organization
- **Service objects** for business logic abstraction and reusability
- **Devise authentication** for secure instructor authentication and session management
- **UUID-based authentication** enabling anonymous student participation
- **AccessControllable concern** for fine-grained authorization and permission checks

### Frontend (React 18)
- **Component-based architecture** with functional components and React hooks
- **Axios integration** for API communication with automatic token management
- **React Router** for seamless client-side navigation
- **SCSS styling system** with modular, maintainable stylesheets
- **Progressive Web App** capabilities for enhanced mobile experience

### Key Components
1. **Institution Management**: Multi-tenant architecture supporting multiple educational institutions
2. **Course Lifecycle**: Create, configure, and manage course course sessions
3. **Question System**: Flexible question creation with multiple answer types
4. **Anonymous Access**: QR code-based student access without registration barriers
5. **Answer Collection**: Efficient asynchronous feedback submission and storage

## Requirements

### System Requirements
- **Ruby**: 3.0.0 or higher
- **Node.js**: 16.0.0 or higher  
- **npm**: 8.0.0 or higher
- **PostgreSQL**: 12.0 or higher
- **Git**: For version control

### Development Environment
- Text editor or IDE (VSCode, RubyMine, etc.)
- Terminal/Command line access
- Web browser (Chrome, Firefox, Safari, Edge)

## Installation

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd evalhub-rails/backend
   ```

2. **Install Ruby dependencies**
   ```bash
   bundle install
   ```

3. **Database setup**
   ```bash
   rails db:create
   rails db:migrate
   rails db:seed  # Optional: Load sample data
   ```

4. **Start the Rails server**
   ```bash
   rails server -p 3000
   ```

The backend API will be available at `http://localhost:3000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
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
DATABASE_URL=postgresql://localhost/evalhub_development
```

Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:3000
```

## API Documentation

### Authentication
The API uses a dual authentication approach:
- **Devise** for instructors: Full authentication with email/password, session management, and secure access to administrative features
- **UUID-based tokens** for students: Anonymous access without registration barriers, maintaining privacy while tracking responses
- **AccessControllable concern**: Provides authorization helpers like `require_instructor!`, `require_course_access!`, and `ensure_same_institution!` for fine-grained permission control

**Join Course (Anonymous)**
```
POST /api/courses/:id/join
Content-Type: application/json

Response: {
  "session_token": "uuid-token-here",
  "course": {...}
}
```

### Institutions
**List Institutions**
```
GET /api/institutions
```

**Create Institution**
```
POST /api/institutions
Content-Type: application/json

{
  "name": "University Name",
  "location": "City, Country"
}
```

### Courses
**List Institution Courses**
```
GET /api/institutions/:institution_id/courses
```

**Create Course**
```
POST /api/institutions/:institution_id/courses
Content-Type: application/json

{
  "name": "Course Course",
  "date": "2025-08-25"
}
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
  "question_text": "How would you rate this course?",
  "question_type": "rating_scale"
}
```

### Answers
**Submit Answer**
```
POST /api/courses/:course_id/questions/:question_id/answers
Content-Type: application/json
Authorization: Bearer <session_token>

{
  "answer_text": "Excellent course content and delivery"
}
```

## Usage Guide

### For Instructors

1. **Create Institution**: Set up your educational institution in the system
2. **Build Question Bank**: Create reusable questions for different course types
3. **Create Course**: Set up a new course course session
4. **Add Questions**: Select questions from your bank to include in the course
5. **Generate QR Code**: Use built-in QR code generation for student access
6. **Collect Answers**: Students respond asynchronously at their own pace
7. **Review Feedback**: View submitted answer and export data for analysis

### For Students

1. **Scan QR Code**: Access the course using your mobile device camera
2. **Anonymous Access**: Join the course without creating an account
3. **Complete Questions**: Progress through course questions thoughtfully
4. **Submit Feedback**: Submit your answers when ready
5. **Confirmation**: Receive confirmation of successful submission

## Testing

### Backend Testing
```bash
cd backend
bundle exec rspec
```

## Academic Context

EvalHub addresses the persistent challenge of low response rates in university course courses. Traditional course methods often suffer from poor participation due to complex access requirements, lengthy forms, and timing issues. By implementing QR code-based anonymous access and mobile-optimized interfaces, EvalHub removes common barriers to student participation.

The platform's focus on asynchronous collection allows students to provide thoughtful, considered feedback rather than rushed answers during class time. This approach has been shown to improve both answer quality and participation rates in educational settings.

## Design Decisions

**Centralized Architecture with Template Method Pattern**: Rather than repeating validation logic across controllers, I implemented a centralized approach using Rails concerns. The ResourceFindable concern uses the template method pattern to handle nested resource validation - each controller defines its resource type, and the concern dynamically generates the appropriate finder methods.

**Recursive Resource Validation**: For complex nested routes like `/institutions/1/courses/2/questions/3/answers/4`, the system automatically validates the entire resource chain recursively. This was my architectural choice to prevent security issues where users might access resources they shouldn't by manipulating URLs.

**Configuration-Driven Resource Hierarchy**: Instead of hard-coding parent-child relationships throughout the codebase, I centralized these definitions in Rails initializers. This makes adding new resource types simple - just update the configuration and the existing validation patterns automatically apply.

**Dynamic Method Generation**: The ResourceFindable concern uses metaprogramming to generate finder methods at runtime based on the resource configuration. This eliminates code duplication while maintaining type safety and clear error messages.

**Template Method for Controllers**: Controllers follow a consistent pattern where common functionality (authentication, validation, error handling) is defined in base classes, while specific resource logic is implemented in child controllers. This creates maintainable, predictable code structure.

**Anonymous Authentication**: The system uses UUID-based session tokens rather than traditional user accounts. This design choice was made to eliminate signup friction while maintaining answer integrity through unique token validation.

**Asynchronous Collection**: Unlike real-time polling systems, EvalHub focuses on post-class course collection. This allows for more reflective answers and accommodates students' varying schedules and preferences.

**Mobile-First Design**: Given that students primarily access courses through mobile devices via QR codes, the interface was designed with mobile usability as the primary consideration, with desktop access as a secondary use case.

**Institution-Centric Architecture**: The multi-tenant design allows multiple educational institutions to use the platform while maintaining complete data isolation and customization capabilities.

## AI Assistance Acknowledgment

This project was developed with assistance from AI tools as development accelerators:

**Architecture & Strategy:**
- **ChatGPT** - Rails project structure recommendations and model relationship design
- **Claude** - Technical architecture planning and database design guidance

**Code Development:**
- **ChatGPT** - Generated initial code templates for models, controllers, and routing structure
- **Claude** - Iterative development assistance for authentication patterns and API design

**Documentation:**
- **Claude** - Initial README structure and API documentation templates
- Content customized independently

**Core Design Philosophy:**
All architectural decisions, including the anonymous access system, asynchronous collection approach, and university-focused positioning, were independently conceived. The choice to use UUID authentication, the database schema design, and the mobile-first interface were strategic decisions made to address specific challenges in educational feedback collection. AI tools served as development accelerators and provided technical implementation guidance, but did not drive the fundamental design strategy and choices, or the academic focus of the platform.

---

**EvalHub** - Empowering instructors to collect meaningful student feedback efficiently and effectively.