import React, { useRef, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { useTranslation } from '../context/TranslationContext';
import SEO from '../components/SEO'; // <-- 1. IMPORT SEO COMPONENT


const Reveal = ({ children, delay = 0, className = '', animation = 'slideUp' }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  const animations = {
    slideUp: visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
    slideLeft: visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8',
    slideRight: visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8',
    fadeIn: visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
    bounce: visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95',
    zoomIn: visible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
  };

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`${className} transform transition-all duration-700 ease-out ${animations[animation]}`}
    >
      {children}
    </div>
  );
};

// Floating particles background
const FloatingParticles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 4,
    duration: Math.random() * 10 + 10
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-blue-400/20 to-cyan-400/20 animate-float"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`
          }}
        />
      ))}
    </div>
  );
};

// Animated gradient mesh background
const AnimatedBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-0">
    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 animate-gradient-shift" />
    <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob dark:bg-purple-500/10" />
    <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 dark:bg-yellow-500/10" />
    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000 dark:bg-pink-500/10" />
    <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-300/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-6000 dark:bg-blue-500/10" />
  </div>
);

// Parallax hero section
const HeroImage = ({ src, alt, title }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative h-64 sm:h-80 md:h-96 lg:h-[32rem] overflow-hidden rounded-3xl border border-white/20 shadow-2xl">
      <div
        className="absolute inset-0 transform transition-transform duration-75 ease-out"
        style={{ transform: `translateY(${scrollY * 0.3}px) scale(${1 + scrollY * 0.0002})` }}
      >
        <img 
          src={src} 
          alt={alt} 
          className="h-full w-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-cyan-500/20" />
      
      <div className="absolute top-6 right-6 w-16 h-16 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center animate-float">
        <svg className="w-8 h-8 text-white/80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 3h6v6M21 3l-7 7M13 3H8a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      
      <div className="absolute bottom-6 left-6 right-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight drop-shadow-2xl">
          {title}
        </h1>
      </div>
    </div>
  );
};

// Enhanced back button
const BackButton = ({ onClick }) => (
  <Reveal animation="slideRight">
    <button
      onClick={onClick}
      className="group relative inline-flex items-center gap-3 rounded-2xl border border-slate-200/50 bg-white/80 backdrop-blur-xl px-4 py-3 text-sm font-semibold text-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 dark:border-slate-800/50 dark:bg-slate-900/80 dark:text-slate-300 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 dark:from-slate-800/50 dark:to-slate-700/50" />
      <svg className="relative z-10 h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="relative z-10">Back</span>
    </button>
  </Reveal>
);

// Enhanced project metadata
const ProjectMeta = ({ project }) => (
  <div className="flex flex-wrap items-center gap-3 mb-6">
    <Reveal delay={200} animation="slideLeft">
      <span className="inline-flex items-center gap-2 rounded-full border border-blue-200/50 bg-blue-50/80 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm dark:border-blue-800/50 dark:bg-blue-900/40 dark:text-blue-300">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" />
          <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" />
          <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" />
          <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" />
        </svg>
        {new Date(project.createdAt).toLocaleDateString()}
      </span>
    </Reveal>
  </div>
);

// Enhanced project card for related projects
const RelatedProjectCard = ({ project, index }) => (
  <Reveal delay={index * 100} animation="slideUp">
    <Link
      to={`/project/${project._id}`}
      className="group relative overflow-hidden rounded-2xl border border-slate-200/50 bg-white/80 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-500 dark:border-slate-800/50 dark:bg-slate-900/80 hover:scale-[1.02] hover:-translate-y-2"
    >
      <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-800/30 dark:to-slate-700/20" />
      
      <div className="relative h-40 sm:h-48 overflow-hidden">
        <img 
          src={project.thumbnailUrl} 
          alt={project.title} 
          className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-300" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 3h6v6M21 3l-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors duration-300 dark:text-slate-100 dark:group-hover:text-cyan-400 text-lg mb-2 line-clamp-1">
          {project.title}
        </h3>
        <p 
          className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed" 
          dangerouslySetInnerHTML={{ __html: project.shortDescription }} 
        />
      </div>
    </Link>
  </Reveal>
);

// Action buttons component
const ActionButtons = () => (
  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-8 border-t border-slate-200/50 dark:border-slate-700/50">
    <Reveal delay={100} animation="slideRight">
      <button
        onClick={() => window.history.back()}
        className="group inline-flex items-center gap-3 rounded-2xl border border-slate-200/50 bg-white/80 backdrop-blur-xl px-6 py-3 font-semibold text-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 dark:border-slate-800/50 dark:bg-slate-900/80 dark:text-slate-300"
      >
        <svg className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>Back</span>
      </button>
    </Reveal>
    
    <Reveal delay={200} animation="slideLeft">
      <Link
        to="/projects"
        className="group relative overflow-hidden inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 font-semibold text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className="relative z-10">View All Projects</span>
        <svg className="relative z-10 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </Reveal>
  </div>
);


const ProjectDetailPage = () => {
  const { content, isTranslating } = useTranslation();
  const { id } = useParams();

  if (!content || isTranslating)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );

  const project = content.projects.find((p) => p._id === id);

  if (!project) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <AnimatedBackground />
        <FloatingParticles />
        <div className="relative z-10 text-center p-8 rounded-3xl border bg-white/80 backdrop-blur-xl shadow-2xl dark:border-slate-800/50 dark:bg-slate-900/80">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
            <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 9v4M12 17h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Project Not Found</h1>
          <p className="text-slate-600 dark:text-slate-300 mb-6">The project you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 font-semibold text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            View All Projects
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  // <-- 2. PREPARE DYNAMIC SEO DATA
  const plainShortDescription = (project.shortDescription || '').replace(/<[^>]*>?/gm, '');
  const siteUrl = `https://stanleypt.vercel.app/project/${project._id}`;

  return (
    <div className="relative min-h-screen">
       {/* 3. ADD THE SEO COMPONENT WITH PROJECT-SPECIFIC DATA */}
      <SEO
        title={`${project.title} | ${content.cv.fullName}`}
        description={plainShortDescription}
        name={content.cv.fullName}
        type="article" 
        url={siteUrl}
        imageUrl={project.thumbnailUrl}
        author={content.cv.fullName}
      />

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-10px) rotate(1deg); }
            66% { transform: translateY(5px) rotate(-1deg); }
          }
          @keyframes blob {
            0%, 100% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
          @keyframes gradient-shift {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
          }
          .animate-float { animation: float ease-in-out infinite; }
          .animate-blob { animation: blob 7s ease-in-out infinite; }
          .animate-gradient-shift { animation: gradient-shift 4s ease-in-out infinite; }
          .animation-delay-2000 { animation-delay: 2s; }
          .animation-delay-4000 { animation-delay: 4s; }
          .animation-delay-6000 { animation-delay: 6s; }
        `
      }} />

      <AnimatedBackground />
      <FloatingParticles />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        <div className="mb-6">
          <BackButton onClick={() => window.history.back()} />
        </div>
        
        <Reveal delay={100} animation="zoomIn">
          <article className="overflow-hidden rounded-3xl border border-slate-200/50 bg-white/80 backdrop-blur-xl shadow-2xl dark:border-slate-800/50 dark:bg-slate-900/80">
            <HeroImage 
              src={project.thumbnailUrl} 
              alt={project.title} 
              title={project.title}
            />
            
            <div className="p-6 sm:p-8 md:p-10">
              <ProjectMeta project={project} />
              
              <Reveal delay={300} animation="fadeIn">
                <div
                  className="prose prose-lg max-w-none text-slate-700 dark:prose-invert dark:text-slate-300 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: project.description }}
                />
              </Reveal>

              <ActionButtons />
            </div>
          </article>
        </Reveal>

        {content.projects && content.projects.length > 1 && (
          <Reveal delay={400}>
            <section className="mt-12 sm:mt-16">
              <div className="mb-8 text-center">
                <Reveal delay={100} animation="slideUp">
                  <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-slate-100 mb-4">
                    More Projects
                  </h2>
                </Reveal>
                <Reveal delay={200} animation="fadeIn">
                  <div className="h-1.5 w-28 rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 mx-auto animate-pulse" />
                </Reveal>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {content.projects
                  .filter((p) => p._id !== project._id)
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .slice(0, 3)
                  .map((p, index) => (
                    <RelatedProjectCard key={p._id} project={p} index={index} />
                  ))}
              </div>
            </section>
          </Reveal>
        )}

        <Reveal delay={600}>
          <section className="mt-16 text-center rounded-3xl border bg-gradient-to-br from-blue-600 via-cyan-500 to-emerald-500 p-8 md:p-12 shadow-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'><defs><pattern id=\'grid\' width=\'10\' height=\'10\' patternUnits=\'userSpaceOnUse\'><path d=\'M 10 0 L 0 0 0 10\' fill=\'none\' stroke=\'white\' stroke-opacity=\'0.1\' stroke-width=\'1\'/></pattern></defs><rect width=\'100\' height=\'100\' fill=\'url(%23grid)\'/></svg>')] opacity-20" />

            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-black text-white mb-4">
                Interested in Working Together?
              </h2>
              <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
                Let's create something amazing! I'm always excited to take on new challenges.
              </p>
              <Link
                to="/contact"
                className="group inline-flex items-center gap-3 rounded-2xl bg-white text-blue-600 px-8 py-4 font-bold shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105"
              >
                <span>Get In Touch</span>
                <svg className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
            
            <div className="absolute top-8 left-8 w-4 h-4 bg-white/20 rounded-full animate-float" />
            <div className="absolute top-16 right-16 w-6 h-6 bg-white/15 rounded-full animate-float animation-delay-2000" />
            <div className="absolute bottom-16 left-16 w-5 h-5 bg-white/25 rounded-full animate-float animation-delay-4000" />
          </section>
        </Reveal>
      </div>
    </div>
  );
};

export default ProjectDetailPage;