import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import AdminPage from './pages/AdminPage';
import EditProjectPage from './pages/EditProjectPage';
import ManageCvPage from './pages/ManageCvPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import ContactPage from './pages/ContactPage';
import { TranslationProvider } from './context/TranslationContext';
import GamePage from './pages/GamePage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    delete axios.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    navigate('/');
  };

  if (loading) return null;

  return (
    <TranslationProvider>
      <div className="min-h-screen flex flex-col font-sans bg-gray-50 text-slate-800 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-200">
        <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        
        <main className="flex-grow container mx-auto px-4 pt-4 relative overflow-hidden">
          {/* Animated background is contained here and won't affect the header */}
          <div className="absolute inset-0 bg-animated -z-10" />

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/project/:id" element={<ProjectDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/games" element={<GamePage />} />
            <Route path="/login" element={<LoginPage setAuth={setIsAuthenticated} />} />
            
            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin/cv" element={<ManageCvPage />} />
              <Route path="/admin/project/edit/:id" element={<EditProjectPage />} />
            </Route>

            {/* Catch-all 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </TranslationProvider>
  );
}

export default App;
