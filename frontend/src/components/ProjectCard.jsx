import { Link } from 'react-router-dom';
import { plainText } from '../lib/text';

// A content card in the style of the App Store's editorial cards:
// image first, one headline, a short secondary line. No motion beyond a highlight.
const ProjectCard = ({ project, headingLevel = 'h3' }) => {
  const Heading = headingLevel;
  return (
  <Link
    to={`/project/${project._id}`}
    className="group flex h-full flex-col overflow-hidden rounded-card bg-elevated transition-colors duration-150 active:bg-fill"
  >
    <div className="aspect-[16/10] overflow-hidden bg-fill">
      {project.thumbnailUrl && (
        <img
          src={project.thumbnailUrl}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-opacity duration-200 group-hover:opacity-90"
        />
      )}
    </div>
    <div className="flex flex-1 flex-col p-4 sm:p-5">
      <Heading className="text-headline font-semibold text-label group-hover:text-tint">{project.title}</Heading>
      <p className="mt-1 line-clamp-3 text-subhead text-label2">{plainText(project.shortDescription)}</p>
    </div>
  </Link>
  );
};

export default ProjectCard;
