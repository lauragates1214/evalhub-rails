// Utility Functions - Central exports for all utility modules

// Text processing utilities
export {
  highlightText,
  useTextHighlighting,
  HighlightedText
} from './textHighlighting'

// Data transformation utilities
export {
  transformEvaluationData,
  transformQuestionData,
  transformAnswerData,
  transformInstitutionData,
  transformResponsesForAnalysis,
  validateFormData,
  safeGet
} from './transformData'