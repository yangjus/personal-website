'use client';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, Plus, Minus } from 'lucide-react';
import { useRef, useState } from 'react';
import { Github } from './BrandIcons';
import { portfolioContent, type Project } from '@/data/siteContent';
import { AnimatedHeading, Reveal } from './Motion';
import { ProjectArtwork } from './ProjectArtwork';
const projectNames = ['EZ Routine', 'MonopolyGO! Trading', 'ELEMENT Data Search', 'ZenStock', 'Rent Bid'];
const details = [
  {category:'Mobile',description:'A workout app I built to make planning workouts and keeping track of progress a little less of a chore.',note:'WORKOUT PLANNING & TRACKING',color:'olive',build:'The app uses SQLite for local workout data and React Query to keep track of that data in the UI.'},
  {category:'Web',description:'A place for MonopolyGO! players to find trades and chat with each other. It’s grown to 750+ registered players, and I’m still working on it.',note:'750+ REGISTERED PLAYERS',color:'clay',build:'Next.js and TypeScript handle the app, MongoDB stores the data, and WebSockets power the chat. I used cookie-based JWT sessions for sign-in and AWS Amplify for hosting.'},
  {category:'Web',description:'I helped build this for public health researchers at the University of Michigan. It gives them an easier way to search study metadata and health documents.',note:'UNIVERSITY OF MICHIGAN',color:'slate',build:'I used Vue and PrimeVue for the search interface, Python to extract and filter documents, and SQLite for the data. The search suggests study metadata as you type.'},
  {category:'AI',description:'A project we put together at MHacks 16 using financial sentiment to recommend stocks. Our team took third in the finance track.',note:'MHACKS 16 · FINANCE TRACK, 3RD PLACE',color:'violet',build:'We used Hugging Face models and PyTorch for sentiment analysis, with a React frontend. I helped bring the ML results into the app.'},
  {category:'Web',description:portfolioContent.projects.find(project=>project.name==='Rent Bid')!.description,note:'LIVE ROOM AUCTIONS · FAIR RENT SPLITS',color:'olive',build:'Next.js API routes and Zod handle server-side validation. Supabase Postgres persists apartment, participant, and bid data, with real-time updates for bidding and participant presence and storage-backed room uploads. Automated auction logic manages bid increments, timers, winners, and the remaining rent calculation.'},
];
const featuredProjects = portfolioContent.projects.filter(project=>projectNames.includes(project.name));

const atmospheres = ['#82935d', '#bd7855', '#669bac', '#9c7ac3'];

function ProjectChapter({ project, index, expanded, onExpand }: {
  project: Project; index: number; expanded: boolean; onExpand: () => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const artworkIndex = projectNames.indexOf(project.name);
  const detail = details[artworkIndex];
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [65, -65]);
  const backdropY = useTransform(scrollYProgress, [0, 1], [-35, 35]);
  const scale = useTransform(scrollYProgress, [0, .5, 1], [.92, 1.04, .98]);
  const rotate = useTransform(scrollYProgress, [0, 1], [index % 2 ? 3 : -3, index % 2 ? -3 : 3]);
  const draw = useTransform(scrollYProgress, [.1, .75], [0, 1]);
  return <motion.article ref={ref} data-atmosphere={atmospheres[artworkIndex % atmospheres.length]} className={`project-chapter ${index%2?'reverse':''}`}
    initial={{opacity:0}} whileInView={{opacity:1}} exit={{opacity:0}} viewport={{once:true,amount:.08}} transition={{duration:.6}}>
    <div className={`project-visual ${detail.color}`}>
      <div className="project-visual-grid" aria-hidden="true"/><span className="micro visual-index">PROJECT / 0{index+1}</span>
      <ProjectArtwork index={artworkIndex} y={reduced ? 0 : backdropY} draw={reduced ? 1 : draw}/>
      <motion.div className={`project-screenshot ${detail.category==='Mobile'?'phone-screenshot':''}`} style={{ y: reduced ? 0 : y, scale: reduced ? 1 : scale, rotate: reduced ? 0 : rotate }}>
        {detail.category!=='Mobile'&&<div className="browser-bar"><span/><span/><span/><span className="browser-title">{project.name}</span><ArrowUpRight size={12}/></div>}
        <Image src={project.image} alt={project.imageAlt} width={project.imageWidth??1380} height={project.imageHeight??1080} sizes="(max-width: 800px) 90vw, 55vw" className="project-image" />
      </motion.div>
      <div className="visual-footer"><span className="micro">{detail.note}</span><button aria-label={`Read about ${project.name}`} onClick={onExpand} className="visual-open"><ArrowUpRight size={22}/></button></div>
    </div>
    <div className="project-copy">
      <span className="micro project-category">{project.kicker} <span> / {project.year}</span></span>
      <AnimatedHeading as="h3" lines={[project.name]}/><p>{detail.description}</p>
      <div className="technology-list">{project.stack.map(tech=><span key={tech}>{tech}</span>)}</div>
      <div className="project-links">{project.links.map(link=><a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">{link.label==='GitHub'?<Github size={15}/>:null}{link.label==='Website'||link.label==='Platform'?'View project':link.label}<ArrowUpRight size={14}/></a>)}</div>
      <button className="build-toggle" aria-expanded={expanded} aria-controls={`build-${index}`} onClick={onExpand}>How {project.name === 'ZenStock' ? 'we' : 'I'} built it {expanded?<Minus size={15}/>:<Plus size={15}/>}</button>
      <AnimatePresence>{expanded&&<motion.div id={`build-${index}`} initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="build-detail"><p>{detail.build}</p></motion.div>}</AnimatePresence>
    </div>
  </motion.article>;
}
export function Projects() {
  const [filter,setFilter]=useState('All work');
  const [expanded,setExpanded]=useState<string|null>(null);
  return <section id="projects" className="section projects container" data-atmosphere="#82935d">
    <Reveal><div className="section-kicker"><span className="micro">04 — PROJECTS</span></div>
      <div className="section-heading"><AnimatedHeading lines={["Some of my", <span className="muted" key="projects">projects</span>]}/></div>
      <div className="project-filters" role="group" aria-label="Filter projects">{['All work','Web','Mobile','AI'].map(item=><button key={item} onClick={()=>{setFilter(item);setExpanded(null);}} aria-pressed={filter===item} className={filter===item?'selected':''}>{item}{item==='All work'&&<span>{String(featuredProjects.length).padStart(2,'0')}</span>}</button>)}</div>
    </Reveal>
    <div className="project-list"><AnimatePresence mode="popLayout">{featuredProjects.map((project,index)=>{
      const detail=details[projectNames.indexOf(project.name)]; if(filter!=='All work'&&detail.category!==filter)return null;
      return <ProjectChapter key={project.name} project={project} index={index} expanded={expanded===project.name} onExpand={()=>setExpanded(expanded===project.name?null:project.name)}/>;
    })}</AnimatePresence></div>
  </section>;
}
