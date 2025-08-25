import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ResponseViewer = ({ institutionId, evaluationId, onClose }) => {
  const [responses, setResponses] = useState([]);
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterUser, setFilterUser] = useState('');
  const [filterQuestion, setFilterQuestion] = useState('');

  useEffect(() => {
    loadData();
  }, [institutionId, evaluationId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [evaluationRes, responsesRes] = await Promise.all([
        api.getEvaluation(institutionId, evaluationId),
        api.getEvaluationResponses(institutionId, evaluationId)
      ]);
      setEvaluation(evaluationRes.data);
      setResponses(responsesRes.data);
    } catch (err) {
      setError('Failed to load response data');
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    const csvContent = responses.map(response => ({
      user: response.user.name,
      question: response.evaluation_question.question.question_text,
      answer: response.answer_text || response.selected_options?.join(', ') || '',
      submitted_at: new Date(response.created_at).toLocaleString()
    }));

    const csv = [
      ['User', 'Question', 'Answer', 'Submitted At'],
      ...csvContent.map(row => [row.user, row.question, row.answer, row.submitted_at])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${evaluation?.name || 'evaluation'}_responses.csv`;
    a.click();
  };

  const filteredResponses = responses.filter(response => {
    const userMatch = !filterUser || 
      response.user.name.toLowerCase().includes(filterUser.toLowerCase());
    const questionMatch = !filterQuestion || 
      response.evaluation_question.question.question_text.toLowerCase().includes(filterQuestion.toLowerCase());
    return userMatch && questionMatch;
  });

  const getResponseSummary = () => {
    const totalUsers = new Set(responses.map(r => r.user.id)).size;
    const totalQuestions = evaluation?.questions?.length || 0;
    const completionRate = totalQuestions > 0 ? 
      (responses.length / (totalUsers * totalQuestions) * 100) : 0;
    
    return { totalUsers, totalQuestions, completionRate: completionRate.toFixed(1) };
  };

  if (loading) return <div className="loading">Loading responses...</div>;

  const summary = getResponseSummary();

  return (
    <div className="response-viewer">
      <div className="viewer-header">
        <h3>Evaluation Responses: {evaluation?.name}</h3>
        <div className="header-actions">
          <button className="export-btn" onClick={exportData}>
            Export CSV
          </button>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="response-summary">
        <div className="summary-item">
          <span className="label">Total Participants:</span>
          <span className="value">{summary.totalUsers}</span>
        </div>
        <div className="summary-item">
          <span className="label">Total Questions:</span>
          <span className="value">{summary.totalQuestions}</span>
        </div>
        <div className="summary-item">
          <span className="label">Completion Rate:</span>
          <span className="value">{summary.completionRate}%</span>
        </div>
        <div className="summary-item">
          <span className="label">Total Responses:</span>
          <span className="value">{responses.length}</span>
        </div>
      </div>

      <div className="response-filters">
        <input
          type="text"
          placeholder="Filter by user name..."
          value={filterUser}
          onChange={(e) => setFilterUser(e.target.value)}
          className="filter-input"
        />
        <input
          type="text"
          placeholder="Filter by question..."
          value={filterQuestion}
          onChange={(e) => setFilterQuestion(e.target.value)}
          className="filter-input"
        />
      </div>

      <div className="responses-list">
        {filteredResponses.map(response => (
          <div key={response.id} className="response-item">
            <div className="response-header">
              <span className="user-name">{response.user.name}</span>
              <span className="timestamp">
                {new Date(response.created_at).toLocaleString()}
              </span>
            </div>
            <div className="response-content">
              <div className="question-text">
                {response.evaluation_question.question.question_text}
              </div>
              <div className="answer-text">
                {response.answer_text || 
                 (response.selected_options?.length > 0 ? 
                  response.selected_options.join(', ') : 
                  'No answer provided')}
              </div>
            </div>
          </div>
        ))}
        
        {filteredResponses.length === 0 && (
          <div className="empty-state">
            {responses.length === 0 ? 
              'No responses submitted yet.' : 
              'No responses match your filters.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponseViewer;