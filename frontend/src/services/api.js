import axios from 'axios'
import { 
  effectiveApiBaseUrl, 
  loginRoute, 
  ORGANIZATION_APIS,
  COURSE_APIS,
  QUESTION_APIS,
  USER_APIS,
  ANSWER_APIS
} from '../constants/apiUrls'
import { API_TIMEOUT, STORAGE_KEYS } from '../constants/environment'

// create axios instance with default config
const axiosInstance = axios.create({
  baseURL: effectiveApiBaseUrl,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const sessionToken = localStorage.getItem(STORAGE_KEYS.SESSION_TOKEN)
    if (sessionToken) {
      config.headers.Authorization = `Bearer ${sessionToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

/**
 * centralized API function to handle all HTTP requests
 * @param {string} method - HTTP method (get, post, put, delete)
 * @param {string} url - API endpoint
 * @param {object} data - request payload (for POST, PUT requests)
 * @param {object} customConfig - optional axios config overrides
 * @returns {Promise} - promise with response data or error
 */
export const apiRequest = async (method, url, data=null, customConfig={}) => {
  try {
    const config = {
      method: method.toLowerCase(),
      url,
      ...customConfig
    }

    // add data to config if provided
    if (data) {
      if (['post', 'put', 'patch'].includes(config.method)) {
        config.data = data
      } else {
        config.params = data
      }
    }

    const response = await axiosInstance(config)
    return response.data
  } catch (error) {
    // handle specific error types
    if (error.response) {
      // server responded with error status code
      const status = error.response.status

      // handle authentication errors
      if (status === 401) {
        localStorage.removeItem(STORAGE_KEYS.SESSION_TOKEN)
        // navigation to login
        window.location.href = loginRoute
        throw new Error('Authentication required. Please login again.')
      }

      // handle forbidden errors
      if (status === 403) {
        throw new Error('Sorry, you do not have permission to access this resource.')
      }

      // handle not found
      if (status === 404) {
        throw new Error(`Sorry, this resource was not found: ${url}`)
      }

      // handle validation errors 
      if (status === 422) {
        const validationErrors = error.response.data.errors || {}
        const validationError = new Error('Validation failed')
        validationError.type = 'VALIDATION_ERROR'
        validationError.errors = validationErrors
        throw validationError
      }

      // handle server errors
      if (status >= 500) {
        throw new Error('Sorry, there was a server error. Please try again.')
      }

      // default error message for other status codes
      throw new Error(error.response.data.message || 'Sorry, an error occurred')
    } else {
      // something happened in setting up the request
      throw new Error('Sorry, an error occurred while processing your request.')
    }
  }
}

// helper methods
export const get = (url, params=null, config={}) => 
  apiRequest('get', url, params, config)

export const post = (url, data = null, config = {}) => 
  apiRequest('post', url, data, config)

export const put = (url, data = null, config = {}) => 
  apiRequest('put', url, data, config)

export const patch = (url, data = null, config = {}) => 
  apiRequest('patch', url, data, config)

// Institution/Organization API methods
const getInstitution = (institutionId) => 
  get(ORGANIZATION_APIS.singleInstitution(institutionId))

const createInstitution = (data) => 
  post(ORGANIZATION_APIS.createInstitution(), data)

const updateInstitution = (institutionId, data) => 
  put(ORGANIZATION_APIS.updateInstitution(institutionId), data)

// Course API methods
const getCourses = (institutionId) => 
  get(COURSE_APIS.allCourses(institutionId))

const getCourse = (institutionId, courseId) => 
  get(COURSE_APIS.singleCourse(institutionId, courseId))

const createCourse = (institutionId, data) => 
  post(COURSE_APIS.createCourse(institutionId), data)

const updateCourse = (institutionId, courseId, data) => 
  put(COURSE_APIS.updateCourse(institutionId, courseId), data)

const joinCourse = (institutionId, courseId, accessCode) => 
  post(COURSE_APIS.joinCourse(institutionId, courseId), { access_code: accessCode })

const getCourseResponses = (institutionId, courseId) => 
  get(COURSE_APIS.courseResponses(institutionId, courseId))

// Question API methods
const getQuestions = (institutionId) => 
  get(QUESTION_APIS.allQuestions(institutionId))

const createQuestion = (institutionId, data) => 
  post(QUESTION_APIS.createQuestion(institutionId), data)

// User API methods
const createUser = (institutionId, userData) => 
  post(USER_APIS.createUser(institutionId), userData)

const authenticateUser = (institutionId, email, password) => 
  post(USER_APIS.authenticateUser(institutionId), { email, password })

// Answer API methods
const createAnswers = (institutionId, courseId, answers) => 
  post(ANSWER_APIS.bulkCreateAnswers(institutionId, courseId), { answers })

const getAnswers = (institutionId, courseId) => 
  get(ANSWER_APIS.allAnswers(institutionId, courseId))

// Create apiService object with all methods
export const apiService = {
  // Core request methods
  request: apiRequest,
  get,
  post,
  put,
  patch,
  
  // Institution methods
  getInstitution,
  createInstitution,
  updateInstitution,
  
  // Course methods
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  joinCourse,
  getCourseResponses,
  
  // Question methods
  getQuestions,
  createQuestion,
  
  // User methods
  createUser,
  authenticateUser,
  
  // Answer methods
  createAnswers,
  getAnswers
}

export default apiService