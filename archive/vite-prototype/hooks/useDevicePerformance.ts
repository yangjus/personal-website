import { useEffect, useState } from 'react'

export interface DevicePerformance {
  isMobile: boolean
  enableEffects: boolean
  dpr: number
}

const fallback: DevicePerformance = {
  isMobile: false,
  enableEffects: true,
  dpr: 1.5,
}

export function useDevicePerformance() {
  const [device, setDevice] = useState<DevicePerformance>(fallback)

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth
      const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8
      const mobile = width < 900

      setDevice({
        isMobile: mobile,
        enableEffects: !mobile && memory >= 4,
        dpr: Math.min(window.devicePixelRatio, mobile ? 1.25 : 1.75),
      })
    }

    update()
    window.addEventListener('resize', update)

    return () => window.removeEventListener('resize', update)
  }, [])

  return device
}
