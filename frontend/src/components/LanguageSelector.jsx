import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from '../context/TranslationContext';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'id', name: 'Indonesian', flag: '🇮🇩' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
];

const LanguageSelector = () => {
  const { changeLanguage, isTranslating, language } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = languages.find((l) => l.code === language) || languages[0];

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const onSelect = (code) => {
    setOpen(false);
    if (code !== language) changeLanguage(code);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        disabled={isTranslating}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm backdrop-blur hover:bg-white transition-colors disabled:opacity-60 dark:bg-slate-800/80 dark:text-slate-200 dark:border-slate-700"
      >
        <span className="text-base" aria-hidden>
          {current.flag}
        </span>
        <span className="hidden sm:inline">{current.name}</span>
        <svg
          className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {isTranslating && (
        <span className="ml-2 text-xs text-slate-500 dark:text-slate-400 animate-pulse">Translating…</span>
      )}
      <div
        className={`absolute right-0 mt-2 w-44 origin-top-right rounded-lg border border-slate-200 bg-white/95 backdrop-blur shadow-lg ring-1 ring-black/5 transition transform duration-150 ease-out dark:bg-slate-900/95 dark:border-slate-700 ${
          open ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <ul role="listbox" aria-label="Select language" className="py-1 max-h-64 overflow-auto">
          {languages.map((l) => (
            <li key={l.code}>
              <button
                role="option"
                aria-selected={language === l.code}
                onClick={() => onSelect(l.code)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-slate-800 ${
                  language === l.code
                    ? 'text-blue-700 dark:text-cyan-400'
                    : 'text-slate-700 dark:text-slate-200'
                }`}
              >
                <span className="text-base" aria-hidden>
                  {l.flag}
                </span>
                <span className="flex-1">{l.name}</span>
                {language === l.code && (
                  <svg
                    className="h-4 w-4 text-blue-600 dark:text-cyan-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                  >
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LanguageSelector;
