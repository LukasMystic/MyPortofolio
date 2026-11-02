import Glyph from './Glyph';
import { GroupedList } from './ui';
import { Reveal } from './motion';
import { research } from '../data/profile';

// Title and venue only; the paper or repository is one tap away.
const ResearchList = () => (
  <Reveal>
    <GroupedList>
      {research.map((r) => {
        const inner = (
          <>
            <div className="min-w-0 flex-1">
              <div className="text-body text-label">{r.title}</div>
              <div className="text-footnote text-label2">{r.venue}</div>
            </div>
            {r.url && <Glyph name="arrow.up.right" className="h-4 w-4 text-label3 transition-colors group-hover:text-tint" weight={2.25} />}
          </>
        );
        return r.url ? (
          <a
            key={r.title}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex min-h-[44px] items-center gap-3 px-4 py-3 transition-colors hover:bg-fill active:bg-fill2"
          >
            {inner}
          </a>
        ) : (
          <div key={r.title} className="flex min-h-[44px] items-center gap-3 px-4 py-3">
            {inner}
          </div>
        );
      })}
    </GroupedList>
  </Reveal>
);

export default ResearchList;
