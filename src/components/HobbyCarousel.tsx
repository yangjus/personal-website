'use client';

import { useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react';
import styles from './HobbyCarousel.module.css';
import { GolfScene, BasketballScene, PhotographyScene, HikingScene, CatScene } from './HobbyScenes';

const hobbies = [
  { id: 'tennis', title: 'Tennis', note: 'On the court', description: 'A racket, a rally, and a reason to get outside.', color: '#9ae4d2', Scene: TennisScene },
  { id: 'gym', title: 'The gym', note: 'One more rep', description: 'A little progress, one workout at a time.', color: '#f3b095', Scene: GymScene },
  { id: 'games', title: 'Board games', note: 'Around the table', description: 'Good friends. A little strategy. Another round.', color: '#cdb0f5', Scene: BoardGameScene },
  { id: 'golf', title: 'Golf', note: 'On the green', description: 'Fresh air, a few swings, and time on the course.', color: '#c3d99a', Scene: GolfScene },
  { id: 'basketball', title: 'Basketball', note: 'Just one more shot', description: 'A ball, a hoop, and a little friendly competition.', color: '#f5be8c', Scene: BasketballScene },
  { id: 'photography', title: 'Photography', note: 'Through the lens', description: 'Slowing down to notice the details and capture a moment.', color: '#a8d4ef', Scene: PhotographyScene },
  { id: 'hiking', title: 'Solo hiking', note: 'At my own pace', description: 'A quiet trail, a good view, and space to clear my head.', color: '#a9d7bc', Scene: HikingScene },
  { id: 'cat', title: 'Cat owner', note: 'In good company', description: 'A little curiosity, a lot of personality, and a companion at home.', color: '#e7bcce', Scene: CatScene },
] as const;

function TennisScene() {
  return <svg viewBox="0 0 560 340" fill="none" aria-hidden="true">
    <ellipse cx="280" cy="284" rx="210" ry="24" fill="#071d1a" opacity=".35" />
    <path d="M139 130H421L495 267H65Z" fill="#34695e" stroke="#81c7b4" strokeWidth="2" />
    <path d="M158 142H402L457 253H103Z" fill="#28544c" stroke="#c5e8d6" strokeWidth="2" />
    <path d="M175 142L128 253M385 142L432 253M123 212H437M146 167H414M280 167V212" stroke="#c5e8d6" strokeWidth="1.6" />
    <path d="M88 195H472" stroke="#101f23" strokeWidth="5" />
    <path d="M88 173H472V195H88Z" fill="#152e2c" fillOpacity=".6" stroke="#c3d4c5" strokeWidth="2" />
    {Array.from({ length: 38 }, (_, i) => <path key={i} d={`M${94 + i * 10} 175V194`} stroke="#aec9bc" strokeOpacity=".4" />)}
    <path d="M89 181H471M89 188H471M87 168V209M473 168V209" stroke="#d1e4d4" strokeWidth="1.5" />
    <circle cx="419" cy="70" r="25" fill="#e8d7a0" opacity=".7" />
    <path d="M95 84C102 74 112 74 122 84M122 84C131 74 141 74 148 84" stroke="#a5cbbc" strokeWidth="2" strokeLinecap="round" />
    <g className={styles.racket}>
      <path d="M170 205L132 272" stroke="#19302e" strokeWidth="15" strokeLinecap="round" />
      <path d="M170 205L132 272" stroke="#e9c399" strokeWidth="8" strokeLinecap="round" />
      <ellipse cx="183" cy="182" rx="29" ry="42" transform="rotate(29 183 182)" fill="#20473e" stroke="#d5e7ce" strokeWidth="7" />
      <g stroke="#c4d7ba" strokeWidth="1" opacity=".65">
        <path d="M163 154L195 207M172 146L207 197M160 167L182 212M177 146L156 183M190 150L158 199M200 160L170 209M210 176L185 214" />
      </g>
    </g>
    <ellipse className={styles.ballShadow} cx="353" cy="241" rx="16" ry="4" fill="#071d1a" opacity=".6" />
    <g className={styles.tennisBall}>
      <circle cx="353" cy="226" r="12" fill="#e1ed8d" />
      <path d="M347 216C357 225 345 229 348 236M359 216C349 225 361 229 358 236" stroke="#f5f6cf" strokeWidth="1.7" />
    </g>
    <path className={styles.rallyTrail} d="M221 170Q292 59 353 218" stroke="#dfe9a0" strokeWidth="1.5" strokeDasharray="4 7" opacity=".3" />
    <g transform="translate(423 239) rotate(12)"><circle r="10" fill="#d5e58b" /><path d="M-4-9Q4 0-4 9" stroke="#f5f6cf" strokeWidth="1.5" /></g>
  </svg>;
}

function GymScene() {
  return <svg viewBox="0 0 560 340" fill="none" aria-hidden="true">
    <path d="M105 272H457" stroke="#bd8e76" strokeOpacity=".35" strokeWidth="2" />
    <rect x="145" y="75" width="270" height="167" rx="8" fill="#2b2527" stroke="#806452" strokeOpacity=".5" strokeWidth="2" />
    <path d="M235 75V242M325 75V242M145 157H415" stroke="#a88c72" strokeOpacity=".18" />
    <rect x="179" y="103" width="30" height="31" rx="4" fill="#ac8767" fillOpacity=".35" />
    <path d="M185 110H203M185 117H199M185 124H195" stroke="#d9bda1" strokeWidth="2" />
    <path d="M177 273V139M383 273V139" stroke="#7e7b80" strokeWidth="10" strokeLinecap="round" />
    <path d="M174 176H189M371 176H386" stroke="#c1b8ad" strokeWidth="6" strokeLinecap="round" />
    <path d="M159 276H196M365 276H403" stroke="#b5aca2" strokeWidth="6" strokeLinecap="round" />
    <ellipse className={styles.weightShadow} cx="280" cy="271" rx="113" ry="10" fill="#160f14" opacity=".6" />
    <g className={styles.barbell}>
      <rect x="141" y="180" width="278" height="9" rx="4.5" fill="#c7c3b7" />
      <rect x="187" y="180" width="187" height="3" rx="1.5" fill="#f3eee0" />
      <rect x="159" y="149" width="26" height="71" rx="7" fill="#dc9876" stroke="#efba95" strokeWidth="2" />
      <rect x="145" y="159" width="14" height="51" rx="5" fill="#9e6659" stroke="#dca280" strokeWidth="2" />
      <path d="M169 158V209" stroke="#f9d1a9" strokeWidth="2" strokeOpacity=".5" />
      <rect x="375" y="149" width="26" height="71" rx="7" fill="#dc9876" stroke="#efba95" strokeWidth="2" />
      <rect x="401" y="159" width="14" height="51" rx="5" fill="#9e6659" stroke="#dca280" strokeWidth="2" />
      <path d="M385 158V209" stroke="#f9d1a9" strokeWidth="2" strokeOpacity=".5" />
    </g>
    <g className={styles.repMarks} stroke="#ecc3a0" strokeWidth="3" strokeLinecap="round">
      <path d="M267 103V116M280 97V110M293 103V116" />
    </g>
    <g transform="translate(423 228) rotate(9)"><rect width="22" height="43" rx="7" fill="#88afa7" /><rect x="5" y="-6" width="12" height="8" rx="2" fill="#c9d9c2" /><path d="M4 12H18" stroke="#cae1cd" strokeWidth="2" /></g>
    <path d="M98 252H133L143 265H89Z" fill="#a792b2" /><path d="M95 252V246H126V252" stroke="#d0bfdb" strokeWidth="3" />
  </svg>;
}

function BoardGameScene() {
  return <svg viewBox="0 0 560 340" fill="none" aria-hidden="true">
    <ellipse cx="280" cy="272" rx="204" ry="26" fill="#160f26" opacity=".45" />
    <path d="M109 136L349 100L465 233L191 275Z" fill="#463957" stroke="#a68bbb" strokeWidth="2" />
    <path d="M109 136V145L191 284L465 243V233M191 275V284" stroke="#736080" strokeWidth="2" />
    <path d="M137 148L339 119L434 223L204 257Z" fill="#74637e" stroke="#d2bbde" strokeWidth="2" />
    <path d="M164 164L337 138L410 217L215 244Z" fill="#41384d" stroke="#b1a0bf" />
    <g stroke="#c9b6d4" strokeWidth="1.3"><path d="M188 157L267 251M234 150L312 244M280 143L356 237M324 137L399 230M147 161L353 129M160 184L373 152M176 207L394 175M190 230L416 198" /></g>
    <path d="M231 184L279 177L298 200L247 208Z" fill="#baa1ce" opacity=".45" />
    <g className={styles.gamePawn}>
      <ellipse cx="248" cy="209" rx="15" ry="5" fill="#211a30" opacity=".6" />
      <path d="M238 207Q233 202 242 193L244 179H252L254 193Q263 202 258 207Z" fill="#e5b18d" stroke="#f1d1a8" strokeWidth="1.5" />
      <circle cx="248" cy="176" r="8" fill="#edbd96" />
      <path d="M242 174Q244 170 249 171" stroke="#ffe0b8" strokeWidth="2" strokeLinecap="round" />
    </g>
    <g transform="translate(344 183)"><path d="M-10 22Q-15 17-6 8L-4-6H4L6 8Q15 17 10 22Z" fill="#93c8bc" stroke="#c3e6d1" strokeWidth="1.5" /><circle cy="-9" r="8" fill="#b2dfcf" /></g>
    <g className={styles.gameDie}>
      <rect x="151" y="91" width="43" height="43" rx="8" fill="#f0e0cb" stroke="#ccb8ae" strokeWidth="2" />
      {[[161, 101], [183, 101], [172, 112], [161, 124], [183, 124]].map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3" fill="#685170" />)}
    </g>
    <g className={styles.gameCards}>
      <rect x="402" y="104" width="51" height="71" rx="5" transform="rotate(17 402 104)" fill="#a292b8" stroke="#dbc3ed" strokeWidth="2" />
      <rect x="396" y="107" width="51" height="71" rx="5" transform="rotate(-7 396 107)" fill="#544468" stroke="#dbc3ed" strokeWidth="2" />
      <path d="M417 122L428 138L416 154L405 138Z" fill="#cdb0f5" /><path d="M403 164L433 160" stroke="#ae96c8" strokeWidth="2" />
    </g>
    <circle cx="137" cy="233" r="11" fill="#dcb582" /><circle cx="137" cy="233" r="7" stroke="#ffe0a6" /><circle cx="114" cy="246" r="11" fill="#dcb582" /><circle cx="114" cy="246" r="7" stroke="#ffe0a6" />
  </svg>;
}

export function HobbyCarousel() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const inView = useInView(root, { amount: .15 });
  const reduced = useReducedMotion();

  function goTo(index: number) {
    const next = (index + hobbies.length) % hobbies.length;
    const slide = track.current?.children[next] as HTMLElement | undefined;
    if (slide && track.current) track.current.scrollTo({ left: slide.offsetLeft, behavior: reduced ? 'instant' : 'smooth' });
  }

  function handleKeys(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      goTo(active + (event.key === 'ArrowRight' ? 1 : -1));
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      goTo(event.key === 'Home' ? 0 : hobbies.length - 1);
    }
  }

  return <div ref={root} className={styles.carousel} role="region" aria-roledescription="carousel" aria-labelledby="hobbies-title" onKeyDown={handleKeys}>
    <div className={styles.heading}>
      <div><span className={`micro ${styles.eyebrow}`}>HOBBIES &amp; ACTIVITIES</span><h3 id="hobbies-title">Things I <span className="serif">enjoy</span></h3></div>
      <div className={styles.arrows}>
        <button type="button" aria-label="Previous hobby" aria-controls="hobby-slides" onClick={() => goTo(active - 1)}><ArrowLeft size={19} /></button>
        <button type="button" aria-label="Next hobby" aria-controls="hobby-slides" onClick={() => goTo(active + 1)}><ArrowRight size={19} /></button>
      </div>
    </div>
    <div ref={track} id="hobby-slides" className={styles.track} tabIndex={0} aria-label="Hobby slides. Use left and right arrow keys to browse." data-lenis-prevent onScroll={() => {
      if (track.current) setActive(Math.round(track.current.scrollLeft / track.current.clientWidth));
    }}>
      {hobbies.map(({ id, title, note, description, color, Scene }, index) => <div key={id} className={`${styles.slide} ${styles[id]}`} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${hobbies.length}: ${title}`} style={{ '--hobby-color': color } as CSSProperties}>
        <div className={styles.scene} data-playing={!paused && inView && active === index && !reduced}><Scene /><span className={styles.sceneLabel} aria-hidden="true">{note}</span></div>
        <div className={styles.copy}><span className={`micro ${styles.number}`}>{String(index + 1).padStart(2, '0')} / {String(hobbies.length).padStart(2, '0')}</span><h4>{title}</h4><p>{description}</p><span className={styles.detail} aria-hidden="true"><span />{note}</span></div>
      </div>)}
    </div>
    <div className={styles.footer}>
      <div className={styles.tabs} aria-label="Choose a hobby">{hobbies.map((hobby, index) => <button type="button" key={hobby.id} aria-label={`Show ${hobby.title.toLowerCase()}`} aria-current={active === index ? 'true' : undefined} aria-controls="hobby-slides" onClick={() => goTo(index)}><span />{hobby.title}</button>)}</div>
      <button type="button" className={styles.pause} aria-label={paused ? 'Play hobby animations' : 'Pause hobby animations'} aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? <Play size={13} /> : <Pause size={13} />}<span>{paused ? 'Play' : 'Pause'}</span></button>
      <span className={styles.srOnly} aria-live="polite" aria-atomic="true">{hobbies[active]?.title}, {active + 1} of {hobbies.length}</span>
    </div>
  </div>;
}
