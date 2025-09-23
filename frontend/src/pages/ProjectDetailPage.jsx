import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SEO from '../components/SEO';
import LoadingSpinner from '../components/LoadingSpinner';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// --- Animation & UI Components ---

const Reveal = ({ children, delay = 0, animation = 'slideUp' }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);
  
  const animationClasses = {
    slideUp: 'transition-all duration-700 ease-out transform',
    visible: 'opacity-100 translate-y-0',
    hidden: 'opacity-0 translate-y-8'
  };

  return (
    <div ref={ref} className={`${animationClasses.slideUp} ${visible ? animationClasses.visible : animationClasses.hidden}`}>
      {children}
    </div>
  );
};

const AnimatedBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950" />
    <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-purple-200/30 rounded-full filter blur-3xl opacity-50 animate-blob dark:bg-purple-900/20" />
    <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-cyan-200/30 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-4000 dark:bg-cyan-900/20" />
  </div>
);

// --- Page-Specific Components ---

const HeroImage = ({ src, alt, title }) => {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="relative h-96 overflow-hidden rounded-t-3xl">
            <img 
              src={src} 
              alt={alt} 
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-75 ease-out"
              style={{ transform: `translateY(${scrollY * 0.2}px) scale(${1 + scrollY * 0.0001})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8">
                <h1 className="text-4xl md:text-5xl font-black text-white leading-tight drop-shadow-lg">
                    {title}
                </h1>
            </div>
        </div>
    );
};

const ProjectMeta = ({ date }) => (
    <Reveal delay={100}>
        <div className="mb-8 flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <span>Posted on {new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
    </Reveal>
);

const ProjectContent = ({ description }) => {
    const contentRef = useRef(null);

    useEffect(() => {
        if (!contentRef.current) return;

        // Process media embeds (YouTube, etc.)
        const processMediaEmbeds = () => {
            const mediaElements = contentRef.current.querySelectorAll('oembed[url]');
            
            mediaElements.forEach(embed => {
                const url = embed.getAttribute('url');
                
                if (url.includes('youtube.com/watch') || url.includes('youtu.be/')) {
                    const videoId = extractYouTubeId(url);
                    if (videoId) {
                        const iframe = document.createElement('div');
                        iframe.className = 'relative w-full aspect-video my-6 rounded-lg overflow-hidden shadow-lg';
                        iframe.innerHTML = `
                            <iframe 
                                class="absolute inset-0 w-full h-full"
                                src="https://www.youtube.com/embed/${videoId}" 
                                title="YouTube video player" 
                                frameborder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                allowfullscreen
                            ></iframe>
                        `;
                        embed.replaceWith(iframe);
                    }
                }
            });
        };

        // Process text alignment from CKEditor
        const processTextAlignment = () => {
            const elementsWithStyles = contentRef.current.querySelectorAll('[style*="text-align"]');
            elementsWithStyles.forEach(element => {
                const style = element.getAttribute('style');
                if (style) {
                    if (style.includes('text-align: center')) element.classList.add('text-center');
                    else if (style.includes('text-align: right')) element.classList.add('text-right');
                    else if (style.includes('text-align: justify')) element.classList.add('text-justify');
                    else if (style.includes('text-align: left')) element.classList.add('text-left');
                }
            });

            const centerElements = contentRef.current.querySelectorAll('.ck-align-center');
            centerElements.forEach(el => el.classList.add('text-center'));

            const rightElements = contentRef.current.querySelectorAll('.ck-align-right');
            rightElements.forEach(el => el.classList.add('text-right'));
        };
        
        // --- NEW: Process image alignment ---
        const processImages = () => {
            const figures = contentRef.current.querySelectorAll('figure.image');
            figures.forEach(figure => {
                // Clear any existing floats and margins before applying new ones
                figure.style.float = 'none';
                figure.style.marginLeft = 'auto';
                figure.style.marginRight = 'auto';
                figure.style.display = 'block';

                if (figure.classList.contains('ck-align-center')) {
                    figure.style.textAlign = 'center';
                } else if (figure.classList.contains('ck-align-right')) {
                    figure.style.float = 'right';
                    figure.style.marginLeft = '1.5em';
                    figure.style.marginRight = '0';
                } else if (figure.classList.contains('ck-align-left')) {
                    figure.style.float = 'left';
                    figure.style.marginRight = '1.5em';
                    figure.style.marginLeft = '0';
                }
            });
        };

        // --- MODIFIED: Process tables for styling AND alignment ---
        const processTables = () => {
            const tables = contentRef.current.querySelectorAll('table');
            tables.forEach(table => {
                // --- Alignment Logic ---
                const figure = table.closest('figure.table'); 
                if (figure) {
                    if (figure.classList.contains('ck-align-center')) {
                       figure.style.display = 'flex';
                       figure.style.justifyContent = 'center';
                    } else if (figure.classList.contains('ck-align-right')) {
                       figure.style.float = 'right';
                    } else if (figure.classList.contains('ck-align-left')) {
                       figure.style.float = 'left';
                    }
                }

                // --- Styling Logic ---
                if (!table.parentElement.classList.contains('table-container')) {
                    const wrapper = document.createElement('div');
                    wrapper.className = 'table-container overflow-x-auto my-6 rounded-lg border border-slate-200 dark:border-slate-700';
                    table.parentNode.insertBefore(wrapper, table);
                    wrapper.appendChild(table);
                }
                
                table.className = 'min-w-full divide-y divide-slate-200 dark:divide-slate-700';
                
                const thead = table.querySelector('thead');
                if (thead) {
                    thead.className = 'bg-slate-50 dark:bg-slate-800';
                    thead.querySelectorAll('th').forEach(th => {
                        th.className = 'px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider border border-slate-200 dark:border-slate-700';
                    });
                }
                
                const tbody = table.querySelector('tbody');
                if (tbody) {
                    tbody.className = 'bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700';
                    tbody.querySelectorAll('tr').forEach((row, index) => {
                        row.className = index % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50 dark:bg-slate-800';
                        row.querySelectorAll('td').forEach(td => {
                            td.className = 'px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700';
                        });
                    });
                }
            });
        };

        // --- Call all processing functions ---
        processMediaEmbeds();
        processTextAlignment();
        processImages();
        processTables();

    }, [description]);

    const extractYouTubeId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    return (
        <Reveal delay={200}>
            <div
                ref={contentRef}
                className="project-content prose prose-lg max-w-none text-slate-700 dark:prose-invert dark:text-slate-300 leading-relaxed
                           prose-headings:text-slate-800 dark:prose-headings:text-slate-100
                           prose-a:text-blue-600 dark:prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
                           prose-strong:text-slate-800 dark:prose-strong:text-slate-100
                           prose-code:text-slate-800 dark:prose-code:text-slate-100 prose-code:bg-slate-100 dark:prose-code:bg-slate-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                           prose-pre:bg-slate-800 dark:prose-pre:bg-slate-900 prose-pre:text-slate-100
                           prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-slate-800 prose-blockquote:px-4 prose-blockquote:py-2
                           prose-img:rounded-lg prose-img:shadow-lg"
                dangerouslySetInnerHTML={{ __html: description }}
            />
        </Reveal>
    );
};

// Helper function to clean HTML and remove unwanted characters
const cleanHtmlContent = (htmlString) => {
    if (!htmlString) return '';
    const withoutTags = htmlString.replace(/<[^>]*>/g, '');
    return withoutTags
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
};

const RelatedProjectCard = ({ project }) => {
    const cleanDescription = cleanHtmlContent(project.shortDescription);
    
    return (
        <Link to={`/project/${project._id}`} className="group block overflow-hidden rounded-2xl border border-slate-200/80 bg-white/60 shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] dark:border-slate-800 dark:bg-slate-900/60">
            <div className="h-48 overflow-hidden">
                <img src={project.thumbnailUrl} alt={project.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
            <div className="p-5">
                <h3 className="font-bold text-slate-800 group-hover:text-blue-600 dark:text-slate-200 dark:group-hover:text-cyan-400 text-lg">{project.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mt-1">{cleanDescription}</p>
            </div>
        </Link>
    );
};

const CallToAction = () => (
    <Reveal delay={400}>
        <section className="mt-16 text-center rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 p-12 shadow-2xl">
            <h2 className="text-3xl font-black text-white">Interested in Working Together?</h2>
            <p className="text-lg text-white/80 mt-2 mb-6 max-w-xl mx-auto">Let's create something amazing. I'm always excited to take on new challenges.</p>
            <Link to="/contact" className="inline-block rounded-xl bg-white px-8 py-3 font-bold text-blue-600 shadow-lg transition-transform hover:scale-105">
                Get In Touch
            </Link>
        </section>
    </Reveal>
);

// --- Main Page Component ---

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProject = async () => {
      setLoading(true);
      setError(false);
      try {
        const { data: currentProject } = await axios.get(`${API_BASE_URL}/api/projects/${id}`);
        setProject(currentProject);

        const { data: allProjects } = await axios.get(`${API_BASE_URL}/api/projects`);
        setRelatedProjects(
          allProjects
            .filter(p => p._id !== currentProject._id)
            .slice(0, 3)
        );

      } catch (err) {
        setError(true);
        console.error("Failed to fetch project:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) return <div className="flex h-screen items-center justify-center"><LoadingSpinner /></div>;
  
  if (error || !project) {
    return (
        <div className="flex h-screen items-center justify-center text-center p-4">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Project Not Found</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2">The project you're looking for doesn't exist or has been moved.</p>
                <Link to="/projects" className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white">View All Projects</Link>
            </div>
        </div>
    );
  }
  
  const plainShortDescription = cleanHtmlContent(project.shortDescription || '');

  return (
    <>
      <SEO
        title={`${project.title} | Portfolio`}
        description={plainShortDescription}
        type="article"
        url={`YOUR_DOMAIN/project/${project._id}`}
        imageUrl={project.thumbnailUrl}
      />
      <AnimatedBackground />
      
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button onClick={() => navigate(-1)} className="mb-8 inline-flex items-center gap-2 font-semibold text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-cyan-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Projects
        </button>

        <Reveal>
            <article className="overflow-hidden rounded-3xl bg-white/70 backdrop-blur-xl shadow-2xl dark:bg-slate-900/70 dark:border dark:border-slate-800">
                <HeroImage src={project.thumbnailUrl} alt={project.title} title={project.title} />
                <div className="p-8 md:p-12">
                    <ProjectMeta date={project.createdAt} />
                    <ProjectContent description={project.description} />
                </div>
            </article>
        </Reveal>

        {relatedProjects.length > 0 && (
            <Reveal delay={200}>
                <section className="mt-16">
                    <h2 className="text-3xl font-black text-center text-slate-800 dark:text-slate-200 mb-8">More Projects</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {relatedProjects.map(p => <RelatedProjectCard key={p._id} project={p} />)}
                    </div>
                </section>
            </Reveal>
        )}
        
        <CallToAction />
      </main>
    </>
  );
};

export default ProjectDetailPage;