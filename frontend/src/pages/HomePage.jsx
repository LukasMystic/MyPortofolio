import { Link } from 'react-router-dom';
import { useTranslation } from '../context/TranslationContext';
import SEO from '../components/SEO';
import Glyph from '../components/Glyph';
import AcademyApps from '../components/AcademyApps';
import ProjectCard from '../components/ProjectCard';
import ExperienceRow from '../components/Experience';
import { sortExperiences } from '../lib/experience';
import { Page, Section, GroupedList, Button, ActivityIndicator } from '../components/ui';
import { Reveal, CountUp } from '../components/motion';
import { profile, stats, tools } from '../data/profile';
import ResearchList from '../components/ResearchList';

const siteUrl = 'https://stanleypt.vercel.app';

const SeeAll = ({ to, children = 'See all' }) => (
  <Link to={to} className="inline-flex min-h-[44px] items-center gap-0.5 text-callout text-tint hover:underline">
    {children} <Glyph name="chevron.right" className="h-4 w-4" weight={2.25} />
  </Link>
);

const HomePage = () => {
  const { content, isTranslating } = useTranslation();
  if (!content || isTranslating) return <ActivityIndicator />;

  const { cv, featuredProjects = [] } = content;
  const roles = sortExperiences(cv.experiences).filter((e) => e.type === 'Work').slice(0, 3);

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
    <>
      <SEO
        title={`${cv.fullName} — ${profile.role}`}
        description={profile.bio.slice(0, 160)}
        name={cv.fullName}
        type="website"
        imageUrl={cv.profilePictureUrl}
        url={siteUrl}
        keywords={tools.flatMap((t) => t.items).join(', ')}
        author={cv.fullName}
        personSchema={personSchema}
      />

      {/* Hero: centred, a photo, two lines and two buttons. */}
      <section aria-label="Introduction" className="mx-auto flex max-w-content flex-col items-center px-4 pb-6 pt-14 text-center sm:px-6 md:pb-10 md:pt-24">
        {cv.profilePictureUrl && (
          <img
            src={cv.profilePictureUrl}
            alt={cv.fullName}
            className="rise h-24 w-24 rounded-full object-cover shadow-[0_8px_24px_rgba(0,0,0,0.12)] md:h-28 md:w-28"
          />
        )}
        <h1 className="mt-7 whitespace-pre-line text-display font-bold">
          {profile.headline.split('\n').map((line, i) => (
            <span key={line} className="rise block" style={{ animationDelay: `${120 + i * 110}ms` }}>
              {line}
            </span>
          ))}
        </h1>
        <p className="rise mt-5 max-w-reading text-body text-label2 md:text-title3 md:font-normal" style={{ animationDelay: '360ms' }}>
          {profile.intro}
        </p>
        <div className="rise mt-8 flex flex-wrap justify-center gap-3" style={{ animationDelay: '480ms' }}>
          <Button to="/projects">See my work</Button>
          <Button href="/CV.pdf" download="CV-StanleyPratamaTeguh.pdf" variant="gray">
            Download CV
          </Button>
        </div>
      </section>

      <Page className="!pt-0">
        {/* By the numbers */}
        <section aria-label="By the numbers" className="mt-10 grid grid-cols-2 gap-3 md:mt-16 md:grid-cols-4 md:gap-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} index={i} className="rounded-card bg-elevated px-5 py-6">
              <div className="text-[34px] font-bold leading-none tracking-[-0.02em] md:text-[40px]">
                <CountUp value={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-2 text-footnote text-label2">{s.label}</div>
            </Reveal>
          ))}
        </section>

        <Section id="academy" title="Apple Developer Academy" action={<SeeAll to="/projects">All work</SeeAll>}>
          <AcademyApps />
        </Section>

        {featuredProjects.length > 0 && (
          <Section id="work" title="Selected work" action={<SeeAll to="/projects" />}>
            {/* A horizontal shelf, so the page stays short however many projects there are. */}
            <div className="shelf -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 md:gap-4 [--shelf-pad:16px] sm:[--shelf-pad:24px]">
              {featuredProjects.map((p, i) => (
                <Reveal key={p._id} index={i} className="w-[260px] shrink-0 md:w-[300px]">
                  <ProjectCard project={p} />
                </Reveal>
              ))}
            </div>
          </Section>
        )}

        <Section id="research" title="Research">
          <ResearchList />
        </Section>

        {roles.length > 0 && (
          <Section id="experience" title="Experience" action={<SeeAll to="/about">Full history</SeeAll>}>
            <Reveal>
              <GroupedList>
                {roles.map((exp) => (
                  <ExperienceRow key={exp._id || exp.title} exp={exp} />
                ))}
              </GroupedList>
            </Reveal>
          </Section>
        )}

        <Section id="contact">
          <Reveal className="rounded-card bg-elevated px-6 py-12 text-center md:py-16">
            <h2 className="text-title1 font-bold md:text-[40px] md:leading-[48px]">Let’s build something.</h2>
            <p className="mt-2 text-body text-label2">{profile.availability}</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button href={`mailto:${cv.email}`}>Email me</Button>
              <Button to="/contact" variant="gray">Contact</Button>
            </div>
          </Reveal>
        </Section>
      </Page>
    </>
  );
};

export default HomePage;
