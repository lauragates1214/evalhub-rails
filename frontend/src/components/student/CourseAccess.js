import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import { setCurrentCourse, setUserData, setSessionToken } from '../../services/storage';

const CourseAccess = () => {
  const { institutionId, courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginForm, setLoginForm] = useState({
    name: '',
    email: '',
    access_code: new URLSearchParams(window.location.search).get('access_code') || ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadCourseInfo();
  }, [institutionId, courseId]);

  const loadCourseInfo = async () => {
    try {
      const accessCode = new URLSearchParams(window.location.search).get('access_code');
      const response = await apiService.joinCourse(institutionId, courseId, accessCode);
      setCourse(response.data.data.course);
      setCurrentCourse(response.data.data);
    } catch (error) {
      console.error('Failed to load course:', error);
      setError('Course not found or access denied.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCourse = async (e) => {
    e.preventDefault();
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
      navigate(`/student/${institutionId}/${courseId}/questions`);
    } catch (error) {
      console.error('Failed to join course:', error);
      setError('Failed to join course. Please check your details and try again.');
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

  if (loading && !course) {
    return <div className="loading">Loading course...</div>;
  }

  return (
    <div className="course-access">
      <div className="course-header">
        <h1>Join Course</h1>
        {course && (
          <div className="course-info">
            <h2>{course.name}</h2>
            {course.description && <p>{course.description}</p>}
            {course.location && <p>📍 {course.location}</p>}
          </div>
        )}
      </div>

      {error && (
        <div className="error">{error}</div>
      )}

      <form onSubmit={handleJoinCourse} className="join-form">
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
            placeholder="Enter course access code (if different from URL)"
          />
        </div>

        <button type="submit" disabled={loading} className="join-btn">
          {loading ? 'Joining...' : 'Join Course 🚀'}
        </button>
      </form>

      <div className="student-info">
        <h3>What happens next?</h3>
        <ul>
          <li>✅ You'll be registered as a student</li>
          <li>📋 You'll see all available questions for this course</li>
          <li>💬 Submit your responses at your own pace</li>
          <li>🎯 Your answers will be collected for analysis</li>
        </ul>
      </div>
    </div>
  );
};

export default CourseAccess;