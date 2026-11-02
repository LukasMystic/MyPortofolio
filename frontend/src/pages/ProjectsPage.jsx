import { useMemo, useState } from 'react';
import { useTranslation } from '../context/TranslationContext';
import SEO from '../components/SEO';
import ProjectCard from '../components/ProjectCard';
import AcademyApps from '../components/AcademyApps';
import { Page, LargeTitle, Section, SegmentedControl, ActivityIndicator } from '../components/ui';

const ProjectsPage = () => {
  const { content, isTranslating } = useTranslation();
  const [sortOrder, setSortOrder] = useState('featured');

  const projects = useMemo(() => {
    const list = [...(content?.projects || [])];
    return list.sort((a, b) => {
      if (sortOrder === 'featured' && a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
      const diff = new Date(b.createdAt) - new Date(a.createdAt);
      return sortOrder === 'oldest' ? -diff : diff;
    });
  }, [content?.projects, sortOrder]);

  if (!content || isTranslating) return <ActivityIndicator />;

  const name = content.cv?.fullName || 'Portfolio';

  return (
    <Page>
      <SEO
        title={`Work | ${name}`}
        description={`iOS apps from the Apple Developer Academy, machine learning research and full-stack projects by ${name}.`}
        name={name}
        type="website"
        url="https://stanleypt.vercel.app/projects"
        imageUrl={content.cv?.profilePictureUrl}
      />

      <LargeTitle
        title="Work"
        subtitle="Apps for Apple platforms, machine learning research, and the web products around them."
      />

      <Section id="apple" title="Apple platforms">
        <AcademyApps />
      </Section>

      <Section
        id="projects"
        title="Research and web"
        action={
          <span className="hidden text-subhead text-label2 sm:inline">
            {projects.length} project{projects.length === 1 ? '' : 's'}
          </span>
        }
      >
        <SegmentedControl
          label="Sort projects"
          className="mb-4"
          value={sortOrder}
          onChange={setSortOrder}
          options={[
            { value: 'featured', label: 'Featured' },
            { value: 'newest', label: 'Newest' },
            { value: 'oldest', label: 'Oldest' },
          ]}
        />
        {projects.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <ProjectCard key={p._id} project={p} />
            ))}
          </div>
        ) : (
          <p className="rounded-card bg-elevated px-4 py-10 text-center text-subhead text-label2">No projects yet.</p>
        )}
      </Section>
    </Page>
  );
};

export default ProjectsPage;
