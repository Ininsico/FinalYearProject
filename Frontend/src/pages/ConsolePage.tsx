import React from 'react'
import { motion } from 'framer-motion'
import type { Orientation, SpatialAnchor } from '../types'
import { TelemetryPanel } from '../components/console/TelemetryPanel'
import { SubsystemsPanel } from '../components/console/SubsystemsPanel'
import { ConnectionsOverview } from '../components/console/ConnectionsOverview'
import { AnchorSyncPanel } from '../components/console/AnchorSyncPanel'

interface ConsolePageProps {
  isOn: boolean
  isConnected: boolean
  temp: number
  npuLoad: number
  imuDrift: number
  orientation?: Orientation
  
  slamEnabled: boolean
  setSlamEnabled: (val: boolean) => void
  gazeEnabled: boolean
  setGazeEnabled: (val: boolean) => void
  handEnabled: boolean
  setHandEnabled: (val: boolean) => void
  voiceEnabled: boolean
  setVoiceEnabled: (val: boolean) => void

  anchors: SpatialAnchor[]
  newAnchorName: string
  setNewAnchorName: (name: string) => void
  addingAnchor: boolean
  onAddAnchor: (e: React.FormEvent) => void
  onDeleteAnchor: (id: string, name: string) => void
}

export function ConsolePage({
  isOn,
  isConnected,
  temp,
  npuLoad,
  imuDrift,
  orientation,
  slamEnabled,
  setSlamEnabled,
  gazeEnabled,
  setGazeEnabled,
  handEnabled,
  setHandEnabled,
  voiceEnabled,
  setVoiceEnabled,
  anchors,
  newAnchorName,
  setNewAnchorName,
  addingAnchor,
  onAddAnchor,
  onDeleteAnchor,
}: ConsolePageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="flex-1 w-full max-w-[1400px] mx-auto px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      {/* LEFT COLUMN */}
      <div className="flex flex-col gap-6 lg:col-span-1">
        <TelemetryPanel
          isOn={isOn}
          temp={temp}
          npuLoad={npuLoad}
          imuDrift={imuDrift}
          orientation={orientation}
        />

        <SubsystemsPanel
          isOn={isOn}
          slamEnabled={slamEnabled}
          setSlamEnabled={setSlamEnabled}
          gazeEnabled={gazeEnabled}
          setGazeEnabled={setGazeEnabled}
          handEnabled={handEnabled}
          setHandEnabled={setHandEnabled}
          voiceEnabled={voiceEnabled}
          setVoiceEnabled={setVoiceEnabled}
        />
      </div>

      {/* CENTER & RIGHT COLUMNS */}
      <div className="flex flex-col gap-6 lg:col-span-2">
        <ConnectionsOverview isConnected={isConnected} isOn={isOn} />

        <AnchorSyncPanel
          isConnected={isConnected}
          anchors={anchors}
          newAnchorName={newAnchorName}
          setNewAnchorName={setNewAnchorName}
          addingAnchor={addingAnchor}
          onAddAnchor={onAddAnchor}
          onDeleteAnchor={onDeleteAnchor}
        />
      </div>
    </motion.div>
  )
}
