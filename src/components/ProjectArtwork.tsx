'use client';

import { motion, type MotionValue } from 'framer-motion';

// Editorial illustrations describe the product; the central image remains the real project.
export function ProjectArtwork({ index, y, draw }: { index: number; y: MotionValue<number> | number; draw: MotionValue<number> | number }) {
  return <motion.div className={`project-artwork artwork-${index}`} style={{ y }} aria-hidden="true">
    {index === 4 && <svg viewBox="0 0 600 700"><motion.path d="M80 110H520V590H80ZM80 300H520M270 110V300M350 300V590M80 470H350" style={{ pathLength: draw }}/><path d="M270 260A40 40 0 0 1 310 300M350 430A40 40 0 0 1 390 470"/></svg>}
    {index === 0 && <>
      <div className="routine-card"><span className="micro">WEEKLY ROUTINE</span><div className="routine-week">{['M','T','W','T','F','S','S'].map((day, i) => <span key={i} className={i < 4 ? 'complete' : ''}>{day}<i/></span>)}</div></div>
      <svg className="routine-ring" viewBox="0 0 400 400"><circle cx="200" cy="200" r="180"/><motion.circle cx="200" cy="200" r="180" style={{ pathLength: draw }}/></svg>
    </>}
    {index === 1 && <>
      <svg className="trade-path" viewBox="0 0 600 600"><motion.path d="M70 150C440 50 150 520 530 450" style={{ pathLength: draw }}/><circle cx="70" cy="150" r="9"/><circle cx="530" cy="450" r="9"/></svg>
      <div className="trade-card trade-have"><span className="micro">HAVE</span><span className="trade-symbol">✦</span></div>
      <div className="trade-card trade-need"><span className="micro">NEED</span><span className="trade-symbol">✧</span></div>
    </>}
    {index === 2 && <>
      <div className="data-card"><span className="micro">STUDY METADATA</span><div className="data-rows">{['Studies', 'Metadata', 'Documents'].map((label, i) => <div key={label}><span>0{i+1}</span><span>{label}</span><i/></div>)}</div></div>
      <svg className="data-path" viewBox="0 0 600 600"><motion.path d="M80 150H250Q290 150 290 190V420Q290 450 330 450H530" style={{ pathLength: draw }}/><rect x="60" y="130" width="40" height="40"/><circle cx="530" cy="450" r="12"/></svg>
    </>}
    {index === 3 && <>
      <svg className="signal-path" viewBox="0 0 600 600"><path className="signal-noise" d="M20 470L75 380L115 445L160 300L200 365L240 240L285 320L335 190L375 230L430 140L485 190L570 80"/><motion.path d="M20 440C130 440 170 340 240 320S370 190 430 170S520 130 570 80" style={{ pathLength: draw }}/></svg>
      <div className="sentiment-card"><span className="micro">SENTIMENT ANALYSIS</span><div className="sentiment-bars">{[.4,.65,.48,.8,.6,1,.74,.9].map((height,i)=><i key={i} style={{height:`${height*100}%`}}/>)}</div></div>
    </>}
  </motion.div>;
}
