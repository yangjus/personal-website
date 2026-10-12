import { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react'
import { Navbar } from './components/Navbar'
import { ProjectCard } from './components/ProjectCard'
import { SectionShell } from './components/SectionShell'
import { portfolioContent, sectionOrder } from './data/siteContent'
import { useCityDriveMotion } from './hooks/useCityDriveMotion'
import { useDevicePerformance } from './hooks/useDevicePerformance'
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion'
import { useSmoothScroll } from './hooks/useSmoothScroll'

const routeStops = {
  home: 'Start Point // Neon Overlook',
  experience: 'Stop 01 // Career District',
  projects: 'Stop 02 // Builder Avenue',
  about: 'Stop 03 // Human Side Street',
  contact: 'Final Stop // Connection Terminal',
} as const

const PortfolioScene = lazy(async () => {
  const module = await import('./scene/PortfolioScene')

  return { default: module.PortfolioScene }
})

function App() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
  const driveProgressRef = useRef(0)
  const device = useDevicePerformance()
  const [activeSection, setActiveSection] =
    useState<(typeof sectionOrder)[number]>('home')

  useSmoothScroll(prefersReducedMotion)
  useCityDriveMotion({ prefersReducedMotion, progressRef: driveProgressRef, rootRef })

  useEffect(() => {
    const sections = sectionOrder
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section))

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (visibleSection?.target.id) {
          setActiveSection(visibleSection.target.id as (typeof sectionOrder)[number])
        }
      },
      {
        rootMargin: '-30% 0px -45% 0px',
        threshold: [0.2, 0.35, 0.5, 0.7],
      },
    )

    sections.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [])

  const navigate = (id: (typeof sectionOrder)[number]) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' })
  }

  const featuredExperience = useMemo(
    () => portfolioContent.experience.slice(0, 3),
    [],
  )

  return (
    <div ref={rootRef} className="app-shell">
      <div className="scene-shell city-stage" aria-hidden="true">
        <div className="scene-gradient" />
        <Suspense fallback={null}>
          <PortfolioScene
            device={device}
            prefersReducedMotion={prefersReducedMotion}
            progressRef={driveProgressRef}
          />
        </Suspense>
        <div className="scene-bloom scene-bloom-left" />
        <div className="scene-bloom scene-bloom-right" />
        <div className="scene-scanlines" />
        <div className="windshield-frame windshield-left" />
        <div className="windshield-frame windshield-right" />
        <div className="windshield-top" />
        <div className="dashboard-hud">
          <span>Night Route // Active</span>
          <span>City Depth // Controlled By Scroll</span>
          <span>Engine // Three.js + GSAP</span>
        </div>
        <div className="car-shell">
          <div className="car-body">
            <span className="car-light car-light-left" />
            <span className="car-light car-light-right" />
            <span className="car-light car-light-center" />
          </div>
        </div>
        <div className="scene-vignette" />
      </div>

      <div className="progress-rail">
        {portfolioContent.navigation.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={activeSection === item.id ? 'is-active' : ''}
            onClick={() => navigate(item.id)}
            aria-label={`Jump to ${item.label}`}
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
          </button>
        ))}
      </div>

      <Navbar
        activeSection={activeSection}
        onNavigate={navigate}
        links={portfolioContent.navigation}
      />

      <main className="site-shell">
        <section id="home" className="hero-section">
          <div className="hero-grid">
            <div className="hero-copy">
              <div className="eyebrow">
                <span className="eyebrow-dot" />
                {routeStops.home}
              </div>
              <p className="hero-intro">Software Engineer // Product Builder</p>
              <h1 className="hero-name">
                JUSTIN
                <br />
                YANG<span>.</span>
              </h1>
              <h2 className="hero-role">
                Scroll forward through a neon city and stop at the teams, products,
                and projects that shaped how I build.
              </h2>
              <p className="hero-summary">{portfolioContent.hero.summary}</p>

              <div className="hero-actions">
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => navigate('experience')}
                >
                  Start the route
                </button>
                <a
                  className="secondary-button"
                  href={portfolioContent.links.legacySite}
                  target="_blank"
                  rel="noreferrer"
                >
                  View legacy portfolio
                </a>
              </div>

              <div className="hero-marquee" role="list" aria-label="Selected companies">
                {portfolioContent.hero.badges.map((badge) => (
                  <span key={badge} role="listitem">
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            <aside className="hero-panel story-panel">
              <div className="panel-label">Upcoming stops</div>
              <p>
                The city now runs as a real Three.js street scene. Scroll drives the
                camera deeper into the district while the portfolio chapters arrive
                like lit checkpoints along the route.
              </p>
              <div className="panel-stats">
                {featuredExperience.map((item) => (
                  <article key={item.company}>
                    <span>{item.company}</span>
                    <strong>{item.shortImpact}</strong>
                  </article>
                ))}
              </div>
            </aside>
          </div>

          <div className="scroll-cue">
            <span>Scroll to drive the city forward</span>
          </div>
        </section>

        <SectionShell
          className="stop-panel stop-left"
          id="experience"
          label="Chapter 02"
          stop={routeStops.experience}
          title="Experience"
          intro="The first major stop on the route: product teams, internal tools, and systems work across mobile, security, and full-stack platforms."
        >
          <div className="experience-grid">
            {portfolioContent.experience.map((item) => (
              <article key={`${item.company}-${item.period}`} className="experience-card">
                <div className="experience-meta">
                  <span>{item.period}</span>
                  <span>{item.location}</span>
                </div>
                <h3>
                  {item.role}
                  <span>{item.company}</span>
                </h3>
                <p>{item.summary}</p>
                <ul>
                  {item.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
                <div className="chip-row" aria-label={`${item.company} technologies`}>
                  {item.technologies.map((tech) => (
                    <span key={tech} className="chip">
                      {tech}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </SectionShell>

        <SectionShell
          className="stop-panel stop-right"
          id="projects"
          label="Chapter 03"
          stop={routeStops.projects}
          title="Projects"
          intro="The builder stop: a tighter set of projects showing product judgment, technical range, and a bias toward things people actually use."
        >
          <div className="project-grid">
            {portfolioContent.projects.map((project) => (
              <ProjectCard key={project.name} project={project} />
            ))}
          </div>
        </SectionShell>

        <SectionShell
          className="stop-panel stop-left"
          id="about"
          label="Chapter 04"
          stop={routeStops.about}
          title="About"
          intro="A quieter stop in the route: how Justin thinks about building, what tools he reaches for, and what keeps him curious beyond the work itself."
        >
          <div className="about-grid">
            <article className="about-card portrait-card">
              <img
                src="/images/headshot.jpg"
                alt="Justin Yang portrait"
                className="portrait"
              />
              <div>
                <h3>Builder mentality</h3>
                <p>{portfolioContent.about.overview}</p>
              </div>
            </article>

            <article className="about-card">
              <h3>What I enjoy building</h3>
              <p>{portfolioContent.about.interests}</p>
            </article>

            <article className="about-card">
              <h3>Toolkit</h3>
              <div className="stack-columns">
                {portfolioContent.about.toolkit.map((group) => (
                  <div key={group.title}>
                    <h4>{group.title}</h4>
                    <ul>
                      {group.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </article>

            <article className="about-card">
              <h3>Off the clock</h3>
              <p>{portfolioContent.about.personal}</p>
            </article>
          </div>
        </SectionShell>

        <SectionShell
          className="stop-panel stop-right"
          id="contact"
          label="Finale"
          stop={routeStops.contact}
          title="Let's build something thoughtful."
          intro="The route ends with the essentials: where to find Justin, what to click next, and a direct way to continue the conversation."
        >
          <div className="contact-card">
            <div>
              <p className="contact-lead">
                Open to product-focused software engineering work, collaborative
                side-projects, and conversations about building polished experiences
                that still perform at scale.
              </p>
            </div>

            <div className="contact-actions">
              <a href={portfolioContent.links.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              <a href={portfolioContent.links.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a href={portfolioContent.links.medium} target="_blank" rel="noreferrer">
                Medium
              </a>
              <a href={portfolioContent.links.legacySite} target="_blank" rel="noreferrer">
                Legacy site
              </a>
            </div>
          </div>
        </SectionShell>
      </main>
    </div>
  )
}

export default App
