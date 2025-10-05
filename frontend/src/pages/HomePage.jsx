import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import Game from '../components/Game';
import { useTranslation } from '../context/TranslationContext';
import SEO from '../components/SEO'; // Import SEO component

// Enhanced reveal animation with multiple effects
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

// Floating particles background
const FloatingParticles = () => {
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 4,
    duration: Math.random() * 10 + 10
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
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
  <div className="fixed inset-0 pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 animate-gradient-shift" />
    <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob dark:bg-purple-500/10" />
    <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 dark:bg-yellow-500/10" />
    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000 dark:bg-pink-500/10" />
    <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-300/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-6000 dark:bg-blue-500/10" />
  </div>
);

const SectionHeader = ({ title, subtitle, anchor }) => (
  <div className="mb-8">
    <Reveal animation="slideRight">
      <div className="inline-flex items-center gap-2 mb-2">
        <span className="inline-block h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 animate-pulse" />
        <span className="uppercase tracking-widest text-xs text-blue-600 font-semibold dark:text-cyan-400">
          {subtitle || 'Section'}
        </span>
      </div>
    </Reveal>
    <Reveal animation="slideLeft" delay={100}>
      <h2 id={anchor} className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-3">
        {title}
      </h2>
    </Reveal>
    <Reveal animation="fadeIn" delay={200}>
      <div className="h-1.5 w-28 rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 animate-pulse" />
    </Reveal>
  </div>
);

const ExperienceCard = ({ exp, index }) => (
   <Reveal delay={index * 100} animation="slideUp">
    <div className="group relative overflow-hidden rounded-xl border bg-white/80 backdrop-blur-sm p-6 shadow-md hover:shadow-xl transition-all duration-500 dark:border-slate-800 dark:bg-slate-900/70 hover:scale-[1.02] hover:-translate-y-1 h-full flex flex-col">
      <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-blue-50 to-cyan-50 dark:from-slate-800/30 dark:to-slate-700/20" />
      <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
      
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-cyan-400 transition-colors">
            {exp.title}
          </h3>
          <p className="text-md text-slate-600 dark:text-slate-300 font-medium">{exp.organization}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{exp.dateRange}</p>
        </div>
        <span className="flex-shrink-0 inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 group-hover:bg-gradient-to-r group-hover:from-blue-50 group-hover:to-cyan-50 dark:group-hover:from-slate-700/50 dark:group-hover:to-slate-600/50 transition-all">
          {exp.type}
        </span>
      </div>
      
      <ul className="space-y-2 text-slate-700 dark:text-slate-300">
        {exp.responsibilities.map((res, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 mt-2" />
            <span className="break-words" dangerouslySetInnerHTML={{ __html: res }} />
          </li>
        ))}
      </ul>
    </div>
  </Reveal>
);

const SocialIcon = ({ type, href }) => {
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
    ),
  };
  return (
    <a
      href={href}
      target={type === 'mail' ? undefined : '_blank'}
      rel={type === 'mail' ? undefined : 'noopener noreferrer'}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-600 shadow-md backdrop-blur hover:bg-white hover:text-blue-700 hover:shadow-lg hover:scale-110 transition-all duration-300 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:text-cyan-400 dark:hover:bg-slate-700"
      aria-label={type}
    >
      {icons[type]}
    </a>
  );
};

const SkillCard = ({ cat, index }) => (
  <Reveal delay={index * 150} animation="bounce">
    <div className="group relative rounded-xl border p-6 bg-white/80 hover:bg-white/95 transition-all duration-500 shadow-md hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/60 dark:hover:bg-slate-900/80 hover:scale-105 hover:-translate-y-2">
      <div className="absolute -top-3 -right-3 h-16 w-16 rounded-full bg-gradient-to-br from-blue-500/10 to-cyan-400/10 blur-xl group-hover:scale-150 transition-transform duration-700" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 rounded-t-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative">
        <h3 className="font-bold text-slate-800 mb-4 text-lg dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-cyan-400 transition-colors">
          {cat.category}
        </h3>
        <div className="flex flex-wrap gap-2">
          {cat.items.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50/80 text-blue-800 px-3 py-1.5 text-sm font-medium shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 dark:border-cyan-800/50 dark:bg-cyan-900/40 dark:text-cyan-300 cursor-default"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  </Reveal>
);

const ProjectCard = ({ proj, index }) => (
  <Reveal delay={index * 100} animation="slideUp">
    <Link
      to={`/project/${proj._id}`}
      className="group relative overflow-hidden rounded-xl border bg-white/90 shadow-md hover:shadow-2xl transition-all duration-500 dark:border-slate-800 dark:bg-slate-900/80 hover:scale-[1.03] hover:-translate-y-2 flex flex-col h-full"
    >
      <div className="relative h-48 md:h-52 overflow-hidden">
        <img 
          src={proj.thumbnailUrl} 
          alt={`Thumbnail for project: ${proj.title}`} 
          className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
        <div className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
          <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      
      <div className="p-5 flex-grow">
        <h3 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors duration-300 dark:text-slate-100 dark:group-hover:text-cyan-400 text-lg mb-2">
          {proj.title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed break-words" dangerouslySetInnerHTML={{ __html: proj.shortDescription }} />
      </div>
    </Link>
  </Reveal>
);


const HomePage = () => {
  const { content, isTranslating } = useTranslation();
  const [expFilter, setExpFilter] = useState('All');

  if (!content || isTranslating) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  const { cv, featuredProjects } = content;
  
  // Prepare SEO data
  const siteUrl = "https://stanleypt.vercel.app"; // <-- UPDATED DOMAIN
  const plainAboutMe = (cv.aboutMe || '').replace(/<[^>]*>?/gm, ''); // Strip HTML for meta description
  const seoKeywords = cv.skills.flatMap(cat => cat.items).join(', ');

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": cv.fullName,
    "url": siteUrl,
    "image": cv.profilePictureUrl,
    "sameAs": [
      cv.linkedIn,
      cv.github
    ],
    "jobTitle": "Software Developer" 
  };

  const parseEndDate = (range = '') => {
    if (/now/i.test(range)) return Number.MAX_SAFE_INTEGER;
    const parts = range.split('-').map((s) => s.trim());
    const end = parts[1] || parts[0] || '';
    const d = Date.parse(end);
    return isNaN(d) ? 0 : d;
  };
  const allExperiences = (cv.experiences || []).slice().sort((a, b) => parseEndDate(b.dateRange) - parseEndDate(a.dateRange));
  const filteredExperiences =
    expFilter === 'All' ? allExperiences : allExperiences.filter((e) => e.type === expFilter);

  return (
    <div className="relative min-h-screen">
      <SEO
        title={`${cv.fullName} | Portfolio`}
        description={plainAboutMe.substring(0, 160)}
        name={cv.fullName}
        type="website"
        imageUrl={cv.profilePictureUrl}
        url={siteUrl}
        keywords={seoKeywords}
        author={cv.fullName}
        personSchema={personSchema}
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
      
      <div className="relative z-10 scroll-smooth container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <Reveal>
          <section className="relative overflow-hidden rounded-3xl border bg-white/80 backdrop-blur-xl shadow-2xl dark:border-slate-800/50 dark:bg-slate-900/80 mb-12">
            <div className="absolute inset-0 opacity-60 bg-[radial-gradient(1200px_600px_at_0%_0%,rgba(59,130,246,0.15),transparent_60%),radial-gradient(1000px_400px_at_100%_100%,rgba(34,211,238,0.15),transparent_60%)]" />
            
            <div className="relative grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8 p-6 sm:p-8 md:p-12 items-center">
              <Reveal delay={200} animation="bounce" className="order-1 lg:order-none lg:col-span-2 flex justify-center lg:justify-start">
                <div className="relative group">
                  <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-blue-500 via-cyan-400 to-emerald-400 opacity-70 blur-lg group-hover:opacity-100 group-hover:blur-xl transition-all duration-700 animate-pulse" />
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-blue-600 via-cyan-500 to-emerald-500 opacity-80 group-hover:scale-105 transition-transform duration-500" />
                  <img
                    src={cv.profilePictureUrl}
                    alt={cv.fullName}
                    className="relative z-10 h-40 w-40 sm:h-48 sm:w-48 md:h-64 md:w-64 rounded-full border-4 border-white shadow-2xl object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-green-500 border-4 border-white rounded-full animate-pulse" />
                </div>
              </Reveal>

              <div className="lg:col-span-3 text-center lg:text-left">
                <Reveal delay={100} animation="slideRight">
                  <p className="text-sm uppercase tracking-widest text-blue-600 font-bold mb-3 dark:text-cyan-400 animate-pulse">
                    Welcome to my world
                  </p>
                </Reveal>
                
                <Reveal delay={300} animation="slideLeft">
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-tight dark:text-slate-100 mb-6 bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 dark:from-slate-100 dark:via-cyan-300 dark:to-slate-100 bg-clip-text text-transparent">
                    {cv.fullName}
                  </h1>
                </Reveal>
                
                <Reveal delay={400} animation="fadeIn">
                  <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto lg:mx-0 leading-relaxed dark:text-slate-300 mb-8">
                    <span dangerouslySetInnerHTML={{ __html: (cv.aboutMe || '').slice(0, 250) + (cv.aboutMe && cv.aboutMe.length > 250 ? '...' : '') }} />
                  </p>
                </Reveal>

                <Reveal delay={500} animation="slideUp">
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
                  <Link
                    to="/projects"
                    className="group relative inline-flex items-center justify-center w-full sm:w-auto gap-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 sm:px-8 sm:py-4 font-bold shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative z-10">View Projects</span>
                    <svg className="relative z-10 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>

                  {/* NEW - DOWNLOAD CV BUTTON */}
                  <a
                    href="/CV.pdf"
                    download="CV-StanleyPrasetio.pdf"
                    className="inline-flex items-center justify-center w-full sm:w-auto gap-2 rounded-full border-2 border-slate-300/80 bg-slate-100/80 text-slate-700 px-6 py-3 sm:px-8 sm:py-4 font-bold hover:border-slate-400 hover:bg-slate-200 transition-all duration-300 hover:scale-105 dark:border-slate-600 dark:bg-slate-800/80 dark:text-cyan-400 dark:hover:bg-slate-700 backdrop-blur-sm shadow-lg"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>Download CV</span>
                  </a>
                  
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center w-full sm:w-auto gap-2 rounded-full border-2 border-blue-200 bg-white/90 text-blue-700 px-6 py-3 sm:px-8 sm:py-4 font-bold hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 hover:scale-105 dark:border-slate-600 dark:bg-slate-800/80 dark:text-cyan-400 dark:hover:bg-slate-700 backdrop-blur-sm shadow-lg"
                  >
                    <span>Let's Connect</span>
                  </Link>
                </div>
              </Reveal>

                <Reveal delay={600} animation="bounce">
                  <div className="flex items-center justify-center lg:justify-start gap-4">
                    <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Follow me:</span>
                    <div className="flex items-center gap-3">
                      <SocialIcon type="mail" href={`mailto:${cv.email}`} />
                      <SocialIcon type="linkedin" href={cv.linkedIn} />
                      <SocialIcon type="github" href={cv.github} />
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal delay={100}>
          <section className="mb-12 rounded-3xl border bg-white/85 backdrop-blur-xl p-6 sm:p-8 md:p-10 shadow-xl dark:border-slate-800/50 dark:bg-slate-900/80">
            <SectionHeader title="About Me" subtitle="My Story" anchor="about" />
            <div 
              className="prose prose-base md:prose-lg max-w-none text-slate-700 dark:prose-invert dark:text-slate-300 leading-relaxed text-justify whitespace-pre-line" 
              dangerouslySetInnerHTML={{ __html: cv.aboutMe }} 
            />
          </section>
        </Reveal>

        <Reveal delay={150}>
          <section id="skills" className="mb-12 rounded-3xl border bg-white/85 backdrop-blur-xl p-6 sm:p-8 md:p-10 shadow-xl dark:border-slate-800/50 dark:bg-slate-900/80">
            <SectionHeader title="Skills & Expertise" subtitle="My Toolbox" anchor="skills" />
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {cv.skills.flatMap((cat) => cat.items).map((skill, i) => (
                <span
                  key={i}
                  className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50/80 text-blue-800 px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm font-medium shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 dark:border-cyan-800/50 dark:bg-cyan-900/40 dark:text-cyan-300 cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal delay={220}>
          <section className="mb-12 rounded-3xl border bg-white/85 backdrop-blur-xl p-6 sm:p-8 md:p-10 shadow-xl dark:border-slate-800/50 dark:bg-slate-900/80">
            <SectionHeader title="Experience" subtitle="My Journey" anchor="experience" />
            
            <div className="mb-8 flex flex-wrap justify-center gap-2 sm:gap-3">
              {['All', 'Work', 'Organization', 'Volunteer'].map((f) => (
                <button
                  key={f}
                  onClick={() => setExpFilter(f)}
                  className={`rounded-full px-5 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm font-bold transition-all duration-300 transform hover:scale-105 ${
                    expFilter === f
                      ? 'text-white bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/25'
                      : 'text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-700 hover:border-blue-300 dark:hover:border-cyan-500 shadow-md'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            
            {filteredExperiences.length ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {filteredExperiences.map((exp, index) => (
                  <ExperienceCard key={exp._id} exp={exp} index={index} />
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-500 dark:text-slate-400 py-8">No experiences found for this category.</p>
            )}
          </section>
        </Reveal>

        {featuredProjects.length > 0 && (
          <Reveal delay={350}>
            <section id="projects" className="mb-12 rounded-3xl border bg-white/85 backdrop-blur-xl p-6 sm:p-8 md:p-10 shadow-xl dark:border-slate-800/50 dark:bg-slate-900/80">
              <SectionHeader title="Featured Projects" subtitle="My Work" anchor="projects" />
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 mb-10">
                {featuredProjects.map((proj, index) => (
                  <ProjectCard key={proj._id} proj={proj} index={index} />
                ))}
              </div>
              
              <div className="text-center">
                <Link
                  to="/projects"
                  className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-4 font-bold shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10">View All Projects</span>
                  <svg className="relative z-10 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </section>
          </Reveal>
        )}

        <Reveal delay={420}>
          <section className="mb-12 rounded-3xl border bg-white/85 backdrop-blur-xl p-6 sm:p-8 md:p-10 shadow-xl dark:border-slate-800/50 dark:bg-slate-900/80">
            <SectionHeader title="Certifications" subtitle="My Credentials" anchor="certs" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cv.certifications.map((cert, index) => (
                <Reveal key={cert._id} delay={index * 100} animation="slideUp">
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block rounded-xl border p-6 bg-white/80 hover:bg-white transition-all duration-500 shadow-md hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/60 dark:hover:bg-slate-900/80 hover:scale-105 hover:-translate-y-1"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <span className="inline-block h-3 w-3 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-400 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 mt-1" />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-blue-700 group-hover:text-blue-800 dark:text-cyan-400 dark:group-hover:text-cyan-300 transition-colors mb-1">
                          {cert.name}
                        </div>
                        <div className="text-slate-600 dark:text-slate-400 font-medium text-sm">
                          {cert.issuer}
                        </div>
                      </div>
                      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                        <svg className="h-5 w-5 text-blue-600 dark:text-cyan-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                  </a>
                </Reveal>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal delay={480}>
          <section className="mb-12 rounded-3xl border bg-white/85 backdrop-blur-xl p-6 sm:p-8 md:p-10 shadow-xl dark:border-slate-800/50 dark:bg-slate-900/80">
            <SectionHeader title="Take a Break" subtitle="Mini Game" anchor="game" />
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-xl animate-pulse" />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-xl animate-pulse animation-delay-2000" />
              <div className="relative z-10">
                <Game />
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal delay={550}>
          <section className="text-center rounded-3xl border bg-gradient-to-br from-blue-600 via-cyan-500 to-emerald-500 p-8 md:p-12 shadow-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'><defs><pattern id=\'grid\' width=\'10\' height=\'10\' patternUnits=\'userSpaceOnUse\'><path d=\'M 10 0 L 0 0 0 10\' fill=\'none\' stroke=\'white\' stroke-opacity=\'0.1\' stroke-width=\'1\'/></pattern></defs><rect width=\'100\' height=\'100\' fill=\'url(%23grid)\'/></svg>')] opacity-20" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                Ready to Work Together?
              </h2>
              <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Let's bring your ideas to life. I'm always excited to take on new challenges and create amazing experiences.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/contact"
                  className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-full bg-white text-blue-600 px-8 py-4 font-bold shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105"
                >
                  <span>Get In Touch</span>
                  <svg className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <Link
                  to="/projects"
                  className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white px-8 py-4 font-bold hover:bg-white/20 transition-all duration-300 hover:scale-105"
                >
                  View Projects
                </Link>
              </div>
            </div>
            
            <div className="absolute top-10 left-10 w-4 h-4 bg-white/20 rounded-full animate-float" />
            <div className="absolute top-20 right-20 w-6 h-6 bg-white/15 rounded-full animate-float animation-delay-2000" />
            <div className="absolute bottom-20 left-20 w-5 h-5 bg-white/25 rounded-full animate-float animation-delay-4000" />
          </section>
        </Reveal>
      </div>
    </div>
  );
};

export default HomePage;