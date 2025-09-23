import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ProjectForm from '../components/ProjectForm';
import LoadingSpinner from '../components/LoadingSpinner';

// Get the base API URL from Vite's environment variables.
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Section header
const AdminSectionHeader = ({ title, description }) => (
  <div className="mb-6">
    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100">{title}</h2>
    {description && <p className="mt-1 text-slate-600 dark:text-slate-400">{description}</p>}
  </div>
);

const Badge = ({ children, color = 'blue' }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${
      color === 'blue'
        ? 'bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:ring-blue-800'
        : 'bg-slate-100 text-slate-700 ring-slate-300 dark:bg-slate-800/50 dark:text-slate-300 dark:ring-slate-700'
    }`}
  >
    {children}
  </span>
);

const GradientButton = ({ children, className = '', ...props }) => (
  <button
    {...props}
    className={`inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 font-semibold shadow hover:shadow-lg transition-colors ${className}`}
  >
    {children}
  </button>
);

const AdminPage = () => {
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const [projectsRes, messagesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/projects`),
          axios.get(`${API_BASE_URL}/api/contact`),
        ]);
        setProjects(projectsRes.data);
        setMessages(messagesRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (err) {
        setError('Failed to load admin data. Please try again.');
        console.error('Admin Fetch error:', err.response || err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const handleProjectAdded = (newProject) => {
    setProjects([newProject, ...projects]);
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/projects/${id}`);
        setProjects(projects.filter((p) => p._id !== id));
      } catch (err) {
        setError('Failed to delete project.');
      }
    }
  };

  const handleToggleFeatured = async (id, currentStatus) => {
    try {
      await axios.put(`${API_BASE_URL}/api/projects/${id}/toggle-featured`);
      setProjects(projects.map((p) => (p._id === id ? { ...p, isFeatured: !currentStatus } : p)));
    } catch (err) {
      setError('Failed to update featured status.');
    }
  };

  const handleDeleteMessage = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/contact/${id}`);
        setMessages(messages.filter((m) => m._id !== id));
      } catch (err) {
        setError('Failed to delete message.');
      }
    }
  };

  if (loading)
    return (
      <div className="flex justify-center p-8">
        <LoadingSpinner />
      </div>
    );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
      <div className="text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500">
            Admin Dashboard
          </span>
        </h1>
      </div>

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-800 text-center dark:border-rose-800/50 dark:bg-rose-900/30 dark:text-rose-200">
          {error}
        </div>
      )}

      {/* Inbox */}
      <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 md:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
        <AdminSectionHeader title="Inbox" description={`You have ${messages.length} message(s).`} />
        <div className="space-y-4">
          {messages.length > 0 ? (
            messages.map((msg) => (
              <div
                key={msg._id}
                className="rounded-xl border border-slate-200 bg-white/70 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-slate-500">From</p>
                      <Badge>{new Date(msg.createdAt).toLocaleString()}</Badge>
                    </div>
                    <p className="font-bold text-lg text-slate-900 dark:text-slate-100">{msg.name}</p>
                    <a
                      href={`mailto:${msg.email}`}
                      className="text-sm text-blue-700 hover:underline dark:text-cyan-400"
                    >
                      {msg.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 sm:self-start">
                    <button
                      onClick={() => handleDeleteMessage(msg._id)}
                      className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-3 py-1.5 text-sm font-semibold text-white shadow hover:bg-rose-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <p className="text-sm text-slate-500 mb-1">Message</p>
                  <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap rounded bg-slate-50 dark:bg-slate-800/60 p-3">
                    {msg.message}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-500 text-center py-4">You have no new messages.</p>
          )}
        </div>
      </section>

      {/* CV Management */}
      <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 md:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
        <AdminSectionHeader title="CV Management" />
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          Edit your personal details, experiences, skills, and more.
        </p>
        <Link to="/admin/cv">
          <GradientButton>Manage CV Content</GradientButton>
        </Link>
      </section>

      {/* Project Management */}
      <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 md:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
        <AdminSectionHeader title="Manage Projects" />
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project._id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-slate-200 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-900/60"
            >
              <div className="flex items-center gap-4">
                <img
                  src={project.thumbnailUrl}
                  alt={project.title}
                  className="h-16 w-20 rounded-md object-cover ring-1 ring-black/5"
                />
                <span className="font-semibold text-lg text-slate-800 dark:text-slate-100">
                  {project.title}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleToggleFeatured(project._id, project.isFeatured)}
                  className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
                    project.isFeatured
                      ? 'bg-amber-400/90 text-amber-900 hover:bg-amber-400'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {project.isFeatured ? '★ Featured' : '☆ Feature'}
                </button>
                <Link
                  to={`/admin/project/edit/${project._id}`}
                  className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-sm font-semibold text-blue-700 shadow-sm hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-800/70 dark:text-cyan-400"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDeleteProject(project._id)}
                  className="inline-flex items-center rounded-full bg-rose-600 px-3 py-1.5 text-sm font-semibold text-white shadow hover:bg-rose-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Create Project */}
      <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 md:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
        <AdminSectionHeader title="Create New Project" description="Upload a thumbnail and write a rich description." />
        <ProjectForm onProjectAdded={handleProjectAdded} />
      </section>
    </div>
  );
};

export default AdminPage;
