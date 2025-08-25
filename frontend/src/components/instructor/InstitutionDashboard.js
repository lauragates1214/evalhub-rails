import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiService from '../../services/api';

const InstitutionDashboard = () => {
  const { institutionId } = useParams();
  const [institution, setInstitution] = useState(null);
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newEvaluationName, setNewEvaluationName] = useState('');
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, [institutionId]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [orgResponse, evaluationsResponse] = await Promise.all([
        apiService.getInstitution(institutionId),
        apiService.getEvaluations(institutionId)
      ]);

      setInstitution(orgResponse.data);
      setEvaluations(evaluationsResponse.data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvaluation = async (e) => {
    e.prevaluationDefault();
    if (!newEvaluationName.trim()) return;
    
    try {
      await apiService.createEvaluation(institutionId, {
        name: newEvaluationName,
        description: `Feedback evaluation: ${newEvaluationName}`
      });
      setNewEvaluationName('');
      loadDashboardData();
    } catch (error) {
      console.error('Failed to create evaluation:', error);
    }
  };

  const viewResponses = async (evaluation) => {
    try {
      const response = await apiService.getEvaluationResponses(institutionId, evaluation.id);
      setSelectedEvaluation({ ...evaluation, responses: response.data });
    } catch (error) {
      console.error('Failed to load responses:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <header>
        <h1>{institution?.name}</h1>
        <p>Facilitator Dashboard</p>
      </header>

      <div className="create-evaluation">
        <h2>Create New Evaluation</h2>
        <form onSubmit={handleCreateEvaluation}>
          <input
            type="text"
            value={newEvaluationName}
            onChange={(e) => setNewEvaluationName(e.target.value)}
            placeholder="Enter evaluation name..."
            required
          />
          <button type="submit">Create Evaluation</button>
        </form>
      </div>

      <div className="evaluations-section">
        <h2>Your Evaluations ({evaluations.length})</h2>
        {evaluations.length === 0 ? (
          <div className="empty-state">
            <p>No evaluations created yet. Create your first evaluation to get started!</p>
          </div>
        ) : (
          <div className="evaluations-list">
            {evaluations.map(evaluation => (
              <div key={evaluation.id} className="evaluation-card">
                <div className="evaluation-info">
                  <h3>{evaluation.name}</h3>
                  <p>{evaluation.description}</p>
                  <div className="evaluation-meta">
                    <span className="access-code">Access Code: {evaluation.access_code}</span>
                    <span className="questions-count">{evaluation.questions?.length || 0} questions</span>
                  </div>
                </div>
                <div className="evaluation-actions">
                  <button onClick={() => viewResponses(evaluation)}>
                    View Responses
                  </button>
                  <div className="qr-info">
                    <p>Participant URL:</p>
                    <code>{`${window.location.origin}/student/${institutionId}/${evaluation.id}?access_code=${evaluation.access_code}`}</code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedEvaluation && (
        <div className="modal-overlay" onClick={() => setSelectedEvaluation(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Responses for {selectedEvaluation.name}</h3>
              <button onClick={() => setSelectedEvaluation(null)}>×</button>
            </div>
            <div className="responses-list">
              {selectedEvaluation.responses?.length > 0 ? (
                selectedEvaluation.responses.map(response => (
                  <div key={response.id} className="response-item">
                    <div><strong>User:</strong> {response.user?.name}</div>
                    <div><strong>Question:</strong> {response.evaluation_question?.question?.question_text}</div>
                    <div><strong>Answer:</strong> {response.answer_text || response.selected_options?.join(', ') || 'No answer'}</div>
                    <div><strong>Submitted:</strong> {new Date(response.created_at).toLocaleString()}</div>
                  </div>
                ))
              ) : (
                <p>No responses yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstitutionDashboard;