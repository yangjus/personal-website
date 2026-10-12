import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useSmoothScroll(prefersReducedMotion: boolean) {
  useEffect(() => {
    if (prefersReducedMotion) {
      return
    }

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      syncTouch: false,
    })

    const updateScrollTrigger = () => ScrollTrigger.update()
    const onTick = (time: number) => {
      lenis.raf(time * 1000)
    }

    lenis.on('scroll', updateScrollTrigger)
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)
    ScrollTrigger.refresh()

    return () => {
      gsap.ticker.remove(onTick)
      lenis.off('scroll', updateScrollTrigger)
      lenis.destroy()
      ScrollTrigger.refresh()
    }
  }, [prefersReducedMotion])
}
