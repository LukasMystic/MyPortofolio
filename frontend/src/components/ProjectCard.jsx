import React from 'react';
import { Link } from 'react-router-dom';

// A small, reusable component for the external link icon for added cleanliness.
const ExternalLinkIcon = () => (
  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

// A dedicated component for the "Featured" badge.
const FeaturedBadge = () => (
  <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-gradient-to-r from-blue-600/90 to-cyan-500/90 backdrop-blur-sm text-xs font-semibold text-white border border-white/20 shadow-lg">
    Featured
  </div>
);

const ProjectCard = ({ project, isFeatured, isHovered, onMouseEnter, onMouseLeave, animationDelay }) => {
  return (
    <Link
      to={`/project/${project._id}`}
      className="group relative block"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        animation: `fadeInUp 0.6s ease ${animationDelay} both`,
        animationFillMode: 'both'
      }}
    >
      <div className="relative h-full overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white/90 dark:bg-slate-800/30 backdrop-blur-xl shadow-lg hover:shadow-2xl dark:hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2 hover:border-blue-500/30 dark:hover:border-blue-500/50">
        
        {/* Hover Glow Effect */}
        <div className={`absolute -inset-0.5 bg-gradient-to-r from-blue-600/20 via-cyan-500/20 to-emerald-500/20 rounded-2xl blur opacity-0 transition-opacity duration-500 ${isHovered ? 'opacity-100' : ''}`} />
        
        <div className="relative flex flex-col h-full">
          {/* Card Image Section */}
          <div className="relative h-48 md:h-52 overflow-hidden">
            <img
              src={project.thumbnailUrl}
              alt={project.title}
              className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-300" />
            
            {/* Hover Icon */}
            <div className={`absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center transform transition-all duration-300 ${isHovered ? 'scale-110 rotate-12' : 'scale-0'}`}>
              <ExternalLinkIcon />
            </div>

            {/* Featured Badge */}
            {isFeatured && <FeaturedBadge />}
          </div>

          {/* Card Content Section */}
          <div className="p-6 flex flex-col flex-grow">
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-500 transition-all duration-300 mb-3">
              {project.title}
            </h3>
            <div 
              className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-300 flex-grow"
              dangerouslySetInnerHTML={{ __html: project.shortDescription }}
            />
            
            {/* Hover Progress Bar (at the bottom) */}
            <div className="mt-4 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className={`h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full transform transition-transform duration-700 ${isHovered ? 'translate-x-0' : '-translate-x-full'}`} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;