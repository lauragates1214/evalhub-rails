import React from 'react';
import { getUserData, isLoggedIn, isOrganizer } from '../../services/storage';
import '../../styles/components/header.scss';

const Header = () => {
  const user = getUserData();
  const loggedIn = isLoggedIn();

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo">
          <h1>EvalHub</h1>
        </div>
        
        {loggedIn && (
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <span className={`user-role ${user?.role}`}>
              {isOrganizer() ? '👤 Organizer' : '🎯 Participant'}
            </span>
            <span className="institution">{user?.institution?.name}</span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;