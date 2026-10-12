import * as THREE from 'three';

/** Soft point sprites share one draw call per effect, with no per-particle meshes. */
export function createParticleField(scene: THREE.Scene, count: number, pixelRatio: number, smoke = false) {
  const positions = new Float32Array(count * 3), colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count), alphas = new Float32Array(count);
  const geometry = new THREE.BufferGeometry();
  for (const [name, array, size] of [
    ['position', positions, 3], ['color', colors, 3], ['size', sizes, 1], ['alpha', alphas, 1],
  ] as const) geometry.setAttribute(name, new THREE.BufferAttribute(array, size).setUsage(THREE.DynamicDrawUsage));
  const material = new THREE.ShaderMaterial({
    uniforms: { pixelRatio: { value: pixelRatio } },
    vertexShader: `
      attribute float size;
      attribute float alpha;
      attribute vec3 color;
      uniform float pixelRatio;
      varying vec3 particleColor;
      varying float particleAlpha;
      void main() {
        particleColor = color;
        particleAlpha = alpha;
        gl_PointSize = max(1.0, size * pixelRatio);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: `
      varying vec3 particleColor;
      varying float particleAlpha;
      void main() {
        float radius = length(gl_PointCoord - vec2(0.5)) * 2.0;
        if (radius > 1.0 || particleAlpha < 0.001) discard;
        float softEdge = 1.0 - smoothstep(0.0, 1.0, radius);
        gl_FragColor = vec4(particleColor, particleAlpha * pow(softEdge, ${smoke ? '1.1' : '1.8'}));
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
    transparent: true, depthWrite: false, depthTest: false,
    blending: smoke ? THREE.NormalBlending : THREE.AdditiveBlending,
  });
  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false; points.renderOrder = smoke ? 0 : 2;
  scene.add(points);
  const bounds = new THREE.Box3(), margin = new THREE.Vector3(), corner = new THREE.Vector3();
  return {
    bounds,
    reset() { bounds.makeEmpty(); alphas.fill(0); },
    set(index: number, position: THREE.Vector3, size: number, alpha: number, color: THREE.Color) {
      position.toArray(positions, index * 3); color.toArray(colors, index * 3);
      sizes[index] = size; alphas[index] = alpha;
      if (alpha > .001) {
        margin.set(size / 2, size / 2, 0);
        bounds.expandByPoint(corner.copy(position).sub(margin));
        bounds.expandByPoint(corner.copy(position).add(margin));
      }
    },
    flush() { for (const attribute of Object.values(geometry.attributes)) attribute.needsUpdate = true; },
    dispose() { scene.remove(points); geometry.dispose(); material.dispose(); },
  };
}

export function createRocketAssembly(rocket: THREE.Group, scene: THREE.Scene, pixelRatio: number) {
  rocket.updateWorldMatrix(true, true);
  const inverse = rocket.matrixWorld.clone().invert();
  const surfaces: { mesh: THREE.Mesh; offset: number; count: number; transform: THREE.Matrix4 }[] = [];
  let total = 0;
  rocket.traverse(object => {
    if (!(object instanceof THREE.Mesh)) return;
    const count = object.geometry.getAttribute('position').count;
    surfaces.push({ mesh: object, offset: total, count, transform: inverse.clone().multiply(object.matrixWorld) });
    total += count;
  });
  const samples = Array.from({ length: 360 }, () => {
    const vertex = Math.floor(Math.random() * total);
    const surface = surfaces.find(surface => vertex < surface.offset + surface.count)!;
    const target = new THREE.Vector3().fromBufferAttribute(surface.mesh.geometry.getAttribute('position'), vertex - surface.offset).applyMatrix4(surface.transform);
    const scatter = new THREE.Vector3(Math.random() - .5, Math.random() - .35, Math.random() - .5).normalize().multiplyScalar(70 + Math.random() * 110);
    const material = Array.isArray(surface.mesh.material) ? surface.mesh.material[0] : surface.mesh.material;
    const color = 'color' in material ? (material.color as THREE.Color).clone() : new THREE.Color('#ccece8');
    return { target, scatter, color: color.lerp(new THREE.Color('#d7f5ec'), .4), size: 2.2 + Math.random() * 2.3, turn: Math.random() * Math.PI * 2 };
  });
  const field = createParticleField(scene, samples.length, pixelRatio);
  const position = new THREE.Vector3();
  return {
    bounds: field.bounds,
    update(progress: number, scale: number) {
      field.reset();
      const gather = THREE.MathUtils.smoothstep(progress, 0, 1);
      const alpha = Math.sin(Math.PI * progress) * .95;
      samples.forEach((sample, index) => {
        position.copy(sample.scatter).multiplyScalar(1 - gather);
        const turn = sample.turn + progress * 2.4;
        const x = position.x;
        position.x = x * Math.cos(turn) - position.z * Math.sin(turn);
        position.z = x * Math.sin(turn) + position.z * Math.cos(turn);
        position.add(sample.target).applyMatrix4(rocket.matrixWorld);
        field.set(index, position, sample.size * Math.max(.7, scale), alpha, sample.color);
      });
      field.flush();
    },
    clear() { field.reset(); field.flush(); },
    dispose: field.dispose,
  };
}
