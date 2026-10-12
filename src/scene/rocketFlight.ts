import * as THREE from 'three';
import { createParticleField, createRocketAssembly } from './rocketParticles';

export const ROCKET_RETURN_DELAY = 5000;
const IGNITION_DURATION = 550, FLIGHT_DURATION = 2300, ASSEMBLY_DURATION = 1200;
const ASSEMBLY_START = ROCKET_RETURN_DELAY - ASSEMBLY_DURATION;
type Particle = { position: THREE.Vector3; velocity: THREE.Vector3; age: number; life: number; size: number; seed: number };

/** The flight and its effects live above the page, beyond the cropped moon backdrop. */
export function createRocketFlight(
  rocket: THREE.Group, camera: THREE.Camera, host: HTMLElement,
  onLaunch: () => void, onReturn: () => void,
) {
  let active: (() => void) | null = null;
  const launch = () => {
    if (active) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' }); }
    catch { return; }
    const pixelRatio = Math.min(window.devicePixelRatio, 1.25);
    renderer.setPixelRatio(pixelRatio); renderer.autoClear = false;
    const canvas = renderer.domElement;
    canvas.className = 'rocket-flight'; canvas.setAttribute('aria-hidden', 'true'); canvas.dataset.phase = 'ignition';
    document.body.appendChild(canvas);
    const scene = new THREE.Scene();
    const view = new THREE.OrthographicCamera(0, window.innerWidth, window.innerHeight, 0, 1, 3000);
    view.position.z = 1800;
    scene.add(new THREE.HemisphereLight('#e9e5ff', '#4b426a', 1.6));
    const sun = new THREE.DirectionalLight('#fff0dc', 2.8); sun.position.set(-650, 900, 1000); scene.add(sun);
    const rim = new THREE.DirectionalLight('#9facf0', 1.1); rim.position.set(650, 150, -100); scene.add(rim);

    rocket.updateWorldMatrix(true, true);
    const flying = rocket.clone(true);
    rocket.matrixWorld.decompose(flying.position, flying.quaternion, flying.scale);
    const worldScale = flying.scale.clone(), orientation = flying.quaternion.clone();
    const projected = flying.position.clone().project(camera), rect = host.getBoundingClientRect();
    const startX = (rect.left + (projected.x + 1) * rect.width / 2) / window.innerWidth;
    const startY = (window.innerHeight - rect.top - (1 - projected.y) * rect.height / 2) / window.innerHeight;
    const depth = flying.position.z, initialScale = rect.width / 1440;
    flying.scale.multiplyScalar(initialScale); scene.add(flying);

    // Fade copied materials without changing the original rocket.
    const bodyMaterials = new Map<THREE.Material, THREE.Material>();
    flying.traverse(object => {
      if (!(object instanceof THREE.Mesh)) return;
      const copy = (original: THREE.Material) => {
        if (!bodyMaterials.has(original)) {
          const material = original.clone(); material.transparent = true;
          bodyMaterials.set(original, material);
        }
        return bodyMaterials.get(original)!;
      };
      object.material = Array.isArray(object.material) ? object.material.map(copy) : copy(object.material);
    });
    const assembly = createRocketAssembly(flying, scene, pixelRatio);
    const smokeField = createParticleField(scene, 90, pixelRatio, true);
    const fireField = createParticleField(scene, 140, pixelRatio);
    const smoke: Particle[] = [], fire: Particle[] = [];
    const smokeColor = new THREE.Color('#ece9e1'), hot = new THREE.Color('#fff3c7'), ember = new THREE.Color('#f46538');
    const particleColor = new THREE.Color(), nozzle = new THREE.Vector3(), exhaust = new THREE.Vector3();
    const surface = new THREE.Vector3(), tangent = new THREE.Vector3(), zAxis = new THREE.Vector3(0, 0, 1);
    const turn = new THREE.Quaternion();
    let smokeCarry = 0, fireCarry = 0;

    const jets = [
      { radius: 12, length: 82, color: '#ff7545', opacity: .5 },
      { radius: 8, length: 62, color: '#ffc56b', opacity: .85 },
      { radius: 4, length: 42, color: '#fff7da', opacity: 1 },
    ].map(({ radius, length, color, opacity }, index) => {
      const geometry = new THREE.ConeGeometry(radius, length, 24, 12);
      geometry.rotateZ(Math.PI); geometry.translate(0, -length / 2 - 3, 0);
      const vertices = Float32Array.from(geometry.getAttribute('position').array);
      const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity, depthWrite: false, toneMapped: false });
      const mesh = new THREE.Mesh(geometry, material); mesh.renderOrder = 1; flying.add(mesh);
      return { mesh, geometry, material, vertices, length, index };
    });
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const started = performance.now();
    let frame = 0, timer = 0, previous = started, lastDraw = 0, finished = false, lost = false;
    const bounds = new THREE.Box3();
    const opacity = parseFloat(getComputedStyle(host.closest('.contact-moon-art') ?? host).opacity) || 1;

    const cleanup = () => {
      if (finished) return;
      finished = true; cancelAnimationFrame(frame); window.clearTimeout(timer);
      window.removeEventListener('resize', resize); document.removeEventListener('visibilitychange', visibility);
      canvas.removeEventListener('webglcontextlost', contextLost);
      jets.forEach(jet => { jet.geometry.dispose(); jet.material.dispose(); });
      bodyMaterials.forEach(material => material.dispose());
      smokeField.dispose(); fireField.dispose(); assembly.dispose();
      // Geometry borrowed from the moon must survive relaunches.
      renderer.dispose(); renderer.forceContextLoss(); canvas.remove(); active = null;
    };
    const regenerate = () => { if (finished) return; cleanup(); onReturn(); };

    const updateParticles = (particles: Particle[], field: ReturnType<typeof createParticleField>, dt: number, scale: number, isSmoke: boolean) => {
      field.reset();
      for (let index = particles.length - 1; index >= 0; index--) {
        const particle = particles[index]; particle.age += dt;
        if (particle.age >= particle.life) { particles.splice(index, 1); continue; }
        particle.position.addScaledVector(particle.velocity, dt);
        const life = particle.age / particle.life;
        if (isSmoke) {
          particle.velocity.multiplyScalar(Math.exp(-dt * .5));
          particle.position.y += dt * 9 * scale;
          const alpha = Math.min(1, life * 8) * Math.pow(1 - life, 1.5) * .42;
          field.set(index, particle.position, particle.size * (1 + life * 2.2), alpha, smokeColor);
        } else {
          particle.position.x += Math.sin(particle.seed + particle.age * 28) * dt * 12 * scale;
          particleColor.copy(hot).lerp(ember, life);
          field.set(index, particle.position, particle.size * (1 - life * .8), Math.pow(1 - life, 1.3) * .9, particleColor);
        }
      }
      field.flush();
    };

    const render = (now: number) => {
      frame = 0;
      if (finished || lost || document.hidden) return;
      const age = now - started;
      if (age >= ROCKET_RETURN_DELAY) { regenerate(); return; }
      if (now - lastDraw < 1000 / 30 - 1) { frame = requestAnimationFrame(render); return; }
      const dt = Math.min((now - previous) / 1000, .06); previous = now; lastDraw = now;
      const scale = host.getBoundingClientRect().width / 1440;
      flying.scale.copy(worldScale).multiplyScalar(scale);
      const x = startX * window.innerWidth, y = startY * window.innerHeight;
      const p = THREE.MathUtils.clamp((age - IGNITION_DURATION) / FLIGHT_DURATION, 0, 1);
      // Rise gently into flight, without a sudden speed change.
      const rise = .16 * p + .84 * p * p;
      const travel = window.innerHeight - y + 240;
      flying.position.set(x + rise * travel * (.4 + .15 * p), y + rise * travel + Math.min(age / IGNITION_DURATION, 1) * 5 * scale, depth * scale);
      flying.quaternion.copy(orientation).premultiply(turn.setFromAxisAngle(zAxis, -p * .12));
      flying.visible = p < 1;
      bodyMaterials.forEach(material => { material.opacity = 1; material.depthWrite = true; });
      canvas.style.opacity = String(opacity);

      if (age >= ASSEMBLY_START) {
        canvas.dataset.phase = 'materializing';
        // Track the current landing spot even after scrolling or resizing.
        rocket.updateWorldMatrix(true, true);
        rocket.matrixWorld.decompose(surface, flying.quaternion, flying.scale);
        const location = surface.clone().project(camera), current = host.getBoundingClientRect();
        flying.position.set(current.left + (location.x + 1) * current.width / 2, window.innerHeight - current.top - (1 - location.y) * current.height / 2, surface.z * scale);
        flying.scale.multiplyScalar(scale); flying.visible = true;
        const progress = (age - ASSEMBLY_START) / ASSEMBLY_DURATION;
        const fade = preference.matches ? THREE.MathUtils.smoothstep(age, ROCKET_RETURN_DELAY - 200, ROCKET_RETURN_DELAY) : THREE.MathUtils.smoothstep(progress, .2, .95);
        bodyMaterials.forEach(material => { material.opacity = fade; material.depthWrite = false; });
        jets.forEach(jet => { jet.mesh.visible = false; });
        flying.updateWorldMatrix(true, true);
        if (!preference.matches) assembly.update(progress, scale); else assembly.clear();
      } else if (preference.matches) {
        flying.position.set(x, y, depth * scale);
        canvas.style.opacity = String(Math.max(0, 1 - age / 180) * opacity);
        canvas.dataset.phase = age < 180 ? 'ignition' : 'departed';
        jets.forEach(jet => { jet.mesh.visible = false; });
      } else {
        canvas.dataset.phase = age < IGNITION_DURATION ? 'ignition' : p < 1 ? 'flying' : 'departed';
        const power = THREE.MathUtils.smoothstep(age, 0, IGNITION_DURATION);
        for (const jet of jets) {
          jet.mesh.visible = p < 1;
          jet.mesh.scale.y = power * (1 + .13 * Math.sin(age * .029 + jet.index) + .06 * Math.sin(age * .067));
          const positions = jet.geometry.getAttribute('position');
          for (let vertex = 0; vertex < positions.count; vertex++) {
            const offset = vertex * 3, distance = -jet.vertices[offset + 1] / jet.length;
            const wave = Math.sin(distance * 13 - age * .035 + jet.index) * distance * 3;
            positions.setXYZ(vertex, jet.vertices[offset] + wave, jet.vertices[offset + 1], jet.vertices[offset + 2] + Math.cos(distance * 17 - age * .026) * distance * 2);
          }
          positions.needsUpdate = true;
        }
        flying.updateWorldMatrix(true, true);
        nozzle.set(0, -7, 0).applyMatrix4(flying.matrixWorld);
        exhaust.set(0, -1, 0).applyQuaternion(flying.quaternion).normalize();
        tangent.set(-exhaust.y, exhaust.x, 0);
        if (age < 1550) {
          smokeCarry += dt * (age < 800 ? 75 : 25);
          while (smokeCarry >= 1 && smoke.length < 90) {
            smokeCarry -= 1;
            const side = Math.random() * 2 - 1;
            surface.set(x, y - 10 * scale, depth * scale);
            smoke.push({ position: surface.clone().addScaledVector(tangent, side * 20 * scale), velocity: tangent.clone().multiplyScalar(side * (30 + Math.random() * 45) * scale).add(new THREE.Vector3(0, 8 * scale, 0)), age: 0, life: 1.5 + Math.random() * .9, size: (35 + Math.random() * 30) * scale, seed: Math.random() * 10 });
          }
        }
        if (p < 1) {
          fireCarry += dt * 135 * power;
          while (fireCarry >= 1 && fire.length < 140) {
            fireCarry -= 1;
            fire.push({ position: nozzle.clone().addScaledVector(tangent, (Math.random() - .5) * 10 * scale), velocity: exhaust.clone().multiplyScalar((100 + Math.random() * 160) * scale).addScaledVector(tangent, (Math.random() - .5) * 38 * scale), age: 0, life: .28 + Math.random() * .35, size: (8 + Math.random() * 10) * scale, seed: Math.random() * 10 });
          }
        }
      }
      if (preference.matches) { smoke.length = 0; fire.length = 0; }
      updateParticles(smoke, smokeField, dt, scale, true); updateParticles(fire, fireField, dt, scale, false);
      flying.updateWorldMatrix(true, true);
      bounds.makeEmpty();
      if (flying.visible) bounds.setFromObject(flying);
      bounds.union(smokeField.bounds).union(fireField.bounds).union(assembly.bounds);
      renderer.setScissorTest(false); renderer.clear();
      if (!bounds.isEmpty()) {
        const left = Math.max(0, Math.floor(bounds.min.x - 8)), bottom = Math.max(0, Math.floor(bounds.min.y - 8));
        const right = Math.min(window.innerWidth, Math.ceil(bounds.max.x + 8)), top = Math.min(window.innerHeight, Math.ceil(bounds.max.y + 8));
        if (right > left && top > bottom) {
          renderer.setScissor(left, bottom, right - left, top - bottom); renderer.setScissorTest(true); renderer.render(scene, view);
        }
      }
      frame = requestAnimationFrame(render);
    };
    const resize = () => {
      view.right = window.innerWidth; view.top = window.innerHeight; view.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      if (!frame && !finished && !lost && !document.hidden) frame = requestAnimationFrame(render);
    };
    const visibility = () => {
      cancelAnimationFrame(frame); frame = 0;
      if (performance.now() - started >= ROCKET_RETURN_DELAY) regenerate();
      else if (!document.hidden && !lost) { previous = performance.now(); frame = requestAnimationFrame(render); }
    };
    const contextLost = (event: Event) => { event.preventDefault(); lost = true; cancelAnimationFrame(frame); frame = 0; canvas.style.opacity = '0'; };
    active = cleanup;
    window.addEventListener('resize', resize); document.addEventListener('visibilitychange', visibility);
    canvas.addEventListener('webglcontextlost', contextLost);
    timer = window.setTimeout(regenerate, ROCKET_RETURN_DELAY);
    onLaunch(); resize();
    return true;
  };
  return { launch, isLaunching: () => active !== null, cancel: () => active?.() };
}
