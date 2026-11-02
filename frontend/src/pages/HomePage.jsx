import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../context/TranslationContext';
import SEO from '../components/SEO';
import Glyph from '../components/Glyph';
import AcademyApps from '../components/AcademyApps';
import ProjectCard from '../components/ProjectCard';
import { Page, Section, GroupedList, Row, RowIcon, Button, SegmentedControl, ActivityIndicator } from '../components/ui';
import { profile, now, research, tools } from '../data/profile';

const siteUrl = 'https://stanleypt.vercel.app';

const parseEndDate = (range = '') => {
  if (/now|present/i.test(range)) return Number.MAX_SAFE_INTEGER;
  const parts = range.split(/\s[-–]\s|-/).map((s) => s.trim());
  const end = parts[parts.length - 1] || '';
  const d = Date.parse(end);
  return Number.isNaN(d) ? 0 : d;
};

const ExperienceRow = ({ exp }) => (
  <details className="group">
    <summary className="flex min-h-[44px] cursor-pointer items-center gap-3 px-4 py-3 transition-colors duration-150 hover:bg-fill">
      <div className="min-w-0 flex-1">
        <div className="text-body text-label">{exp.title}</div>
        <div className="text-subhead text-label2">{exp.organization}</div>
      </div>
      <div className="shrink-0 text-right text-subhead text-label2">{exp.dateRange}</div>
      <Glyph name="chevron.right" className="disclosure h-4 w-4 text-label3 transition-transform duration-200 ease-ios" weight={2.25} />
    </summary>
    {exp.responsibilities?.length > 0 && (
      <ul className="list-disc space-y-1.5 pb-4 pl-9 pr-4 text-subhead text-label2 marker:text-label3">
        {exp.responsibilities.map((r, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: r }} />
        ))}
      </ul>
    )}
  </details>
);

const HomePage = () => {
  const { content, isTranslating } = useTranslation();
  const [filter, setFilter] = useState('All');

  if (!content || isTranslating) return <ActivityIndicator />;

  const { cv, featuredProjects } = content;
  const experiences = (cv.experiences || []).slice().sort((a, b) => parseEndDate(b.dateRange) - parseEndDate(a.dateRange));
  const shownExperiences = filter === 'All' ? experiences : experiences.filter((e) => e.type === filter);

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: cv.fullName,
    url: siteUrl,
    image: cv.profilePictureUrl,
    jobTitle: profile.role,
    alumniOf: (cv.education || []).map((e) => e.institution),
    sameAs: [cv.linkedIn, cv.github].filter(Boolean),
  };

  return (
    <Page>
      <SEO
        title={`${cv.fullName} — ${profile.role}`}
        description={`${profile.headline} ${profile.intro}`.slice(0, 160)}
        name={cv.fullName}
        type="website"
        imageUrl={cv.profilePictureUrl}
        url={siteUrl}
        keywords={tools.flatMap((t) => t.items).join(', ')}
        author={cv.fullName}
        personSchema={personSchema}
      />

      {/* Hero */}
      <section aria-label="Introduction" className="pt-4 md:pt-10">
        <div className="flex flex-col-reverse gap-8 md:flex-row md:items-center md:gap-12">
          <div className="min-w-0 flex-1">
            <p className="text-subhead font-semibold text-tint">{now[0].detail} · {now[0].label}</p>
            <h1 className="mt-3 text-display font-bold">{profile.headline}</h1>
            <p className="mt-5 max-w-reading text-body text-label2 md:text-[19px] md:leading-[28px] md:tracking-[-0.022em]">{profile.intro}</p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button to="/projects">See my work</Button>
              <Button href="/CV.pdf" download="CV-StanleyPratamaTeguh.pdf" variant="gray">
                <Glyph name="arrow.down" className="h-4 w-4" weight={2.25} />
                Download CV
              </Button>
            </div>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-subhead">
              {cv.github && (
                <a href={cv.github} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center gap-1.5 text-tint hover:underline">
                  <Glyph name="github" className="h-4 w-4" /> GitHub
                </a>
              )}
              {cv.linkedIn && (
                <a href={cv.linkedIn} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center gap-1.5 text-tint hover:underline">
                  <Glyph name="linkedin" className="h-4 w-4" /> LinkedIn
                </a>
              )}
              <a href={`mailto:${cv.email}`} className="inline-flex min-h-[44px] items-center gap-1.5 text-tint hover:underline">
                <Glyph name="envelope" className="h-4 w-4" /> {cv.email}
              </a>
            </div>
          </div>
          {cv.profilePictureUrl && (
            <img
              src={cv.profilePictureUrl}
              alt={cv.fullName}
              className="h-28 w-28 shrink-0 rounded-full object-cover md:h-56 md:w-56"
            />
          )}
        </div>
      </section>

      <Section
        id="academy"
        title="At the Apple Developer Academy"
        footnote="Swift and Apple frameworks throughout, designed to Apple’s Human Interface Guidelines."
      >
        <p className="-mt-1 mb-5 max-w-reading text-body text-label2">
          Native apps for iPhone and iPad, where most of my recent work lives: augmented reality, real-time simulation, and learning for kids.
        </p>
        <AcademyApps />
      </Section>

      <Section id="research" title="Research">
        <GroupedList>
          {research.map((r) => {
            const body = (
              <>
                <div className="text-footnote font-medium uppercase tracking-[0.02em] text-label2">{r.venue}</div>
                <div className="mt-0.5 text-headline font-semibold text-label">{r.title}</div>
                <p className="mt-1 text-subhead text-label2">{r.description}</p>
                <p className="mt-2 text-footnote text-label3">{r.stack}</p>
              </>
            );
            return r.url ? (
              <a key={r.title} href={r.url} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-3 px-4 py-4 transition-colors hover:bg-fill">
                <div className="min-w-0 flex-1">{body}</div>
                <Glyph name="arrow.up.right" className="mt-1 h-4 w-4 text-label3 group-hover:text-tint" weight={2.25} />
              </a>
            ) : (
              <div key={r.title} className="px-4 py-4">{body}</div>
            );
          })}
        </GroupedList>
      </Section>

      {featuredProjects?.length > 0 && (
        <Section
          id="work"
          title="More work"
          action={
            <Link to="/projects" className="inline-flex min-h-[44px] items-center gap-0.5 text-callout text-tint hover:underline">
              See all <Glyph name="chevron.right" className="h-4 w-4" weight={2.25} />
            </Link>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((p) => (
              <ProjectCard key={p._id} project={p} />
            ))}
          </div>
        </Section>
      )}

      <Section id="experience" title="Experience">
        <SegmentedControl
          label="Filter experience"
          className="mb-4"
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'All', label: 'All' },
            { value: 'Work', label: 'Work' },
            { value: 'Organization', label: 'Organizations' },
            { value: 'Volunteer', label: 'Volunteering' },
          ]}
        />
        {shownExperiences.length ? (
          <GroupedList>
            {shownExperiences.map((exp) => (
              <ExperienceRow key={exp._id || exp.title} exp={exp} />
            ))}
          </GroupedList>
        ) : (
          <p className="rounded-card bg-elevated px-4 py-6 text-center text-subhead text-label2">Nothing here yet.</p>
        )}
      </Section>

      <Section id="about" title="About">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rich-text max-w-reading whitespace-pre-line text-label2" dangerouslySetInnerHTML={{ __html: cv.aboutMe }} />
          <div className="space-y-6">
            {cv.education?.length > 0 && (
              <GroupedList header="Education" inset="57px">
                {cv.education.map((e) => (
                  <Row key={e._id || e.institution} icon={<RowIcon name="graduationcap" color="#007AFF" />} title={e.institution} subtitle={`${e.degree} · ${e.dateRange}`} />
                ))}
              </GroupedList>
            )}
            <GroupedList header="Now" inset="16px">
              {now.map((n) => (
                <Row key={n.label} title={n.label} subtitle={n.detail} />
              ))}
            </GroupedList>
          </div>
        </div>
      </Section>

      <Section id="tools" title="Tools">
        <GroupedList>
          {tools.map((t) => (
            <div key={t.group} className="px-4 py-3.5 sm:flex sm:gap-6">
              <div className="text-subhead font-semibold text-label sm:w-40 sm:shrink-0">{t.group}</div>
              <div className="mt-0.5 text-subhead text-label2 sm:mt-0">{t.items.join(', ')}</div>
            </div>
          ))}
        </GroupedList>
      </Section>

      {cv.certifications?.length > 0 && (
        <Section id="certifications" title="Certifications">
          <GroupedList>
            {cv.certifications.map((c) => (
              <Row key={c._id || c.name} href={c.url || undefined} title={c.name} subtitle={c.issuer} />
            ))}
          </GroupedList>
        </Section>
      )}

      <Section id="contact" className="text-center">
        <div className="rounded-card bg-elevated px-6 py-10 md:py-14">
          <h2 className="text-title1 font-bold">Let’s talk.</h2>
          <p className="mx-auto mt-2 max-w-reading text-body text-label2">{profile.availability}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button href={`mailto:${cv.email}`}>
              <Glyph name="envelope" className="h-4 w-4" weight={2} /> Email me
            </Button>
            <Button to="/contact" variant="gray">Send a message</Button>
          </div>
        </div>
      </Section>
    </Page>
  );
};

export default HomePage;
