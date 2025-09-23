import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../context/TranslationContext';
import LoadingSpinner from '../components/LoadingSpinner';

// Enhanced reveal animation
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
    bounce: visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
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

// Social Icon Component
const SocialIcon = ({ type, href, delay = 0 }) => {
  const common = 'h-5 w-5';
  const icons = {
    mail: (
      <svg className={common} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="2" />
        <path d="M4 6l8 6 8-6" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    linkedin: (
      <svg className={common} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.98 3.5a2.5 2.5 0 110 5 2.5 2.5 0 010-5zM3 8.98h4v12H3v-12zM10 8.98h3.8v1.64h.05c.53-.95 1.82-1.95 3.75-1.95 4.01 0 4.75 2.64 4.75 6.08v6.23h-4v-5.52c0-1.32-.03-3.02-1.84-3.02-1.85 0-2.13 1.44-2.13 2.92v5.62h-4v-12z" />
      </svg>
    ),
    github: (
      <svg className={common} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M12 2C6.48 2 2 6.58 2 12.26c0 4.51 2.87 8.33 6.84 9.68.5.09.68-.22.68-.49 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.1-1.5-1.1-1.5-.9-.63.07-.62.07-.62 1 .07 1.52 1.06 1.52 1.06.89 1.56 2.34 1.11 2.9.85.09-.66.35-1.11.64-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.73 0 0 .84-.27 2.75 1.05a9.2 9.2 0 015 0c1.9-1.32 2.74-1.05 2.74-1.05.56 1.42.21 2.47.1 2.73.64.72 1.02 1.63 1.02 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.69.95.69 1.92 0 1.39-.01 2.5-.01 2.84 0 .27.18.59.69.49A10.06 10.06 0 0022 12.26C22 6.58 17.52 2 12 2z" clipRule="evenodd" />
      </svg>
    )
  };

  return (
    <Reveal delay={delay} animation="bounce">
      <a
        href={href}
        target={type === 'mail' ? undefined : '_blank'}
        rel={type === 'mail' ? undefined : 'noopener noreferrer'}
        className="group inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-slate-200/60 bg-white/80 backdrop-blur-sm text-slate-600 shadow-sm hover:shadow-lg hover:scale-110 transition-all duration-300 dark:border-slate-700/60 dark:bg-slate-800/60 dark:text-slate-300 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:hover:border-cyan-400/60 dark:hover:bg-slate-700/80 dark:hover:text-cyan-400"
        aria-label={type}
      >
        <div className="relative">
          {icons[type]}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-md scale-150" />
        </div>
      </a>
    </Reveal>
  );
};

// Quick Links Component
const QuickLink = ({ to, children, delay = 0 }) => (
  <Reveal delay={delay} animation="slideUp">
    <Link
      to={to}
      className="group inline-flex items-center gap-2 text-slate-600 hover:text-blue-700 dark:text-slate-400 dark:hover:text-cyan-400 transition-colors duration-300 font-medium"
    >
      <span className="group-hover:translate-x-1 transition-transform duration-300">
        {children}
      </span>
      <svg 
        className="h-4 w-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  </Reveal>
);

// Status Badge Component
const StatusBadge = ({ delay = 0 }) => (
  <Reveal delay={delay} animation="fadeIn">
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-200/60 bg-emerald-50/80 backdrop-blur-sm text-emerald-700 dark:border-emerald-800/40 dark:bg-emerald-900/20 dark:text-emerald-400">
      <div className="relative">
        <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
        <div className="absolute inset-0 h-2 w-2 bg-emerald-500 rounded-full animate-ping opacity-75" />
      </div>
      <span className="text-xs font-semibold">Available for Projects</span>
    </div>
  </Reveal>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { content, isTranslating } = useTranslation();

  if (!content || isTranslating) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  const { cv } = content;

  return (
    <footer className="relative mt-auto">
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes gradient-flow {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          @keyframes float-gentle {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-5px) rotate(1deg); }
          }
          .animate-gradient-flow { 
            animation: gradient-flow 6s ease-in-out infinite;
            background-size: 200% 200%;
          }
          .animate-float-gentle { animation: float-gentle 4s ease-in-out infinite; }
        `
      }} />

      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/90 via-blue-50/50 to-cyan-50/60 dark:from-slate-950/90 dark:via-slate-900/80 dark:to-slate-800/90" />
        <div className="absolute -top-24 left-1/4 w-48 h-48 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl animate-float-gentle" />
        <div className="absolute -top-32 right-1/3 w-64 h-64 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-float-gentle" style={{ animationDelay: '2s' }} />
      </div>

      {/* Main footer content */}
      <div className="relative border-t border-slate-200/60 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 dark:border-slate-800/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Top section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand & Description */}
            <div className="lg:col-span-2">
              <Reveal animation="slideRight">
                <div className="mb-6">
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 mb-3">
                    <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 bg-clip-text text-transparent">
                      {cv.fullName}
                    </span>
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-md">
                    Crafting digital experiences with passion, precision, and purpose. 
                    Let's build something amazing together.
                  </p>
                </div>
              </Reveal>
              
              <StatusBadge delay={200} />
            </div>

            {/* Quick Links */}
            <div>
              <Reveal animation="slideUp">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-4 text-lg">
                  Quick Links
                </h4>
              </Reveal>
              <div className="space-y-3">
                <QuickLink to="/" delay={100}>Home</QuickLink>
                <QuickLink to="/projects" delay={150}>Projects</QuickLink>
                <QuickLink to="/contact" delay={200}>Contact</QuickLink>
              </div>
            </div>

            {/* Connect */}
            <div>
              <Reveal animation="slideUp" delay={100}>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-4 text-lg">
                  Let's Connect
                </h4>
              </Reveal>
              <div className="flex items-center gap-3 mb-4">
                <SocialIcon type="mail" href={`mailto:${cv.email}`} delay={150} />
                <SocialIcon type="linkedin" href={cv.linkedIn} delay={200} />
                <SocialIcon type="github" href={cv.github} delay={250} />
              </div>
              <Reveal animation="fadeIn" delay={350}>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Follow my journey and latest projects
                </p>
              </Reveal>
            </div>
          </div>

          {/* Divider */}
          <Reveal animation="slideUp" delay={400}>
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200/60 dark:border-slate-700/60" />
              </div>
              <div className="relative flex justify-center">
                <div className="px-6 bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 animate-pulse" />
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                      Portfolio
                    </span>
                    <div className="h-2 w-2 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Bottom section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Reveal animation="slideRight" delay={500}>
              <div className="flex items-center gap-3 text-sm">
                <span className="inline-flex items-center gap-2">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 font-bold">
                    © {currentYear} {cv.fullName}
                  </span>
                </span>
                <span className="text-slate-400 dark:text-slate-600">•</span>
                <span className="text-slate-600 dark:text-slate-400">
                  All Rights Reserved
                </span>
              </div>
            </Reveal>

          </div>

  
        </div>
      </div>

      
    </footer>
  );
};

export default Footer;