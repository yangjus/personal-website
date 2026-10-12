import { useEffect, useRef } from 'react'
import type { MutableRefObject } from 'react'
import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  AmbientLight,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  Clock,
  Color,
  DirectionalLight,
  DoubleSide,
  FogExp2,
  Group,
  HemisphereLight,
  InstancedMesh,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Points,
  PointsMaterial,
  Scene,
  SRGBColorSpace,
  WebGLRenderer,
} from 'three'
import type { DevicePerformance } from '../hooks/useDevicePerformance'

interface PortfolioSceneProps {
  progressRef: MutableRefObject<number>
  prefersReducedMotion: boolean
  device: DevicePerformance
}

interface AnimatedBillboard {
  frame: Mesh
  panel: Mesh
  pulseOffset: number
}

interface HoverLane {
  group: Group
  speed: number
  offset: number
  sway: number
  laneX: number
  baseY: number
}

function hexColor(value: string) {
  return new Color(value)
}

export function PortfolioScene({
  progressRef,
  prefersReducedMotion,
  device,
}: PortfolioSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) {
      return
    }

    const renderer = new WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !device.isMobile,
      powerPreference: 'high-performance',
    })
    renderer.outputColorSpace = SRGBColorSpace
    renderer.toneMapping = ACESFilmicToneMapping
    renderer.toneMappingExposure = device.enableEffects ? 1.18 : 1.08
    renderer.setPixelRatio(device.dpr)

    const scene = new Scene()
    scene.fog = new FogExp2(hexColor('#040812').getHex(), device.isMobile ? 0.026 : 0.02)

    const camera = new PerspectiveCamera(
      device.isMobile ? 50 : 42,
      1,
      0.1,
      720,
    )
    camera.position.set(0, 2.05, 10)

    const resize = () => {
      const width = window.innerWidth
      const height = window.innerHeight

      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    resize()
    window.addEventListener('resize', resize)

    const city = new Group()
    scene.add(city)

    const ambient = new AmbientLight('#86a8ff', 1.45)
    const hemisphere = new HemisphereLight('#c9ebff', '#04070d', 1.3)
    const keyLight = new DirectionalLight('#9fd3ff', 1.8)
    keyLight.position.set(5, 14, 8)
    const rimLight = new PointLight('#ff9366', 80, 28, 2)
    rimLight.position.set(0, 3.2, 8)
    const skylineLight = new PointLight('#9ee9ff', 120, 180, 2)
    skylineLight.position.set(0, 18, -190)

    scene.add(ambient, hemisphere, keyLight, rimLight, skylineLight)

    const road = new Mesh(
      new PlaneGeometry(24, 560),
      new MeshPhysicalMaterial({
        color: '#05070d',
        roughness: 0.14,
        metalness: 0.72,
        clearcoat: 0.95,
        clearcoatRoughness: 0.18,
      }),
    )
    road.rotation.x = -Math.PI / 2
    road.position.set(0, -0.62, -220)
    city.add(road)

    const roadGlow = new Mesh(
      new PlaneGeometry(16, 560),
      new MeshBasicMaterial({
        color: '#294a78',
        transparent: true,
        opacity: 0.11,
        blending: AdditiveBlending,
      }),
    )
    roadGlow.rotation.x = -Math.PI / 2
    roadGlow.position.set(0, -0.605, -220)
    city.add(roadGlow)

    const shoulderMaterial = new MeshStandardMaterial({
      color: '#0a111a',
      roughness: 0.45,
      metalness: 0.48,
      emissive: hexColor('#07131f'),
      emissiveIntensity: 0.35,
    })

    ;[-1, 1].forEach((side) => {
      const shoulder = new Mesh(new PlaneGeometry(6, 560), shoulderMaterial)
      shoulder.rotation.x = -Math.PI / 2
      shoulder.position.set(side * 14.5, -0.58, -220)
      city.add(shoulder)
    })

    const laneMaterial = new MeshBasicMaterial({
      color: '#9ad7ff',
      transparent: true,
      opacity: 0.8,
      blending: AdditiveBlending,
    })

    for (let index = 0; index < 90; index += 1) {
      const segment = new Mesh(new PlaneGeometry(0.12, 3.2), laneMaterial)
      segment.rotation.x = -Math.PI / 2
      segment.position.set(0, -0.55, 8 - index * 6.1)
      city.add(segment)
    }

    const curbMaterial = new MeshBasicMaterial({
      color: '#ff7a65',
      transparent: true,
      opacity: 0.62,
      blending: AdditiveBlending,
    })

    ;[-1, 1].forEach((side) => {
      for (let index = 0; index < 72; index += 1) {
        const curb = new Mesh(new PlaneGeometry(0.16, 4.6), curbMaterial)
        curb.rotation.x = -Math.PI / 2
        curb.position.set(side * 9.55, -0.545, 2 - index * 7.4)
        city.add(curb)
      }
    })

    const skyline = new Group()
    skyline.position.z = -210
    city.add(skyline)

    const coreTowerMaterial = new MeshStandardMaterial({
      color: '#0f1c2e',
      roughness: 0.26,
      metalness: 0.9,
      emissive: hexColor('#1a355d'),
      emissiveIntensity: 0.95,
    })

    const coreTower = new Mesh(new BoxGeometry(9, 64, 9), coreTowerMaterial)
    coreTower.position.set(0, 30, 0)
    skyline.add(coreTower)

    const beam = new Mesh(
      new PlaneGeometry(7, 72),
      new MeshBasicMaterial({
        color: '#a2e9ff',
        transparent: true,
        opacity: 0.28,
        blending: AdditiveBlending,
        side: DoubleSide,
      }),
    )
    beam.position.set(0, 31, 2.5)
    skyline.add(beam)

    const halo = new Mesh(
      new PlaneGeometry(54, 54),
      new MeshBasicMaterial({
        color: '#5dbdff',
        transparent: true,
        opacity: 0.16,
        blending: AdditiveBlending,
        side: DoubleSide,
      }),
    )
    halo.position.set(0, 20, -8)
    skyline.add(halo)

    const buildingGeometry = new BoxGeometry(1, 1, 1)
    const buildingMaterial = new MeshStandardMaterial({
      color: '#0a1523',
      roughness: 0.34,
      metalness: 0.86,
      emissive: hexColor('#122840'),
      emissiveIntensity: 0.54,
    })
    const buildingCount = device.isMobile ? 90 : 160
    const buildings = new InstancedMesh(
      buildingGeometry,
      buildingMaterial,
      buildingCount,
    )
    const dummy = new Object3D()

    for (let index = 0; index < buildingCount; index += 1) {
      const side = index % 2 === 0 ? -1 : 1
      const depth = 8 - index * 4.25
      const width = 1.8 + ((index * 7) % 6) * 0.58
      const height = 12 + ((index * 13) % 10) * 3.4
      const thickness = 1.8 + ((index * 11) % 5) * 0.8
      const distance = 12 + ((index * 5) % 3) * 2.45

      dummy.position.set(side * distance, height * 0.5 - 0.8, depth)
      dummy.scale.set(width, height, thickness)
      dummy.rotation.y = side * 0.06
      dummy.updateMatrix()
      buildings.setMatrixAt(index, dummy.matrix)
    }

    city.add(buildings)

    const towerMaterial = new MeshStandardMaterial({
      color: '#09111c',
      roughness: 0.28,
      metalness: 0.9,
      emissive: hexColor('#16375b'),
      emissiveIntensity: 0.72,
    })

    const towerGroup = new Group()
    city.add(towerGroup)

    for (let index = 0; index < 18; index += 1) {
      const side = index % 2 === 0 ? -1 : 1
      const height = 32 + (index % 5) * 7
      const tower = new Mesh(
        new BoxGeometry(6 + (index % 3), height, 6 + (index % 2)),
        towerMaterial,
      )
      tower.position.set(side * (23 + (index % 3) * 4.8), height * 0.5 - 0.8, -36 - index * 18)
      tower.rotation.y = side * 0.12
      towerGroup.add(tower)
    }

    const billboardColors = ['#9fd5ff', '#78ffd8', '#b8c8ff']
    const billboards: AnimatedBillboard[] = []

    for (let index = 0; index < (device.isMobile ? 10 : 18); index += 1) {
      const side = index % 2 === 0 ? -1 : 1
      const width = 3.6 + (index % 3) * 1.25
      const height = 2.2 + (index % 2) * 1.2
      const frame = new Mesh(
        new BoxGeometry(width + 0.25, height + 0.25, 0.18),
        new MeshStandardMaterial({
          color: '#152033',
          roughness: 0.24,
          metalness: 0.88,
          emissive: hexColor('#0f1728'),
          emissiveIntensity: 0.35,
        }),
      )
      const panel = new Mesh(
        new PlaneGeometry(width, height),
        new MeshBasicMaterial({
          color: billboardColors[index % billboardColors.length],
          transparent: true,
          opacity: 0.3,
          blending: AdditiveBlending,
          side: DoubleSide,
        }),
      )
      const z = -18 - index * 18
      const x = side * (8.35 + (index % 3) * 0.95)
      const y = 4.8 + (index % 4) * 1.65
      const tilt = side > 0 ? -0.18 : 0.18

      frame.position.set(x, y, z)
      frame.rotation.y = tilt
      panel.position.set(x - side * 0.1, y, z + 0.14)
      panel.rotation.y = tilt
      city.add(frame, panel)
      billboards.push({ frame, panel, pulseOffset: index * 0.65 })
    }

    const pylonMaterials = [
      new MeshStandardMaterial({
        color: '#121a26',
        roughness: 0.3,
        metalness: 0.84,
        emissive: hexColor('#10253f'),
        emissiveIntensity: 0.45,
      }),
      new MeshBasicMaterial({
        color: '#9ed7ff',
        transparent: true,
        opacity: 0.3,
        blending: AdditiveBlending,
      }),
    ] as const

    const pylons: Group[] = []

    for (let index = 0; index < (device.isMobile ? 14 : 20); index += 1) {
      const leftPylon = new Group()
      const rightPylon = new Group()

      ;[leftPylon, rightPylon].forEach((group, groupIndex) => {
        const pole = new Mesh(new BoxGeometry(0.28, 7.2, 0.28), pylonMaterials[0])
        const light = new Mesh(new BoxGeometry(1.6, 0.14, 0.18), pylonMaterials[1])

        pole.position.y = 2.9
        light.position.y = 5.3 + (index % 3) * 0.25
        light.position.x = groupIndex === 0 ? 0.8 : -0.8
        group.add(pole, light)
      })

      leftPylon.position.set(-7.3, 0, 0)
      rightPylon.position.set(7.3, 0, 0)
      city.add(leftPylon, rightPylon)
      pylons.push(leftPylon, rightPylon)
    }

    const hoverLanes: HoverLane[] = []
    const hoverMaterial = new MeshStandardMaterial({
      color: '#1c2636',
      roughness: 0.22,
      metalness: 0.94,
      emissive: hexColor('#5aaeff'),
      emissiveIntensity: 0.34,
    })
    const hoverGlowMaterial = new MeshBasicMaterial({
      color: '#b8e8ff',
      transparent: true,
      opacity: 0.42,
      blending: AdditiveBlending,
    })

    for (let index = 0; index < (device.isMobile ? 3 : 5); index += 1) {
      const group = new Group()
      const hull = new Mesh(new BoxGeometry(1.8, 0.34, 4.3), hoverMaterial)
      const glow = new Mesh(new BoxGeometry(0.9, 0.08, 1.9), hoverGlowMaterial)

      glow.position.set(0, -0.16, 0.8)
      group.add(hull, glow)
      scene.add(group)

      hoverLanes.push({
        group,
        speed: 0.65 + index * 0.11,
        offset: index * 28,
        sway: 0.28 + index * 0.08,
        laneX: index % 2 === 0 ? -2.8 - index * 0.5 : 2.8 + index * 0.5,
        baseY: 6 + (index % 3) * 1.7,
      })
    }

    const driftGeometry = new BufferGeometry()
    const driftCount = device.isMobile ? 120 : 220
    const driftPositions = new Float32Array(driftCount * 3)

    for (let index = 0; index < driftCount; index += 1) {
      const stride = index * 3
      driftPositions[stride] = (Math.random() - 0.5) * 26
      driftPositions[stride + 1] = Math.random() * 11
      driftPositions[stride + 2] = -Math.random() * 340
    }

    driftGeometry.setAttribute('position', new BufferAttribute(driftPositions, 3))

    const drift = new Points(
      driftGeometry,
      new PointsMaterial({
        color: '#9bcfff',
        size: device.isMobile ? 0.045 : 0.06,
        transparent: true,
        opacity: 0.28,
        blending: AdditiveBlending,
      }),
    )
    scene.add(drift)

    const roadReflection = new Mesh(
      new PlaneGeometry(10, 560),
      new MeshBasicMaterial({
        color: '#ffffff',
        transparent: true,
        opacity: 0.018,
        blending: AdditiveBlending,
      }),
    )
    roadReflection.rotation.x = -Math.PI / 2
    roadReflection.position.set(0, -0.535, -220)
    city.add(roadReflection)

    let smoothedProgress = 0
    const clock = new Clock()

    const renderScene = () => {
      const delta = clock.getDelta()
      const elapsed = clock.elapsedTime
      const targetProgress = prefersReducedMotion ? 0 : progressRef.current

      smoothedProgress = MathUtils.damp(
        smoothedProgress,
        targetProgress,
        prefersReducedMotion ? 14 : 5.2,
        delta,
      )

      const driveDistance = smoothedProgress * 238
      const forwardZ = 10 - driveDistance
      const laneSway = prefersReducedMotion ? 0 : Math.sin(smoothedProgress * Math.PI * 7) * 0.18
      const roadBounce = prefersReducedMotion ? 0 : Math.sin(elapsed * 1.8 + smoothedProgress * 24) * 0.04

      camera.position.set(laneSway, 2.02 + roadBounce + smoothedProgress * 0.18, forwardZ)
      rimLight.position.z = camera.position.z + 10
      camera.rotation.z = prefersReducedMotion ? 0 : Math.sin(elapsed * 0.6 + smoothedProgress * 11) * 0.012
      camera.lookAt(laneSway * 0.72, 1.08 + roadBounce * 0.6, forwardZ - 42)

      billboards.forEach(({ frame, panel, pulseOffset }, index) => {
        const pulse = 0.88 + Math.sin(elapsed * 1.4 + pulseOffset) * 0.12
        frame.scale.setScalar(1 + Math.sin(elapsed * 0.55 + index) * 0.003)
        ;(panel.material as MeshBasicMaterial).opacity = 0.22 + pulse * 0.18
      })

      const pylonCycle = 180
      const pylonSpacing = 18
      const pylonStart = camera.position.z + 18
      pylons.forEach((group, index) => {
        const trackOffset = (driveDistance * 1.35 + index * pylonSpacing) % pylonCycle
        group.position.z = pylonStart - trackOffset
      })

      hoverLanes.forEach((lane, index) => {
        const cycle = 170
        const track = ((driveDistance * lane.speed * 1.65) + lane.offset + elapsed * 7.5) % cycle
        lane.group.position.set(
          lane.laneX + Math.sin(elapsed * 0.85 + index) * lane.sway,
          lane.baseY + Math.sin(elapsed * 1.4 + index * 0.7) * 0.14,
          camera.position.z - 36 - track,
        )
        lane.group.rotation.y = Math.sin(elapsed * 0.5 + index) * 0.12
        lane.group.rotation.z = Math.sin(elapsed * 0.8 + index) * 0.04
      })

      const driftPositionsArray = drift.geometry.attributes.position.array as Float32Array
      for (let index = 0; index < driftCount; index += 1) {
        const stride = index * 3
        driftPositionsArray[stride + 1] -= delta * (0.8 + (index % 6) * 0.06)

        if (driftPositionsArray[stride + 1] < -1.2) {
          driftPositionsArray[stride] = (Math.random() - 0.5) * 26
          driftPositionsArray[stride + 1] = 9 + Math.random() * 3
          driftPositionsArray[stride + 2] = camera.position.z - 40 - Math.random() * 260
        }
      }
      drift.geometry.attributes.position.needsUpdate = true

      roadGlow.material.opacity = 0.08 + smoothedProgress * 0.09
      ;(roadReflection.material as MeshBasicMaterial).opacity = 0.015 + smoothedProgress * 0.018
      beam.scale.x = 1 + smoothedProgress * 0.5
      halo.rotation.z = elapsed * 0.03

      renderer.render(scene, camera)
    }

    renderer.setAnimationLoop(renderScene)

    return () => {
      window.removeEventListener('resize', resize)
      renderer.setAnimationLoop(null)
      driftGeometry.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
    }
  }, [device, prefersReducedMotion, progressRef])

  return <canvas ref={canvasRef} className="city-canvas" aria-hidden="true" />
}
