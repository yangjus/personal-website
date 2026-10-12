import { useEffect } from 'react'
import type { MutableRefObject, RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface CityDriveMotionOptions {
  prefersReducedMotion: boolean
  progressRef: MutableRefObject<number>
  rootRef: RefObject<HTMLElement | null>
}

export function useCityDriveMotion({
  prefersReducedMotion,
  progressRef,
  rootRef,
}: CityDriveMotionOptions) {
  useEffect(() => {
    const root = rootRef.current

    if (!root) {
      return
    }

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        progressRef.current = 0
        root.style.setProperty('--drive-progress', '0')
        gsap.set('.stop-panel', { autoAlpha: 1, y: 0, x: 0 })
        gsap.set('.hero-copy, .hero-panel', { autoAlpha: 1, y: 0 })
        gsap.set('.dashboard-hud, .scene-vignette, .car-shell', { clearProps: 'all' })
        return
      }

      progressRef.current = 0
      root.style.setProperty('--drive-progress', '0')

      const route = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.1,
          onUpdate: (self) => {
            progressRef.current = self.progress
            root.style.setProperty('--drive-progress', self.progress.toFixed(4))
          },
        },
      })

      route
        .to('.scene-gradient', { scale: 1.08, yPercent: 6, ease: 'none' }, 0)
        .to('.scene-bloom-left', { yPercent: 12, xPercent: -8, ease: 'none' }, 0)
        .to('.scene-bloom-right', { yPercent: -8, xPercent: 8, ease: 'none' }, 0)
        .to('.dashboard-hud', { yPercent: 18, autoAlpha: 0.62, ease: 'none' }, 0)
        .to('.car-shell', { yPercent: 10, ease: 'none' }, 0)
        .to('.scene-vignette', { opacity: 0.88, ease: 'none' }, 0)

      gsap.fromTo(
        '.hero-copy',
        { autoAlpha: 0, y: 48 },
        { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power2.out' },
      )

      gsap.fromTo(
        '.hero-panel',
        { autoAlpha: 0, y: 36 },
        { autoAlpha: 1, y: 0, duration: 0.9, delay: 0.15, ease: 'power2.out' },
      )

      gsap.utils.toArray<HTMLElement>('.stop-panel').forEach((panel) => {
        const isRight = panel.classList.contains('stop-right')

        gsap.fromTo(
          panel,
          {
            autoAlpha: 0.35,
            y: 72,
            x: isRight ? 36 : -36,
          },
          {
            autoAlpha: 1,
            y: 0,
            x: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: panel,
              start: 'top 82%',
              end: 'top 34%',
              scrub: 1,
            },
          },
        )
      })

      gsap.utils.toArray<HTMLElement>('.experience-card, .project-card, .about-card').forEach(
        (card, index) => {
          gsap.fromTo(
            card,
            {
              autoAlpha: 0.45,
              y: 32,
            },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              delay: index % 2 === 0 ? 0 : 0.05,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 88%',
              },
            },
          )
        },
      )
    }, root)

    ScrollTrigger.refresh()

    return () => {
      progressRef.current = 0
      root.style.setProperty('--drive-progress', '0')
      ctx.revert()
    }
  }, [prefersReducedMotion, progressRef, rootRef])
}
