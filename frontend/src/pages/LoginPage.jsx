import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Get the base API URL from Vite's environment variables.
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const LoginPage = ({ setAuth }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      // Use the API_BASE_URL to construct the full request URL.
      const { data } = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
      
      localStorage.setItem('authToken', data.token);
      setAuth(true);
      navigate('/admin');
      // Hard reload to refresh app state after login
      setTimeout(() => window.location.reload(), 50);
    } catch (err) {
      setError('Invalid credentials. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md p-8 space-y-6 rounded-2xl border border-slate-200 bg-white/80 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
        <h2 className="text-3xl font-extrabold text-center text-slate-900 dark:text-slate-100">Admin Login</h2>
        {error && (
          <p className="text-center text-rose-600 dark:text-rose-400">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 rounded-lg border border-slate-300 bg-white/90 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800/70 dark:border-slate-700 dark:text-slate-200"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 rounded-lg border border-slate-300 bg-white/90 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800/70 dark:border-slate-700 dark:text-slate-200"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-4 py-2 font-semibold text-white rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 shadow hover:shadow-lg disabled:opacity-60"
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;