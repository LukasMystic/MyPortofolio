import { useState, useEffect } from 'react';
import { Routes, Route, Outlet, useNavigate, useLocation } from 'react-router-dom';
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

// The admin screens predate the redesign and bring their own styling, so they
// keep the padded container they were built for.
const AdminLayout = () => (
  <div className="container mx-auto px-4 pb-24 pt-6 md:pb-10">
    <Outlet />
  </div>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

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
      <ScrollToTop />
      <div className="flex min-h-screen flex-col bg-grouped text-label">
        <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />

        <main id="main" className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/project/:id" element={<ProjectDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/games" element={<GamePage />} />

            <Route element={<AdminLayout />}>
              <Route path="/login" element={<LoginPage setAuth={setIsAuthenticated} />} />
              <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/admin/cv" element={<ManageCvPage />} />
                <Route path="/admin/project/edit/:id" element={<EditProjectPage />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </TranslationProvider>
  );
}

export default App;
