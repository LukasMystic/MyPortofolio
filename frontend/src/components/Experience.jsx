import { useId, useState } from 'react';
import Glyph from './Glyph';
import { Collapse } from './motion';
import { plainText } from '../lib/text';

const shortDate = (range = '') => range.replace(/\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+/g, '').replace(/\s*-\s*/g, ' – ');

// One role per row: title, organisation, dates. Tapping expands the detail,
// written as short lines of prose rather than bullets.
const ExperienceRow = ({ exp, expandable = true }) => {
  const [open, setOpen] = useState(false);
  const id = useId();
  const details = (exp.responsibilities || []).map((r) => plainText(r)).filter(Boolean);
  const canExpand = expandable && details.length > 0;

  const head = (
    <>
      <div className="min-w-0 flex-1">
        <div className="text-body text-label">{exp.title}</div>
        <div className="truncate text-subhead text-label2">{exp.organization}</div>
      </div>
      <div className="shrink-0 text-right text-footnote tabular-nums text-label2">{shortDate(exp.dateRange)}</div>
      {canExpand && (
        <Glyph
          name="chevron.right"
          className={`h-4 w-4 text-label3 transition-transform duration-300 ${open ? 'rotate-90' : ''}`}
          weight={2.25}
        />
      )}
    </>
  );

  if (!canExpand) return <div className="flex min-h-[44px] items-center gap-3 px-4 py-3">{head}</div>;

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={id}
        className="flex min-h-[44px] w-full items-center gap-3 px-4 py-3 text-left transition-colors duration-150 hover:bg-fill active:bg-fill2"
      >
        {head}
      </button>
      <Collapse open={open} id={id}>
        <div className="space-y-2 px-4 pb-4 text-subhead text-label2">
          {details.map((d, i) => (
            <p key={i}>{d}</p>
          ))}
        </div>
      </Collapse>
    </div>
  );
};

export default ExperienceRow;
