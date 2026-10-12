'use client';

import { animate, createScope, onScroll, stagger } from 'animejs';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

const Moon = dynamic(() => import('@/scene/Moon'), { ssr: false });

const craters = [
  { x: 485, y: 225, rx: 48, ry: 26, rotate: -24 },
  { x: 685, y: 160, rx: 29, ry: 16, rotate: -6 },
  { x: 850, y: 265, rx: 62, ry: 43, rotate: 18 },
  { x: 560, y: 405, rx: 83, ry: 57, rotate: -12 },
  { x: 1030, y: 405, rx: 42, ry: 63, rotate: -32 },
  { x: 745, y: 470, rx: 31, ry: 25, rotate: 12 },
  { x: 360, y: 430, rx: 19, ry: 36, rotate: 27 },
];

export function ContactMoon() {
  const ref = useRef<HTMLDivElement>(null);
  const rocketControl = useRef<HTMLButtonElement>(null);
  const [nearby, setNearby] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const section = ref.current?.closest('section');
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setNearby(true); observer.disconnect(); }
    }, { rootMargin: '300px' });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const root = ref.current;
    const section = root?.closest('section');
    if (!root || !section) return;

    const scope = createScope({ root, mediaQueries: { reduceMotion: '(prefers-reduced-motion: reduce)' } }).add(self => {
      if (!self || self.matches.reduceMotion) return;
      animate('.contact-moon-art', {
        y: [90, 0],
        ease: 'out(3)',
        autoplay: onScroll({ target: section, enter: 'bottom top', leave: 'bottom bottom', sync: .65 }),
      });
      if (ready) return;

      const drift = animate('.moon-drift', {
        y: [0, -8], rotate: [-.6, .6],
        duration: 6500, ease: 'inOutSine', alternate: true, loop: true, autoplay: false,
      });
      const rocket = animate('.moon-rocket-body', {
        y: [0, -5], rotate: [-1.5, 1.5],
        duration: 2800, ease: 'inOutSine', alternate: true, loop: true, autoplay: false,
      });
      const stars = animate('.moon-stars > *', {
        opacity: [.35, 1], scale: [.85, 1.08],
        delay: stagger(230), duration: 2100, ease: 'inOutSine', alternate: true, loop: true, autoplay: false,
      });

      // Only run the ambient loops while this section is on screen.
      const observer = new IntersectionObserver(([entry]) => {
        for (const animation of [drift, rocket, stars]) {
          if (entry.isIntersecting) animation.resume();
          else animation.pause();
        }
      });
      observer.observe(section);
      return () => observer.disconnect();
    });

    return () => scope.revert();
  }, [ready]);

  return <><div ref={ref} className="contact-moon" aria-hidden="true">
    <div className="contact-moon-art" data-ready={ready}>
    {nearby && <Moon onReady={setReady} controlRef={rocketControl} />}
    <svg className="contact-moon-fallback" viewBox="0 0 1440 1040" fill="none">
      <defs>
        <linearGradient id="contact-moon-fill" x1="490" y1="100" x2="970" y2="670" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ede8ed" /><stop offset=".48" stopColor="#c5bfdb" /><stop offset="1" stopColor="#8f86b5" />
        </linearGradient>
        <clipPath id="contact-moon-clip"><circle cx="720" cy="560" r="480" /></clipPath>
      </defs>
      <g className="moon-stars" fill="#e9dfc7">
        <path d="M339 97L344 112L359 117L344 122L339 137L334 122L319 117L334 112Z" />
        <path d="M1095 210L1099 221L1110 225L1099 229L1095 240L1091 229L1080 225L1091 221Z" />
        <path d="M810 26L813 34L821 37L813 40L810 48L807 40L799 37L807 34Z" />
        <circle cx="443" cy="53" r="3" /><circle cx="1024" cy="65" r="3" /><circle cx="1187" cy="360" r="2.5" /><circle cx="270" cy="277" r="2.5" />
      </g>
      <g className="moon-drift">
      <circle cx="720" cy="560" r="480" fill="url(#contact-moon-fill)" stroke="#6f688e" strokeWidth="5" />
      <g clipPath="url(#contact-moon-clip)">
        <path d="M1060 197C1170 452 955 705 655 709C456 712 328 629 267 513C312 824 676 1064 1006 932C1320 806 1313 402 1060 197Z" fill="#827aa5" opacity=".26" />
        <path d="M350 310C430 177 580 106 744 104" stroke="#fff8ee" strokeWidth="11" strokeLinecap="round" opacity=".45" />
        {craters.map(crater => <g key={crater.x} transform={`rotate(${crater.rotate} ${crater.x} ${crater.y})`}>
          <ellipse cx={crater.x} cy={crater.y} rx={crater.rx} ry={crater.ry} fill="#a59cbd" stroke="#8f85a9" strokeWidth="3" />
          <ellipse cx={crater.x + 3} cy={crater.y + 5} rx={crater.rx * .77} ry={crater.ry * .69} fill="#bdb4cf" />
          <path d={`M${crater.x - crater.rx * .7} ${crater.y + crater.ry * .68}Q${crater.x} ${crater.y + crater.ry * 1.18} ${crater.x + crater.rx * .72} ${crater.y + crater.ry * .62}`} stroke="#f0e9ed" strokeWidth="3" strokeLinecap="round" opacity=".6" />
        </g>)}
        <g fill="#9a90b0" opacity=".7"><circle cx="620" cy="280" r="7" /><circle cx="646" cy="296" r="4" /><circle cx="942" cy="344" r="6" /><circle cx="470" cy="330" r="5" /><circle cx="787" cy="358" r="4" /></g>
      </g>
      <g className="moon-rocket" transform="translate(920 117) rotate(24)">
        <ellipse cx="0" cy="24" rx="50" ry="9" fill="#776d97" opacity=".35" />
        <g className="moon-rocket-body" stroke="#635c79" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round">
          <path d="M-20-38C-41-30-44-7-41 10L-16-2Z" fill="#e99c90" />
          <path d="M20-38C41-30 44-7 41 10L16-2Z" fill="#e99c90" />
          <path d="M-23-21C-31-61-18-92 0-111C18-92 31-61 23-21L15 5H-15Z" fill="#fff1d9" />
          <path d="M-18-86Q-10-101 0-111Q10-101 18-86Q0-76-18-86Z" fill="#ec9c8e" />
          <path d="M-21-19H21L15 5H-15Z" fill="#ded1cf" />
          <circle cy="-56" r="14" fill="#78bdcb" /><path d="M-7-60Q-3-66 4-65" stroke="#e6f8f4" />
          <path d="M0-23V13" stroke="#cf897f" strokeWidth="7" />
          <path d="M-17 4L-23 23M17 4L23 23M-28 23H-17M17 23H28" />
        </g>
      </g>
      </g>
    </svg>
    </div>
  </div><button ref={rocketControl} type="button" className="rocket-launch" aria-label="Launch rocket" disabled={!ready} data-positioned="false" data-launch-state="ready"><span className="rocket-hint" aria-hidden="true">↗ &nbsp; CLICK TO LAUNCH</span></button></>;
}
