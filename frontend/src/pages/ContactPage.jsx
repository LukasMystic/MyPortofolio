import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useTranslation } from '../context/TranslationContext';
import LoadingSpinner from '../components/LoadingSpinner';

const contactContent = {
  en: {
    title: 'Let\'s Connect',
    subtitle: 'Ready to Create Something Amazing?',
    description: 'Have a question or want to work together? I\'d love to hear from you. Drop me a message and let\'s start the conversation.',
    nameLabel: 'Your Name',
    emailLabel: 'Email Address',
    messageLabel: 'Your Message',
    buttonText: 'Send Message',
    submittingText: 'Sending...',
    contactInfo: 'Get in Touch',
    responseTime: 'I typically respond within 24 hours',
  },
};

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
  const particles = Array.from({ length: 20 }, (_, i) => ({
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

// Contact info card component
const ContactInfoCard = ({ icon, title, content, delay }) => (
  <Reveal delay={delay} animation="slideLeft">
    <div className="group relative overflow-hidden rounded-xl border bg-white/80 backdrop-blur-sm p-6 shadow-md hover:shadow-xl transition-all duration-500 dark:border-slate-800 dark:bg-slate-900/70 hover:scale-[1.02] hover:-translate-y-1">
      <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-blue-50 to-cyan-50 dark:from-slate-800/30 dark:to-slate-700/20" />
      <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
      
      <div className="relative flex items-center gap-4">
        <div className="flex-shrink-0 p-3 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 group-hover:from-blue-500/20 group-hover:to-cyan-500/20 transition-all duration-300">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-cyan-400 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">{content}</p>
        </div>
      </div>
    </div>
  </Reveal>
);

// Enhanced input component
const AnimatedInput = ({ label, type = 'text', name, value, onChange, required = false, rows, delay = 0 }) => {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  useEffect(() => {
    setHasValue(value && value.length > 0);
  }, [value]);

  const InputComponent = type === 'textarea' ? 'textarea' : 'input';

  return (
    <Reveal delay={delay} animation="slideUp">
      <div className="relative group">
        <InputComponent
          type={type === 'textarea' ? undefined : type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          rows={rows}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`
            w-full px-4 py-4 rounded-xl border-2 bg-white/90 backdrop-blur-sm shadow-sm 
            transition-all duration-300 focus:outline-none focus:shadow-lg
            dark:bg-slate-800/70 dark:text-slate-200
            ${focused || hasValue 
              ? 'border-blue-500 focus:border-cyan-400 dark:border-cyan-500' 
              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            }
            ${type === 'textarea' ? 'resize-none min-h-[120px]' : 'h-14'}
            placeholder-transparent
          `}
          placeholder={label}
        />
        <label
          className={`
            absolute left-4 pointer-events-none transition-all duration-300 font-medium
            ${focused || hasValue
              ? 'top-2 text-xs text-blue-600 dark:text-cyan-400'
              : 'top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400'
            }
            ${type === 'textarea' && (focused || hasValue) ? 'top-3' : ''}
          `}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        {/* Animated border effect */}
        <div className={`
          absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 
          transition-all duration-300 transform origin-left
          ${focused ? 'w-full scale-x-100' : 'w-0 scale-x-0'}
        `} />
      </div>
    </Reveal>
  );
};

const ContactPage = () => {
  const { language, translateText, isTranslating } = useTranslation();
  const [t, setT] = useState(contactContent.en);
  const [formData, setFormData] = useState({ name: '', email: '', message: '', honeypot: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [responseType, setResponseType] = useState('');

  useEffect(() => {
    if (language === 'en') {
      setT(contactContent.en);
    } else {
      const translateContent = async () => {
        const newT = {};
        for (const key in contactContent.en) {
          newT[key] = await translateText(contactContent.en[key], language);
        }
        setT(newT);
      };
      translateContent();
    }
  }, [language, translateText]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResponseMessage('');
    
    try {
      const { data } = await axios.post('/api/contact', formData);
      const translatedSuccess = await translateText(data.message, language);
      setResponseMessage(translatedSuccess);
      setResponseType('success');
      setFormData({ name: '', email: '', message: '', honeypot: '' });
    } catch (err) {
      const serverError = err.response?.data?.message || 'An error occurred. Please try again.';
      const translatedError = await translateText(serverError, language);
      setResponseMessage(translatedError);
      setResponseType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isTranslating && language !== 'en') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
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
          @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.4); }
            50% { box-shadow: 0 0 30px rgba(34, 211, 238, 0.6); }
          }
          .animate-float { animation: float ease-in-out infinite; }
          .animate-blob { animation: blob 7s ease-in-out infinite; }
          .animate-gradient-shift { animation: gradient-shift 4s ease-in-out infinite; }
          .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
          .animation-delay-2000 { animation-delay: 2s; }
          .animation-delay-4000 { animation-delay: 4s; }
          .animation-delay-6000 { animation-delay: 6s; }
        `
      }} />

      <AnimatedBackground />
      <FloatingParticles />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Reveal animation="slideUp">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="inline-block h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 animate-pulse" />
              <span className="uppercase tracking-widest text-xs text-blue-600 font-semibold dark:text-cyan-400">
                Contact
              </span>
            </div>
          </Reveal>
          
          <Reveal animation="fadeIn" delay={100}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-tight dark:text-slate-100 mb-6 bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 dark:from-slate-100 dark:via-cyan-300 dark:to-slate-100 bg-clip-text text-transparent">
              {t.title}
            </h1>
          </Reveal>
          
          <Reveal animation="slideUp" delay={200}>
            <p className="text-xl md:text-2xl text-blue-600 dark:text-cyan-400 font-semibold mb-4">
              {t.subtitle}
            </p>
          </Reveal>
          
          <Reveal animation="fadeIn" delay={300}>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              {t.description}
            </p>
          </Reveal>
          
          <Reveal animation="slideUp" delay={400}>
            <div className="mt-6 h-1.5 w-28 mx-auto rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 animate-pulse" />
          </Reveal>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <Reveal animation="slideRight">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  {t.contactInfo}
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  {t.responseTime}
                </p>
              </div>
            </Reveal>

            <div className="space-y-6">
              <ContactInfoCard
                delay={100}
                icon={
                  <svg className="h-6 w-6 text-blue-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
                title="Email"
                content="Let's discuss your project"
              />
              
              <ContactInfoCard
                delay={200}
                icon={
                  <svg className="h-6 w-6 text-blue-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                }
                title="Location"
                content="Available for remote work"
              />
              
              <ContactInfoCard
                delay={300}
                icon={
                  <svg className="h-6 w-6 text-blue-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                title="Response Time"
                content="Within 24 hours"
              />
            </div>

            
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Reveal animation="slideLeft">
              <div className="relative overflow-hidden rounded-3xl border bg-white/80 backdrop-blur-xl shadow-2xl dark:border-slate-800/50 dark:bg-slate-900/80 p-8 md:p-10">
                <div className="absolute inset-0 opacity-60 bg-[radial-gradient(800px_400px_at_0%_0%,rgba(59,130,246,0.1),transparent_50%),radial-gradient(600px_300px_at_100%_100%,rgba(34,211,238,0.1),transparent_50%)]" />
                
                <div className="relative z-10">
                  {responseMessage && (
                    <Reveal animation="slideUp">
                      <div
                        className={`p-4 rounded-xl mb-6 text-center backdrop-blur-sm border ${
                          responseType === 'success'
                            ? 'bg-emerald-100/80 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800/50'
                            : 'bg-rose-100/80 text-rose-800 border-rose-200 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-800/50'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          {responseType === 'success' ? (
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                          {responseMessage}
                        </div>
                      </div>
                    </Reveal>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <AnimatedInput
                        label={t.nameLabel}
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        delay={0}
                      />
                      <AnimatedInput
                        label={t.emailLabel}
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        delay={100}
                      />
                    </div>

                    <AnimatedInput
                      label={t.messageLabel}
                      type="textarea"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      delay={200}
                    />

                    {/* Honeypot field */}
                    <div className="hidden" aria-hidden="true">
                      <label htmlFor="honeypot">Bot trap:</label>
                      <input
                        type="text"
                        name="honeypot"
                        id="honeypot"
                        value={formData.honeypot}
                        onChange={handleChange}
                        tabIndex="-1"
                        autoComplete="off"
                      />
                    </div>

                    <Reveal delay={300} animation="slideUp">
                      <div className="text-center pt-4">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className={`
                            group relative inline-flex items-center gap-3 rounded-full text-white px-8 py-4 font-bold shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden
                            ${isSubmitting 
                              ? 'bg-gradient-to-r from-slate-400 to-slate-500 cursor-not-allowed' 
                              : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:scale-105 hover:-translate-y-1'
                            }
                          `}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          {isSubmitting ? (
                            <>
                              <div className="relative z-10 h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                              <span className="relative z-10">{t.submittingText}</span>
                            </>
                          ) : (
                            <>
                              <span className="relative z-10">{t.buttonText}</span>
                              <svg className="relative z-10 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </>
                          )}
                        </button>
                      </div>
                    </Reveal>
                  </form>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;