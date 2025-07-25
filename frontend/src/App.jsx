import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Course from './pages/Course';
import Lesson from './pages/Lesson';
import Quiz from './pages/Quiz';
import Chat from './pages/Chat';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/courses/:id" element={<Course />} />
          <Route path="/lessons/:id" element={<Lesson />} />
          <Route path="/quizzes/:id" element={<Quiz />} />
          <Route path="/chat/:courseId" element={<Chat />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App; 