// Environment variable helper that works in both Create React App and Jest
const getEnvVar = (key, fallback) => {
  // For Create React App/Node.js/Jest environments
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key]
  }
  
  // For runtime environments where env vars might be injected differently
  if (typeof window !== 'undefined' && window.__ENV__ && window.__ENV__[key]) {
    return window.__ENV__[key]
  }
  
  return fallback
}

// Base URLs with standardized fallbacks
const isDevelopment = getEnvVar('NODE_ENV', 'development') === 'development'
// API base URL (empty string for development proxy, full URL for production)
export const apiBaseUrl = isDevelopment ? '' : getEnvVar('REACT_APP_API_URL', 'http://localhost:3000')
export const frontendBaseUrl = getEnvVar('REACT_APP_FRONTEND_URL', 'http://localhost:3001')

// Routes for navigation
export const loginRoute = 'authenticate'

// Authentication URLs
export const authenticateApi = (institutionId) => 
  `${apiBaseUrl}/api/institutions/${institutionId}/users/${loginRoute}`

// Institution API endpoints
export const INSTITUTION_APIS = {
  allInstitutions: () => 
    `${apiBaseUrl}/api/institutions`,
  singleInstitution: (institutionId) => 
    `${apiBaseUrl}/api/institutions/${institutionId}`,
  createInstitution: () =>
    `${apiBaseUrl}/api/institutions`,
  updateInstitution: (institutionId) =>
    `${apiBaseUrl}/api/institutions/${institutionId}`,
  deleteInstitution: (institutionId) =>
    `${apiBaseUrl}/api/institutions/${institutionId}`
}

// Course API endpoints
export const COURSE_APIS = {
  allCourses: (institutionId) => 
    `${apiBaseUrl}/api/institutions/${institutionId}/courses`,
  singleCourse: (institutionId, courseId) => 
    `${apiBaseUrl}/api/institutions/${institutionId}/courses/${courseId}`,
  createCourse: (institutionId) =>
    `${apiBaseUrl}/api/institutions/${institutionId}/courses`,
  updateCourse: (institutionId, courseId) =>
    `${apiBaseUrl}/api/institutions/${institutionId}/courses/${courseId}`,
  deleteCourse: (institutionId, courseId) =>
    `${apiBaseUrl}/api/institutions/${institutionId}/courses/${courseId}`,
  
  // Custom endpoints
  joinCourse: (institutionId, courseId) =>
    `${apiBaseUrl}/api/institutions/${institutionId}/courses/${courseId}/join`,
  courseResponses: (institutionId, courseId) =>
    `${apiBaseUrl}/api/institutions/${institutionId}/courses/${courseId}/responses`
}

// Question API endpoints
export const QUESTION_APIS = {
  allQuestions: (institutionId) => 
    `${apiBaseUrl}/api/institutions/${institutionId}/questions`,
  singleQuestion: (institutionId, questionId) => 
    `${apiBaseUrl}/api/institutions/${institutionId}/questions/${questionId}`,
  createQuestion: (institutionId) =>
    `${apiBaseUrl}/api/institutions/${institutionId}/questions`,
  updateQuestion: (institutionId, questionId) =>
    `${apiBaseUrl}/api/institutions/${institutionId}/questions/${questionId}`,
  deleteQuestion: (institutionId, questionId) =>
    `${apiBaseUrl}/api/institutions/${institutionId}/questions/${questionId}`,
  
  // Question-Course relationship
  addQuestionToCourse: (institutionId, questionId) =>
    `${apiBaseUrl}/api/institutions/${institutionId}/questions/${questionId}/add_to_course`,
  removeQuestionFromCourse: (institutionId, questionId) =>
    `${apiBaseUrl}/api/institutions/${institutionId}/questions/${questionId}/remove_from_course`
}

// User API endpoints (simplified for evalhub)
export const USER_APIS = {
  singleUser: (institutionId, userId) =>
    `${apiBaseUrl}/api/institutions/${institutionId}/users/${userId}`,
  createUser: (institutionId) =>
    `${apiBaseUrl}/api/institutions/${institutionId}/users`,
  authenticateUser: (institutionId) =>
    `${apiBaseUrl}/api/institutions/${institutionId}/users/authenticate`
}

// Answer API endpoints
export const ANSWER_APIS = {
  bulkCreateAnswers: (institutionId, courseId) =>
    `${apiBaseUrl}/api/institutions/${institutionId}/courses/${courseId}/answers/bulk_create`,
  allAnswers: (institutionId, courseId) =>
    `${apiBaseUrl}/api/institutions/${institutionId}/courses/${courseId}/answers`,
  singleAnswer: (institutionId, courseId, answerId) =>
    `${apiBaseUrl}/api/institutions/${institutionId}/courses/${courseId}/answers/${answerId}`
}

// Health check
export const HEALTH_API = {
  healthCheck: () =>
    `${apiBaseUrl}/api/health`
}

// Build QR code URLs
export const buildStudentQrUrl = (institutionId, courseId, accessCode) =>
  `${frontendBaseUrl}/student/${institutionId}/${courseId}?access_code=${accessCode}`

export const buildInstructorQrUrl = (institutionId, courseId, accessCode) =>
  `${frontendBaseUrl}/instructor/${institutionId}/${courseId}?access_code=${accessCode}`