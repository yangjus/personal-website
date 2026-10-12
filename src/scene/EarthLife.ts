import * as THREE from 'three';
import { geographicPoint } from './earthCoordinates';

export function createEarthLife(planet: THREE.Group) {
  const geometries: THREE.BufferGeometry[] = [], materials: THREE.Material[] = [];
  const cloudMaterial = new THREE.MeshLambertMaterial({ color: '#f9f3e6' });
  const birdMaterial = new THREE.MeshLambertMaterial({ color: '#fff8e8', side: THREE.DoubleSide });
  materials.push(cloudMaterial, birdMaterial);
  const dummy = new THREE.Object3D(), normal = new THREE.Vector3();

  const bubble = new THREE.SphereGeometry(1, 16, 12); geometries.push(bubble);
  // A rounded volume, with front puffs as well as a full middle; no tapered crescent tips.
  const shapes = [
    [-.07, -.015, 0, .072], [.003, 0, .005, .09], [.074, -.012, 0, .071],
    [-.03, .05, .01, .063], [.045, .04, .014, .063],
    [-.033, .004, .055, .062], [.035, .005, .05, .056],
  ];
  const clusters = [
    { lat: 20, lon: -40 }, { lat: -20, lon: -135 }, { lat: 7, lon: 75 },
    { lat: 48, lon: -155 }, { lat: -43, lon: 45 }, { lat: 38, lon: 135 },
  ];
  const clouds = new THREE.InstancedMesh(bubble, cloudMaterial, clusters.length * shapes.length);
  clouds.name = 'Smooth drifting cloud banks'; clouds.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  clouds.frustumCulled = false; planet.add(clouds);
  const east = new THREE.Vector3(), north = new THREE.Vector3(), basis = new THREE.Matrix4();
  const cloudRotation = new THREE.Quaternion(), center = new THREE.Vector3();

  const wingShape = new THREE.Shape();
  wingShape.moveTo(0, 0); wingShape.quadraticCurveTo(.045, .027, .115, -.012);
  wingShape.quadraticCurveTo(.055, -.013, .012, -.018); wingShape.closePath();
  const wingsGeometry = new THREE.ShapeGeometry(wingShape); geometries.push(wingsGeometry);
  const wings = new THREE.InstancedMesh(wingsGeometry, birdMaterial, 10);
  const bodies = new THREE.InstancedMesh(bubble, birdMaterial, 5);
  wings.instanceMatrix.setUsage(THREE.DynamicDrawUsage); bodies.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  wings.frustumCulled = bodies.frustumCulled = false;
  planet.add(wings, bodies);
  const flight = new THREE.Object3D(), wing = new THREE.Object3D();
  const facing = new THREE.Vector3(0, 0, 1), birdPosition = new THREE.Vector3();
  return {
    update(time: number) {
      let instance = 0;
      for (let i = 0; i < clusters.length; i++) {
        const cluster = clusters[i];
        const longitude = cluster.lon + time * 1.4;
        geographicPoint(cluster.lat + Math.sin(time * .35 + i) * 1.2, longitude, 1, normal);
        const phi = (longitude + 180) * Math.PI / 180;
        east.set(Math.sin(phi), 0, Math.cos(phi)); north.crossVectors(normal, east).normalize();
        basis.makeBasis(east, north, normal); cloudRotation.setFromRotationMatrix(basis);
        center.copy(normal).multiplyScalar(1.59 + Math.sin(time * .65 + i) * .008);
        for (const [x, y, z, radius] of shapes) {
          dummy.position.copy(center).addScaledVector(east, x).addScaledVector(north, y).addScaledVector(normal, z);
          dummy.quaternion.copy(cloudRotation); dummy.scale.set(radius, radius * .9, radius * .92);
          dummy.updateMatrix(); clouds.setMatrixAt(instance++, dummy.matrix);
        }
      }
      clouds.instanceMatrix.needsUpdate = true;
      for (let i = 0; i < 5; i++) {
        const phase = i * Math.PI * 2 / 5;
        geographicPoint(Math.sin(time * .32 + phase) * 25, -28 + i * 72 + time * 4.2, 1, normal);
        birdPosition.copy(normal).multiplyScalar(1.65 + Math.sin(time * 1.2 + phase) * .018);
        flight.position.copy(birdPosition); flight.quaternion.setFromUnitVectors(facing, normal);
        flight.rotateZ(-Math.PI / 2 + Math.cos(time * .32 + phase) * .3); flight.scale.setScalar(.9);
        flight.updateMatrix();
        wing.position.set(0, 0, 0); wing.rotation.set(0, 0, 0); wing.scale.set(.015, .039, .013);
        wing.updateMatrix(); dummy.matrix.multiplyMatrices(flight.matrix, wing.matrix); bodies.setMatrixAt(i, dummy.matrix);
        const flap = Math.sin(time * 5.5 + phase) * .5;
        for (let side = 0; side < 2; side++) {
          wing.scale.set(1, 1, 1); wing.rotation.y = side === 0 ? flap : Math.PI - flap;
          wing.updateMatrix(); dummy.matrix.multiplyMatrices(flight.matrix, wing.matrix); wings.setMatrixAt(i * 2 + side, dummy.matrix);
        }
      }
      wings.instanceMatrix.needsUpdate = bodies.instanceMatrix.needsUpdate = true;
    },
    dispose() {
      planet.remove(clouds, wings, bodies);
      for (const mesh of [clouds, wings, bodies]) mesh.dispose();
      geometries.forEach(item => item.dispose()); materials.forEach(item => item.dispose());
    },
  };
}
