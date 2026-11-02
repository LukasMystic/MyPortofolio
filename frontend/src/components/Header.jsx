import { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTranslation } from '../context/TranslationContext';
import Glyph from './Glyph';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'id', name: 'Bahasa Indonesia' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'pt', name: 'Português' },
  { code: 'ja', name: '日本語' },
  { code: 'zh', name: '中文' },
  { code: 'ru', name: 'Русский' },
  { code: 'hi', name: 'हिन्दी' },
];

const tabs = [
  { to: '/', label: 'Home', icon: 'house', end: true },
  { to: '/projects', label: 'Work', icon: 'square.grid' },
  { to: '/about', label: 'About', icon: 'person' },
  { to: '/contact', label: 'Contact', icon: 'bubble' },
];

const useTheme = () => {
  const [theme, setTheme] = useState(() =>
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Follow the system appearance until the visitor makes a choice.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e) => {
      if (!localStorage.getItem('theme')) setTheme(e.matches ? 'dark' : 'light');
    };
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    setTheme(next);
  };

  return [theme, toggle];
};

const IconButton = ({ label, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    title={label}
    className="inline-flex h-11 w-11 items-center justify-center rounded-full text-tint transition-colors duration-150 hover:bg-fill"
  >
    {children}
  </button>
);

// A pop-up button. The native <select> keeps it accessible and gives each
// platform its own picker (the wheel on iPhone, a menu on the Mac).
const LanguagePicker = () => {
  const { language, changeLanguage, isTranslating } = useTranslation();
  return (
    <label className="relative inline-flex h-11 items-center gap-1 rounded-full px-2.5 text-tint transition-colors duration-150 focus-within:bg-fill hover:bg-fill">
      <Glyph name="globe" className="h-[19px] w-[19px]" />
      <span className="text-subhead font-medium uppercase" aria-hidden="true">
        {isTranslating ? '…' : language}
      </span>
      <select
        value={language}
        onChange={(e) => changeLanguage(e.target.value)}
        disabled={isTranslating}
        aria-label="Language"
        className="absolute inset-0 cursor-pointer opacity-0"
      >
        {languages.map((l) => (
          <option key={l.code} value={l.code}>
            {l.name}
          </option>
        ))}
      </select>
    </label>
  );
};

const navLinkClass = ({ isActive }) =>
  `inline-flex min-h-[44px] items-center rounded-full px-3.5 text-subhead transition-colors duration-150 hover:bg-fill ${
    isActive ? 'font-semibold text-label' : 'text-label2 hover:text-label'
  }`;

// Like a large-title navigation bar: transparent at the top of the page, the
// material and hairline fade in once content scrolls underneath.
const useScrolled = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return scrolled;
};

const Header = ({ isAuthenticated, onLogout }) => {
  const [theme, toggleTheme] = useTheme();
  const scrolled = useScrolled();
  const { content } = useTranslation();
  const name = content?.cv?.fullName || 'Stanley Pratama Teguh';
  const tabItems = isAuthenticated ? [...tabs, { to: '/admin', label: 'Admin', icon: 'doc.text' }] : tabs;

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] rounded-full bg-tint-fill px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-3"
      >
        Skip to content
      </a>

      {/* Navigation bar */}
      <header
        className={`sticky top-0 z-50 pt-[env(safe-area-inset-top)] transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
          scrolled ? 'material-bar hairline-b' : 'bg-grouped'
        }`}
      >
        <nav aria-label="Primary" className="mx-auto flex h-[52px] max-w-content items-center gap-1 px-2 sm:px-4">
          <Link to="/" className="flex min-h-[44px] min-w-0 items-center gap-2.5 rounded-full px-2 text-headline font-semibold">
            {content?.cv?.profilePictureUrl && (
              <img src={content.cv.profilePictureUrl} alt="" className="h-7 w-7 shrink-0 rounded-full object-cover" />
            )}
            <span className="truncate">{name}</span>
          </Link>

          <div className="ml-auto hidden items-center gap-0.5 md:flex">
            {tabs.map((t) => (
              <NavLink key={t.to} to={t.to} end={t.end} className={navLinkClass}>
                {t.label}
              </NavLink>
            ))}
            {isAuthenticated && (
              <NavLink to="/admin" className={navLinkClass}>
                Admin
              </NavLink>
            )}
            <span className="mx-1.5 h-5 w-px bg-separator" aria-hidden="true" />
          </div>

          <div className="ml-auto flex shrink-0 items-center md:ml-0">
            <LanguagePicker />
            <IconButton label={theme === 'dark' ? 'Use light appearance' : 'Use dark appearance'} onClick={toggleTheme}>
              <Glyph name={theme === 'dark' ? 'sun' : 'moon'} className="h-5 w-5" />
            </IconButton>
            {isAuthenticated && (
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex min-h-[44px] items-center rounded-full px-3 text-subhead font-medium text-sys-red hover:bg-fill"
              >
                Sign Out
              </button>
            )}
          </div>
        </nav>
      </header>

      {/* Tab bar on iPhone-sized screens */}
      <nav
        aria-label="Sections"
        className="material-bar hairline-t fixed inset-x-0 bottom-0 z-50 pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        <ul className="mx-auto flex max-w-md">
          {tabItems.map((t) => (
            <li key={t.to} className="flex-1">
              <NavLink
                to={t.to}
                end={t.end}
                className={({ isActive }) =>
                  `flex h-[50px] flex-col items-center justify-center gap-0.5 text-[10px] font-medium tracking-[0.01em] transition-colors duration-200 ${
                    isActive ? 'tab-active text-tint' : 'text-label3'
                  }`
                }
              >
                <Glyph name={t.icon} className="h-[25px] w-[25px]" weight={1.9} />
                {t.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default Header;
