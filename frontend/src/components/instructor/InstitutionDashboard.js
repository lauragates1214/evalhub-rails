import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiService } from '../../services/api';

const InstitutionDashboard = () => {
  const { institutionId } = useParams();
  const [institution, setInstitution] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCourseName, setNewCourseName] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, [institutionId]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [orgResponse, coursesResponse] = await Promise.all([
        apiService.getInstitution(institutionId),
        apiService.getCourses(institutionId)
      ]);

      setInstitution(orgResponse.data);
      setCourses(coursesResponse.data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!newCourseName.trim()) return;
    
    try {
      await apiService.createCourse(institutionId, {
        name: newCourseName,
        description: `Feedback course: ${newCourseName}`
      });
      setNewCourseName('');
      loadDashboardData();
    } catch (error) {
      console.error('Failed to create course:', error);
    }
  };

  const viewResponses = async (course) => {
    try {
      const response = await apiService.getCourseResponses(institutionId, course.id);
      setSelectedCourse({ ...course, responses: response.data });
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

      <div className="create-course">
        <h2>Create New Course</h2>
        <form onSubmit={handleCreateCourse}>
          <input
            type="text"
            value={newCourseName}
            onChange={(e) => setNewCourseName(e.target.value)}
            placeholder="Enter course name..."
            required
          />
          <button type="submit">Create Course</button>
        </form>
      </div>

      <div className="courses-section">
        <h2>Your Courses ({courses.length})</h2>
        {courses.length === 0 ? (
          <div className="empty-state">
            <p>No courses created yet. Create your first course to get started!</p>
          </div>
        ) : (
          <div className="courses-list">
            {courses.map(course => (
              <div key={course.id} className="course-card">
                <div className="course-info">
                  <h3>{course.name}</h3>
                  <p>{course.description}</p>
                  <div className="course-meta">
                    <span className="access-code">Access Code: {course.access_code}</span>
                    <span className="questions-count">{course.questions?.length || 0} questions</span>
                  </div>
                </div>
                <div className="course-actions">
                  <button onClick={() => viewResponses(course)}>
                    View Responses
                  </button>
                  <div className="qr-info">
                    <p>Participant URL:</p>
                    <code>{`${window.location.origin}/student/${institutionId}/${course.id}?access_code=${course.access_code}`}</code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedCourse && (
        <div className="modal-overlay" onClick={() => setSelectedCourse(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Responses for {selectedCourse.name}</h3>
              <button onClick={() => setSelectedCourse(null)}>×</button>
            </div>
            <div className="responses-list">
              {selectedCourse.responses?.length > 0 ? (
                selectedCourse.responses.map(response => (
                  <div key={response.id} className="response-item">
                    <div><strong>User:</strong> {response.user?.name}</div>
                    <div><strong>Question:</strong> {response.course_question?.question?.question_text}</div>
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