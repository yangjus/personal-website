'use client';
import { useEffect, useRef } from 'react';
import type { MotionValue } from 'framer-motion';
import { animate } from 'animejs/animation';
import * as THREE from 'three';
import { createEarthLife } from './EarthLife';
import { createEarthLocation } from './EarthLocation';
import { EARTH_RADIUS, LAND_ELEVATION } from './earthCoordinates';

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 p = modelViewMatrix * vec4(position, 1.0);
    vView = -p.xyz;
    gl_Position = projectionMatrix * p;
  }
`;

type EarthProps = { exitProgress: MotionValue<number> };

export default function Earth({ exitProgress }: EarthProps) {
  const container = useRef<HTMLDivElement>(null);
  const interaction = useRef<HTMLButtonElement>(null);
  const locationLabel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const host = container.current, control = interaction.current, label = locationLabel.current;
    if (!host || !control || !label) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' }); }
    catch { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    renderer.domElement.setAttribute('aria-hidden', 'true'); host.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, .1, 100); camera.position.z = 5.4;
    const depth = new THREE.Group(), axis = new THREE.Group(), planet = new THREE.Group();
    axis.rotation.set(.1, 0, THREE.MathUtils.degToRad(-18));
    planet.rotation.y = -.28; axis.add(planet); depth.add(axis); scene.add(depth);
    const initialOrientation = axis.quaternion.clone(), initialLongitude = planet.rotation.y;
    scene.add(new THREE.AmbientLight('#d3e5df', 1.45));
    const sunlight = new THREE.DirectionalLight('#fff0da', 1.8); sunlight.position.set(-3, 4, 5); scene.add(sunlight);
    const life = createEarthLife(planet), location = createEarthLocation(planet);
    const pulse = { value: 0 };
    // Anime.js is driven by this scene's clock, so it never starts a second RAF loop.
    const pinAnimation = animate(pulse, { value: [0, 1], duration: 2200, alternate: true, loop: true, ease: 'inOutSine', autoplay: false });
    const coast = { x: 0, y: 0 };
    let coastAnimation: ReturnType<typeof animate> | null = null, coastStart = 0, coastX = 0, coastY = 0;
    let disposed = false, ready = false, inView = true, frame = 0, previousTime = 0, elapsed = 0;
    let activePointer: number | null = null, lastX = 0, lastY = 0, lastMove = 0, velocityX = 0, velocityY = 0;
    let fastUntil = 0;
    const pointer = new THREE.Vector2(), turn = new THREE.Quaternion(), turnAxis = new THREE.Vector3();
    const textures: THREE.Texture[] = [];
    const loader = new THREE.TextureLoader();
    const load = (url: string, color = false) => new Promise<THREE.Texture>((resolve, reject) => {
      const texture = loader.load(url, loaded => { if (disposed) loaded.dispose(); else resolve(loaded); }, undefined, reject);
      texture.wrapS = THREE.RepeatWrapping;
      texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 4);
      if (color) texture.colorSpace = THREE.SRGBColorSpace;
      textures.push(texture);
    });
    const surfaceGeometry = new THREE.SphereGeometry(EARTH_RADIUS, 192, 128);
    const surfaceMaterial = new THREE.ShaderMaterial({
      uniforms: { uSurface: { value: null }, uWater: { value: null }, uShore: { value: null }, uTime: { value: 0 } },
      vertexShader: `
        uniform sampler2D uWater;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vView;
        varying float vRelief;
        void main() {
          vUv = uv;
          // A short coast bevel avoids stair-stepped elevation at the map's sharp edges.
          vec2 bevel = vec2(.0035, .007);
          float water = texture2D(uWater, uv).r * .4
                      + texture2D(uWater, uv + vec2(bevel.x, 0.)).r * .15
                      + texture2D(uWater, uv - vec2(bevel.x, 0.)).r * .15
                      + texture2D(uWater, uv + vec2(0., bevel.y)).r * .15
                      + texture2D(uWater, uv - vec2(0., bevel.y)).r * .15;
          float land = 1. - water;
          vRelief = smoothstep(.05, .98, land) * ${LAND_ELEVATION};
          vec4 p = modelViewMatrix * vec4(position + normal * vRelief, 1.);
          vNormal = normalize(normalMatrix * normal); vView = -p.xyz;
          gl_Position = projectionMatrix * p;
        }
      `,
      fragmentShader: `
        uniform sampler2D uSurface;
        uniform sampler2D uWater;
        uniform sampler2D uShore;
        uniform float uTime;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vView;
        varying float vRelief;
        void main() {
          float water = texture2D(uWater, vUv).r;
          vec3 reliefNormal = normalize(cross(dFdx(vView), dFdy(vView)));
          vec3 n = normalize(mix(normalize(vNormal), reliefNormal, (1. - water) * .85));
          vec3 view = normalize(vView);
          float light = dot(n, normalize(vec3(-.65, .75, 1.2)));
          float shade = .6 + .2 * smoothstep(-.12, -.03, light) + .2 * smoothstep(.48, .57, light);
          vec3 surface = texture2D(uSurface, vUv).rgb;
          vec3 color = surface * shade;
          // Tidal washes follow distance from the real coast and breathe in and out.
          // They share the globe's surface draw call and its existing animation clock.
          float shore = texture2D(uShore, vUv).r;
          float cycle = uTime * .28;
          float reach = .52 + .18 * sin(cycle * .45);
          float phase = shore * 4.5 + .1 * sin(vUv.x * 34. + vUv.y * 22.)
                      + .55 * sin(cycle);
          float crest = abs(sin(phase * 3.14159));
          float aa = max(fwidth(phase) * 2., .03);
          float foam = 1. - smoothstep(.08, .08 + aa, crest);
          float coast = smoothstep(.025, .13, shore) * (1. - smoothstep(reach, .95, shore));
          float wash = .5 + .5 * sin(shore * 9. - cycle);
          color = mix(color, vec3(.34, .63, .65) * shade, coast * wash * water * .12);
          color = mix(color, vec3(.51, .76, .73) * shade, foam * coast * water * .27);
          float swell = sin(vUv.x * 18. + vUv.y * 24. - uTime * .35);
          color += vec3(.008, .016, .02) * swell * water * shade;
          color *= mix(.77 + .23 * smoothstep(.004, .04, vRelief), 1., water);
          float sheen = pow(max(dot(reflect(-normalize(vec3(-.65,.75,1.2)), n), view), 0.), 18.);
          color += vec3(.09, .16, .16) * sheen * water * .2;
          float rim = pow(1. - max(dot(n, view), 0.), 4.);
          color = mix(color, vec3(.06, .16, .2), rim * .26);
          gl_FragColor = vec4(color, 1.);
          #include <colorspace_fragment>
        }
      `,
    });
    planet.add(new THREE.Mesh(surfaceGeometry, surfaceMaterial));
    const outlineGeometry = new THREE.SphereGeometry(1.466, 48, 32);
    const outlineMaterial = new THREE.MeshBasicMaterial({ color: '#284754', side: THREE.BackSide });
    planet.add(new THREE.Mesh(outlineGeometry, outlineMaterial));
    const atmosphereGeometry = new THREE.SphereGeometry(1.49, 48, 32);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader, transparent: true, depthWrite: false, side: THREE.BackSide, blending: THREE.AdditiveBlending,
      fragmentShader: `
        varying vec3 vNormal; varying vec3 vView;
        void main() {
          float rim = pow(1. - abs(dot(normalize(vNormal), normalize(vView))), 3.5);
          gl_FragColor = vec4(.46, .8, .85, rim * .12);
          #include <colorspace_fragment>
        }
      `,
    });
    depth.add(new THREE.Mesh(atmosphereGeometry, atmosphereMaterial));
    const starsGeometry = new THREE.BufferGeometry(), positions = new Float32Array(120 * 3);
    let seed = 919;
    const random = () => { seed = seed * 16807 % 2147483647; return seed / 2147483647; };
    for (let i = 0; i < 120; i++) { positions[i * 3] = (random() - .5) * 7; positions[i * 3 + 1] = (random() - .5) * 7; positions[i * 3 + 2] = -random() * 4 - 2; }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const starsMaterial = new THREE.PointsMaterial({ size: .012, color: '#c1d4df', transparent: true, opacity: .32 });
    scene.add(new THREE.Points(starsGeometry, starsMaterial));

    const rotate = (dx: number, dy: number) => {
      const distance = Math.hypot(dx, dy); if (!distance) return;
      turnAxis.set(dy, dx, 0).normalize(); turn.setFromAxisAngle(turnAxis, distance * .007);
      axis.quaternion.premultiply(turn).normalize();
    };
    const stopCoast = () => { coastAnimation?.cancel(); coastAnimation = null; coast.x = coast.y = coastX = coastY = 0; };
    const startCoast = (x: number, y: number, duration = 820) => {
      stopCoast(); coastStart = elapsed * 1000;
      coastAnimation = animate(coast, { x: [0, x], y: [0, y], duration, ease: 'outExpo', autoplay: false });
      fastUntil = performance.now() + duration;
    };
    const release = (allowCoast: boolean) => {
      const captured = activePointer; activePointer = null; host.classList.remove('is-dragging');
      if (captured !== null && control.hasPointerCapture(captured)) control.releasePointerCapture(captured);
      if (allowCoast && performance.now() - lastMove < 100) startCoast(velocityX * .18, velocityY * .18);
      velocityX = velocityY = 0;
    };
    const onDown = (event: PointerEvent) => {
      if (!ready || exitProgress.get() > .12 || event.button !== 0 || activePointer !== null) return;
      event.preventDefault(); stopCoast(); activePointer = event.pointerId;
      lastX = event.clientX; lastY = event.clientY; lastMove = performance.now(); velocityX = velocityY = 0;
      control.setPointerCapture(event.pointerId); host.classList.add('is-dragging');
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerId !== activePointer) return;
      const now = performance.now(), seconds = Math.max((now - lastMove) / 1000, 1 / 120);
      const dx = event.clientX - lastX, dy = event.clientY - lastY;
      rotate(dx, dy); // Direct input avoids tweening behind the pointer.
      velocityX = THREE.MathUtils.clamp(dx / seconds, -500, 500); velocityY = THREE.MathUtils.clamp(dy / seconds, -500, 500);
      lastX = event.clientX; lastY = event.clientY; lastMove = now;
    };
    const onUp = (event: PointerEvent) => { if (event.pointerId === activePointer) release(event.type === 'pointerup'); };
    const onKey = (event: KeyboardEvent) => {
      if (exitProgress.get() > .12) return;
      const directions: Record<string, [number, number]> = { ArrowLeft: [-24, 0], ArrowRight: [24, 0], ArrowUp: [0, -24], ArrowDown: [0, 24], Enter: [40, 0], ' ': [40, 0] };
      if (event.key === 'Home') { event.preventDefault(); stopCoast(); axis.quaternion.copy(initialOrientation); planet.rotation.y = initialLongitude; }
      else if (directions[event.key]) { event.preventDefault(); startCoast(...directions[event.key], 240); }
    };
    const onPointer = (event: PointerEvent) => pointer.set((event.clientX / window.innerWidth - .5) * 2, (event.clientY / window.innerHeight - .5) * 2);
    let width = 0, height = 0;
    const resize = () => { width = host.clientWidth; height = host.clientHeight; renderer.setSize(width, height); camera.aspect = width / Math.max(height, 1); camera.updateProjectionMatrix(); };
    const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(host); resize();
    const render = (time: number) => {
      frame = 0;
      if (disposed || !ready || !inView || document.hidden || exitProgress.get() >= .995) return;
      const fps = activePointer !== null || time < fastUntil ? 60 : 30;
      if (time - previousTime < 1000 / fps - 1) { frame = requestAnimationFrame(render); return; }
      const delta = Math.min((time - previousTime) / 1000, .06); previousTime = time; elapsed += delta;
      surfaceMaterial.uniforms.uTime.value = elapsed;
      if (coastAnimation) {
        const position = elapsed * 1000 - coastStart;
        coastAnimation.seek(Math.min(position, coastAnimation.duration), true);
        rotate(coast.x - coastX, coast.y - coastY); coastX = coast.x; coastY = coast.y;
        if (position >= coastAnimation.duration) stopCoast();
      }
      if (activePointer === null && !coastAnimation) planet.rotation.y += delta * Math.PI * 2 / 180;
      pinAnimation.seek(elapsed * 1000 % 4400, true); life.update(elapsed);
      const ease = 1 - Math.exp(-5 * delta);
      depth.rotation.y = THREE.MathUtils.lerp(depth.rotation.y, pointer.x * .1, ease);
      depth.rotation.x = THREE.MathUtils.lerp(depth.rotation.x, pointer.y * .065, ease);
      location.update(pulse.value, camera, label, width, height);
      renderer.render(scene, camera);
      if (!host.classList.contains('is-ready')) host.classList.add('is-ready');
      frame = requestAnimationFrame(render);
    };
    const resume = () => {
      if (!disposed && ready && inView && !document.hidden && exitProgress.get() < .995 && !frame) { host.dataset.motion = 'running'; previousTime = performance.now(); frame = requestAnimationFrame(render); }
    };
    const suspend = () => { cancelAnimationFrame(frame); frame = 0; release(false); stopCoast(); label.hidden = true; host.dataset.motion = 'paused'; };
    const onExit = (value: number) => {
      const departing = value > .12;
      if (departing && activePointer !== null) release(false);
      control.disabled = !ready || departing; control.tabIndex = ready && inView && !departing ? 0 : -1;
      if (value >= .995) suspend(); else resume();
    };
    const unlistenExit = exitProgress.on('change', onExit);
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting; control.tabIndex = inView && ready && exitProgress.get() <= .12 ? 0 : -1;
      if (inView) resume(); else suspend();
    }); observer.observe(host);
    const onVisibility = () => { if (document.hidden) suspend(); else resume(); };
    const onBlur = () => release(false);
    const onContextLost = (event: Event) => {
      event.preventDefault(); ready = false; control.disabled = true; suspend(); host.classList.remove('is-ready');
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    control.addEventListener('pointerdown', onDown); control.addEventListener('pointermove', onMove); control.addEventListener('keydown', onKey);
    for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) control.addEventListener(name, onUp as EventListener);
    window.addEventListener('pointermove', onPointer, { passive: true }); window.addEventListener('blur', onBlur);
    document.addEventListener('visibilitychange', onVisibility);
    Promise.all([load('/images/earth/cartoon-map.svg', true), load('/images/earth/water-mask.svg'), load('/images/earth/shore-distance.png')]).then(([map, water, shore]) => {
      if (disposed) return;
      surfaceMaterial.uniforms.uSurface.value = map; surfaceMaterial.uniforms.uWater.value = water;
      surfaceMaterial.uniforms.uShore.value = shore;
      ready = true; onExit(exitProgress.get()); resume();
    }).catch(() => { /* The CSS globe remains visible if WebGL textures fail. */ });
    return () => {
      disposed = true; unlistenExit(); suspend(); pinAnimation.cancel(); life.dispose(); location.dispose();
      control.disabled = true; control.removeEventListener('pointerdown', onDown); control.removeEventListener('pointermove', onMove); control.removeEventListener('keydown', onKey);
      for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) control.removeEventListener(name, onUp as EventListener);
      window.removeEventListener('pointermove', onPointer); window.removeEventListener('blur', onBlur); document.removeEventListener('visibilitychange', onVisibility);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost); resizeObserver.disconnect(); observer.disconnect(); host.classList.remove('is-ready', 'is-dragging');
      textures.forEach(texture => texture.dispose());
      for (const geometry of [surfaceGeometry, outlineGeometry, atmosphereGeometry, starsGeometry]) geometry.dispose();
      for (const material of [surfaceMaterial, outlineMaterial, atmosphereMaterial, starsMaterial]) material.dispose();
      renderer.dispose(); renderer.domElement.remove();
    };
  }, [exitProgress]);
  return <div className="earth-canvas" ref={container}>
    <button ref={interaction} className="earth-interaction" disabled tabIndex={-1} aria-label="Rotate Earth" aria-describedby="earth-instructions" />
    <span id="earth-instructions" className="sr-only">Drag or use arrow keys to rotate the globe. Home returns to New York City, where I’m based.</span>
    <span className="earth-hint" aria-hidden="true">↔ &nbsp; DRAG TO SPIN</span>
    <div ref={locationLabel} className="earth-location" hidden><span>NEW YORK CITY</span><small>Based here · 40.71° N, 74.01° W</small></div>
  </div>;
}
