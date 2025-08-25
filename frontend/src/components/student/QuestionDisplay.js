import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const QuestionDisplay = ({ institutionId, evaluationId }) => {
  const [evaluation, setEvaluation] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    loadEvaluation();
  }, [institutionId, evaluationId]);

  const loadEvaluation = async () => {
    try {
      setLoading(true);
      const response = await api.getEvaluation(institutionId, evaluationId);
      setEvaluation(response.data);
      setQuestions(response.data.questions || []);
    } catch (err) {
      setError('Failed to load evaluation questions');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const submitAnswers = async () => {
    try {
      setSubmitting(true);
      const answerData = Object.entries(answers).map(([questionId, value]) => ({
        evaluation_question_id: parseInt(questionId),
        answer_text: typeof value === 'string' ? value : null,
        selected_options: Array.isArray(value) ? value : null
      }));

      await api.bulkCreateAnswers(institutionId, evaluationId, { answers: answerData });
      alert('Responses submitted successfully!');
    } catch (err) {
      setError('Failed to submit responses');
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestionInput = (question) => {
    const questionId = question.id;
    const currentAnswer = answers[questionId] || '';

    switch (question.question_type) {
      case 'text':
        return (
          <textarea
            value={currentAnswer}
            onChange={(e) => handleAnswerChange(questionId, e.target.value)}
            placeholder="Enter your response..."
            className="text-input"
          />
        );

      case 'multiple_choice':
        return (
          <div className="multiple-choice">
            {question.options?.map((option, index) => (
              <label key={index} className="option-label">
                <input
                  type="radio"
                  name={`question_${questionId}`}
                  value={option}
                  checked={currentAnswer === option}
                  onChange={(e) => handleAnswerChange(questionId, e.target.value)}
                />
                <span className="option-text">{option}</span>
              </label>
            )) || (
              <div className="no-options">No options available for this question</div>
            )}
          </div>
        );

      default:
        return <div className="unsupported-type">Unsupported question type</div>;
    }
  };

  if (loading) return <div className="loading">Loading questions...</div>;

  if (!evaluation || questions.length === 0) {
    return (
      <div className="question-display">
        <div className="empty-state">
          <h3>No Questions Available</h3>
          <p>This evaluation doesn't have any questions yet.</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const answeredQuestions = Object.keys(answers).length;

  return (
    <div className="question-display">
      <div className="evaluation-header">
        <h2>{evaluation.name}</h2>
        <div className="progress-info">
          Question {currentQuestionIndex + 1} of {questions.length}
          ({answeredQuestions} answered)
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="question-card">
        <div className="question-header">
          <span className="question-number">#{currentQuestionIndex + 1}</span>
          <span className="question-type">{currentQuestion.question_type}</span>
        </div>
        
        <div className="question-text">
          {currentQuestion.question_text}
        </div>

        <div className="question-input">
          {renderQuestionInput(currentQuestion)}
        </div>
      </div>

      <div className="navigation-controls">
        <button 
          className="nav-btn prev"
          onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </button>

        <div className="question-dots">
          {questions.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentQuestionIndex ? 'active' : ''} ${answers[questions[index].id] ? 'answered' : ''}`}
              onClick={() => setCurrentQuestionIndex(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {!isLastQuestion ? (
          <button 
            className="nav-btn next"
            onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
          >
            Next
          </button>
        ) : (
          <button 
            className="submit-btn"
            onClick={submitAnswers}
            disabled={submitting || answeredQuestions === 0}
          >
            {submitting ? 'Submitting...' : `Submit Responses (${answeredQuestions})`}
          </button>
        )}
      </div>

      <div className="question-overview">
        <h4>All Questions</h4>
        <div className="question-list">
          {questions.map((question, index) => (
            <div 
              key={question.id}
              className={`question-summary ${index === currentQuestionIndex ? 'current' : ''} ${answers[question.id] ? 'answered' : ''}`}
              onClick={() => setCurrentQuestionIndex(index)}
            >
              <span className="summary-number">#{index + 1}</span>
              <span className="summary-text">{question.question_text}</span>
              <span className="summary-status">
                {answers[question.id] ? '✓' : '○'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionDisplay;