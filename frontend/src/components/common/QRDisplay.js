import React, { useState } from 'react';
import '../../styles/components/qr-display.scss';

const QRDisplay = ({ evaluation }) => {
  const [activeTab, setActiveTab] = useState('student');

  const generateQRUrl = (role) => {
    const baseUrl = process.env.REACT_APP_FRONTEND_URL || window.location.origin;
    return `${baseUrl}/${role}/${evaluation.institution.id}/${evaluation.id}?access_code=${evaluation.access_code}`;
  };

  const studentUrl = generateQRUrl('student');
  const instructorUrl = generateQRUrl('instructor');

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // Could add a toast notification here
      console.log('URL copied to clipboard');
    });
  };

  return (
    <div className="qr-display">
      <div className="qr-header">
        <h3>Evaluation Access</h3>
        <div className="evaluation-info">
          <span className="evaluation-name">{evaluation.name}</span>
          <span className="access-code">Code: {evaluation.access_code}</span>
        </div>
      </div>

      <div className="qr-tabs">
        <button 
          className={activeTab === 'student' ? 'active' : ''}
          onClick={() => setActiveTab('student')}
        >
          🎯 Participant Access
        </button>
        <button 
          className={activeTab === 'instructor' ? 'active' : ''}
          onClick={() => setActiveTab('instructor')}
        >
          👤 Organizer Access
        </button>
      </div>

      <div className="qr-content">
        {activeTab === 'student' ? (
          <div className="qr-section">
            <div className="qr-placeholder">
              {/* In a real app, you'd generate an actual QR code here */}
              <div className="qr-code-mock">
                <div className="qr-pattern"></div>
                <div className="qr-center">QR</div>
              </div>
            </div>
            <p className="qr-instruction">
              Scan to join <strong>{evaluation.name}</strong> as a student
            </p>
            <div className="url-section">
              <input 
                type="text" 
                value={studentUrl} 
                readOnly 
                className="url-input"
              />
              <button 
                className="copy-btn"
                onClick={() => copyToClipboard(studentUrl)}
              >
                📋 Copy
              </button>
            </div>
          </div>
        ) : (
          <div className="qr-section">
            <div className="qr-placeholder">
              <div className="qr-code-mock instructor">
                <div className="qr-pattern"></div>
                <div className="qr-center">QR</div>
              </div>
            </div>
            <p className="qr-instruction">
              Scan to access <strong>{evaluation.name}</strong> instructor controls
            </p>
            <div className="url-section">
              <input 
                type="text" 
                value={instructorUrl} 
                readOnly 
                className="url-input"
              />
              <button 
                className="copy-btn"
                onClick={() => copyToClipboard(instructorUrl)}
              >
                📋 Copy
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="qr-footer">
        <p className="note">
          💡 Participants can also join using the access code: <code>{evaluation.access_code}</code>
        </p>
      </div>
    </div>
  );
};

export default QRDisplay;