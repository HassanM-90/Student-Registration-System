import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { StudentProvider } from './contexts/StudentContext';
import { DarkModeProvider } from './contexts/DarkModeContext';
import SplashScreen from './components/SplashScreen/SplashScreen';
import RegistrationForm from './components/RegistrationForm/RegistrationForm';
import StudentDashboard from './components/StudentDashboard/StudentDashboard';

function App() {
  return (
    <DarkModeProvider>
      <StudentProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<SplashScreen />} />
              <Route path="/register" element={<RegistrationForm />} />
              <Route path="/dashboard" element={<StudentDashboard />} />
            </Routes>
          </div>
        </Router>
      </StudentProvider>
    </DarkModeProvider>
  );
}

export default App;