import { Link } from 'react-router-dom';
import { useTranslation } from '../context/TranslationContext';

const FooterLink = ({ to, href, children }) =>
  to ? (
    <Link to={to} className="hover:text-label hover:underline">
      {children}
    </Link>
  ) : (
    <a href={href} target="_blank" rel="noopener noreferrer" className="hover:text-label hover:underline">
      {children}
    </a>
  );

const Footer = () => {
  const { content } = useTranslation();
  const cv = content?.cv || {};
  const name = cv.fullName || 'Stanley Pratama Teguh';

  return (
    <footer className="mt-auto bg-grouped pb-[calc(72px+env(safe-area-inset-bottom))] md:pb-0">
      <div className="hairline-t mx-auto max-w-content px-4 py-6 text-footnote text-label2 sm:px-6">
        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2">
          <FooterLink to="/projects">Work</FooterLink>
          <FooterLink to="/contact">Contact</FooterLink>
          <a href="/CV.pdf" download="CV-StanleyPratamaTeguh.pdf" className="hover:text-label hover:underline">
            CV (PDF)
          </a>
          {cv.github && <FooterLink href={cv.github}>GitHub</FooterLink>}
          {cv.linkedIn && <FooterLink href={cv.linkedIn}>LinkedIn</FooterLink>}
          <FooterLink to="/games">A small game</FooterLink>
        </nav>
        <p className="mt-4 text-label3">
          © {new Date().getFullYear()} {name}.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
