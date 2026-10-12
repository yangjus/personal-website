'use client';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
const links = [{ id: 'about', label: 'About' },{ id: 'tools', label: 'Tools' },{ id: 'experience', label: 'Experience' },{ id: 'projects', label: 'Work' }];
export function Navbar() {
  const [menu,setMenu]=useState(false);
  const [scrolled,setScrolled]=useState(false);
  const [active,setActive]=useState('home');
  const {scrollY,scrollYProgress}=useScroll();
  useMotionValueEvent(scrollY,'change',value=>setScrolled(value>40));
  useEffect(()=>{
    const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting)setActive(entry.target.id);});},{rootMargin:'-20% 0px -60% 0px'});
    document.querySelectorAll('main section[id]').forEach(section=>observer.observe(section));
    const escape=(e: KeyboardEvent)=>{if(e.key==='Escape')setMenu(false);};
    window.addEventListener('keydown',escape);
    return ()=>{observer.disconnect();window.removeEventListener('keydown',escape);};
  },[]);
  return <><motion.div className="reading-progress" style={{scaleX:scrollYProgress}} /><header className={`navbar ${scrolled?'scrolled':''}`}>
    <nav className="container nav-inner" aria-label="Main navigation"><a className="wordmark" href="#home" aria-label="Justin Yang, home" onClick={()=>setMenu(false)}>jy<span>®</span></a>
      <div className="nav-links">{links.map(link=><a key={link.id} className={active===link.id?'active':''} href={`#${link.id}`} aria-current={active===link.id?'location':undefined}>{link.label}</a>)}</div>
      <a className="nav-contact" href="#contact">Say hi <ArrowUpRight size={16} /></a>
      <button className="menu-toggle" aria-label={menu?'Close navigation':'Open navigation'} aria-expanded={menu} aria-controls="mobile-navigation" onClick={()=>setMenu(!menu)}>{menu?<X size={22}/>:<Menu size={22}/>}</button>
    </nav><AnimatePresence>{menu&&<motion.div id="mobile-navigation" className="mobile-navigation" initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}}>{[...links,{id:'contact',label:'Say hi'}].map((link,index)=><a key={link.id} href={`#${link.id}`} onClick={()=>setMenu(false)}><span className="micro">0{index+1}</span>{link.label}<ArrowUpRight size={20}/></a>)}</motion.div>}</AnimatePresence>
  </header></>;
}
