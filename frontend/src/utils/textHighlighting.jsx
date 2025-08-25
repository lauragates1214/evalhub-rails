import React from 'react'

/**
 * Highlights specified words/phrases in text with accent color styling
 * @param {string} text - The text to process
 * @param {string|Array<string>} wordsToHighlight - Words or phrases to highlight
 * @param {string} className - Optional CSS class for highlighted text
 * @returns {React.Component} - JSX with highlighted text spans
 */
export const highlightText = (text, wordsToHighlight, className = 'highlighted-text') => {
  if (!text || !wordsToHighlight) {
    return text
  }

  // Convert to array if single string provided
  const highlightArray = Array.isArray(wordsToHighlight) 
    ? wordsToHighlight 
    : [wordsToHighlight]

  // Filter out empty strings and trim whitespace
  const validHighlights = highlightArray
    .filter(word => word && word.trim().length > 0)
    .map(word => word.trim())

  if (validHighlights.length === 0) {
    return text
  }

  // Create regex pattern for case-insensitive matching
  // Escape special regex characters and join with OR operator
  const escapeRegex = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const pattern = validHighlights
    .map(escapeRegex)
    .join('|')
  
  const regex = new RegExp(`(${pattern})`, 'gi')
  
  // Split text by the regex pattern and map to JSX
  const parts = text.split(regex)
  
  return parts.map((part, index) => {
    // Check if this part matches any highlight word (case-insensitive)
    const isHighlighted = validHighlights.some(
      word => part.toLowerCase() === word.toLowerCase()
    )

    if (isHighlighted) {
      return (
        <span 
          key={index} 
          className={className}
          style={{ 
            backgroundColor: 'var(--accent-color, #C65D47)', 
            color: 'white',
            padding: '0.125rem 0.25rem',
            borderRadius: '0.25rem',
            fontWeight: '600'
          }}
        >
          {part}
        </span>
      )
    }
    
    return part
  })
}

/**
 * Hook for managing text highlighting with configuration
 * @param {Object} config - Configuration object with highlight_words property
 * @returns {Function} - Function to highlight text based on config
 */
export const useTextHighlighting = (config = {}) => {
  const highlightWords = config?.highlight_words || []
  
  const highlightWithConfig = (text, customWords = null, className) => {
    const wordsToUse = customWords || highlightWords
    return highlightText(text, wordsToUse, className)
  }
  
  return highlightWithConfig
}

/**
 * Component wrapper for highlighted text
 * @param {Object} props - Component props
 * @param {string} props.text - Text to highlight
 * @param {Array<string>} props.highlights - Words to highlight
 * @param {string} props.className - CSS class for container
 * @param {string} props.highlightClassName - CSS class for highlighted spans
 * @returns {React.Component}
 */
export const HighlightedText = ({ 
  text, 
  highlights = [], 
  className = '', 
  highlightClassName = 'highlighted-text' 
}) => {
  const processedText = highlightText(text, highlights, highlightClassName)
  
  return (
    <div className={className}>
      {processedText}
    </div>
  )
}

export default {
  highlightText,
  useTextHighlighting,
  HighlightedText
}