import React, { useState, useMemo, useEffect } from 'react';
// Link is no longer directly used in this file's JSX, but ProjectCard uses it.
// It's good practice to keep it if other links exist, or remove if not.
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { useTranslation } from '../context/TranslationContext';
import SEO from '../components/SEO';
import ProjectCard from '../components/ProjectCard'; // <-- 1. IMPORT THE NEW CARD COMPONENT

const ProjectsPage = () => {
  const { content, isTranslating } = useTranslation();
  const [sortOrder, setSortOrder] = useState('newest');
  const [hoveredProject, setHoveredProject] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const featuredIds = useMemo(
    () => new Set((content?.featuredProjects || []).map(p => p._id)),
    [content?.featuredProjects]
  );

  const sortedProjects = useMemo(() => {
    if (!content?.projects) return [];
    const arr = [...content.projects].sort((a, b) => {
      if (sortOrder === 'featured') {
        const aFeatured = featuredIds.has(a._id);
        const bFeatured = featuredIds.has(b._id);
        if (aFeatured && !bFeatured) return -1;
        if (!aFeatured && bFeatured) return 1;
      }
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === 'newest' ? dateB - dateA : sortOrder === 'oldest' ? dateA - b : 0;
    });
    return arr;
  }, [content?.projects, sortOrder, featuredIds]);

  const siteUrl = "https://stanleypt.vercel.app/projects";
  const seoTitle = `Projects | ${content?.cv?.fullName || 'Portfolio'}`;
  const seoDescription = `Explore a collection of web development projects by ${content?.cv?.fullName || ''}. Discover work showcasing skills in React, Node.js, and modern web technologies.`;
  const seoImageUrl = content?.cv?.profilePictureUrl; 

  if (!content || isTranslating)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 dark:bg-slate-950">
      <SEO
        title={seoTitle}
        description={seoDescription}
        name={content?.cv?.fullName}
        type="website"
        url={siteUrl}
        imageUrl={seoImageUrl}
      />

      {/* Background elements remain the same... */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="absolute w-2 h-2 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full animate-float" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 10}s`, animationDuration: `${8 + Math.random() * 4}s` }} />
        ))}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.03\'%3E%3Cpath d=\'m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
      </div>
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 md:py-12">
        {/* Header and Sort controls remain the same... */}
        <div className={`text-center mb-10 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 animate-gradient-x">
            All Projects
          </h1>
          <p className="mt-4 text-lg md:text-xl text-slate-600 dark:text-slate-400">
            Explore selected works and side projects
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="inline-flex items-center rounded-full border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/60 backdrop-blur p-1.5 shadow-lg">
            {['newest','oldest','featured'].map(opt => (
              <button key={opt} onClick={() => setSortOrder(opt)} className={`px-6 py-2.5 text-sm font-semibold rounded-full transition-all duration-300 ${ sortOrder === opt ? 'text-white bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg' : 'text-slate-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-cyan-400' }`}>
                {opt === 'newest' ? 'Newest' : opt === 'oldest' ? 'Oldest' : 'Featured'}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 dark:bg-slate-900/40 backdrop-blur border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">
              {sortedProjects.length} project{sortedProjects.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* --- TIDIED UP PROJECT GRID --- */}
        {sortedProjects.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {sortedProjects.map((project, idx) => (
              <ProjectCard
                key={project._id}
                project={project}
                isFeatured={featuredIds.has(project._id)}
                isHovered={hoveredProject === project._id}
                onMouseEnter={() => setHoveredProject(project._id)}
                onMouseLeave={() => setHoveredProject(null)}
                animationDelay={`${idx * 0.1}s`}
              />
            ))}
          </div>
        ) : (
          /* "No projects" message remains the same... */
          <div className={`flex flex-col items-center justify-center rounded-3xl border border-gray-200 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/30 backdrop-blur-xl p-12 text-center transform transition-all duration-1000 delay-700 shadow-lg ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600/10 to-cyan-500/10 dark:from-blue-600/20 dark:to-cyan-500/20 flex items-center justify-center">
                <svg className="h-10 w-10 text-gray-400 dark:text-slate-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 5h16v14H4z" stroke="currentColor" strokeWidth="2" /><path d="M4 15l4-4 4 4 4-4 4 4" stroke="currentColor" strokeWidth="2" /></svg>
              </div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600/20 to-cyan-500/20 blur-xl animate-pulse"></div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-slate-200 mb-2">No projects yet</h3>
            <p className="text-gray-600 dark:text-slate-400">Check back soon for amazing new projects!</p>
          </div>
        )}
      </div>

      {/* Styles remain the same... */}
      <style>{`@keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } } @keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-20px) rotate(180deg); } } @keyframes gradient-x { 0%, 100% { background-size: 200% 200%; background-position: left center; } 50% { background-size: 200% 200%; background-position: right center; } } @keyframes pulse-slow { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.02); } } .animate-float { animation: float 8s ease-in-out infinite; } .animate-gradient-x { animation: gradient-x 4s ease infinite; background-size: 200% 200%; } .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; } @media (max-width: 640px) { .animate-float { animation-duration: 6s; } @media (prefers-reduced-motion: reduce) { .animate-float, .animate-gradient-x, .animate-pulse-slow { animation: none; } } } @media (max-width: 768px) { .overflow-hidden { -webkit-overflow-scrolling: touch; } }`}</style>
    </div>
  );
};

export default ProjectsPage;