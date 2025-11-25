import React, { useEffect, useState, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from '../context/TranslationContext'; // Make sure path is correct

// --- Language Data (Expanded to 10 Languages) ---
const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'id', name: 'Bahasa', flag: '🇮🇩' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
];

// --- Improved Language Selector UI ---
const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, changeLanguage, isTranslating } = useTranslation();
  const dropdownRef = useRef(null);

  const currentLanguage = languages.find(l => l.code === language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (langCode) => {
    if (langCode !== language) {
      changeLanguage(langCode);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 items-center gap-2 rounded-full border-2 border-slate-200 bg-white/90 px-3 py-2 text-sm text-slate-700 shadow-lg transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:scale-105 dark:border-slate-700 dark:bg-slate-800/90 dark:text-slate-200 dark:hover:border-cyan-400"
      >
        {isTranslating ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-blue-500" />
        ) : (
          <>
            <span>{currentLanguage.flag}</span>
            <span className="font-medium hidden sm:inline">{currentLanguage.code.toUpperCase()}</span>
          </>
        )}
        <svg className={`h-4 w-4 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 z-10 mt-2 w-48 origin-top-right rounded-xl bg-white/95 backdrop-blur-md shadow-2xl ring-1 ring-black/5 dark:bg-slate-800/95 dark:ring-white/10 animate-fade-in-scale">
          <div className="p-2 h-64 overflow-y-auto">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                disabled={language === lang.code}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-slate-100 disabled:opacity-100 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                <span className="text-xl">{lang.flag}</span>
                <span className={`flex-1 text-left ${language === lang.code ? 'font-bold text-blue-600 dark:text-cyan-400' : ''}`}>
                  {lang.name}
                </span>
                {language === lang.code && (
                  <svg className="h-5 w-5 text-blue-500 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


const navItems = [
    { to: '/', label: 'Home', icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )},
    { to: '/projects', label: 'Projects', icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    )},
    { to: '/contact', label: 'Contact', icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )},
  ];
  
  const ThemeToggle = ({ isMobile = false }) => {
    const getPreferred = () => {
      if (typeof window === 'undefined') return 'light';
      const stored = localStorage.getItem('theme');
      if (stored) return stored;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };
  
    const [theme, setTheme] = useState(getPreferred);
    const [isAnimating, setIsAnimating] = useState(false);
  
    useEffect(() => {
      const root = document.documentElement;
      if (theme === 'dark') root.classList.add('dark');
      else root.classList.remove('dark');
      localStorage.setItem('theme', theme);
    }, [theme]);
  
    useEffect(() => {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const handle = (e) => {
        const stored = localStorage.getItem('theme');
        if (!stored) setTheme(e.matches ? 'dark' : 'light');
      };
      mq.addEventListener?.('change', handle);
      return () => mq.removeEventListener?.('change', handle);
    }, []);
  
    const handleToggle = () => {
      setIsAnimating(true);
      setTheme(theme === 'dark' ? 'light' : 'dark');
      setTimeout(() => setIsAnimating(false), 500);
    };
  
    if (isMobile) {
      return (
        <button
          onClick={handleToggle}
          className={`group flex items-center gap-3 w-full p-4 rounded-xl font-medium transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300 ${isAnimating ? 'animate-pulse' : ''}`}
          aria-label="Toggle theme"
        >
          <div className="relative">
            <div className={`h-2 w-2 rounded-full transition-all duration-300 bg-gradient-to-r ${theme === 'dark' ? 'from-yellow-400 to-orange-400' : 'from-blue-500 to-cyan-400'} group-hover:scale-125`} />
          </div>
          <div className="flex items-center gap-2">
            <svg className={`h-5 w-5 transition-all duration-500 ${theme === 'dark' ? 'rotate-180 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`} viewBox="0 0 24 24" fill="none">
              <path d="M12 4V2m0 20v-2M4 12H2m20 0h-2M5 5 3.5 3.5M20.5 20.5 19 19M5 19 3.5 20.5M20.5 3.5 19 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
            </svg>
            <svg className={`absolute h-5 w-5 transition-all duration-500 ${theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : '-rotate-180 scale-0 opacity-0'}`} viewBox="0 0 24 24" fill="none">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-lg group-hover:translate-x-1 transition-transform duration-300">
              {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </span>
          </div>
          <div className="ml-auto">
            <div className={`w-12 h-6 rounded-full border-2 transition-all duration-300 relative ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : 'bg-slate-200 border-slate-300'}`}>
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 ${theme === 'dark' ? 'translate-x-6 bg-gradient-to-r from-blue-400 to-cyan-400' : 'translate-x-0.5 bg-gradient-to-r from-yellow-400 to-orange-400'}`} />
            </div>
          </div>
        </button>
      );
    }
  
    return (
      <button
        onClick={handleToggle}
        className={`group relative inline-flex h-10 w-10 items-center justify-center rounded-full border-2 bg-white/90 backdrop-blur-sm text-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 dark:bg-slate-800/90 dark:text-slate-200 ${
          theme === 'dark' 
            ? 'border-slate-600 hover:border-cyan-400' 
            : 'border-slate-200 hover:border-blue-400'
        } ${isAnimating ? 'animate-pulse' : ''}`}
        aria-label="Toggle theme"
        title="Toggle theme"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md" />
        <svg className={`relative z-10 h-5 w-5 transition-all duration-500 ${ theme === 'dark' ? 'rotate-180 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100' }`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 4V2m0 20v-2M4 12H2m20 0h-2M5 5 3.5 3.5M20.5 20.5 19 19M5 19 3.5 20.5M20.5 3.5 19 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
        </svg>
        <svg className={`absolute inset-0 m-auto h-5 w-5 transition-all duration-500 ${ theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : '-rotate-180 scale-0 opacity-0' }`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    );
  };
  
  const AnimatedNavLink = ({ to, children, onClick }) => {
    const location = useLocation();
    const isActive = location.pathname === to;
  
    return (
      <NavLink to={to} onClick={onClick} className="group relative px-3 py-2 text-sm font-semibold text-slate-600 hover:text-blue-700 transition-all duration-300 dark:text-slate-300 dark:hover:text-cyan-400">
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 dark:from-slate-800/50 dark:to-slate-700/50" />
        <span className="relative z-10 group-hover:scale-105 transition-transform duration-300">{children}</span>
        <div className={`absolute left-0 -bottom-1 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-300 ${ isActive ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100' }`} />
        {isActive && (<div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 animate-pulse" />)}
      </NavLink>
    );
  };
  
  const Header = ({ isAuthenticated, onLogout }) => {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { content, isTranslating } = useTranslation();
    const mobileMenuRef = useRef(null);
    const location = useLocation();
  
    useEffect(() => {
      const handleScroll = () => setScrolled(window.scrollY > 10);
      handleScroll();
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);
  
    useEffect(() => {
      const onEsc = (e) => e.key === 'Escape' && setOpen(false);
      if (open) {
        document.addEventListener('keydown', onEsc);
        document.body.style.overflow = 'hidden';
        return () => {
          document.removeEventListener('keydown', onEsc);
          document.body.style.overflow = 'unset';
        };
      }
    }, [open]);
  
    useEffect(() => {
      setOpen(false);
    }, [location.pathname]);
  
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
          setOpen(false);
        }
      };
      if (open) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [open]);
  
    const getBrandName = () => content?.cv?.fullName || 'Stanley Pratama Teguh';
  
    return (
      <>
        <header className={`sticky top-0 left-0 right-0 z-50 header-sticky ${scrolled ? 'header-scrolled' : ''}`}>
          <style dangerouslySetInnerHTML={{ __html: `
              @keyframes float-gentle { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-2px); } }
              @keyframes glow-pulse { 0%, 100% { box-shadow: 0 0 15px rgba(59, 130, 246, 0.3); } 50% { box-shadow: 0 0 25px rgba(34, 211, 238, 0.5); } }
              @keyframes slide-down { 0% { transform: translateY(-100%); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
              @keyframes bounce-in { 0% { transform: scale(0.3) rotate(-45deg); opacity: 0; } 50% { transform: scale(1.05) rotate(-10deg); } 70% { transform: scale(0.9) rotate(3deg); } 100% { transform: scale(1) rotate(0deg); opacity: 1; } }
              @keyframes slide-up { 0% { transform: translateY(20px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
              @keyframes fade-in-scale { 0% { transform: scale(0.95); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
              .animate-float-gentle { animation: float-gentle 3s ease-in-out infinite; }
              .animate-glow-pulse { animation: glow-pulse 2s ease-in-out infinite; }
              .animate-slide-down { animation: slide-down 0.8s ease-out; }
              .animate-bounce-in { animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
              .animate-slide-up { animation: slide-up 0.4s ease-out; }
              .animate-fade-in-scale { animation: fade-in-scale 0.3s ease-out; }
              .header-sticky { animation: slide-down 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
              .header-scrolled { transform: translateY(0); backdrop-filter: blur(20px) saturate(180%); border-bottom: 1px solid rgba(148, 163, 184, 0.2); }
              .dark .header-scrolled { border-bottom: 1px solid rgba(71, 85, 105, 0.3); }
              .mobile-menu-backdrop { animation: fade-in-scale 0.3s ease-out; }
              .mobile-menu-panel { animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
          `}} />
          <div className={`relative border-b backdrop-blur-xl transition-all duration-700 ease-out ${ scrolled ? 'header-scrolled border-slate-300/60 bg-white/95 shadow-xl dark:bg-slate-900/95 dark:border-slate-700/60' : 'border-slate-200/40 bg-white/70 dark:bg-slate-900/70 dark:border-slate-800/40' }`}>
            <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-4">
              <NavLink to="/" className="group relative flex flex-shrink-0 items-center gap-3 animate-float-gentle">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/50 to-cyan-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md animate-glow-pulse" />
                  <img
                    src="/foto_kece.png"
                    alt="Stanley Pratama Teguh"
                    className="relative z-10 h-10 w-10 rounded-full object-cover shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 ring-2 ring-white/50 group-hover:ring-blue-400/50"
                    onError={(e) => {
                      // Fallback to initials if image fails to load
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <span className="relative z-10 text-white font-black text-lg">ST</span>
                  </div>
                </div>
                <div className="hidden sm:block">
                  <div className="text-lg md:text-xl lg:text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 group-hover:from-blue-700 group-hover:via-cyan-600 group-hover:to-emerald-600 transition-all duration-300 whitespace-nowrap truncate">
                    {isTranslating ? <div className="h-6 w-48 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded animate-pulse" /> : getBrandName()}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Portfolio</div>
                </div>
              </NavLink>
              
              <div className="hidden md:flex items-center gap-6">
                {navItems.map((item) => <AnimatedNavLink key={item.to} to={item.to}>{item.label}</AnimatedNavLink>)}
                {isAuthenticated && <AnimatedNavLink to="/admin">Admin</AnimatedNavLink>}
              </div>
              
              <div className="flex flex-shrink-0 items-center gap-3">
                <LanguageSelector />
                <ThemeToggle />
                {isAuthenticated && (
                  <button onClick={onLogout} className="hidden md:inline-flex items-center gap-2 justify-center rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2 text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group">
                    <span>Logout</span>
                    <svg className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  </button>
                )}
                
                {/* Enhanced Mobile Menu Button */}
                <button 
                  className="md:hidden relative z-50 inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-slate-200 bg-white/90 backdrop-blur-sm text-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-slate-800/90 dark:text-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-cyan-400 group active:scale-95" 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    e.stopPropagation(); 
                    setOpen(!open);
                    // Add haptic feedback for mobile
                    if (navigator.vibrate) navigator.vibrate(50);
                  }} 
                  aria-label={open ? "Close menu" : "Open menu"} 
                  aria-expanded={open}
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md" />
                  <div className="relative flex items-center justify-center w-6 h-6">
                    <span className={`absolute h-0.5 w-5 bg-current transform transition-all duration-300 ease-in-out ${open ? 'rotate-45 translate-y-0' : '-translate-y-1.5'}`} />
                    <span className={`absolute h-0.5 w-5 bg-current transform transition-all duration-300 ease-in-out ${open ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`} />
                    <span className={`absolute h-0.5 w-5 bg-current transform transition-all duration-300 ease-in-out ${open ? '-rotate-45 translate-y-0' : 'translate-y-1.5'}`} />
                  </div>
                </button>
              </div>
            </nav>
          </div>
        </header>
  
        {/* Enhanced Mobile Menu */}
        {open && (
          <div className="fixed inset-0 md:hidden z-50 pt-20">
            {/* Enhanced backdrop with better blur */}
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-md mobile-menu-backdrop" 
              onClick={() => setOpen(false)}
              style={{ backdropFilter: 'blur(8px) saturate(180%)' }}
            />
            
            {/* Enhanced close button */}
            <button 
              onClick={() => setOpen(false)} 
              className="fixed top-6 right-6 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-white/95 dark:bg-slate-800/95 border-2 border-slate-200 dark:border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group animate-bounce-in" 
              aria-label="Close menu"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md" />
              <div className="relative flex items-center justify-center w-6 h-6">
                <span className="absolute h-0.5 w-5 bg-slate-600 dark:bg-slate-300 transform rotate-45 transition-transform duration-200 group-hover:scale-110" />
                <span className="absolute h-0.5 w-5 bg-slate-600 dark:bg-slate-300 transform -rotate-45 transition-transform duration-200 group-hover:scale-110" />
              </div>
            </button>
            
            {/* Enhanced menu panel */}
            <div 
              ref={mobileMenuRef} 
              className="relative h-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/60 dark:border-slate-700/60 shadow-2xl mobile-menu-panel"
              style={{ backdropFilter: 'blur(20px) saturate(180%)' }}
            >
              {/* Menu header with profile info */}
              <div className="px-6 py-8 border-b border-slate-200/60 dark:border-slate-700/60 animate-fade-in-scale">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src="/foto_kece.png"
                      alt="Stanley Pratama Teguh"
                      className="h-16 w-16 rounded-full object-cover shadow-lg ring-4 ring-blue-100 dark:ring-blue-900/50"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="hidden h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg ring-4 ring-blue-100 dark:ring-blue-900/50">
                      <span className="text-white font-black text-2xl">ST</span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 border-2 border-white dark:border-slate-900 animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      {getBrandName()}
                    </h2>
                 
                    <div className="flex items-center gap-2 mt-2">
                      <div className="h-2 w-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 animate-pulse" />
                      <span className="text-xs text-slate-500 dark:text-slate-400">Available for work</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Enhanced navigation menu */}
              <div className="h-full overflow-y-auto px-4 py-6 pb-32">
                <div className="space-y-2">
                  {navItems.map((item, index) => (
                    <div 
                      key={item.to} 
                      className="animate-slide-up opacity-0"
                      style={{ 
                        animation: `slide-up 0.4s ease-out ${index * 100}ms forwards`,
                      }}
                    >
                      <NavLink 
                        to={item.to} 
                        end={item.to === '/'} 
                        onClick={() => setOpen(false)} 
                        className={({ isActive }) => 
                          `flex items-center gap-4 p-4 rounded-xl font-medium transition-all duration-300 group active:scale-95 ${
                            isActive 
                              ? 'bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 text-blue-700 dark:text-cyan-400 shadow-lg border-2 border-blue-200/50 dark:border-cyan-800/50' 
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:shadow-md border-2 border-transparent'
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <div className={`relative flex items-center justify-center h-10 w-10 rounded-lg transition-all duration-300 ${
                              isActive 
                                ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-md' 
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-cyan-400 group-hover:text-white'
                            }`}>
                              {item.icon}
                              {isActive && (
                                <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 animate-pulse border-2 border-white dark:border-slate-900" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="text-lg font-semibold group-hover:translate-x-1 transition-transform duration-300">
                                {item.label}
                              </div>
                              <div className="text-sm text-slate-500 dark:text-slate-400 font-normal">
                                {item.to === '/' && 'Welcome page'}
                                {item.to === '/projects' && 'My work & portfolio'}
                                {item.to === '/contact' && 'Get in touch'}
                              </div>
                            </div>
                            {isActive && (
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 animate-pulse" />
                                <svg className="h-5 w-5 text-blue-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            )}
                          </>
                        )}
                      </NavLink>
                    </div>
                  ))}
                  
                  {/* Admin link for authenticated users */}
                  {isAuthenticated && (
                    <div 
                      className="animate-slide-up opacity-0"
                      style={{ 
                        animation: `slide-up 0.4s ease-out ${navItems.length * 100}ms forwards`,
                      }}
                    >
                      <NavLink 
                        to="/admin" 
                        onClick={() => setOpen(false)} 
                        className={({ isActive }) => 
                          `flex items-center gap-4 p-4 rounded-xl font-medium transition-all duration-300 group active:scale-95 ${
                            isActive 
                              ? 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 text-emerald-700 dark:text-teal-400 shadow-lg border-2 border-emerald-200/50 dark:border-teal-800/50' 
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:shadow-md border-2 border-transparent'
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <div className={`relative flex items-center justify-center h-10 w-10 rounded-lg transition-all duration-300 ${
                              isActive 
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-white shadow-md' 
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 group-hover:bg-gradient-to-r group-hover:from-emerald-500 group-hover:to-teal-400 group-hover:text-white'
                            }`}>
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {isActive && (
                                <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 animate-pulse border-2 border-white dark:border-slate-900" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="text-lg font-semibold group-hover:translate-x-1 transition-transform duration-300">
                                Admin Panel
                              </div>
                              <div className="text-sm text-slate-500 dark:text-slate-400 font-normal">
                                Manage content
                              </div>
                            </div>
                            {isActive && (
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 animate-pulse" />
                                <svg className="h-5 w-5 text-emerald-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            )}
                          </>
                        )}
                      </NavLink>
                    </div>
                  )}
  
                  {/* Theme toggle in mobile menu */}
                  <div 
                    className="animate-slide-up opacity-0 pt-4 border-t border-slate-200/60 dark:border-slate-700/60"
                    style={{ 
                      animation: `slide-up 0.4s ease-out ${(navItems.length + (isAuthenticated ? 1 : 0)) * 100 + 100}ms forwards`,
                    }}
                  >
                    <ThemeToggle isMobile={true} />
                  </div>
  
                  {/* Enhanced logout button for mobile */}
                  {isAuthenticated && (
                    <div 
                      className="animate-slide-up opacity-0 pt-4"
                      style={{ 
                        animation: `slide-up 0.4s ease-out ${(navItems.length + 2) * 100}ms forwards`,
                      }}
                    >
                      <button 
                        onClick={() => { 
                          onLogout(); 
                          setOpen(false); 
                        }} 
                        className="flex items-center gap-4 w-full p-4 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group active:scale-95 border-2 border-transparent hover:border-rose-300"
                      >
                        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-white/20 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/30">
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-lg font-semibold">Logout</div>
                          <div className="text-sm text-white/80 font-normal">Sign out securely</div>
                        </div>
                        <svg className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  )}
  
                  {/* Additional mobile menu footer */}
                  <div 
                    className="animate-slide-up opacity-0 pt-8 pb-4"
                    style={{ 
                      animation: `slide-up 0.4s ease-out ${(navItems.length + (isAuthenticated ? 3 : 1)) * 100}ms forwards`,
                    }}
                  >
                    <div className="text-center space-y-4">
                      <div className="flex items-center justify-center gap-4 text-slate-400 dark:text-slate-500">
                        <div className="h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent flex-1" />
                        <span className="text-sm font-medium">Connect</span>
                        <div className="h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent flex-1" />
                      </div>
                      <div className="flex items-center justify-center gap-4">
                        
                        <div className="flex items-center justify-center gap-4">
  

                          <a 
                            href="https://www.linkedin.com/in/stanley-pratama-teguh/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <button className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all duration-300 hover:scale-110 active:scale-95" >
                              <svg className="h-5 w-5 text-slate-600 dark:text-slate-300" fill="currentColor" viewBox="0 0 24 24" >
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                              </svg>
                            </button>
                          </a>
                        
                          <a href="https://github.com/LukasMystic" target="_blank" rel="noopener noreferrer">
                            <button className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-300 hover:scale-110 active:scale-95">
                              <svg className="h-5 w-5 text-slate-600 dark:text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                              </svg>
                            </button> 
                          </a>
                        
                        </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        © 2025 Stanley Pratama Teguh. All rights reserved.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };
  
  export default Header;
