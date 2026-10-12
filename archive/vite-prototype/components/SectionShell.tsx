import type { PropsWithChildren } from 'react'

interface SectionShellProps extends PropsWithChildren {
  className?: string
  id: string
  label: string
  stop?: string
  title: string
  intro: string
}

export function SectionShell({
  className,
  id,
  label,
  stop,
  title,
  intro,
  children,
}: SectionShellProps) {
  return (
    <section id={id} className={`content-section ${className ?? ''}`.trim()}>
      <div className="section-header">
        <div className="section-meta">
          <span className="section-label">{label}</span>
          {stop ? <span className="section-stop">{stop}</span> : null}
        </div>
        <div>
          <h2>{title}</h2>
          <p>{intro}</p>
        </div>
      </div>
      {children}
    </section>
  )
}
