'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

// One shared light source ties the chapters together without repainting on every scroll frame.
export function Atmosphere() {
  const [color, setColor] = useState('#b76e3c');
  const reduced = useReducedMotion();
  const { scrollY, scrollYProgress } = useScroll();
  const opacity = useTransform(scrollY, [0, 500, 900], [0, 0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%']);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const entering = entries.find(entry => entry.isIntersecting);
      if (entering) setColor((entering.target as HTMLElement).dataset.atmosphere ?? '#b76e3c');
    }, { rootMargin: '-35% 0px -45% 0px' });
    document.querySelectorAll('[data-atmosphere]').forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return <div className="page-atmosphere" aria-hidden="true">
    <motion.div className="atmosphere-light" animate={{ backgroundColor: color }}
      transition={{ duration: reduced ? 0 : 1.4 }} style={{ y: reduced ? 0 : y }} />
    <motion.div className="journey-guide" style={{ opacity: reduced ? 0 : opacity }}>
      <span className="journey-track" /><span className="journey-point" />
    </motion.div>
  </div>;
}
