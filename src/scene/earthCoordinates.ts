import * as THREE from 'three';

export const EARTH_RADIUS = 1.45;
export const LAND_ELEVATION = .042;
export const NEW_YORK = { latitude: 40.7128, longitude: -74.006 } as const;

/** Geographic coordinates -> the same UV orientation as our Natural Earth map. */
export function geographicPoint(latitude: number, longitude: number, radius = 1, target = new THREE.Vector3()) {
  const phi = (longitude + 180) * Math.PI / 180;
  const theta = (90 - latitude) * Math.PI / 180;
  return target.set(-Math.cos(phi) * Math.sin(theta), Math.cos(theta), Math.sin(phi) * Math.sin(theta)).multiplyScalar(radius);
}
