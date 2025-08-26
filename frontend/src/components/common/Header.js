import React, { useState, useEffect } from 'react';
import { getUserData, isLoggedIn, isOrganizer } from '../../services/storage';
import '../../styles/components/header.scss';

const Header = () => {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  // Function to update user data from localStorage
  const updateUserData = () => {
    const userData = getUserData();
    const isUserLoggedIn = isLoggedIn();
    setUser(userData);
    setLoggedIn(isUserLoggedIn);
  };

  useEffect(() => {
    // Load initial data
    updateUserData();

    // Listen for storage changes (for cross-tab updates)
    const handleStorageChange = (e) => {
      if (e.key === 'evalhub_user_data' || e.key === 'evalhub_session_token' || e.key === null) {
        updateUserData();
      }
    };

    // Listen for custom event for same-tab updates
    const handleUserUpdate = () => {
      updateUserData();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userDataUpdated', handleUserUpdate);

    // Set up interval to check for updates (fallback for same-tab changes)
    const intervalId = setInterval(updateUserData, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userDataUpdated', handleUserUpdate);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo">
          <h1>EvalHub</h1>
        </div>
        
        {loggedIn && user && (
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <span className={`user-role ${user?.role}`}>
              {isInstructor() ? '👤 Instructor' : '🎯 Student'}
            </span>
            <span className="institution">{user?.institution?.name}</span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;