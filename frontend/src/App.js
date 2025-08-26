import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Common components
import Header from './components/common/Header';
import Navigation from './components/common/Navigation';

// Organizer components
import InstitutionDashboard from './components/instructor/InstitutionDashboard';
import CourseCreator from './components/instructor/CourseCreator';
import QuestionManager from './components/instructor/QuestionManager';
import ResponseViewer from './components/instructor/ResponseViewer';

// Participant components
import CourseAccess from './components/student/CourseAccess';
import QuestionDisplay from './components/student/QuestionDisplay';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <div className="app-content">
          <Routes>
            {/* Home/Landing */}
            <Route path="/" element={<div className="landing">
              <h1>Welcome to EvalHub</h1>
              <p>Interactive survey and feedback platform</p>
            </div>} />
            
            {/* Organizer Routes */}
            <Route path="/instructor/:institutionId" element={<InstitutionDashboard />} />
            <Route path="/instructor/:institutionId/courses/new" element={<CourseCreator />} />
            <Route path="/instructor/:institutionId/courses/:courseId" element={<ResponseViewer />} />
            <Route path="/instructor/:institutionId/questions" element={<QuestionManager />} />
            
            {/* Participant Routes */}
            <Route path="/student/:institutionId/:courseId" element={<CourseAccess />} />
            <Route path="/student/:institutionId/:courseId/questions" element={<QuestionDisplay />} />
            
            {/* 404 */}
            <Route path="*" element={<div className="not-found">
              <h2>Page Not Found</h2>
              <p>The page you're looking for doesn't exist.</p>
            </div>} />
          </Routes>
        </div>
        <Navigation />
      </div>
    </Router>
  );
}

export default App;