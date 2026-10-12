import type { Project } from '../data/siteContent'

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="project-card">
      <div className="project-image-frame">
        <img src={project.image} alt={project.imageAlt} className="project-image" />
      </div>
      <div className="project-content">
        <div className="project-header">
          <div>
            <span className="project-kicker">{project.kicker}</span>
            <h3>{project.name}</h3>
          </div>
          <span className="project-year">{project.year}</span>
        </div>
        <p>{project.description}</p>
        <div className="chip-row">
          {project.stack.map((tech) => (
            <span key={tech} className="chip">
              {tech}
            </span>
          ))}
        </div>
        <div className="project-links">
          {project.links.map((link) => (
            <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </article>
  )
}
