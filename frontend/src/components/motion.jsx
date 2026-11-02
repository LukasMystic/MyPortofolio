import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Glyph from './Glyph';
import { useInView, reducedMotion } from '../lib/useInView';

// Motion follows iOS: short, physical, and always in service of where things
// came from or went. Everything here is skipped under Reduce Motion (the CSS
// in index.css flattens durations; the hooks below also short-circuit).

// Fade up into place once, the first time an element scrolls into view.
// `index` staggers siblings by 60 ms, capped so long lists never lag.
export const Reveal = ({ as: Tag = 'div', index = 0, className = '', children, ...rest }) => {
  const [ref, inView] = useInView();
  const Component = Tag;
  return (
    <Component
      ref={ref}
      className={`reveal ${inView ? 'is-in' : ''} ${className}`}
      style={{ transitionDelay: inView ? `${Math.min(index, 6) * 60}ms` : '0ms' }}
      {...rest}
    >
      {children}
    </Component>
  );
};

// Counts up to a number with an ease-out curve when it first appears.
export const CountUp = ({ value, suffix = '', duration = 1100 }) => {
  const [ref, inView] = useInView({ threshold: 0.6 });
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reducedMotion()) {
      setShown(value);
      return;
    }
    let raf;
    const start = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - start) / duration);
      setShown(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);
  return (
    <span ref={ref} className="tabular-nums">
      {shown}
      {suffix}
    </span>
  );
};

// Height animation for disclosure content (grid 0fr → 1fr, no measuring).
export const Collapse = ({ open, children, id }) => (
  <div id={id} className={`collapse-grid ${open ? 'is-open' : ''}`} aria-hidden={!open}>
    <div className="min-h-0 overflow-hidden">{children}</div>
  </div>
);

// A sheet: slides up from the bottom on iPhone-sized screens, and appears as a
// centred card that scales in on larger ones. Esc, the backdrop and the close
// button dismiss it; focus moves in on open and returns on close.
export const Sheet = ({ open, onClose, title, children }) => {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);
  const panelRef = useRef(null);
  const returnFocus = useRef(null);

  useEffect(() => {
    if (open) {
      returnFocus.current = document.activeElement;
      setMounted(true);
      const id = requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      return () => cancelAnimationFrame(id);
    }
    setVisible(false);
    const t = setTimeout(() => setMounted(false), reducedMotion() ? 0 : 320);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!mounted) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      returnFocus.current?.focus?.();
    };
  }, [mounted, onClose]);

  useEffect(() => {
    if (visible) panelRef.current?.focus();
  }, [visible]);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-end justify-center md:items-center md:p-6">
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ease-ios ${visible ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={`sheet-panel relative max-h-[88vh] w-full overflow-y-auto rounded-t-[22px] bg-elevated pb-[env(safe-area-inset-bottom)] outline-none md:max-w-lg md:rounded-[22px] ${
          visible ? 'is-in' : ''
        }`}
      >
        <div className="sticky top-0 z-10 flex justify-center bg-elevated pt-2 md:hidden" aria-hidden="true">
          <span className="h-[5px] w-9 rounded-full bg-fill2" />
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-20 inline-flex h-[30px] w-[30px] items-center justify-center rounded-full bg-fill text-label2 transition-colors hover:bg-fill2"
        >
          <Glyph name="xmark" className="h-3.5 w-3.5" weight={2.6} />
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
};
