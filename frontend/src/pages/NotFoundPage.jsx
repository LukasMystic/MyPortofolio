import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// Floating particles background
const FloatingParticles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 6 + 3,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 4,
    duration: Math.random() * 15 + 15
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
    <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-300/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob dark:bg-purple-500/10" />
    <div className="absolute top-0 -right-4 w-96 h-96 bg-yellow-300/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 dark:bg-yellow-500/10" />
    <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-300/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000 dark:bg-pink-500/10" />
    <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-300/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-6000 dark:bg-blue-500/10" />
  </div>
);

// Glitch effect for 404 text
const GlitchText = ({ children, className }) => (
  <div className={`relative ${className}`}>
    <span className="relative z-10">{children}</span>
    <span 
      className="absolute top-0 left-0 text-red-500 opacity-70 animate-glitch-1"
      aria-hidden="true"
    >
      {children}
    </span>
    <span 
      className="absolute top-0 left-0 text-blue-500 opacity-70 animate-glitch-2"
      aria-hidden="true"
    >
      {children}
    </span>
  </div>
);

// Animated reveal component
const Reveal = ({ children, delay = 0, className = '', animation = 'slideUp' }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
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
      className={`${className} transform transition-all duration-700 ease-out ${animations[animation]}`}
    >
      {children}
    </div>
  );
};

// Interactive floating elements
const InteractiveElements = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Mouse follower */}
      <div
        className="absolute w-8 h-8 bg-gradient-to-r from-blue-500/30 to-cyan-400/30 rounded-full blur-lg transition-all duration-700 ease-out"
        style={{
          left: mousePos.x - 16,
          top: mousePos.y - 16,
          transform: `scale(${Math.sin(Date.now() * 0.003) * 0.5 + 1})`
        }}
      />
      
      {/* Random floating elements */}
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={i}
          className="absolute animate-float"
          style={{
            left: `${10 + i * 12}%`,
            top: `${20 + (i % 3) * 20}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${8 + i}s`
          }}
        >
          <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-60" />
        </div>
      ))}
    </div>
  );
};

const NotFoundPage = () => {
  const [hover, setHover] = useState(false);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Enhanced CSS animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-15px) rotate(2deg); }
            66% { transform: translateY(8px) rotate(-1deg); }
          }
          @keyframes blob {
            0%, 100% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(40px, -60px) scale(1.2); }
            66% { transform: translate(-30px, 30px) scale(0.8); }
          }
          @keyframes gradient-shift {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          @keyframes glitch-1 {
            0%, 100% { transform: translate(0); }
            20% { transform: translate(-2px, 2px); }
            40% { transform: translate(-2px, -2px); }
            60% { transform: translate(2px, 2px); }
            80% { transform: translate(2px, -2px); }
          }
          @keyframes glitch-2 {
            0%, 100% { transform: translate(0); }
            20% { transform: translate(2px, -2px); }
            40% { transform: translate(2px, 2px); }
            60% { transform: translate(-2px, -2px); }
            80% { transform: translate(-2px, 2px); }
          }
          @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(59, 130, 246, 0.1); }
            50% { box-shadow: 0 0 30px rgba(34, 211, 238, 0.4), 0 0 60px rgba(34, 211, 238, 0.2); }
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
            20%, 40%, 60%, 80% { transform: translateX(2px); }
          }
          
          .animate-float { animation: float ease-in-out infinite; }
          .animate-blob { animation: blob 10s ease-in-out infinite; }
          .animate-gradient-shift { animation: gradient-shift 6s ease-in-out infinite; }
          .animate-glitch-1 { animation: glitch-1 0.3s ease-in-out infinite alternate; }
          .animate-glitch-2 { animation: glitch-2 0.3s ease-in-out infinite alternate; }
          .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
          .animate-shake { animation: shake 0.5s ease-in-out; }
          
          .animation-delay-2000 { animation-delay: 2s; }
          .animation-delay-4000 { animation-delay: 4s; }
          .animation-delay-6000 { animation-delay: 6s; }
          
          .bg-grid {
            background-image: 
              linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px);
            background-size: 50px 50px;
          }
        `
      }} />

      <AnimatedBackground />
      <FloatingParticles />
      <InteractiveElements />

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Background grid pattern */}
        <div className="absolute inset-0 bg-grid opacity-30 rounded-3xl" />
        
        {/* Content container */}
        <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8 sm:p-12 lg:p-16 dark:bg-slate-900/80 dark:border-slate-800/50">
          {/* Decorative elements */}
          <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-400/20 rounded-full blur-xl animate-pulse" />
          <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-400/20 rounded-full blur-xl animate-pulse animation-delay-2000" />
          
          {/* Animated 404 */}
          <Reveal animation="bounce">
            <div className="mb-8">
              <GlitchText className="text-8xl sm:text-9xl lg:text-[12rem] font-black bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 bg-clip-text text-transparent leading-none">
                404
              </GlitchText>
            </div>
          </Reveal>

          {/* Error message */}
          <Reveal delay={200} animation="slideUp">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Oops! Page Not Found
            </h1>
          </Reveal>

          <Reveal delay={400} animation="fadeIn">
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              It looks like you've wandered into uncharted territory. The page you're looking for seems to have vanished into the digital void!
            </p>
          </Reveal>

          {/* Animated illustration */}
          <Reveal delay={600} animation="bounce">
            <div className="mb-12 relative">
              <div className="inline-block relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-cyan-400/20 to-emerald-400/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-700 animate-pulse" />
                <div className="relative bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-slate-800 dark:to-slate-700 rounded-full p-12 sm:p-16 animate-float">
                  <svg 
                    className="w-24 h-24 sm:w-32 sm:h-32 text-blue-600 dark:text-cyan-400" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                  </svg>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Action buttons */}
          <Reveal delay={800} animation="slideUp">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-8">
              <Link 
                to="/" 
                className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 px-8 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-pulse-glow overflow-hidden"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <svg className="relative z-10 w-6 h-6 group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="relative z-10">Back to Home</span>
              </Link>
              
              <Link 
                to="/projects" 
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 border-2 border-blue-200 bg-white/90 text-blue-700 py-4 px-8 rounded-full font-bold text-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 hover:scale-105 dark:border-slate-600 dark:bg-slate-800/80 dark:text-cyan-400 dark:hover:bg-slate-700 backdrop-blur-sm shadow-lg"
              >
                <svg className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                View Projects
              </Link>
            </div>
          </Reveal>

          {/* Quick navigation */}
          <Reveal delay={1000} animation="fadeIn">
            <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Or explore these sections:
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  { to: '/contact', label: 'Contact', icon: '📧' },
                  { to: '/projects', label: 'Projects', icon: '🚀' },
                  { to: '/#about', label: 'About', icon: '👋' },
                  { to: '/#skills', label: 'Skills', icon: '⚡' }
                ].map((link, index) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="group inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-slate-50/80 text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 hover:scale-105 hover:-translate-y-1 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-cyan-400 text-sm font-medium"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <span className="text-lg group-hover:animate-bounce">{link.icon}</span>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* Floating action hint */}
        <Reveal delay={1200} animation="bounce">
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-400 dark:text-slate-500 animate-pulse">
              ✨ Move your mouse around to see some magic ✨
            </p>
          </div>
        </Reveal>
      </div>

      {/* Corner decorations */}
      <div className="fixed top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-blue-500/30 opacity-50 animate-pulse" />
      <div className="fixed top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-cyan-500/30 opacity-50 animate-pulse animation-delay-2000" />
      <div className="fixed bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-emerald-500/30 opacity-50 animate-pulse animation-delay-4000" />
      <div className="fixed bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-purple-500/30 opacity-50 animate-pulse animation-delay-6000" />
    </div>
  );
};

export default NotFoundPage;