import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const QuestionManager = ({ institutionId, evaluationId, onClose }) => {
  const [questions, setQuestions] = useState([]);
  const [evaluationQuestions, setEvaluationQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, [institutionId, evaluationId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [questionsRes, evaluationRes] = await Promise.all([
        api.getQuestions(institutionId),
        api.getEvaluation(institutionId, evaluationId)
      ]);
      setQuestions(questionsRes.data);
      setEvaluationQuestions(evaluationRes.data.questions || []);
    } catch (err) {
      setError('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const addQuestionToEvaluation = async (questionId) => {
    try {
      await api.addQuestionToEvaluation(institutionId, questionId, { evaluation_id: evaluationId });
      await loadData();
    } catch (err) {
      setError('Failed to add question to evaluation');
    }
  };

  const removeQuestionFromEvaluation = async (questionId) => {
    try {
      await api.removeQuestionFromEvaluation(institutionId, questionId, { evaluation_id: evaluationId });
      await loadData();
    } catch (err) {
      setError('Failed to remove question from evaluation');
    }
  };

  const availableQuestions = questions.filter(
    q => !evaluationQuestions.some(eq => eq.id === q.id)
  );

  if (loading) return <div className="loading">Loading questions...</div>;

  return (
    <div className="question-manager">
      <div className="manager-header">
        <h3>Manage Evaluation Questions</h3>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="questions-section">
        <div className="section-header">
          <h4>Questions in Evaluation ({evaluationQuestions.length})</h4>
        </div>
        <div className="questions-list">
          {evaluationQuestions.map(question => (
            <div key={question.id} className="question-item in-evaluation">
              <div className="question-content">
                <span className="question-type">{question.question_type}</span>
                <span className="question-text">{question.question_text}</span>
              </div>
              <button 
                className="remove-btn"
                onClick={() => removeQuestionFromEvaluation(question.id)}
              >
                Remove
              </button>
            </div>
          ))}
          {evaluationQuestions.length === 0 && (
            <div className="empty-state">No questions added to this evaluation yet.</div>
          )}
        </div>
      </div>

      <div className="questions-section">
        <div className="section-header">
          <h4>Available Questions ({availableQuestions.length})</h4>
        </div>
        <div className="questions-list">
          {availableQuestions.map(question => (
            <div key={question.id} className="question-item available">
              <div className="question-content">
                <span className="question-type">{question.question_type}</span>
                <span className="question-text">{question.question_text}</span>
              </div>
              <button 
                className="add-btn"
                onClick={() => addQuestionToEvaluation(question.id)}
              >
                Add to Evaluation
              </button>
            </div>
          ))}
          {availableQuestions.length === 0 && (
            <div className="empty-state">No available questions to add.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionManager;