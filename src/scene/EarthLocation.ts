import * as THREE from 'three';
import { EARTH_RADIUS, NEW_YORK, geographicPoint, LAND_ELEVATION } from './earthCoordinates';

export function createEarthLocation(planet: THREE.Group) {
  const location = new THREE.Group();
  const normal = geographicPoint(NEW_YORK.latitude, NEW_YORK.longitude);
  location.position.copy(normal).multiplyScalar(EARTH_RADIUS + LAND_ELEVATION + .007);
  location.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
  const stemGeometry = new THREE.CylinderGeometry(.005, .005, .105, 6);
  const dotGeometry = new THREE.SphereGeometry(.034, 16, 10);
  const ringGeometry = new THREE.RingGeometry(.046, .057, 32);
  const pale = new THREE.MeshBasicMaterial({ color: '#ffe4bd' });
  const copper = new THREE.MeshBasicMaterial({ color: '#f4b483' });
  const ringMaterial = new THREE.MeshBasicMaterial({ color: '#efb084', transparent: true, opacity: .45, side: THREE.DoubleSide, depthWrite: false });
  const stem = new THREE.Mesh(stemGeometry, pale); stem.position.y = .058;
  const dot = new THREE.Mesh(dotGeometry, copper); dot.position.y = .13;
  const ring = new THREE.Mesh(ringGeometry, ringMaterial); ring.rotation.x = -Math.PI / 2; ring.position.y = .004;
  const anchor = new THREE.Object3D(); anchor.position.y = .15;
  location.add(stem, dot, ring, anchor); planet.add(location);
  const point = new THREE.Vector3(), base = new THREE.Vector3(), center = new THREE.Vector3(), view = new THREE.Vector3();
  return {
    update(pulse: number, camera: THREE.Camera, label: HTMLDivElement, width: number, height: number) {
      ring.scale.setScalar(1 + pulse * .7); ringMaterial.opacity = .5 - pulse * .35;
      anchor.getWorldPosition(point); location.getWorldPosition(base); planet.getWorldPosition(center);
      view.copy(camera.position).sub(center).normalize();
      const visible = base.sub(center).normalize().dot(view) > .3;
      point.project(camera);
      label.hidden = !visible || Math.abs(point.x) > 1 || Math.abs(point.y) > 1;
      if (!label.hidden) label.style.transform = `translate3d(${((point.x + 1) * width / 2).toFixed(1)}px,${((-point.y + 1) * height / 2).toFixed(1)}px,0) translate(12px,-50%)`;
    },
    dispose() {
      planet.remove(location);
      for (const geometry of [stemGeometry, dotGeometry, ringGeometry]) geometry.dispose();
      for (const material of [pale, copper, ringMaterial]) material.dispose();
    },
  };
}
