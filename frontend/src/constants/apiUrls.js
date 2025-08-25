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
export const apiBaseUrl = getEnvVar('REACT_APP_API_URL', 'http://localhost:3000')
export const frontendBaseUrl = getEnvVar('REACT_APP_FRONTEND_URL', 'http://localhost:3001')
const isDevelopment = getEnvVar('NODE_ENV', 'development') === 'development'

// Effective API base URL (empty string for development proxy, full URL for production)
export const effectiveApiBaseUrl = isDevelopment ? '' : apiBaseUrl

// Routes for navigation
export const loginRoute = 'authenticate'

// Authentication URLs
export const authenticateApi = (institutionId) => 
  `${effectiveApiBaseUrl}/api/institutions/${institutionId}/users/${loginRoute}`

// Institution API endpoints
export const ORGANIZATION_APIS = {
  allInstitutions: () => 
    `${effectiveApiBaseUrl}/api/institutions`,
  singleInstitution: (institutionId) => 
    `${effectiveApiBaseUrl}/api/institutions/${institutionId}`,
  createInstitution: () =>
    `${effectiveApiBaseUrl}/api/institutions`,
  updateInstitution: (institutionId) =>
    `${effectiveApiBaseUrl}/api/institutions/${institutionId}`,
  deleteInstitution: (institutionId) =>
    `${effectiveApiBaseUrl}/api/institutions/${institutionId}`
}

// Evaluation API endpoints
export const EVENT_APIS = {
  allEvaluations: (institutionId) => 
    `${effectiveApiBaseUrl}/api/institutions/${institutionId}/evaluations`,
  singleEvaluation: (institutionId, evaluationId) => 
    `${effectiveApiBaseUrl}/api/institutions/${institutionId}/evaluations/${evaluationId}`,
  createEvaluation: (institutionId) =>
    `${effectiveApiBaseUrl}/api/institutions/${institutionId}/evaluations`,
  updateEvaluation: (institutionId, evaluationId) =>
    `${effectiveApiBaseUrl}/api/institutions/${institutionId}/evaluations/${evaluationId}`,
  deleteEvaluation: (institutionId, evaluationId) =>
    `${effectiveApiBaseUrl}/api/institutions/${institutionId}/evaluations/${evaluationId}`,
  
  // Custom endpoints
  joinEvaluation: (institutionId, evaluationId) =>
    `${effectiveApiBaseUrl}/api/institutions/${institutionId}/evaluations/${evaluationId}/join`,
  evaluationResponses: (institutionId, evaluationId) =>
    `${effectiveApiBaseUrl}/api/institutions/${institutionId}/evaluations/${evaluationId}/responses`
}

// Question API endpoints
export const QUESTION_APIS = {
  allQuestions: (institutionId) => 
    `${effectiveApiBaseUrl}/api/institutions/${institutionId}/questions`,
  singleQuestion: (institutionId, questionId) => 
    `${effectiveApiBaseUrl}/api/institutions/${institutionId}/questions/${questionId}`,
  createQuestion: (institutionId) =>
    `${effectiveApiBaseUrl}/api/institutions/${institutionId}/questions`,
  updateQuestion: (institutionId, questionId) =>
    `${effectiveApiBaseUrl}/api/institutions/${institutionId}/questions/${questionId}`,
  deleteQuestion: (institutionId, questionId) =>
    `${effectiveApiBaseUrl}/api/institutions/${institutionId}/questions/${questionId}`,
  
  // Question-Evaluation relationship
  addQuestionToEvaluation: (institutionId, questionId) =>
    `${effectiveApiBaseUrl}/api/institutions/${institutionId}/questions/${questionId}/add_to_evaluation`,
  removeQuestionFromEvaluation: (institutionId, questionId) =>
    `${effectiveApiBaseUrl}/api/institutions/${institutionId}/questions/${questionId}/remove_from_evaluation`
}

// User API endpoints (simplified for evalhub)
export const USER_APIS = {
  singleUser: (institutionId, userId) =>
    `${effectiveApiBaseUrl}/api/institutions/${institutionId}/users/${userId}`,
  createUser: (institutionId) =>
    `${effectiveApiBaseUrl}/api/institutions/${institutionId}/users`,
  authenticateUser: (institutionId) =>
    `${effectiveApiBaseUrl}/api/institutions/${institutionId}/users/authenticate`
}

// Answer API endpoints
export const ANSWER_APIS = {
  bulkCreateAnswers: (institutionId, evaluationId) =>
    `${effectiveApiBaseUrl}/api/institutions/${institutionId}/evaluations/${evaluationId}/answers/bulk_create`,
  allAnswers: (institutionId, evaluationId) =>
    `${effectiveApiBaseUrl}/api/institutions/${institutionId}/evaluations/${evaluationId}/answers`,
  singleAnswer: (institutionId, evaluationId, answerId) =>
    `${effectiveApiBaseUrl}/api/institutions/${institutionId}/evaluations/${evaluationId}/answers/${answerId}`
}

// Health check
export const HEALTH_API = {
  healthCheck: () =>
    `${effectiveApiBaseUrl}/api/health`
}

// Helper function to build QR code URLs
export const buildParticipantUrl = (institutionId, evaluationId, accessCode) =>
  `${frontendBaseUrl}/student/${institutionId}/${evaluationId}?access_code=${accessCode}`

export const buildFacilitatorUrl = (institutionId, evaluationId, accessCode) =>
  `${frontendBaseUrl}/instructor/${institutionId}/${evaluationId}?access_code=${accessCode}`