'use client';

import { animate } from 'animejs/animation';
import { useEffect, useRef, type RefObject } from 'react';
import * as THREE from 'three';
import { createRocketFlight } from './rocketFlight';

const RADIUS = 480;
// Positions use the same projection as the illustrated fallback.
const craterLocations = [
  [-235, 335, 55, 22], [-35, 400, 32, 13], [130, 295, 70, 28],
  [-160, 155, 88, 34], [310, 155, 65, 26], [25, 90, 36, 14],
  [-350, 130, 30, 14], [175, 80, 24, 10], [-90, 290, 18, 8],
  [210, 370, 28, 12], [-280, 235, 20, 8], [260, 255, 21, 9],
  [65, 210, 24, 10], [-20, 185, 14, 6], [375, 75, 28, 12],
  [-220, 65, 22, 9], [110, 420, 20, 9], [190, 185, 14, 6],
];

function createSurface() {
  const geometry = new THREE.SphereGeometry(RADIUS, 192, 128);
  const positions = geometry.getAttribute('position');
  const colors = new Float32Array(positions.count * 3);
  const craters = craterLocations.map(([x, y, radius, depth]) => ({
    center: new THREE.Vector3(x, y, Math.sqrt(RADIUS * RADIUS - x * x - y * y)).normalize(), radius, depth,
  }));
  const normal = new THREE.Vector3(), color = new THREE.Color();
  const base = new THREE.Color('#c9c4da'), bowl = new THREE.Color('#9991b4');
  for (let i = 0; i < positions.count; i++) {
    normal.fromBufferAttribute(positions, i).normalize();
    let height = .6 * Math.sin(normal.x * 31) * Math.sin(normal.y * 23) * Math.cos(normal.z * 27);
    let darkness = 0;
    for (const crater of craters) {
      const distance = Math.sqrt(Math.max(0, 2 - 2 * normal.dot(crater.center))) * RADIUS / crater.radius;
      if (distance > 1.4) continue;
      const depression = Math.pow(Math.max(0, 1 - distance * distance), 2);
      const rim = Math.exp(-Math.pow((distance - .94) / .13, 2));
      height += crater.depth * (-depression + .32 * rim);
      darkness = Math.max(darkness, depression * .45);
    }
    positions.setXYZ(i, normal.x * (RADIUS + height), normal.y * (RADIUS + height), normal.z * (RADIUS + height));
    color.copy(base).lerp(bowl, darkness);
    color.multiplyScalar(.98 + .02 * Math.sin(normal.x * 11 + normal.y * 8));
    color.toArray(colors, i * 3);
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  return geometry;
}

export default function Moon({ onReady, controlRef }: { onReady: (ready: boolean) => void; controlRef: RefObject<HTMLButtonElement | null> }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    const section = host?.closest('section');
    const control = controlRef.current;
    if (!host || !section || !control) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' }); }
    catch { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.domElement.setAttribute('aria-hidden', 'true');
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-720, 720, 560, -480, 1, 3000);
    camera.position.z = 1800;
    const planet = new THREE.Group();
    scene.add(planet);
    scene.add(new THREE.HemisphereLight('#e9e5ff', '#4b426a', 1.6));
    const sunlight = new THREE.DirectionalLight('#fff0dc', 2.8);
    sunlight.position.set(-650, 900, 1000);
    sunlight.castShadow = true;
    sunlight.shadow.mapSize.set(1024, 1024);
    Object.assign(sunlight.shadow.camera, { left: -620, right: 620, top: 620, bottom: -620, near: 1, far: 2600 });
    sunlight.shadow.normalBias = 2;
    scene.add(sunlight);
    const rimLight = new THREE.DirectionalLight('#9facf0', 1.1);
    rimLight.position.set(650, 150, -100); scene.add(rimLight);

    const surface = new THREE.Mesh(createSurface(), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .95 }));
    surface.name = 'Cratered moon'; surface.receiveShadow = true; planet.add(surface);
    const outline = new THREE.Mesh(new THREE.SphereGeometry(483, 64, 48), new THREE.MeshBasicMaterial({ color: '#625879', side: THREE.BackSide }));
    planet.add(outline);

    const cream = new THREE.MeshStandardMaterial({ color: '#fff0d7', roughness: .48 });
    const coral = new THREE.MeshStandardMaterial({ color: '#e69284', roughness: .48 });
    const metal = new THREE.MeshStandardMaterial({ color: '#7b718a', roughness: .45, metalness: .35 });
    const glass = new THREE.MeshStandardMaterial({ color: '#79c9df', roughness: .15, metalness: .4 });
    const anchor = new THREE.Group(), rocket = new THREE.Group();
    anchor.name = 'Rocket landing'; rocket.name = 'Rocket';
    const landingNormal = new THREE.Vector3(200, 435, 75).normalize();
    anchor.position.copy(landingNormal).multiplyScalar(RADIUS + 18);
    anchor.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), landingNormal);
    anchor.add(rocket); planet.add(anchor);
    const mesh = (geometry: THREE.BufferGeometry, material: THREE.Material, parent: THREE.Group = rocket) => {
      const part = new THREE.Mesh(geometry, material); part.castShadow = part.receiveShadow = true; parent.add(part); return part;
    };
    const profile = [[0, 0], [16, 0], [22, 15], [25, 42], [23, 66], [17, 87], [0, 111]].map(([x, y]) => new THREE.Vector2(x, y));
    mesh(new THREE.LatheGeometry(profile, 48), cream);
    const nose = mesh(new THREE.ConeGeometry(18.5, 29, 48), coral); nose.position.y = 98;
    const collar = mesh(new THREE.CylinderGeometry(20, 17, 12, 48), metal); collar.position.y = 4;
    const windowRim = mesh(new THREE.TorusGeometry(13, 3, 12, 40), metal); windowRim.position.set(0, 56, 24);
    const windowGlass = mesh(new THREE.SphereGeometry(12, 32, 20), glass); windowGlass.scale.z = .3; windowGlass.position.set(0, 56, 25);
    const glint = mesh(new THREE.SphereGeometry(2.5, 12, 8), new THREE.MeshBasicMaterial({ color: '#f2ffff' })); glint.position.set(-4, 60, 29);
    const finShape = new THREE.Shape(); finShape.moveTo(16, 3); finShape.lineTo(40, -6); finShape.quadraticCurveTo(41, 23, 22, 40); finShape.closePath();
    const finGeometry = new THREE.ExtrudeGeometry(finShape, { depth: 6, bevelEnabled: true, bevelSize: 2, bevelThickness: 2, bevelSegments: 3, steps: 1 });
    finGeometry.translate(0, 0, -3);
    for (let i = 0; i < 3; i++) {
      const angle = i * Math.PI * 2 / 3;
      const fin = mesh(finGeometry, coral); fin.rotation.y = angle;
      const start = new THREE.Vector3(Math.cos(angle) * 16, 2, Math.sin(angle) * 16);
      const end = new THREE.Vector3(Math.cos(angle) * 32, -17, Math.sin(angle) * 32);
      const leg = mesh(new THREE.CylinderGeometry(2, 2, start.distanceTo(end), 12), metal);
      leg.position.copy(start).add(end).multiplyScalar(.5);
      leg.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), end.clone().sub(start).normalize());
      const foot = mesh(new THREE.CylinderGeometry(8, 9, 3, 20), metal); foot.position.copy(end);
    }

    const stars = new THREE.Group(); scene.add(stars);
    for (const [x, y, size] of [[-381, 443, 15], [375, 335, 11], [90, 523, 8]]) {
      const shape = new THREE.Shape();
      for (let i = 0; i < 8; i++) {
        const angle = i * Math.PI / 4, radius = i % 2 ? size * .3 : size;
        if (i === 0) shape.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
        else shape.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
      }
      shape.closePath();
      const star = new THREE.Mesh(new THREE.ShapeGeometry(shape), new THREE.MeshBasicMaterial({ color: '#f0e4cd', transparent: true, opacity: .8 }));
      star.position.set(x, y, -500); stars.add(star);
    }
    const pose = { turn: 0, bob: 0, rocket: 0, sparkle: 1 };
    const drift = animate(pose, { turn: [-.012, .012], bob: [0, 8], duration: 6500, alternate: true, loop: true, ease: 'inOutSine', autoplay: false });
    const hover = animate(pose, { rocket: [0, 5], duration: 2800, alternate: true, loop: true, ease: 'inOutSine', autoplay: false });
    const twinkle = animate(pose, { sparkle: [.5, 1], duration: 2300, alternate: true, loop: true, ease: 'inOutSine', autoplay: false });
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let disposed = false, contextLost = false, inView = false, frame = 0, previous = 0, elapsed = 0, rendered = false;
    const flight = createRocketFlight(rocket, camera, host, () => {
      rocket.visible = false;
      control.disabled = true; control.dataset.launchState = 'launching';
      suspend(); draw();
    }, () => {
      rocket.visible = true; control.dataset.launchState = 'ready';
      draw(); resume();
    });
    const box = new THREE.Box3(), corner = new THREE.Vector3();
    const updateControl = () => {
      control.disabled = !rendered || contextLost || !inView || flight.isLaunching();
      control.tabIndex = inView ? 0 : -1;
      if (!rendered || contextLost || flight.isLaunching()) return;
      rocket.updateWorldMatrix(true, true); box.setFromObject(rocket);
      const rect = host.getBoundingClientRect(), parent = section.getBoundingClientRect();
      let left = Infinity, top = Infinity, right = -Infinity, bottom = -Infinity;
      for (const x of [box.min.x, box.max.x]) for (const y of [box.min.y, box.max.y]) for (const z of [box.min.z, box.max.z]) {
        corner.set(x, y, z).project(camera);
        const px = rect.left + (corner.x + 1) * rect.width / 2 - parent.left;
        const py = rect.top + (1 - corner.y) * rect.height / 2 - parent.top;
        left = Math.min(left, px); right = Math.max(right, px); top = Math.min(top, py); bottom = Math.max(bottom, py);
      }
      const width = Math.max(44, right - left + 8), height = Math.max(44, bottom - top + 8);
      control.style.left = `${Math.round((left + right - width) / 2)}px`;
      control.style.top = `${Math.round((top + bottom - height) / 2)}px`;
      control.style.width = `${Math.ceil(width)}px`; control.style.height = `${Math.ceil(height)}px`;
      const hintHalf = ((control.firstElementChild as HTMLElement | null)?.offsetWidth ?? 160) / 2;
      const center = (left + right) / 2 + parent.left;
      const hintCenter = THREE.MathUtils.clamp(center, hintHalf + 16, window.innerWidth - hintHalf - 16);
      control.style.setProperty('--rocket-hint-offset', `${Math.round(hintCenter - center)}px`);
      control.dataset.positioned = 'true';
    };
    const draw = () => {
      if (disposed || contextLost) return;
      renderer.render(scene, camera);
      if (!rendered) { rendered = true; onReady(true); }
      updateControl();
    };
    const render = (time: number) => {
      frame = 0;
      if (disposed || contextLost || !inView || document.hidden || preference.matches || flight.isLaunching()) { host.dataset.motion = 'paused'; return; }
      if (time - previous < 1000 / 30 - 1) { frame = requestAnimationFrame(render); return; }
      elapsed += Math.min(time - previous, 60); previous = time;
      drift.seek(elapsed % 13000, true); hover.seek(elapsed % 5600, true); twinkle.seek(elapsed % 4600, true);
      planet.rotation.z = pose.turn; planet.rotation.y = pose.turn * .5; planet.position.y = pose.bob;
      rocket.position.y = pose.rocket; rocket.rotation.y = Math.sin(elapsed / 5600) * .05;
      stars.children.forEach((star, index) => { star.scale.setScalar(.9 + .1 * pose.sparkle); (star as THREE.Mesh<THREE.ShapeGeometry, THREE.MeshBasicMaterial>).material.opacity = .35 + .5 * pose.sparkle + index * .03; });
      host.dataset.motion = 'running'; host.dataset.frame = String(Math.round(elapsed));
      draw(); frame = requestAnimationFrame(render);
    };
    const suspend = () => { cancelAnimationFrame(frame); frame = 0; host.dataset.motion = 'paused'; };
    const resume = () => {
      if (disposed || contextLost || !inView || document.hidden || preference.matches || flight.isLaunching()) return;
      if (!frame) { previous = performance.now(); frame = requestAnimationFrame(render); }
    };
    const resize = () => { renderer.setSize(host.clientWidth, host.clientHeight); draw(); };
    const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(host); resize();
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; updateControl(); if (inView) resume(); else suspend(); }); observer.observe(section);
    const onPreference = () => {
      suspend(); planet.rotation.set(0, 0, 0); planet.position.y = 0; rocket.position.y = 0; rocket.rotation.y = 0;
      draw(); resume();
    };
    const onVisibility = () => { if (document.hidden) suspend(); else resume(); };
    const launch = () => { if (!control.disabled) flight.launch(); };
    const onContextLost = (event: Event) => {
      event.preventDefault(); contextLost = true; rendered = false; suspend(); flight.cancel(); rocket.visible = true;
      control.disabled = true; control.dataset.positioned = 'false'; control.dataset.launchState = 'ready'; onReady(false);
    };
    const onContextRestored = () => { contextLost = false; resize(); resume(); };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);
    preference.addEventListener('change', onPreference); document.addEventListener('visibilitychange', onVisibility);
    control.addEventListener('click', launch); window.addEventListener('scroll', updateControl, { passive: true });
    onPreference();
    return () => {
      disposed = true; suspend(); flight.cancel(); observer.disconnect(); resizeObserver.disconnect();
      control.removeEventListener('click', launch); window.removeEventListener('scroll', updateControl);
      control.disabled = true; control.dataset.positioned = 'false'; control.dataset.launchState = 'ready';
      preference.removeEventListener('change', onPreference); document.removeEventListener('visibilitychange', onVisibility);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);
      drift.cancel(); hover.cancel(); twinkle.cancel();
      const geometries = new Set<THREE.BufferGeometry>(), materials = new Set<THREE.Material>();
      scene.traverse(object => { if (object instanceof THREE.Mesh) { geometries.add(object.geometry); for (const material of Array.isArray(object.material) ? object.material : [object.material]) materials.add(material); } });
      geometries.forEach(geometry => geometry.dispose()); materials.forEach(material => material.dispose());
      sunlight.shadow.dispose(); renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove();
    };
  }, [onReady, controlRef]);

  return <div ref={ref} className="moon-canvas" data-motion="paused" aria-hidden="true" />;
}
