'use client';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

export function AnimatedHeading({ lines, as: Tag = 'h2', className = '' }: {
  lines: ReactNode[]; as?: 'h2' | 'h3'; className?: string;
}) {
  const reduced = useReducedMotion();
  return <Tag className={`animated-heading ${className}`}>
    {lines.map((line, index) => <motion.span className="heading-mask" key={index}
      initial="hidden" whileInView="visible" viewport={{ once: true, amount: .2 }}>
      <motion.span variants={{ hidden: { y: reduced ? 0 : '105%' }, visible: { y: 0 } }}
        transition={{ duration: reduced ? 0 : .9, delay: reduced ? 0 : index * .1, ease: [.22, 1, .36, 1] }}>
        {line}{index < lines.length - 1 ? ' ' : ''}
      </motion.span>
    </motion.span>)}
  </Tag>;
}

export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={{ opacity: 0, y: reduced ? 0 : 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }}
    transition={{ duration: reduced ? 0 : 0.8, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}
export function Parallax({ children, className = '', distance = 50 }: { children: ReactNode; className?: string; distance?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  return <motion.div ref={ref} className={className} style={{ y: reduced ? 0 : y }}>{children}</motion.div>;
}
