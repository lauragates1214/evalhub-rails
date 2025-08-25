import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Common components
import Header from './components/common/Header';
import Navigation from './components/common/Navigation';

// Organizer components
import InstitutionDashboard from './components/instructor/InstitutionDashboard';
import EvaluationCreator from './components/instructor/EvaluationCreator';
import QuestionManager from './components/instructor/QuestionManager';
import ResponseViewer from './components/instructor/ResponseViewer';

// Participant components
import EvaluationAccess from './components/student/EvaluationAccess';
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
            <Route path="/instructor/:institutionId/evaluations/new" element={<EvaluationCreator />} />
            <Route path="/instructor/:institutionId/evaluations/:evaluationId" element={<ResponseViewer />} />
            <Route path="/instructor/:institutionId/questions" element={<QuestionManager />} />
            
            {/* Participant Routes */}
            <Route path="/student/:institutionId/:evaluationId" element={<EvaluationAccess />} />
            <Route path="/student/:institutionId/:evaluationId/questions" element={<QuestionDisplay />} />
            
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