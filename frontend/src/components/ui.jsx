import { Link } from 'react-router-dom';
import Glyph from './Glyph';

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------

export const Page = ({ children, className = '' }) => (
  <div className={`mx-auto w-full max-w-content px-4 pb-24 pt-6 sm:px-6 md:pb-20 md:pt-10 ${className}`}>{children}</div>
);

// A large title, as at the top of an iOS navigation stack.
export const LargeTitle = ({ title, subtitle }) => (
  <header className="mb-8 md:mb-10">
    <h1 className="text-large-title font-bold md:text-[44px] md:leading-[52px] md:tracking-[-0.01em]">{title}</h1>
    {subtitle && <p className="mt-2 max-w-reading text-body text-label2">{subtitle}</p>}
  </header>
);

export const Section = ({ id, title, footnote, action, children, className = '' }) => (
  <section id={id} aria-labelledby={id ? `${id}-title` : undefined} className={`mt-14 first:mt-0 md:mt-20 ${className}`}>
    {(title || action) && (
      <div className="mb-4 flex items-end justify-between gap-4">
        {title && (
          <h2 id={id ? `${id}-title` : undefined} className="text-title2 font-bold md:text-title1 md:font-bold">
            {title}
          </h2>
        )}
        {action}
      </div>
    )}
    {children}
    {footnote && <p className="mt-2 px-4 text-footnote text-label2">{footnote}</p>}
  </section>
);

// ---------------------------------------------------------------------------
// Inset grouped list
// ---------------------------------------------------------------------------

export const GroupedList = ({ children, header, className = '', inset }) => (
  <div className={className}>
    {header && <h3 className="mb-1.5 px-4 text-footnote uppercase text-label2">{header}</h3>}
    <div className="grouped-list overflow-hidden rounded-card bg-elevated" style={inset ? { '--inset': inset } : undefined}>
      {children}
    </div>
  </div>
);

const rowBase =
  'flex min-h-[44px] w-full items-center gap-3 px-4 py-3 text-left transition-colors duration-150 ease-ios';
const rowInteractive = 'hover:bg-fill active:bg-fill2';

const RowBody = ({ icon, title, subtitle, detail, accessory }) => (
  <>
    {icon}
    <div className="min-w-0 flex-1">
      <div className="text-body text-label">{title}</div>
      {subtitle && <div className="text-subhead text-label2">{subtitle}</div>}
    </div>
    {detail && <div className="shrink-0 text-subhead text-label2">{detail}</div>}
    {accessory === 'chevron' && <Glyph name="chevron.right" className="h-4 w-4 text-label3" weight={2.25} />}
    {accessory === 'external' && <Glyph name="arrow.up.right" className="h-4 w-4 text-label3" weight={2.25} />}
  </>
);

export const Row = ({ to, href, onClick, ...props }) => {
  if (to) {
    return (
      <Link to={to} className={`${rowBase} ${rowInteractive}`}>
        <RowBody accessory="chevron" {...props} />
      </Link>
    );
  }
  if (href) {
    const external = /^https?:/.test(href);
    return (
      <a
        href={href}
        className={`${rowBase} ${rowInteractive}`}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        <RowBody accessory={external ? 'external' : 'chevron'} {...props} />
      </a>
    );
  }
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`${rowBase} ${rowInteractive}`}>
        <RowBody {...props} />
      </button>
    );
  }
  return (
    <div className={rowBase}>
      <RowBody {...props} />
    </div>
  );
};

// The rounded-square icon that leads a Settings-style row.
export const RowIcon = ({ name, color = '#8E8E93' }) => (
  <span className="flex h-[29px] w-[29px] shrink-0 items-center justify-center rounded-[7px] text-white" style={{ background: color }}>
    <Glyph name={name} className="h-[17px] w-[17px]" weight={2} />
  </span>
);

// ---------------------------------------------------------------------------
// Controls
// ---------------------------------------------------------------------------

const buttonStyles = {
  filled: 'bg-tint-fill text-white hover:brightness-110 active:brightness-95',
  gray: 'bg-fill text-tint hover:bg-fill2',
  plain: 'text-tint hover:underline px-0',
};

export const Button = ({ to, href, variant = 'filled', children, className = '', download, ...rest }) => {
  const cls = `inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-full px-5 text-callout font-semibold transition duration-150 ease-ios disabled:cursor-not-allowed disabled:opacity-40 ${buttonStyles[variant]} ${className}`;
  if (to) return <Link to={to} className={cls}>{children}</Link>;
  if (href) {
    const external = /^https?:/.test(href);
    return (
      <a href={href} className={cls} download={download} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {children}
      </a>
    );
  }
  return <button className={cls} {...rest}>{children}</button>;
};

// UISegmentedControl: one choice from a small, fixed set.
export const SegmentedControl = ({ options, value, onChange, label, className = '' }) => (
  <div role="radiogroup" aria-label={label} className={`inline-flex rounded-[9px] bg-fill p-[2px] ${className}`}>
    {options.map((opt) => {
      const selected = opt.value === value;
      return (
        <button
          key={opt.value}
          type="button"
          role="radio"
          aria-checked={selected}
          onClick={() => onChange(opt.value)}
          className={`min-h-[32px] rounded-[7px] px-3.5 text-footnote font-medium transition duration-200 ease-ios sm:px-4 ${
            selected ? 'bg-bg text-label shadow-[0_3px_8px_rgba(0,0,0,0.12),0_3px_1px_rgba(0,0,0,0.04)] dark:bg-elevated2' : 'text-label hover:text-label2'
          }`}
        >
          {opt.label}
        </button>
      );
    })}
  </div>
);

export const Tag = ({ children }) => (
  <span className="inline-flex items-center rounded-full bg-fill px-2.5 py-0.5 text-footnote text-label2">{children}</span>
);

// An app-icon tile: the 22% continuous-corner squircle, gradient fill, white glyph.
export const AppIcon = ({ symbol, tint = ['#8E8E93', '#636366'], size = 64, className = '' }) => (
  <span
    className={`relative inline-flex shrink-0 items-center justify-center text-white shadow-[0_1px_2px_rgba(0,0,0,0.12),inset_0_0_0_0.5px_rgba(0,0,0,0.08)] ${className}`}
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.2237,
      background: `linear-gradient(180deg, ${tint[0]}, ${tint[1]})`,
    }}
    aria-hidden="true"
  >
    <Glyph name={symbol} className="h-[55%] w-[55%]" weight={1.6} />
  </span>
);

export const ActivityIndicator = ({ label = 'Loading' }) => (
  <div role="status" className="flex flex-col items-center justify-center gap-3 py-24 text-label2">
    <svg className="h-7 w-7 animate-spin [animation-duration:0.9s]" viewBox="0 0 24 24" aria-hidden="true">
      {Array.from({ length: 8 }, (_, i) => (
        <line
          key={i}
          x1="12"
          y1="3"
          x2="12"
          y2="7.5"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          opacity={0.25 + (i / 8) * 0.75}
          transform={`rotate(${i * 45} 12 12)`}
        />
      ))}
    </svg>
    <span className="sr-only">{label}</span>
  </div>
);
