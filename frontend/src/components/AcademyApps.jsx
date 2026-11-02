import { useCallback, useState } from 'react';
import { academyApps } from '../data/profile';
import { AppIcon, Button, Tag } from './ui';
import { Reveal, Sheet } from './motion';
import Glyph from './Glyph';

// The grid shows only what a home screen would: icon, name, one line.
// Everything else waits in a sheet until someone asks for it.
const AppTile = ({ app, onOpen }) => (
  <button
    type="button"
    onClick={onOpen}
    className="pressable lift group flex h-full w-full flex-col items-center rounded-card bg-elevated px-4 pb-6 pt-8 text-center"
  >
    <AppIcon symbol={app.symbol} tint={app.tint} size={84} className="transition-transform duration-500 group-hover:scale-105" />
    <span className="mt-4 text-headline font-semibold">{app.name}</span>
    <span className="mt-1 text-subhead text-label2">{app.summary}</span>
    <span className="mt-auto inline-flex items-center gap-0.5 pt-3 text-footnote font-medium text-tint">
      Details <Glyph name="chevron.right" className="h-3 w-3" weight={2.5} />
    </span>
  </button>
);

const AppSheet = ({ app }) => (
  <div className="px-6 pb-8 pt-6 md:pt-8">
    <div className="flex items-center gap-4 pr-8">
      <AppIcon symbol={app.symbol} tint={app.tint} size={72} />
      <div>
        <h2 className="text-title2 font-bold">{app.name}</h2>
        <p className="text-subhead text-label2">{app.category}</p>
      </div>
    </div>
    {app.screenshot && <img src={app.screenshot} alt={`${app.name} screenshot`} className="mt-6 w-full rounded-[14px]" />}
    <p className="mt-6 text-body">{app.description}</p>
    <div className="mt-5 flex flex-wrap gap-1.5">
      {app.frameworks.map((f) => (
        <Tag key={f}>{f}</Tag>
      ))}
    </div>
    {app.url && (
      <Button href={app.url} className="mt-7 w-full">
        <Glyph name="github" className="h-4 w-4" /> View source
      </Button>
    )}
  </div>
);

const AcademyApps = () => {
  const [openName, setOpenName] = useState(null);
  const [lastApp, setLastApp] = useState(null);
  const close = useCallback(() => setOpenName(null), []);
  const open = (app) => {
    setLastApp(app);
    setOpenName(app.name);
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        {academyApps.map((app, i) => (
          <Reveal key={app.name} index={i} className="h-full">
            <AppTile app={app} onOpen={() => open(app)} />
          </Reveal>
        ))}
      </div>
      {/* lastApp stays rendered while the sheet animates out */}
      <Sheet open={!!openName} onClose={close} title={lastApp?.name || 'App'}>
        {lastApp && <AppSheet app={lastApp} />}
      </Sheet>
    </>
  );
};

export default AcademyApps;
