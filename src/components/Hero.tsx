'use client';
import dynamic from 'next/dynamic';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowUpRight, MoveDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
const Earth = dynamic(() => import('@/scene/Earth'), { ssr: false });

const stars = [
  [6, 17, 2], [15, 24, 1], [23, 13, 2], [31, 21, 1.5],
  [43, 14, 1], [54, 20, 2], [63, 12, 1.5], [74, 22, 1],
  [87, 15, 2], [94, 26, 1.5], [11, 35, 1], [27, 31, 2],
  [79, 34, 1.5], [91, 43, 1], [5, 51, 1.5], [18, 58, 2],
  [84, 55, 1], [96, 62, 2], [9, 72, 1], [29, 77, 1.5],
  [70, 69, 2], [88, 79, 1.5],
] as const;
const sparkles = [[9, 25], [36, 15], [81, 19], [92, 57]] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [interactive, setInteractive] = useState(false);
  useEffect(() => { setInteractive(window.matchMedia('(pointer: fine)').matches); }, []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const scale = useTransform(scrollYProgress, [0, .15, .8, 1], [1, .96, .38, .24]);
  const x = useTransform(scrollYProgress, [0, 1], ['0vw', '10vw']);
  const y = useTransform(scrollYProgress, [0, 1], ['0vh', '-38vh']);
  const opacity = useTransform(scrollYProgress, [0, .6, 1], [1, .8, 0]);
  const copyOpacity = useTransform(scrollYProgress, [0, .18, .72], [1, 1, 0]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -110]);
  const starsY = useTransform(scrollYProgress, [0, 1], [0, -55]);
  const starsOpacity = useTransform(scrollYProgress, [0, .6, 1], [1, .65, 0]);
  const orbitRotate = useTransform(scrollYProgress, [0, 1], [0, -16]);
  useEffect(() => {
    const section = ref.current;
    if (!section || reduced !== false) return;
    const copy = section.querySelector<HTMLElement>('.hero-copy');
    const bottom = section.querySelector<HTMLElement>('.hero-bottom');
    const update = (progress: number) => {
      section.dataset.orbitState = progress >= .995 ? 'gone' : progress > 0 ? 'leaving' : 'home';
      if (copy) copy.inert = progress >= .72;
      if (bottom) bottom.inert = progress >= .72;
    };
    update(scrollYProgress.get());
    const unlisten = scrollYProgress.on('change', update);
    return () => { unlisten(); delete section.dataset.orbitState; if (copy) copy.inert = false; if (bottom) bottom.inert = false; };
  }, [reduced, scrollYProgress]);
  return <section id="home" ref={ref} className="hero" data-atmosphere="#427f8e" data-transition="leave-orbit">
    <div className="hero-stage">
    <motion.div className="hero-stars" aria-hidden="true" style={{ y: reduced ? 0 : starsY, opacity: reduced ? 1 : starsOpacity }}>
      {stars.map(([left, top, size], index) => <span key={`star-${index}`} className="hero-star" style={{ left: `${left}%`, top: `${top}%`, width: size, height: size, opacity: .25 + (index % 4) * .1 }}/>) }
      {sparkles.map(([left, top], index) => <span key={`sparkle-${index}`} className="hero-star hero-sparkle" style={{ left: `${left}%`, top: `${top}%` }}/>) }
    </motion.div>
    <motion.div className="hero-universe" style={{ x: reduced ? 0 : x, y: reduced ? 0 : y, scale: reduced ? 1 : scale, opacity: reduced ? 1 : opacity }}>
      <div className="earth-aura" aria-hidden="true" /><div className="earth-fallback" aria-hidden="true"><div className="earth-surface" /><div className="earth-location-fallback" /><div className="earth-waves" /><div className="earth-clouds" /><i className="earth-gull gull-one" /><i className="earth-gull gull-two" /></div>
      {interactive && reduced === false && <Earth exitProgress={scrollYProgress} />}
      <motion.div className="hero-orbits" aria-hidden="true" style={{ rotate: reduced ? 0 : orbitRotate }}><div className="orbit orbit-one" /><div className="orbit orbit-two" /></motion.div>
    </motion.div>
    <motion.div className="hero-copy" style={{ y: reduced ? 0 : copyY, opacity: reduced ? 1 : copyOpacity }}>
      <motion.h1 initial={false} animate={{ opacity: 1 }} transition={{ duration: 1 }}>Justin Yang</motion.h1>
      <div className="hero-actions flex justify-center"><a href="#projects" className="button button-light">See what I’ve built <ArrowDown size={16} /></a><a href="#about" className="button button-ghost">About me <ArrowUpRight size={16} /></a></div>
    </motion.div>
    <motion.div className="hero-bottom container" style={{ opacity: reduced ? 1 : copyOpacity }}><a href="#about" className="scroll-hint"><span className="scroll-icon"><MoveDown size={16} /></span><span className="micro">SCROLL DOWN</span></a><span className="micro hero-index">00 / 05</span></motion.div>
    </div>
  </section>;
}
