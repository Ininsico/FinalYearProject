export interface SpatialAnchor {
  id: string
  name: string
  x: number
  y: number
  z: number
  confidence: number
}

export interface Orientation {
  roll: number
  pitch: number
  yaw: number
}

export interface TelemetryData {
  temp: number
  npuLoad: number
  imuDrift: number
  batteryLevel: number
  isGlassOn: boolean
  orientation?: Orientation
}

export interface LogEntry {
  timestamp: string
  system: string
  message: string
  type: 'info' | 'warn' | 'success'
}
