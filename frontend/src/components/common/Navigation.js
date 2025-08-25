import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { isLoggedIn, isOrganizer, getUserData, removeSessionToken, removeUserData } from '../../services/storage';
import '../../styles/components/navigation.scss';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const loggedIn = isLoggedIn();
  const user = getUserData();

  const handleLogout = () => {
    removeSessionToken();
    removeUserData();
    navigate('/');
  };

  if (!loggedIn) {
    return null;
  }

  const institutionId = user?.institution?.id;

  return (
    <nav className="app-navigation">
      <div className="nav-content">
        {isOrganizer() ? (
          // Organizer navigation
          <div className="nav-links">
            <button 
              className={location.pathname === `/instructor/${institutionId}` ? 'active' : ''}
              onClick={() => navigate(`/instructor/${institutionId}`)}
            >
              📊 Dashboard
            </button>
            <button 
              className={location.pathname.includes('/questions') ? 'active' : ''}
              onClick={() => navigate(`/instructor/${institutionId}/questions`)}
            >
              ❓ Questions
            </button>
            <button 
              className={location.pathname.includes('/evaluations/new') ? 'active' : ''}
              onClick={() => navigate(`/instructor/${institutionId}/evaluations/new`)}
            >
              ➕ New Evaluation
            </button>
          </div>
        ) : (
          // Participant navigation
          <div className="nav-links">
            <button onClick={() => navigate('/')}>
              🏠 Home
            </button>
          </div>
        )}
        
        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
    </nav>
  );
};

export default Navigation;