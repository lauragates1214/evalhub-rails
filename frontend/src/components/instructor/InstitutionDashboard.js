import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import { getUserData } from '../../services/storage';

const InstitutionDashboard = () => {
  const { institutionId } = useParams();
  const navigate = useNavigate();
  const [institution, setInstitution] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCourseName, setNewCourseName] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Validate user and load data
    validateAndLoadDashboard();
  }, [institutionId]);

  const validateAndLoadDashboard = async () => {
    try {
      setLoading(true);
      
      // Get current user from localStorage
      const userData = getUserData();
      if (!userData) {
        console.error('No user data found');
        navigate('/');
        return;
      }
      
      setCurrentUser(userData);
      
      // Check if user belongs to this institution
      const userInstitutionId = userData?.institution?.id?.toString();
      const requestedInstitutionId = institutionId?.toString();
      
      if (userInstitutionId !== requestedInstitutionId) {
        console.error(`User institution (${userInstitutionId}) doesn't match requested institution (${requestedInstitutionId})`);
        // Redirect to the correct institution dashboard
        if (userInstitutionId) {
          navigate(`/instructor/${userInstitutionId}`);
        } else {
          navigate('/');
        }
        return;
      }
      
      // Load dashboard data
      const [institutionResponse, coursesResponse] = await Promise.all([
        apiService.getInstitution(institutionId),
        apiService.getCourses(institutionId)
      ]);

      console.log("Institution data:", institutionResponse.data)
      setInstitution(institutionResponse.data.institution);
      setCourses(coursesResponse.data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      if (error.response?.status === 401) {
        // User is not authenticated, redirect to homepage
        navigate('/');
      }
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
      validateAndLoadDashboard();
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
        <p>Institution Dashboard</p>
        {currentUser && (
          <div className="user-info">
            <span>Current Instructor:
              <br></br>
            <strong>{currentUser.name}</strong></span>
          </div>
        )}
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
                  <button onClick={() => viewResponses(course)}>View Responses</button>
                  <button className="secondary">Manage Questions</button>
                  <button className="secondary">Generate QR Code</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedCourse && (
        <div className="modal">
          <div className="modal-content">
            <h2>{selectedCourse.name} - Responses</h2>
            <button onClick={() => setSelectedCourse(null)}>Close</button>
            {selectedCourse.responses ? (
              <div className="responses">
                <p>Total responses: {selectedCourse.responses.length}</p>
                {/* Add response details here */}
              </div>
            ) : (
              <p>Loading responses...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InstitutionDashboard;