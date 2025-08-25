/**
 * Data transformation utilities for EvalHub
 * Handles data normalization, validation, and formatting
 */

/**
 * Safely transforms evaluation data with fallbacks for missing properties
 * @param {Object} evaluationData - Raw evaluation data from API
 * @returns {Object} - Normalized evaluation object
 */
export const transformEvaluationData = (evaluationData) => {
  if (!evaluationData || typeof evaluationData !== 'object') {
    return {
      id: null,
      name: 'Untitled Evaluation',
      description: '',
      access_code: '',
      created_at: null,
      updated_at: null,
      questions: [],
      responses: []
    }
  }

  return {
    id: evaluationData.id || null,
    name: evaluationData.name || 'Untitled Evaluation',
    description: evaluationData.description || '',
    access_code: evaluationData.access_code || '',
    created_at: evaluationData.created_at || null,
    updated_at: evaluationData.updated_at || null,
    questions: Array.isArray(evaluationData.questions) ? evaluationData.questions : [],
    responses: Array.isArray(evaluationData.responses) ? evaluationData.responses : []
  }
}

/**
 * Transforms question data with safe fallbacks
 * @param {Object} questionData - Raw question data from API
 * @returns {Object} - Normalized question object
 */
export const transformQuestionData = (questionData) => {
  if (!questionData || typeof questionData !== 'object') {
    return {
      id: null,
      text: '',
      question_type: 'open_text',
      required: false,
      options: [],
      created_at: null
    }
  }

  return {
    id: questionData.id || null,
    text: questionData.text || '',
    question_type: questionData.question_type || 'open_text',
    required: Boolean(questionData.required),
    options: Array.isArray(questionData.options) ? questionData.options : [],
    created_at: questionData.created_at || null,
    // Support for text highlighting configuration
    highlight_words: Array.isArray(questionData.highlight_words) 
      ? questionData.highlight_words 
      : []
  }
}

/**
 * Transforms answer/response data with validation
 * @param {Object} answerData - Raw answer data from API
 * @returns {Object} - Normalized answer object
 */
export const transformAnswerData = (answerData) => {
  if (!answerData || typeof answerData !== 'object') {
    return {
      id: null,
      question_id: null,
      student_name: 'Anonymous',
      response_text: '',
      created_at: null
    }
  }

  return {
    id: answerData.id || null,
    question_id: answerData.question_id || null,
    student_name: answerData.student_name || 'Anonymous',
    response_text: answerData.response_text || '',
    created_at: answerData.created_at || null
  }
}

/**
 * Transforms institution data with fallbacks
 * @param {Object} orgData - Raw institution data from API
 * @returns {Object} - Normalized institution object
 */
export const transformInstitutionData = (orgData) => {
  if (!orgData || typeof orgData !== 'object') {
    return {
      id: null,
      name: 'Unnamed Institution',
      created_at: null,
      evaluations: []
    }
  }

  return {
    id: orgData.id || null,
    name: orgData.name || 'Unnamed Institution',
    created_at: orgData.created_at || null,
    evaluations: Array.isArray(orgData.evaluations) 
      ? orgData.evaluations.map(transformEvaluationData)
      : []
  }
}

/**
 * Transforms and groups response data for analysis
 * @param {Array} responses - Array of response objects
 * @param {Array} questions - Array of question objects for context
 * @returns {Object} - Grouped and analyzed response data
 */
export const transformResponsesForAnalysis = (responses = [], questions = []) => {
  if (!Array.isArray(responses) || !Array.isArray(questions)) {
    return {
      totalResponses: 0,
      questionAnalysis: {},
      studentSummary: {}
    }
  }

  const transformedResponses = responses.map(transformAnswerData)
  
  // Group responses by question
  const questionAnalysis = {}
  questions.forEach(question => {
    const questionResponses = transformedResponses.filter(
      response => response.question_id === question.id
    )
    
    questionAnalysis[question.id] = {
      question: transformQuestionData(question),
      responses: questionResponses,
      responseCount: questionResponses.length
    }
  })

  // Group responses by student
  const studentSummary = {}
  transformedResponses.forEach(response => {
    const student = response.student_name
    if (!studentSummary[student]) {
      studentSummary[student] = {
        name: student,
        responses: [],
        responseCount: 0
      }
    }
    studentSummary[student].responses.push(response)
    studentSummary[student].responseCount++
  })

  return {
    totalResponses: transformedResponses.length,
    questionAnalysis,
    studentSummary
  }
}

/**
 * Validates and normalizes form data before API submission
 * @param {Object} formData - Raw form data
 * @param {string} type - Type of form (evaluation, question, answer)
 * @returns {Object} - Validated and normalized form data
 */
export const validateFormData = (formData, type) => {
  if (!formData || typeof formData !== 'object') {
    return { isValid: false, errors: ['Invalid form data'], data: {} }
  }

  const errors = []
  const normalizedData = {}

  switch (type) {
    case 'evaluation':
      normalizedData.name = (formData.name || '').trim()
      normalizedData.description = (formData.description || '').trim()
      
      if (!normalizedData.name) {
        errors.push('Evaluation name is required')
      }
      break

    case 'question':
      normalizedData.text = (formData.text || '').trim()
      normalizedData.question_type = formData.question_type || 'open_text'
      normalizedData.required = Boolean(formData.required)
      normalizedData.options = Array.isArray(formData.options) 
        ? formData.options.filter(opt => opt && opt.trim())
        : []
      
      if (!normalizedData.text) {
        errors.push('Question text is required')
      }
      break

    case 'answer':
      normalizedData.response_text = (formData.response_text || '').trim()
      normalizedData.question_id = formData.question_id || null
      normalizedData.student_name = (formData.student_name || '').trim()
      
      if (!normalizedData.response_text) {
        errors.push('Response text is required')
      }
      if (!normalizedData.question_id) {
        errors.push('Question ID is required')
      }
      break

    default:
      errors.push('Unknown form type')
  }

  return {
    isValid: errors.length === 0,
    errors,
    data: normalizedData
  }
}

/**
 * Utility to safely extract nested properties from objects
 * @param {Object} obj - Source object
 * @param {string} path - Dot-notation path (e.g., 'user.profile.name')
 * @param {*} defaultValue - Default value if path doesn't exist
 * @returns {*} - Value at path or default value
 */
export const safeGet = (obj, path, defaultValue = null) => {
  if (!obj || typeof obj !== 'object' || !path) {
    return defaultValue
  }

  const keys = path.split('.')
  let current = obj

  for (const key of keys) {
    if (current === null || current === undefined || !(key in current)) {
      return defaultValue
    }
    current = current[key]
  }

  return current !== undefined ? current : defaultValue
}

export default {
  transformEvaluationData,
  transformQuestionData,
  transformAnswerData,
  transformInstitutionData,
  transformResponsesForAnalysis,
  validateFormData,
  safeGet
}