import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { setSessionToken, setUserData } from '../services/storage';
import '../styles/homepage.scss';

const Homepage = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [institutions, setInstitutions] = useState([]);
  const [filteredInstitutions, setFilteredInstitutions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [isNewInstitution, setIsNewInstitution] = useState(false);
  
  // Success popup state
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successRedirectData, setSuccessRedirectData] = useState(null);
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    institutionName: '',
    institutionId: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      institutionName: '',
      institutionId: ''
    });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Get institution ID from selected institution or search for it
      let institutionId;
      
      if (selectedInstitution) {
        institutionId = selectedInstitution.id;
      } else if (formData.institutionName) {
        // Try to find the institution by name
        const inst = institutions.find(i => 
          i.name.toLowerCase() === formData.institutionName.toLowerCase()
        );
        if (inst) {
          institutionId = inst.id;
        } else {
          setError('Institution not found. Please select from the dropdown.');
          setLoading(false);
          return;
        }
      } else {
        setError('Please select your institution');
        setLoading(false);
        return;
      }

      // Authenticate user
      const response = await apiService.authenticateUser(
        institutionId,
        formData.email,
        formData.password
      );

      // Access the session token and user from the nested response
      const sessionToken = response.data?.session_token || response.session_token;
      const user = response.data?.user || response.user;
      
      if (sessionToken || user) {
        // Clear any existing session data first
        localStorage.clear();
        
        // Set new session data
        if (sessionToken) {
          setSessionToken(sessionToken);
        }
        setUserData(user);
        
        // Use the institution ID from the user's data to ensure we go to the correct dashboard
        const actualInstitutionId = user?.institution?.id || institutionId;
        
        // Navigate to instructor dashboard
        navigate(`/instructor/${actualInstitutionId}`);
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Prevent double submission
    if (loading) return;
    
    setLoading(true);
    setError('');

    try {
      let institutionId = formData.institutionId;
      
      // Use selected institution or create new one
      if (selectedInstitution) {
        institutionId = selectedInstitution.id;
      } else if (isNewInstitution && formData.institutionName) {
        const instResponse = await apiService.createInstitution({
          name: formData.institutionName,
          description: `Institution created by ${formData.name}`
        });
        
        console.log('Institution creation response:', instResponse);
        
        // Access the institution ID from the nested response
        institutionId = instResponse.data?.institution?.id || instResponse.institution?.id || instResponse.id;
        
        if (!institutionId) {
          console.error('Failed to get institution ID from response:', instResponse);
          setError('Failed to create institution. Please try again.');
          setLoading(false);
          return;
        }
      } else if (!institutionId) {
        setError('Please enter your institution name or ID');
        setLoading(false);
        return;
      }

      // Create instructor account
      const userData = {
        user: {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'instructor'  // Only instructors register
        }
      };

      const response = await apiService.createUser(institutionId, userData);

      // Access the session token and user from the nested response
      const sessionToken = response.data?.session_token || response.session_token;
      const user = response.data?.user || response.user;
      
      if (sessionToken || response.data?.user) {
        // Clear any existing session data first to prevent conflicts
        localStorage.clear();
        
        // Store new session data
        if (sessionToken) {
          setSessionToken(sessionToken);
        }
        setUserData(user);
        
        // Get the actual institution ID from the user's data
        const actualInstitutionId = user?.institution?.id || institutionId;
        
        // Store redirect data for after success popup
        setSuccessRedirectData({
          institutionId: actualInstitutionId,
          sessionToken,
          user
        });
        
        // Show success popup
        setShowSuccessPopup(true);
        setShowModal(false);
        resetForm();
      }
    } catch (err) {
      console.error('Registration error:', err);
      // Check if it's a validation error from the API
      if (err.response?.data?.validation_errors) {
        const errors = err.response.data.validation_errors;
        const errorMessages = [];
        
        if (errors.email) {
          errorMessages.push('Email ' + errors.email.join(', '));
        }
        if (errors.password) {
          errorMessages.push('Password ' + errors.password.join(', '));
        }
        if (errors.name) {
          errorMessages.push('Name ' + errors.name.join(', '));
        }
        
        setError(errorMessages.join('. ') || 'Validation failed');
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessOK = () => {
    setShowSuccessPopup(false);
    
    // Navigate to instructor dashboard
    if (successRedirectData) {
      navigate(`/instructor/${successRedirectData.institutionId}`);
    }
  };

  const openModal = async (loginMode) => {
    setIsLogin(loginMode);
    setShowModal(true);
    resetForm();
    setSelectedInstitution(null);
    setIsNewInstitution(false);
    
    // Fetch institutions for both login and registration
    try {
      const response = await apiService.getAllInstitutions();
      const institutionList = response.data?.institutions || [];
      setInstitutions(institutionList);
      setFilteredInstitutions([]);
    } catch (err) {
      console.error('Failed to fetch institutions:', err);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
    setSelectedInstitution(null);
    setIsNewInstitution(false);
    setFilteredInstitutions([]);
    setShowDropdown(false);
  };

  const handleInstitutionSearch = (value) => {
    setFormData(prev => ({ ...prev, institutionName: value }));
    setSelectedInstitution(null);
    
    if (value.length > 0) {
      const filtered = institutions.filter(inst => 
        inst.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredInstitutions(filtered);
      setShowDropdown(true);
      
      // Check if exact match exists
      const exactMatch = institutions.find(inst => 
        inst.name.toLowerCase() === value.toLowerCase()
      );
      if (exactMatch) {
        setSelectedInstitution(exactMatch);
        setIsNewInstitution(false);
      } else {
        setIsNewInstitution(true);
      }
    } else {
      setFilteredInstitutions([]);
      setShowDropdown(false);
      setIsNewInstitution(false);
    }
  };

  const selectInstitution = (institution) => {
    setSelectedInstitution(institution);
    setFormData(prev => ({ ...prev, institutionName: institution.name }));
    setShowDropdown(false);
    setIsNewInstitution(false);
  };

  return (
    <div className="homepage">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to EvalHub</h1>
          <p className="hero-subtitle">Interactive Course Feedback Platform</p>
          <p className="hero-description">
            Create and manage course evaluations with ease. Students join via QR codes
            to provide anonymous feedback - no registration required.
          </p>
          
          <div className="hero-actions">
            <button 
              className="btn btn-primary"
              onClick={() => openModal(false)}
            >
              Instructor Registration
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => openModal(true)}
            >
              Instructor Login
            </button>
          </div>
        </div>

        <div className="features">
          <div className="feature">
            <h3>👨‍🏫 For Instructors</h3>
            <p>Register an account to create courses, manage questions, and view real-time feedback</p>
          </div>
          <div className="feature">
            <h3>🎓 For Students</h3>
            <p>Simply scan the QR code - no registration needed! Provide feedback anonymously</p>
          </div>
          <div className="feature">
            <h3>🔐 Privacy First</h3>
            <p>Students remain anonymous while instructors get valuable feedback insights</p>
          </div>
        </div>
        
        <div className="student-notice">
          <h3>📱 Students</h3>
          <p>
            Are you a student looking to provide course feedback? 
            You don't need to register! Simply scan the QR code provided by your instructor 
            to access the course evaluation directly.
          </p>
        </div>
      </div>

      {/* Registration Success Popup */}
      {showSuccessPopup && (
        <div className="modal-overlay">
          <div className="success-popup">
            <div className="success-icon">✓</div>
            <h2>Registration Successful!</h2>
            <p>Your account has been created successfully.</p>
            <button 
              className="btn btn-primary"
              onClick={handleSuccessOK}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Login/Registration Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{isLogin ? 'Instructor Login' : 'Instructor Registration'}</h2>
              <button className="modal-close" onClick={closeModal} disabled={loading}>×</button>
            </div>

            {error && (
              <div className="error-message">{error}</div>
            )}

            {loading && (
              <div className="loading-indicator">
                <div className="spinner"></div>
                <p>{isLogin ? 'Logging in...' : 'Creating your account...'}</p>
              </div>
            )}

            <form onSubmit={isLogin ? handleLogin : handleRegister} className={loading ? 'form-disabled' : ''}>
              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    required={!isLogin}
                    placeholder="Enter your full name"
                    disabled={loading}
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your email"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password *</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your password"
                  disabled={loading}
                />
              </div>

              {!isLogin ? (
                <div className="form-group">
                  <label htmlFor="institutionName">Institution *</label>
                  <div className="institution-selector">
                    <input
                      id="institutionName"
                      name="institutionName"
                      type="text"
                      value={formData.institutionName}
                      onChange={(e) => handleInstitutionSearch(e.target.value)}
                      onFocus={() => formData.institutionName && handleInstitutionSearch(formData.institutionName)}
                      required={!isLogin}
                      placeholder="Start typing your institution name..."
                      autoComplete="off"
                      disabled={loading}
                    />
                    
                    {showDropdown && filteredInstitutions.length > 0 && (
                      <div className="institution-dropdown">
                        {filteredInstitutions.map(inst => (
                          <div 
                            key={inst.id}
                            className="dropdown-item"
                            onClick={() => !loading && selectInstitution(inst)}
                          >
                            {inst.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {selectedInstitution && (
                    <small className="form-hint success">
                      ✓ Joining existing institution: {selectedInstitution.name}
                    </small>
                  )}
                  
                  {isNewInstitution && formData.institutionName && (
                    <small className="form-hint info">
                      ✨ This will create a new institution: "{formData.institutionName}"
                    </small>
                  )}
                  
                  {!selectedInstitution && !isNewInstitution && formData.institutionName && (
                    <small className="form-hint">
                      Keep typing to search or create a new institution
                    </small>
                  )}
                </div>
              ) : (
                <div className="form-group">
                  <label htmlFor="institutionName">Institution *</label>
                  <div className="institution-selector">
                    <input
                      id="institutionName"
                      name="institutionName"
                      type="text"
                      value={formData.institutionName}
                      onChange={(e) => handleInstitutionSearch(e.target.value)}
                      onFocus={() => formData.institutionName && handleInstitutionSearch(formData.institutionName)}
                      required
                      placeholder="Start typing your institution name..."
                      autoComplete="off"
                      disabled={loading}
                    />
                    
                    {showDropdown && filteredInstitutions.length > 0 && (
                      <div className="institution-dropdown">
                        {filteredInstitutions.map(inst => (
                          <div 
                            key={inst.id}
                            className="dropdown-item"
                            onClick={() => !loading && selectInstitution(inst)}
                          >
                            {inst.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {selectedInstitution && (
                    <small className="form-hint success">
                      ✓ Selected: {selectedInstitution.name}
                    </small>
                  )}
                  
                  {!selectedInstitution && formData.institutionName && (
                    <small className="form-hint">
                      Keep typing to find your institution
                    </small>
                  )}
                </div>
              )}

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (isLogin ? 'Logging in...' : 'Registering...') : (isLogin ? 'Login' : 'Register')}
                </button>
              </div>

              <div className="form-footer">
                {isLogin ? (
                  <p>
                    Don't have an account? 
                    <button 
                      type="button"
                      className="link-btn"
                      onClick={() => setIsLogin(false)}
                      disabled={loading}
                    >
                      Register here
                    </button>
                  </p>
                ) : (
                  <p>
                    Already have an account? 
                    <button 
                      type="button"
                      className="link-btn"
                      onClick={() => setIsLogin(true)}
                      disabled={loading}
                    >
                      Login here
                    </button>
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Homepage;