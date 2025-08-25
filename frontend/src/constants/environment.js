/**
 * Centralized environment configuration for EvalHub
 * Handles all environment variables and application settings
 */

// Environment variable helper that works across different build systems
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

// Environment detection
export const NODE_ENV = getEnvVar('NODE_ENV', 'development')
export const isDevelopment = NODE_ENV === 'development'
export const isProduction = NODE_ENV === 'production'
export const isTest = NODE_ENV === 'test'

// API Configuration
export const API_BASE_URL = getEnvVar('REACT_APP_API_URL', 'http://localhost:3000')
export const API_TIMEOUT = parseInt(getEnvVar('REACT_APP_API_TIMEOUT', '10000'), 10)

// Frontend Configuration
export const FRONTEND_BASE_URL = getEnvVar('REACT_APP_FRONTEND_URL', 'http://localhost:3001')
export const APP_NAME = getEnvVar('REACT_APP_NAME', 'EvalHub')
export const APP_VERSION = getEnvVar('REACT_APP_VERSION', '1.0.0')

// Feature Flags
export const FEATURES = {
  DEBUG_MODE: getEnvVar('REACT_APP_DEBUG', isDevelopment ? 'true' : 'false') === 'true',
  ANALYTICS_ENABLED: getEnvVar('REACT_APP_ANALYTICS', 'false') === 'true',
  ERROR_REPORTING: getEnvVar('REACT_APP_ERROR_REPORTING', isProduction ? 'true' : 'false') === 'true'
}

// Storage Configuration
export const STORAGE_KEYS = {
  SESSION_TOKEN: 'session_token',
  USER_PREFERENCES: 'user_preferences',
  ORGANIZATION_ID: 'institution_id',
  LAST_EVENT: 'last_evaluation'
}

// Default Values
export const DEFAULTS = {
  ORGANIZATION_NAME: 'My Institution',
  EVENT_NAME: 'New Evaluation',
  PARTICIPANT_NAME: 'Anonymous',
  SESSION_TIMEOUT: 3600000, // 1 hour in milliseconds
  MAX_QUESTIONS_PER_EVENT: 50,
  MAX_PARTICIPANTS_PER_EVENT: 1000
}

// Validation Rules
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: parseInt(getEnvVar('REACT_APP_MIN_PASSWORD_LENGTH', '8'), 10),
  MAX_TEXT_LENGTH: parseInt(getEnvVar('REACT_APP_MAX_TEXT_LENGTH', '5000'), 10),
  MAX_QUESTION_TEXT_LENGTH: parseInt(getEnvVar('REACT_APP_MAX_QUESTION_LENGTH', '500'), 10),
  MAX_ANSWER_TEXT_LENGTH: parseInt(getEnvVar('REACT_APP_MAX_ANSWER_LENGTH', '2000'), 10)
}

// Development Tools
export const DEV_TOOLS = {
  MOCK_DATA: getEnvVar('REACT_APP_MOCK_DATA', 'false') === 'true',
  BYPASS_AUTH: getEnvVar('REACT_APP_BYPASS_AUTH', 'false') === 'true',
  SHOW_DEV_TOOLS: isDevelopment && getEnvVar('REACT_APP_DEV_TOOLS', 'true') === 'true'
}

// Export all environment configuration as a single object for easy importing
export const ENV_CONFIG = {
  NODE_ENV,
  isDevelopment,
  isProduction,
  isTest,
  API_BASE_URL,
  API_TIMEOUT,
  FRONTEND_BASE_URL,
  APP_NAME,
  APP_VERSION,
  FEATURES,
  STORAGE_KEYS,
  DEFAULTS,
  VALIDATION,
  DEV_TOOLS
}

export default ENV_CONFIG