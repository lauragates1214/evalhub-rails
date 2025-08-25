import axios from 'axios'
import { effectiveApiBaseUrl, loginRoute } from '@constants/apiUrls'
import { API_TIMEOUT, STORAGE_KEYS } from '@constants/environment'

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
        throw {
          type: 'VALIDATION_ERROR',
          message: 'Validation failed',
          errors: validationErrors
        }
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

export default {
  request: apiRequest,
  get,
  post,
  put,
  patch
}