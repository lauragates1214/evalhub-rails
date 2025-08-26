import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';

const EvaluationCreator = () => {
  const { institutionId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    start_time: '',
    end_time: '',
    active: false
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await apiService.createEvaluation(institutionId, formData);
      navigate(`/instructor/${institutionId}`);
    } catch (error) {
      console.error('Failed to create evaluation:', error);
      alert('Failed to create evaluation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="evaluation-creator">
      <h1>Create New Evaluation</h1>
      
      <form onSubmit={handleSubmit} className="evaluation-form">
        <div className="form-group">
          <label htmlFor="name">Evaluation Name *</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            name="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="start_time">Start Time</label>
            <input
              id="start_time"
              name="start_time"
              type="datetime-local"
              value={formData.start_time}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="end_time">End Time</label>
            <input
              id="end_time"
              name="end_time"
              type="datetime-local"
              value={formData.end_time}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              name="active"
              type="checkbox"
              checked={formData.active}
              onChange={handleChange}
            />
            Activate evaluation immediately
          </label>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate(-1)} disabled={loading}>
            Cancel
          </button>
          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Evaluation'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EvaluationCreator;