import { useState } from 'react';
import { useTranslation } from '../context/TranslationContext';
import SEO from '../components/SEO';
import Glyph from '../components/Glyph';
import ExperienceRow from '../components/Experience';
import { Page, LargeTitle, Section, GroupedList, Row, RowIcon, SegmentedControl, Tag, ActivityIndicator } from '../components/ui';
import { Reveal, Collapse } from '../components/motion';
import { profile, tools } from '../data/profile';
import { aboutBlocks } from '../lib/text';
import { sortExperiences } from '../lib/experience';

const CERTS_SHOWN = 4;

const AboutPage = () => {
  const { content, isTranslating } = useTranslation();
  const [filter, setFilter] = useState('All');
  const [storyOpen, setStoryOpen] = useState(false);
  const [allCerts, setAllCerts] = useState(false);

  if (!content || isTranslating) return <ActivityIndicator />;

  const { cv } = content;
  const experiences = sortExperiences(cv.experiences);
  const shown = filter === 'All' ? experiences : experiences.filter((e) => e.type === filter);
  const story = aboutBlocks(cv.aboutMe || '');
  const certs = cv.certifications || [];

  return (
    <Page>
      <SEO
        title={`About | ${cv.fullName}`}
        description={profile.bio.slice(0, 160)}
        name={cv.fullName}
        type="profile"
        url="https://stanleypt.vercel.app/about"
        imageUrl={cv.profilePictureUrl}
      />

      <LargeTitle title="About" />

      <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-start">
        {cv.profilePictureUrl && (
          <img src={cv.profilePictureUrl} alt={cv.fullName} className="h-20 w-20 shrink-0 rounded-full object-cover" />
        )}
        <div className="max-w-reading">
          <p className="text-title3 font-normal leading-[30px] text-label">{profile.bio}</p>
          {story.length > 0 && (
            <>
              <button
                type="button"
                onClick={() => setStoryOpen((o) => !o)}
                aria-expanded={storyOpen}
                aria-controls="full-story"
                className="mt-3 inline-flex min-h-[44px] items-center gap-1 text-callout text-tint hover:underline"
              >
                {storyOpen ? 'Less' : 'The longer version'}
                <Glyph name="chevron.right" className={`h-4 w-4 transition-transform duration-300 ${storyOpen ? '-rotate-90' : 'rotate-90'}`} weight={2.25} />
              </button>
              <Collapse open={storyOpen} id="full-story">
                <div className="space-y-4 pt-2 text-body text-label2">
                  {story.map((b, i) =>
                    b.text ? (
                      <p key={i}>{b.text}</p>
                    ) : (
                      <div key={i}>
                        {b.heading && <p className="font-semibold text-label">{b.heading}</p>}
                        <p>{b.items.join(' · ')}</p>
                      </div>
                    )
                  )}
                </div>
              </Collapse>
            </>
          )}
        </div>
      </Reveal>

      <Section id="experience" title="Experience">
        <SegmentedControl
          label="Filter experience"
          className="mb-4 w-full sm:w-auto"
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'All', label: 'All' },
            { value: 'Work', label: 'Work' },
            { value: 'Organization', label: 'Clubs' },
            { value: 'Volunteer', label: 'Volunteer' },
          ]}
        />
        <GroupedList key={filter} className="page-in">
          {shown.map((exp) => (
            <ExperienceRow key={exp._id || exp.title} exp={exp} />
          ))}
        </GroupedList>
      </Section>

      {cv.education?.length > 0 && (
        <Section id="education" title="Education">
          <Reveal>
            <GroupedList inset="57px">
              {cv.education.map((e) => (
                <Row
                  key={e._id || e.institution}
                  icon={<RowIcon name="graduationcap" color="#007AFF" />}
                  title={e.institution}
                  subtitle={e.degree}
                  detail={e.dateRange}
                />
              ))}
            </GroupedList>
          </Reveal>
        </Section>
      )}

      <Section id="tools" title="Tools">
        <div className="space-y-5">
          {tools.map((t, i) => (
            <Reveal key={t.group} index={i}>
              <h3 className="mb-2 text-footnote font-medium uppercase tracking-[0.02em] text-label2">{t.group}</h3>
              <div className="flex flex-wrap gap-1.5">
                {t.items.map((item) => (
                  <Tag key={item}>{item}</Tag>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {certs.length > 0 && (
        <Section id="certifications" title="Certifications">
          <Reveal>
            <GroupedList>
              {certs.slice(0, CERTS_SHOWN).map((c) => (
                <Row key={c._id || c.name} href={c.url || undefined} title={c.name} subtitle={c.issuer} />
              ))}
            </GroupedList>
            {certs.length > CERTS_SHOWN && (
              <>
                <Collapse open={allCerts} id="more-certs">
                  <GroupedList className="mt-3">
                    {certs.slice(CERTS_SHOWN).map((c) => (
                      <Row key={c._id || c.name} href={c.url || undefined} title={c.name} subtitle={c.issuer} />
                    ))}
                  </GroupedList>
                </Collapse>
                <button
                  type="button"
                  onClick={() => setAllCerts((o) => !o)}
                  aria-expanded={allCerts}
                  aria-controls="more-certs"
                  className="mt-2 inline-flex min-h-[44px] items-center px-4 text-callout text-tint hover:underline"
                >
                  {allCerts ? 'Show fewer' : `Show all ${certs.length}`}
                </button>
              </>
            )}
          </Reveal>
        </Section>
      )}
    </Page>
  );
};

export default AboutPage;
