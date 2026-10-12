import styles from './HobbyCarousel.module.css';

export function GolfScene() {
  return <svg viewBox="0 0 560 340" fill="none" aria-hidden="true">
    <circle cx="417" cy="80" r="24" fill="#e6dca7" opacity=".75" />
    <path d="M65 212Q127 148 204 181Q292 124 368 171Q433 154 495 204V267H65Z" fill="#344f3b" />
    <path d="M65 236Q160 180 255 215Q370 161 495 216V267H65Z" fill="#4d7050" />
    <ellipse cx="305" cy="247" rx="152" ry="35" fill="#7b9a63" />
    <path d="M198 239Q225 222 251 227" stroke="#b5c589" strokeWidth="2" strokeLinecap="round" opacity=".5" />
    <ellipse cx="373" cy="242" rx="12" ry="4" fill="#26392c" />
    <path d="M373 241V98" stroke="#e8e5c9" strokeWidth="3" strokeLinecap="round" />
    <g className={styles.golfFlag}><path d="M375 100Q394 94 414 105L414 133Q393 121 375 128Z" fill="#e7b38c" stroke="#f2d6ab" strokeWidth="1.5" /></g>
    <path d="M220 242Q276 232 363 241" stroke="#d9e4bc" strokeWidth="1.5" strokeDasharray="3 7" opacity=".3" />
    <g className={styles.golfBall}><circle cx="220" cy="239" r="6" fill="#f1edd7" /><path d="M218 236L221 235M222 239L224 238" stroke="#b9c5ad" strokeLinecap="round" /></g>
    <g transform="translate(131 193) rotate(-10)">
      <path d="M-18 25L-10-60M0 22L13-69M14 30L33-48" stroke="#c4c8b6" strokeWidth="4" strokeLinecap="round" />
      <path d="M-10-60L-25-66M13-69L-1-74M33-48L48-49" stroke="#e2d9c2" strokeWidth="9" strokeLinecap="round" />
      <rect x="-26" y="-3" width="58" height="88" rx="11" fill="#bf9974" stroke="#e5c6a0" strokeWidth="2" />
      <path d="M-25 17H31M-25 62H31" stroke="#e7c5a0" strokeWidth="3" /><rect x="-14" y="28" width="35" height="24" rx="5" fill="#936b55" />
      <path d="M31 8Q58 37 30 63" stroke="#d1b38b" strokeWidth="5" />
    </g>
    <path d="M82 273H473" stroke="#c3d99a" strokeOpacity=".2" strokeWidth="2" />
  </svg>;
}

export function BasketballScene() {
  return <svg viewBox="0 0 560 340" fill="none" aria-hidden="true">
    <path d="M86 260L171 178H397L479 260Z" fill="#72503f" stroke="#bd8965" strokeWidth="2" />
    <path d="M110 250H452M280 179V260M196 211H362L393 251H166Z" stroke="#e0b691" strokeWidth="1.5" />
    <path d="M228 260Q228 235 280 235Q332 235 332 260" stroke="#e0b691" strokeWidth="1.5" />
    <path d="M124 230L149 205M164 260L210 180M350 180L398 260M410 205L435 230" stroke="#c99670" strokeOpacity=".3" />
    <path d="M397 246V83" stroke="#9b9995" strokeWidth="9" strokeLinecap="round" />
    <path d="M372 252H420" stroke="#c7bbb0" strokeWidth="7" strokeLinecap="round" />
    <rect x="342" y="73" width="110" height="71" rx="5" fill="#afb4ad" fillOpacity=".14" stroke="#dcd2c2" strokeWidth="3" />
    <path d="M379 100H416V128H379Z" stroke="#f1dec2" strokeWidth="2" />
    <g className={styles.basketNet}>
      <path d="M361 139L373 177H413L425 139M369 140L383 177M381 140L395 177M394 140L407 177M407 140L419 158M419 140L407 177M406 140L393 177M393 140L380 177M380 140L367 158" stroke="#dbceba" strokeWidth="1.5" />
    </g>
    <ellipse cx="393" cy="137" rx="35" ry="7" stroke="#ec9d6b" strokeWidth="5" />
    <ellipse className={styles.basketShadow} cx="233" cy="252" rx="29" ry="6" fill="#2c211f" opacity=".6" />
    <g className={styles.basketBall}>
      <circle cx="233" cy="221" r="26" fill="#e7a068" stroke="#f3bb85" strokeWidth="2" />
      <path d="M207 221H259M233 195V247M215 202Q244 222 215 240M251 202Q222 222 251 240" stroke="#885038" strokeWidth="2" />
    </g>
    <path d="M135 87L139 95M146 82L150 91M123 95L128 103" stroke="#ecc69e" strokeWidth="2" strokeLinecap="round" opacity=".5" />
  </svg>;
}

export function PhotographyScene() {
  return <svg viewBox="0 0 560 340" fill="none" aria-hidden="true">
    <ellipse cx="271" cy="272" rx="176" ry="22" fill="#101c27" opacity=".5" />
    <g transform="translate(383 117) rotate(12)"><g className={styles.photoPrint}>
      <rect x="-45" y="-44" width="98" height="123" rx="3" fill="#e9e5d7" stroke="#c1c9c2" strokeWidth="2" />
      <rect x="-37" y="-36" width="82" height="84" fill="#6d9dba" />
      <circle cx="22" cy="-16" r="11" fill="#f1d3a1" />
      <path d="M-37 30L-7-7L24 31L45 9V48H-37Z" fill="#638d80" /><path d="M-37 43L12 9L45 43V48H-37Z" fill="#3d6a60" />
      <path d="M-14 2L-7-7L1 4L-7 0Z" fill="#e8efdd" /><path d="M-19 64H27" stroke="#aeb6ae" strokeWidth="2" strokeLinecap="round" />
    </g></g>
    <path d="M150 161Q97 165 112 216Q124 262 165 257" stroke="#8b9da9" strokeWidth="6" />
    <g className={styles.cameraBody}>
      <path d="M197 143L209 123H280L294 143" fill="#a5b8bf" stroke="#dae4dc" strokeWidth="2" />
      <rect x="145" y="140" width="216" height="113" rx="13" fill="#354b59" stroke="#9ab8c5" strokeWidth="2" />
      <path d="M145 177H361" stroke="#a3b8bf" strokeWidth="2" /><rect x="158" y="151" width="25" height="89" rx="7" fill="#263842" />
      <rect x="317" y="152" width="28" height="16" rx="3" fill="#d4ddcf" /><rect x="213" y="133" width="41" height="10" rx="2" fill="#223944" />
      <path d="M171 132H188" stroke="#c3d2d0" strokeWidth="7" strokeLinecap="round" />
      <circle cx="255" cy="197" r="48" fill="#182d3c" stroke="#b2cbd1" strokeWidth="5" />
      <circle cx="255" cy="197" r="36" fill="#294658" stroke="#607c89" strokeWidth="2" />
      <g className={styles.cameraAperture}><path d="M255 170L278 183V211L255 224L232 211V183Z" fill="#112330" stroke="#88b1c2" strokeWidth="2" /><path d="M255 170L250 190L278 183M278 183L262 198L278 211M278 211L257 205L255 224M255 224L249 205L232 211M232 211L247 196L232 183M232 183L251 187L255 170" stroke="#88b1c2" strokeWidth="1.5" /></g>
      <circle cx="244" cy="185" r="6" fill="#c6e2e2" opacity=".5" />
      <g className={styles.cameraFlash}><path d="M324 132L320 115M339 135L350 122M344 149L363 147" stroke="#f1e7bd" strokeWidth="3" strokeLinecap="round" /></g>
      <circle cx="300" cy="158" r="3" fill="#e9b28e" />
    </g>
  </svg>;
}

export function HikingScene() {
  return <svg viewBox="0 0 560 340" fill="none" aria-hidden="true">
    <circle cx="397" cy="77" r="24" fill="#e6d5a2" opacity=".8" />
    <path d="M66 230L181 80L311 230Z" fill="#53756e" /><path d="M225 227L348 107L473 227Z" fill="#6c8d7d" />
    <path d="M156 113L181 80L208 114L184 105L172 116Z" fill="#d8e1cf" /><path d="M325 130L348 107L375 133L354 126L344 135Z" fill="#d8e1cf" />
    <path d="M67 256Q168 179 272 226Q363 177 494 238V276H67Z" fill="#355749" />
    <path d="M279 276Q204 252 258 231Q299 216 283 203" stroke="#bdb495" strokeWidth="15" />
    <g fill="#719881" stroke="#a0b99c" strokeWidth="1"><path d="M112 164L89 209H135Z" /><path d="M112 188L84 234H140Z" /><path d="M427 164L405 206H449Z" /><path d="M427 187L398 234H456Z" /></g>
    <path d="M112 228V251M427 226V251" stroke="#b5a58a" strokeWidth="5" />
    <g transform="translate(269 210)"><g className={styles.hiker}>
      <path d="M-8 16L-16 43M4 16L13 42" stroke="#b1c7be" strokeWidth="7" strokeLinecap="round" />
      <path d="M-16 44H-25M13 43H20" stroke="#dfc8a3" strokeWidth="6" strokeLinecap="round" />
      <rect x="-23" y="-20" width="17" height="33" rx="6" fill="#dba07b" stroke="#e6c79a" strokeWidth="2" />
      <path d="M-9-19Q-2-24 6-16L12 14Q0 22-14 16Z" fill="#8ec6b2" stroke="#b3d6bd" strokeWidth="2" />
      <path d="M3-10L16 0L25-8" stroke="#dfc8a3" strokeWidth="5" strokeLinecap="round" />
      <path d="M26-9L21 44" stroke="#d4c6ac" strokeWidth="3" strokeLinecap="round" />
      <circle cx="-3" cy="-32" r="10" fill="#dec3a2" /><path d="M-16-36H10M-11-37L-8-43H3L6-37" stroke="#b8c9a1" strokeWidth="5" strokeLinecap="round" />
    </g></g>
    <g className={styles.hikingCloud} stroke="#bacfc1" strokeWidth="2" strokeLinecap="round" opacity=".5"><path d="M90 94H135M102 86H150M245 81H283" /></g>
    <path d="M352 69Q359 60 366 69Q373 60 380 69" stroke="#b8cebd" strokeWidth="2" strokeLinecap="round" />
    <path d="M77 277H483" stroke="#94b89c" strokeOpacity=".25" strokeWidth="2" />
  </svg>;
}

export function CatScene() {
  return <svg viewBox="0 0 560 340" fill="none" aria-hidden="true">
    <rect x="301" y="63" width="123" height="141" rx="5" fill="#4e475c" stroke="#9f899f" strokeWidth="3" />
    <circle cx="381" cy="102" r="18" fill="#e5d2b5" /><path d="M307 166L342 127L377 165L418 140V198H307Z" fill="#657468" />
    <path d="M362 64V203M302 132H424" stroke="#b29ca9" strokeWidth="4" /><path d="M291 205H435" stroke="#d1b7b6" strokeWidth="7" strokeLinecap="round" />
    <ellipse cx="263" cy="271" rx="141" ry="22" fill="#523e4b" /><ellipse cx="263" cy="266" rx="137" ry="20" fill="#8b6875" stroke="#c297a6" strokeWidth="2" />
    <path className={styles.catTail} d="M284 235Q352 263 361 223Q365 201 346 207" stroke="#d3b393" strokeWidth="18" strokeLinecap="round" />
    <g className={styles.catBody}>
      <ellipse cx="259" cy="232" rx="66" ry="31" fill="#d3b393" stroke="#e5caac" strokeWidth="2" />
      <path d="M284 208L278 228M298 216L291 233M309 226L300 240" stroke="#9d7a66" strokeWidth="6" strokeLinecap="round" opacity=".65" />
      <path d="M219 245Q238 251 255 245" stroke="#efd8bc" strokeWidth="12" strokeLinecap="round" />
    </g>
    <g>
      <path d="M176 220L172 182L197 198M219 197L244 182L240 222" fill="#d3b393" stroke="#e5caac" strokeWidth="2" />
      <path d="M177 190L180 209L191 201M237 190L224 201L234 209" fill="#bd8c8f" />
      <ellipse cx="207" cy="220" rx="36" ry="30" fill="#d3b393" stroke="#e5caac" strokeWidth="2" />
      <g className={styles.catEyes}><path d="M186 218Q193 224 200 218M214 218Q221 224 228 218" stroke="#705751" strokeWidth="2.5" strokeLinecap="round" /></g>
      <path d="M203 230L207 234L211 230Z" fill="#a9787c" /><path d="M207 234V239M200 239Q207 244 214 239" stroke="#8d665c" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M183 231L158 226M183 238L157 240M231 231L255 227M232 238L256 241" stroke="#ead2b5" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M201 193L205 203M212 193L212 202" stroke="#9d7a66" strokeWidth="4" strokeLinecap="round" />
    </g>
    <g className={styles.catPurr} fill="#dec5d2"><circle cx="150" cy="174" r="3" /><circle cx="142" cy="158" r="2" /><circle cx="148" cy="143" r="1.5" /></g>
    <g transform="translate(119 246)"><circle r="14" fill="#a7bba4" stroke="#ced7b6" strokeWidth="2" /><path d="M-9-10Q3 0-9 10M-4-13Q8 0-4 13M2-13Q14 0 2 13M14 4Q24 11 19 20" stroke="#768f7a" strokeWidth="1.5" /></g>
    <path d="M449 244V213M449 229Q427 226 431 211Q447 211 449 229M450 223Q468 222 469 205Q453 204 450 223" stroke="#93b49d" strokeWidth="3" fill="#719b7e" />
    <path d="M435 239H463L459 264H439Z" fill="#b58779" stroke="#d5aa98" strokeWidth="2" />
  </svg>;
}
