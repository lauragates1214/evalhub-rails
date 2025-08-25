# EvalHub API Documentation

This document provides comprehensive documentation for the EvalHub REST API.

## Base URL

**Development**: `http://localhost:3000/api`
**Production**: `https://your-domain.com/api`

## Authentication

EvalHub uses session-based authentication. Users must authenticate to access protected endpoints.

### Session Management
- Sessions are stored server-side
- Session tokens are returned in response headers
- Tokens must be included in subsequent requests
- Sessions expire after inactivity

## Error Handling

### Standard HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `422` - Unprocessable Entity (validation errors)
- `500` - Internal Server Error

### Error Response Format
```json
{
  "error": "Error message",
  "details": ["Specific validation errors"],
  "code": "ERROR_CODE"
}
```

## Health Check

### GET /health
Check API service status.

**Response**
```json
{
  "status": "ok",
  "service": "EvalHub API"
}
```

## Institutions

### GET /institutions
List all institutions.

**Response**
```json
{
  "institutions": [
    {
      "id": 1,
      "name": "Acme Corporation",
      "description": "Technology company",
      "created_at": "2024-01-01T00:00:00.000Z",
      "total_evaluations": 5,
      "active_evaluations": 2,
      "total_students": 150
    }
  ]
}
```

### POST /institutions
Create a new institution.

**Request Body**
```json
{
  "name": "Institution Name",
  "description": "Institution description"
}
```

**Response (201)**
```json
{
  "id": 1,
  "name": "Institution Name", 
  "description": "Institution description",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

### GET /institutions/:id
Get institution details.

**Response**
```json
{
  "id": 1,
  "name": "Acme Corporation",
  "description": "Technology company",
  "created_at": "2024-01-01T00:00:00.000Z",
  "evaluations": [...],
  "questions": [...],
  "users": [...]
}
```

### GET /institutions/:id/stats
Get institution statistics.

**Response**
```json
{
  "total_evaluations": 10,
  "active_evaluations": 3,
  "total_students": 250,
  "total_responses": 1500,
  "completion_rate": 85.2
}
```

## Evaluations

### GET /institutions/:institution_id/evaluations
List institution evaluations.

**Query Parameters**
- `status` - Filter by status: `active`, `inactive`, `all` (default: `all`)

**Response**
```json
{
  "evaluations": [
    {
      "id": 1,
      "name": "Product Launch Evaluation",
      "description": "Feedback for new product launch",
      "access_code": "ABC123",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00.000Z",
      "student_count": 45,
      "response_count": 180,
      "completion_rate": 80.0
    }
  ]
}
```

### POST /institutions/:institution_id/evaluations
Create a new evaluation.

**Request Body**
```json
{
  "name": "Evaluation Name",
  "description": "Evaluation description"
}
```

**Response (201)**
```json
{
  "id": 1,
  "name": "Evaluation Name",
  "description": "Evaluation description", 
  "access_code": "XYZ789",
  "is_active": false,
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

### GET /institutions/:institution_id/evaluations/:id
Get evaluation details including questions.

**Response**
```json
{
  "id": 1,
  "name": "Product Launch Evaluation",
  "description": "Feedback for new product launch",
  "access_code": "ABC123", 
  "is_active": true,
  "created_at": "2024-01-01T00:00:00.000Z",
  "questions": [
    {
      "id": 1,
      "question_text": "How would you rate this evaluation?",
      "question_type": "rating",
      "max_rating": 5,
      "position": 1
    }
  ],
  "qr_code_data": {
    "student_url": "http://localhost:3001/student/1/1?access_code=ABC123",
    "instructor_url": "http://localhost:3001/instructor/1/1?access_code=ABC123"
  }
}
```

### PATCH /institutions/:institution_id/evaluations/:id/activate
Activate an evaluation for student responses.

**Response**
```json
{
  "id": 1,
  "name": "Product Launch Evaluation",
  "is_active": true,
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

### PATCH /institutions/:institution_id/evaluations/:id/deactivate
Deactivate an evaluation to stop accepting responses.

**Response**
```json
{
  "id": 1,
  "name": "Product Launch Evaluation", 
  "is_active": false,
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

### GET /institutions/:institution_id/evaluations/:id/join
Join an evaluation as a student (validates access code).

**Query Parameters**
- `access_code` - Required evaluation access code

**Response**
```json
{
  "evaluation": {
    "id": 1,
    "name": "Product Launch Evaluation",
    "description": "Feedback for new product launch"
  },
  "questions": [...],
  "student_token": "session_token_here"
}
```

### GET /institutions/:institution_id/evaluations/:id/responses
Get all responses for an evaluation (instructor only).

**Response**
```json
{
  "responses": [
    {
      "id": 1,
      "user": {
        "id": 1,
        "name": "John Doe"
      },
      "evaluation_question": {
        "id": 1,
        "question": {
          "id": 1,
          "question_text": "How would you rate this evaluation?",
          "question_type": "rating"
        }
      },
      "answer_text": null,
      "selected_options": ["4"],
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## Questions

### GET /institutions/:institution_id/questions
List institution questions.

**Query Parameters**
- `type` - Filter by question type: `text`, `multiple_choice`, `rating`

**Response**
```json
{
  "questions": [
    {
      "id": 1,
      "question_text": "How would you rate this evaluation?",
      "question_type": "rating",
      "options": ["1", "2", "3", "4", "5"],
      "max_rating": 5,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### POST /institutions/:institution_id/questions
Create a new question.

**Request Body**
```json
{
  "question_text": "How would you rate this evaluation?",
  "question_type": "rating",
  "options": ["1", "2", "3", "4", "5"],
  "max_rating": 5
}
```

**Question Types**
- `text` - Free text response
- `multiple_choice` - Single selection from options
- `rating` - Numeric rating scale

**Response (201)**
```json
{
  "id": 1,
  "question_text": "How would you rate this evaluation?",
  "question_type": "rating", 
  "options": ["1", "2", "3", "4", "5"],
  "max_rating": 5,
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

### POST /institutions/:institution_id/questions/:id/add_to_evaluation
Add a question to an evaluation.

**Request Body**
```json
{
  "evaluation_id": 1,
  "position": 1
}
```

**Response**
```json
{
  "evaluation_question_id": 1,
  "message": "Question added to evaluation successfully"
}
```

### DELETE /institutions/:institution_id/questions/:id/remove_from_evaluation
Remove a question from an evaluation.

**Request Body**
```json
{
  "evaluation_id": 1
}
```

**Response**
```json
{
  "message": "Question removed from evaluation successfully"
}
```

## Answers

### POST /institutions/:institution_id/evaluations/:evaluation_id/answers/bulk_create
Submit multiple answers for an evaluation.

**Request Body**
```json
{
  "answers": [
    {
      "evaluation_question_id": 1,
      "answer_text": "Great evaluation!",
      "selected_options": []
    },
    {
      "evaluation_question_id": 2,
      "answer_text": null,
      "selected_options": ["Option A", "Option B"]
    }
  ]
}
```

**Response (201)**
```json
{
  "created": 2,
  "answers": [
    {
      "id": 1,
      "evaluation_question_id": 1,
      "answer_text": "Great evaluation!",
      "created_at": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": 2,
      "evaluation_question_id": 2,
      "selected_options": ["Option A", "Option B"],
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## Users

### POST /institutions/:institution_id/users/authenticate
Authenticate a user.

**Request Body**
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Response (200)**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  },
  "session_token": "abc123...",
  "institution": {
    "id": 1,
    "name": "Acme Corporation"
  }
}
```

### DELETE /institutions/:institution_id/users/logout
Logout current user.

**Response (200)**
```json
{
  "message": "Logged out successfully"
}
```

### GET /institutions/:institution_id/users/me
Get current user information.

**Response**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com", 
    "role": "student"
  },
  "institution": {
    "id": 1,
    "name": "Acme Corporation"
  }
}
```

## QR Code Generation

QR codes are automatically generated for evaluations and contain URLs for easy access.

### QR Code URLs
- **Participant**: `/student/:institution_id/:evaluation_id?access_code=:code`
- **Organizer**: `/instructor/:institution_id/:evaluation_id?access_code=:code`

### QR Code Data Structure
```json
{
  "evaluation": {
    "id": 1,
    "name": "Evaluation Name",
    "access_code": "ABC123"
  },
  "urls": {
    "student": "http://localhost:3001/student/1/1?access_code=ABC123",
    "instructor": "http://localhost:3001/instructor/1/1?access_code=ABC123"
  },
  "qr_data": {
    "student": {
      "url": "http://localhost:3001/student/1/1?access_code=ABC123",
      "display_text": "Join as Participant",
      "instructions": "Scan to join Evaluation Name as a student"
    },
    "instructor": {
      "url": "http://localhost:3001/instructor/1/1?access_code=ABC123", 
      "display_text": "Access as Organizer",
      "instructions": "Scan to access Evaluation Name instructor controls"
    }
  }
}
```

## Rate Limiting

API requests are rate-limited to prevaluation abuse:
- **Development**: No rate limiting
- **Production**: 100 requests per minute per IP address

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1609459200
```

## CORS Configuration

Cross-Origin Resource Sharing (CORS) is configured for:
- **Development**: `http://localhost:3001`
- **Production**: Your configured frontend domain

## API Client Examples

### JavaScript (Axios)
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Authenticate user
const response = await api.post('/institutions/1/users/authenticate', {
  name: 'John Doe',
  email: 'john@example.com'
});

// Include session token in subsequent requests
api.defaults.headers.common['Authorization'] = `Bearer ${response.data.session_token}`;
```

### cURL Examples
```bash
# Get institutions
curl -X GET http://localhost:3000/api/institutions

# Create institution
curl -X POST http://localhost:3000/api/institutions \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Org", "description": "Test institution"}'

# Authenticate user
curl -X POST http://localhost:3000/api/institutions/1/users/authenticate \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'
```

## Webhooks (Future Enhancement)

EvalHub will support webhooks for real-time evaluation notifications:
- Evaluation created
- Evaluation activated/deactivated
- Response submitted
- Evaluation completed

## API Versioning

Current version: `v1` (implied in base URL)
Future versions will be explicitly versioned: `/api/v2/`

## Support

For API support and questions:
- Documentation: This file and inline code comments
- Issues: GitHub Issues for bug reports and feature requests
- Email: api-support@evalhub.com