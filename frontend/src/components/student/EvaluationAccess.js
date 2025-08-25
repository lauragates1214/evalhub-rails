import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import { setCurrentEvaluation, setUserData, setSessionToken } from '../../services/storage';

const EvaluationAccess = () => {
  const { institutionId, evaluationId } = useParams();
  const navigate = useNavigate();
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginForm, setLoginForm] = useState({
    name: '',
    email: '',
    access_code: new URLSearchParams(window.location.search).get('access_code') || ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadEvaluationInfo();
  }, [institutionId, evaluationId]);

  const loadEvaluationInfo = async () => {
    try {
      const accessCode = new URLSearchParams(window.location.search).get('access_code');
      const response = await apiService.joinEvaluation(institutionId, evaluationId, accessCode);
      setEvaluation(response.data.data.evaluation);
      setCurrentEvaluation(response.data.data);
    } catch (error) {
      console.error('Failed to load evaluation:', error);
      setError('Evaluation not found or access denied.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinEvaluation = async (e) => {
    e.prevaluationDefault();
    setLoading(true);
    setError('');

    try {
      // First try to authenticate existing user
      let authResponse;
      try {
        authResponse = await apiService.authenticateUser(institutionId, loginForm.email, 'temporary');
      } catch (authError) {
        // If authentication fails, create new user
        const userData = {
          name: loginForm.name,
          email: loginForm.email,
          role: 'student',
          password: 'temporary'
        };
        authResponse = await apiService.createUser(institutionId, userData);
      }

      // Set user session
      setSessionToken(authResponse.data.data.session_token);
      setUserData(authResponse.data.data.user);

      // Navigate to questions
      navigate(`/student/${institutionId}/${evaluationId}/questions`);
    } catch (error) {
      console.error('Failed to join evaluation:', error);
      setError('Failed to join evaluation. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setLoginForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (loading && !evaluation) {
    return <div className="loading">Loading evaluation...</div>;
  }

  return (
    <div className="evaluation-access">
      <div className="evaluation-header">
        <h1>Join Evaluation</h1>
        {evaluation && (
          <div className="evaluation-info">
            <h2>{evaluation.name}</h2>
            {evaluation.description && <p>{evaluation.description}</p>}
            {evaluation.location && <p>📍 {evaluation.location}</p>}
          </div>
        )}
      </div>

      {error && (
        <div className="error">{error}</div>
      )}

      <form onSubmit={handleJoinEvaluation} className="join-form">
        <div className="form-group">
          <label htmlFor="name">Your Name *</label>
          <input
            id="name"
            name="name"
            type="text"
            value={loginForm.name}
            onChange={handleChange}
            required
            placeholder="Enter your full name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address *</label>
          <input
            id="email"
            name="email"
            type="email"
            value={loginForm.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="access_code">Access Code</label>
          <input
            id="access_code"
            name="access_code"
            type="text"
            value={loginForm.access_code}
            onChange={handleChange}
            placeholder="Enter evaluation access code (if different from URL)"
          />
        </div>

        <button type="submit" disabled={loading} className="join-btn">
          {loading ? 'Joining...' : 'Join Evaluation 🚀'}
        </button>
      </form>

      <div className="student-info">
        <h3>What happens next?</h3>
        <ul>
          <li>✅ You'll be registered as a student</li>
          <li>📋 You'll see all available questions for this evaluation</li>
          <li>💬 Submit your responses at your own pace</li>
          <li>🎯 Your answers will be collected for analysis</li>
        </ul>
      </div>
    </div>
  );
};

export default EvaluationAccess;