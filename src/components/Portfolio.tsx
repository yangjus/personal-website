'use client';
import Image from 'next/image';
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Plus, Minus, MoveUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { Github, Linkedin } from './BrandIcons';
import { companyProfiles, portfolioContent } from '@/data/siteContent';
import { Navbar } from './Navbar';
import { CompanyStrip } from './CompanyStrip';
import { Hero } from './Hero';
import { Projects } from './Projects';
import { AnimatedHeading, Reveal, Parallax } from './Motion';
import { Atmosphere } from './Atmosphere';
import { ContactMoon } from './ContactMoon';
import { HobbyCarousel } from './HobbyCarousel';

function Experience() {
  const [selected,setSelected]=useState<number|null>(null);
  return <section id="experience" className="section experience container" data-atmosphere="#638dc9">
    <Reveal><div className="section-kicker"><span className="micro">03 — EXPERIENCE</span></div><div className="section-heading"><AnimatedHeading lines={["Where I’ve", <span className="muted" key="work">worked</span>]}/></div></Reveal>
    <div className="experience-list">{portfolioContent.experience.map((job,index)=>{
      const tenures=job.tenures??[job];
      const company=companyProfiles.find(profile=>profile.name===job.company);
      return <Reveal key={job.company}><div className={`experience-row ${selected===index?'open':''}`}>
        <button className="experience-trigger" onClick={()=>setSelected(selected===index?null:index)} aria-expanded={selected===index} aria-controls={`job-${index}`}>
          <span className="experience-year micro">{job.tenures ? job.tenures.map(tenure => <span className="experience-period" key={tenure.period}>{tenure.period}</span>) : job.period}{job.current&&<span className="current-role">NOW</span>}</span>
          <span className="experience-company">{job.company}</span>
          <span className="experience-title">{job.role}<span className="micro">{job.location}</span></span>
          <span className="experience-toggle">{selected===index?<Minus size={19}/>:<Plus size={19}/>}</span>
        </button>
        <AnimatePresence initial={false}>{selected===index&&<motion.div id={`job-${index}`} className="experience-panel" initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} transition={{duration:.35}}>
          <div className="experience-tenures">{tenures.map(tenure=><div key={tenure.period} className={`experience-detail ${job.tenures?'grouped-tenure':''}`}>
            {job.tenures&&<div className="tenure-meta"><span className="micro">{tenure.period}</span><span className="micro">{tenure.location}</span></div>}
            <div className="impact"><span className="micro">A QUICK LOOK</span><strong>{tenure.shortImpact}</strong></div>
            <div><ul>{tenure.highlights.map(highlight=><li key={highlight}>{highlight}</li>)}</ul><div className="technology-list">{tenure.technologies.map(tech=><span key={tech}>{tech}</span>)}</div></div>
          </div>)}{company&&<a className="experience-company-link" href={company.href} target="_blank" rel="noopener noreferrer">Company website <ArrowUpRight size={13}/></a>}</div>
        </motion.div>}</AnimatePresence>
      </div></Reveal>;
    })}</div>
  </section>;
}
function About() {
  return <section id="about" className="section about container" data-atmosphere="#54bda9">
    <Reveal><div className="section-kicker"><span className="micro">01 — ABOUT</span></div></Reveal>
    <div className="about-grid">
      <div className="about-copy">
        <AnimatedHeading lines={["A bit", <span className="serif accent" key="about">about me</span>]}/>
        <Reveal><p className="about-intro">{portfolioContent.about.overview}</p>
          <p>{portfolioContent.about.interests}</p>
          <p>These days, I’m building backend services and AI tools for Amazon’s Associates program. I’ve also worked on web and mobile apps at Tesla, Capital One, and Riot Games.</p>
          <div className="about-education"><span className="micro">UNIVERSITY OF MICHIGAN · CLASS OF 2025</span><p>BSE, Computer Science<br/>Minor in Applied Statistics</p></div>
          <a className="text-link" href={portfolioContent.links.linkedin} target="_blank" rel="noopener noreferrer">Let’s connect <ArrowUpRight size={17}/></a>
        </Reveal>
      </div>
      <div className="about-portrait">
        <Parallax className="portrait-outline" distance={-25}><div aria-hidden="true"/></Parallax>
        <Parallax distance={40}><div className="portrait-frame"><Image src="/images/headshot.jpg" alt="Justin Yang smiling outdoors" width={720} height={900} sizes="(max-width: 800px) 80vw, 35vw"/><span className="portrait-corner top-left"/><span className="portrait-corner bottom-right"/></div></Parallax>
        <Parallax distance={12}><div className="portrait-caption"><span className="micro">JUSTIN YANG</span></div></Parallax>
      </div>
    </div>
    <HobbyCarousel />
  </section>;
}
function Tools() {
  return <section id="tools" className="tools-section container" data-atmosphere="#a085d8" aria-labelledby="tools-title"><Reveal><div className="toolkit"><div className="toolkit-intro"><h2 id="tools-title" className="micro">02 — TOOLS</h2></div>{portfolioContent.about.toolkit.map(group=><div key={group.title}><h3 className="micro muted">{group.title}</h3><div className="toolkit-items">{group.items.map(item=><span key={item}>{item}</span>)}</div></div>)}</div></Reveal>
  </section>;
}
function Contact() {
  return <section id="contact" className="contact section" data-atmosphere="#a085d8"><ContactMoon/><div className="container"><Reveal><div className="section-kicker"><span className="micro">05 — CONTACT</span></div><a href={portfolioContent.links.linkedin} target="_blank" rel="noopener noreferrer" className="contact-title">Say<br/><span className="serif">hello</span><ArrowUpRight aria-hidden="true"/></a><div className="contact-bottom"><p>If you’ve got a role or project in mind, or just want to say hi,<br/>send me a message on LinkedIn</p><div className="contact-socials"><a href={portfolioContent.links.github} target="_blank" rel="noopener noreferrer"><Github size={19}/>GitHub<ArrowUpRight size={15}/></a><a href={portfolioContent.links.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin size={19}/>LinkedIn<ArrowUpRight size={15}/></a></div></div></Reveal><footer><span>© {new Date().getFullYear()} Justin Yang</span><a href="#home">Back to top <MoveUp size={14}/></a></footer></div></section>;
}
export function Portfolio() {
  const reduced=useReducedMotion();
  useEffect(()=>{
    if(reduced!==false)return;
    const lenis=new Lenis({duration:1.05,smoothWheel:true,autoRaf:true});
    const initialTarget=document.getElementById(window.location.hash.slice(1));
    let initialAnchorActive=!!initialTarget?.matches('main section[id]');
    // Keep direct hash URLs aligned while fonts and the initial layout settle.
    const alignInitialAnchor=()=>{
      if(!initialAnchorActive||!initialTarget)return;
      lenis.resize();
      lenis.scrollTo(initialTarget.getBoundingClientRect().top+window.scrollY,{immediate:true});
    };
    const layoutObserver=new ResizeObserver(alignInitialAnchor);
    const main=document.querySelector('main');
    if(initialAnchorActive&&main)layoutObserver.observe(main);
    const releaseInitialAnchor=()=>{initialAnchorActive=false;layoutObserver.disconnect();};
    const inputs=['pointerdown','wheel','keydown'] as const;
    inputs.forEach(type=>window.addEventListener(type,releaseInitialAnchor,{passive:true}));
    void document.fonts.ready.then(alignInitialAnchor);
    // Own animated anchor clicks so removing a mobile menu link cannot cancel the scroll.
    const navigate=(event:MouseEvent)=>{
      if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
      const link=event.target instanceof Element?event.target.closest<HTMLAnchorElement>('a[href^="#"]'):null;
      const hash=link?.getAttribute('href');
      const target=hash?document.getElementById(hash.slice(1)):null;
      if(!target?.matches('main section[id]')||!hash||link?.target==='_blank'||link?.hasAttribute('download'))return;
      event.preventDefault();
      releaseInitialAnchor();
      if(window.location.hash!==hash)window.history.pushState(null,'',hash);
      lenis.resize();
      lenis.scrollTo(target.getBoundingClientRect().top+window.scrollY);
    };
    document.addEventListener('click',navigate);
    return ()=>{
      releaseInitialAnchor();
      inputs.forEach(type=>window.removeEventListener(type,releaseInitialAnchor));
      document.removeEventListener('click',navigate);
      lenis.destroy();
    };
  },[reduced]);
  return <MotionConfig reducedMotion="user"><div className="site"><a href="#main" className="skip-link">Skip to content</a><div className="film-grain" aria-hidden="true"/><Atmosphere/><Navbar/><main id="main"><Hero/><CompanyStrip/><About/><Tools/><Experience/><Projects/><Contact/></main></div></MotionConfig>;
}
