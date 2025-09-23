import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const TranslationContext = createContext();

export const useTranslation = () => useContext(TranslationContext);

// In-memory cache for full page translations to prevent re-fetching
const pageTranslationCache = {};

export const TranslationProvider = ({ children }) => {
  const [originalContent, setOriginalContent] = useState(null);
  const [translatedContent, setTranslatedContent] = useState(null);
  const [language, setLanguage] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);

  // --- Step 1: Fetch all original (English) content once when the app loads ---
  useEffect(() => {
    const fetchInitialContent = async () => {

      try {
        // Fetch everything needed for the public site in parallel
        const [cvRes, projectsRes] = await Promise.all([
          axios.get('/api/cv'),
          axios.get('/api/projects') // Fetch ALL projects
        ]);
        const content = {
          cv: cvRes.data,
          projects: projectsRes.data,
          featuredProjects: projectsRes.data.filter(p => p.isFeatured).slice(0, 5)
        };

        setOriginalContent(content);
        setTranslatedContent(content);
        // Store the original content in our cache for easy access
        pageTranslationCache['en'] = content;
      } catch (error) {

      }
    };
    fetchInitialContent();
  }, []);
  
  // --- Step 2: This function is called from the Header dropdown ---
  const changeLanguage = async (lang) => {

    setLanguage(lang);

    // If the requested language is already in our cache, use it directly.
    if (pageTranslationCache[lang]) {
      setTranslatedContent(pageTranslationCache[lang]);
      return;
    }
    
    setIsTranslating(true);
   
    
    try {
      // Send the entire original content object to the backend for translation
      const { data } = await axios.post('/api/translate', { 
        content: originalContent, 
        targetLanguage: lang 
      });


      const newTranslatedContent = data.translatedContent;
      
      // Store the new translation in our cache and update the state
      pageTranslationCache[lang] = newTranslatedContent;
      setTranslatedContent(newTranslatedContent);

    } catch (error) {
        setTranslatedContent(originalContent); // Revert to English on error
    } finally {
        setIsTranslating(false);
    }
  };
  
  const value = { content: translatedContent, changeLanguage, isTranslating, language };

  return <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>;
};

