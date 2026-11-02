import { academyApps } from '../data/profile';
import { AppIcon, Tag } from './ui';
import Glyph from './Glyph';

// Apps from the Apple Developer Academy, laid out like an App Store listing:
// icon, name, category, then what the app does and what it is built with.
const AppCard = ({ app }) => (
  <article className="flex h-full flex-col rounded-card bg-elevated p-5">
    {app.screenshot && (
      <img src={app.screenshot} alt={`${app.name} screenshot`} className="-mx-5 -mt-5 mb-5 aspect-[4/3] w-[calc(100%+40px)] max-w-none rounded-t-card object-cover" />
    )}
    <div className="flex items-center gap-4">
      <AppIcon symbol={app.symbol} tint={app.tint} size={64} />
      <div className="min-w-0">
        <h3 className="text-headline font-semibold">{app.name}</h3>
        <p className="text-footnote text-label2">{app.category}</p>
      </div>
    </div>
    <p className="mt-4 text-body font-medium">{app.summary}</p>
    <p className="mt-1.5 text-subhead text-label2">{app.description}</p>
    <div className="mt-4 flex flex-wrap gap-1.5">
      {app.frameworks.map((f) => (
        <Tag key={f}>{f}</Tag>
      ))}
    </div>
    {app.url && (
      <a
        href={app.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto inline-flex min-h-[44px] items-center gap-1 self-start pt-4 text-subhead font-medium text-tint hover:underline"
      >
        Source on GitHub
        <Glyph name="arrow.up.right" className="h-3.5 w-3.5" weight={2.25} />
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    )}
  </article>
);

const AcademyApps = () => (
  <div className="grid gap-4 md:grid-cols-3">
    {academyApps.map((app) => (
      <AppCard key={app.name} app={app} />
    ))}
  </div>
);

export default AcademyApps;
