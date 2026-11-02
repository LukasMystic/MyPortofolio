import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import SEO from '../components/SEO';
import Glyph from '../components/Glyph';
import ProjectCard from '../components/ProjectCard';
import { Page, Section, Button, ActivityIndicator } from '../components/ui';
import { plainText } from '../lib/text';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const youTubeId = (url = '') => {
  const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
  return match && match[2].length === 11 ? match[2] : null;
};

// Normalise CKEditor output so it reads like the rest of the site. Styling lives
// in .rich-text (index.css); this only fixes structure CSS cannot reach.
const useNormalisedContent = (ref, html) => {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    root.querySelectorAll('oembed[url]').forEach((embed) => {
      const id = youTubeId(embed.getAttribute('url'));
      if (!id) return;
      const wrap = document.createElement('div');
      wrap.className = 'video';
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${id}`;
      iframe.title = 'Video';
      iframe.allow = 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      iframe.loading = 'lazy';
      wrap.appendChild(iframe);
      (embed.closest('figure.media') || embed).replaceWith(wrap);
    });

    root.querySelectorAll('table').forEach((table) => {
      if (table.parentElement?.classList.contains('table-wrap')) return;
      const wrap = document.createElement('div');
      wrap.className = 'table-wrap';
      table.parentNode.insertBefore(wrap, table);
      wrap.appendChild(table);
    });

    // CKEditor spaces content with empty paragraphs; spacing comes from CSS instead.
    root.querySelectorAll('p').forEach((p) => {
      if (!p.querySelector('img, iframe, video') && !p.textContent.replace(/\u00a0/g, '').trim()) p.remove();
    });

    root.querySelectorAll('img').forEach((img) => {
      img.loading = 'lazy';
      img.removeAttribute('align');
      img.style.removeProperty('float');
    });

    root.querySelectorAll('a[href^="http"]').forEach((a) => {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    });
  }, [ref, html]);
};

const ProjectDetailPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [related, setRelated] = useState([]);
  const [status, setStatus] = useState('loading');
  const bodyRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    let cancelled = false;
    (async () => {
      setStatus('loading');
      try {
        const [{ data: current }, { data: all }] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/projects/${id}`),
          axios.get(`${API_BASE_URL}/api/projects`),
        ]);
        if (cancelled) return;
        setProject(current);
        setRelated(all.filter((p) => p._id !== current._id && p.isFeatured).slice(0, 3));
        setStatus('ready');
      } catch (err) {
        console.error('Failed to fetch project:', err);
        if (!cancelled) setStatus('error');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  useNormalisedContent(bodyRef, project?.description);

  if (status === 'loading') return <ActivityIndicator />;

  if (status === 'error' || !project) {
    return (
      <Page className="text-center">
        <h1 className="mt-16 text-title1 font-bold">Project not found</h1>
        <p className="mt-2 text-body text-label2">It may have been moved or removed.</p>
        <Button to="/projects" className="mt-6">See all work</Button>
      </Page>
    );
  }

  const published = new Date(project.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

  return (
    <Page>
      <SEO
        title={`${project.title} | Stanley Pratama Teguh`}
        description={plainText(project.shortDescription).slice(0, 160)}
        type="article"
        url={`https://stanleypt.vercel.app/project/${project._id}`}
        imageUrl={project.thumbnailUrl}
      />

      <Link to="/projects" className="-ml-1 inline-flex min-h-[44px] items-center gap-0.5 text-callout text-tint hover:underline">
        <Glyph name="chevron.left" className="h-5 w-5" weight={2.25} />
        Work
      </Link>

      <article className="mt-2">
        <header className="max-w-reading">
          <p className="text-subhead text-label2">{published}</p>
          <h1 className="mt-1 text-large-title font-bold md:text-[44px] md:leading-[52px] md:tracking-[-0.01em]">{project.title}</h1>
        </header>

        {project.thumbnailUrl && (
          <img src={project.thumbnailUrl} alt="" className="mt-8 aspect-[16/9] w-full rounded-card bg-fill object-cover" />
        )}

        <div className="mt-8 rounded-card bg-elevated px-5 py-6 md:px-10 md:py-10">
          <div ref={bodyRef} className="rich-text mx-auto max-w-reading" dangerouslySetInnerHTML={{ __html: project.description }} />
        </div>
      </article>

      {related.length > 0 && (
        <Section title="More work">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProjectCard key={p._id} project={p} />
            ))}
          </div>
        </Section>
      )}
    </Page>
  );
};

export default ProjectDetailPage;
