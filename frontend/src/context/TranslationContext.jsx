import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const TranslationContext = createContext();

export const useTranslation = () => useContext(TranslationContext);

const API_BASE_URL = import.meta.env.VITE_API_URL || '';
const pageTranslationCache = {};

export const TranslationProvider = ({ children }) => {
  const [originalContent, setOriginalContent] = useState(null);
  const [translatedContent, setTranslatedContent] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  
  // 1. Get the last selected language from the browser's localStorage.
  //    This makes the user's choice persist across visits. Default to 'en'.
  const [language, setLanguage] = useState(() => localStorage.getItem('portfolio-lang') || 'en');

  // 2. Fetch the original English content when the application loads.
  useEffect(() => {
    const fetchInitialContent = async () => {
      // Only fetch if we don't have the original content already.
      if (originalContent) return; 
      
      try {
        const [cvRes, projectsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/cv`),
          axios.get(`${API_BASE_URL}/api/projects`)
        ]);
        
        const content = {
          cv: cvRes.data,
          projects: projectsRes.data,
          featuredProjects: projectsRes.data.filter(p => p.isFeatured).slice(0, 5)
        };

        // Store the original English content and cache it.
        setOriginalContent(content);
        pageTranslationCache['en'] = content;

        // If the user's saved language is not English, trigger a translation immediately.
        if (language !== 'en') {
          // Pass the freshly fetched content directly to avoid state delays.
          changeLanguage(language, content);
        } else {
          // Otherwise, just display the English content.
          setTranslatedContent(content);
        }
      } catch (error) {
        console.error("Failed to fetch initial content:", error);
      }
    };
    fetchInitialContent();
  }, [language]); // Dependency array ensures this logic runs correctly on initial load.
  
  /**
   * 3. This is the core function called by the LanguageSelector.
   * It's dynamic and will work with any language code you pass it ('en', 'id', 'es', 'ja', etc.).
   * @param {string} lang - The target language code (e.g., "fr").
   * @param {object} baseContent - Optional content to translate, used for initial load.
   */
  const changeLanguage = async (lang, baseContent) => {
    const contentToTranslate = baseContent || originalContent;

    // Don't do anything if the base content isn't loaded yet.
    if (!contentToTranslate) return;

    // Save the new language choice to localStorage and update the state.
    localStorage.setItem('portfolio-lang', lang);
    setLanguage(lang);

    // If switching back to English, use the original content directly.
    if (lang === 'en') {
        setTranslatedContent(contentToTranslate);
        return;
    }

    // If we have a cached version of this language, use it instantly.
    if (pageTranslationCache[lang]) {
      setTranslatedContent(pageTranslationCache[lang]);
      return;
    }
    
    // If not cached, call the backend API.
    setIsTranslating(true);
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/translate`, { 
        content: contentToTranslate, 
        targetLanguage: lang 
      });

      const newTranslatedContent = data.translatedContent;

      // Store the new translation in the cache and update the UI.
      pageTranslationCache[lang] = newTranslatedContent;
      setTranslatedContent(newTranslatedContent);

    } catch (error) {
        console.error(`Failed to translate content to ${lang}:`, error);
        setTranslatedContent(contentToTranslate); // Revert to English on error.
    } finally {
        setIsTranslating(false);
    }
  };
  
  const value = { content: translatedContent, changeLanguage, isTranslating, language };

  // Display a full-page loading spinner until the initial content (English or translated) is ready.
  // This prevents the page from flashing empty or untranslated content on first load.
  if (!translatedContent) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-slate-900">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-500" />
      </div>
    );
  }

  return <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>;
};