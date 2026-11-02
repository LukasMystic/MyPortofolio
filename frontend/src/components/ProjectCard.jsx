import { Link } from 'react-router-dom';

// Image first, then a title. The write-up lives on the project page.
const ProjectCard = ({ project, headingLevel = 'h3', className = '' }) => {
  const Heading = headingLevel;
  return (
    <Link
      to={`/project/${project._id}`}
      className={`pressable lift group flex h-full flex-col overflow-hidden rounded-card bg-elevated ${className}`}
    >
      <div className="aspect-[16/10] overflow-hidden bg-fill">
        {project.thumbnailUrl && (
          <img src={project.thumbnailUrl} alt="" loading="lazy" className="lift-img h-full w-full object-cover" />
        )}
      </div>
      <div className="flex flex-1 items-start px-4 py-3.5">
        <Heading className="line-clamp-2 text-subhead font-semibold text-label">{project.title}</Heading>
      </div>
    </Link>
  );
};

export default ProjectCard;
