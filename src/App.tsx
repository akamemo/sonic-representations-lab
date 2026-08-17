import {
  createRmsTimeline,
  type RmsTimeline,
} from './analysis/createRmsTimeline'
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from 'react'
import { decodeAudioFile } from './audio/decodeAudioFile'
import {
  PlaybackController,
  type PlaybackStatus,
} from './playback/PlaybackController'
import { AnalysisCompleteScreen } from './screens/AnalysisCompleteScreen'
import { LaboratoryScreen } from './screens/LaboratoryScreen'
import { LoadingScreen } from './screens/LoadingScreen'
import { WelcomeScreen } from './screens/WelcomeScreen'
import './App.css'
import {
  createSpectralAnalysis,
  type SpectralAnalysis,
} from './analysis/createSpectralAnalysis'

import {
  createSpectralCentroidTimeline,
  type SpectralCentroidTimeline,
} from './analysis/createSpectralCentroidTimeline'

import {
  createSpectralFluxTimeline,
  type SpectralFluxTimeline,
} from './analysis/createSpectralFluxTimeline'

import {
  createSpectralFlatnessTimeline,
  type SpectralFlatnessTimeline,
} from './analysis/createSpectralFlatnessTimeline'

import {
  createOnsetStrengthTimeline,
  type OnsetStrengthTimeline,
} from './analysis/createOnsetStrengthTimeline'

const supportedExtensions = [
  'wav',
  'mp3',
  'flac',
  'ogg',
  'm4a',
]

type ApplicationPhase =
  | 'welcome'
  | 'loading'
  | 'complete'
  | 'laboratory'

type LaboratoryMode =
  | 'microscope'
  | 'canvas'

function getFileExtension(fileName: string): string {
  return (
    fileName.split('.').pop()?.toLowerCase() ?? ''
  )
}

function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds)
  })
}

function App() {
  const [phase, setPhase] =
    useState<ApplicationPhase>('welcome')

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null)

  const [audioBuffer, setAudioBuffer] =
    useState<AudioBuffer | null>(null)

  const [rmsTimeline, setRmsTimeline] =
  useState<RmsTimeline | null>(null)

  const [spectralAnalysis, setSpectralAnalysis] =
  useState<SpectralAnalysis | null>(null)

const [
  spectralCentroidTimeline,
  setSpectralCentroidTimeline,
] = useState<SpectralCentroidTimeline | null>(null)

const [
  spectralFluxTimeline,
  setSpectralFluxTimeline,
] = useState<SpectralFluxTimeline | null>(null)

const [
  spectralFlatnessTimeline,
  setSpectralFlatnessTimeline,
] = useState<SpectralFlatnessTimeline | null>(null)

const [
  onsetStrengthTimeline,
  setOnsetStrengthTimeline,
] = useState<OnsetStrengthTimeline | null>(
  null,
)

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null)

  const [isDragging, setIsDragging] =
    useState(false)

  const [playbackStatus, setPlaybackStatus] =
    useState<PlaybackStatus>('ready')

  const [currentTime, setCurrentTime] =
    useState(0)

  const [isSeeking, setIsSeeking] =
    useState(false)

  const [seekPreviewTime, setSeekPreviewTime] =
    useState(0)

  const playbackControllerRef =
    useRef<PlaybackController | null>(null)

  const [laboratoryMode, setLaboratoryMode] =
  useState<LaboratoryMode>('microscope')

  useEffect(() => {
    function preventWindowFileDrop(
      event: globalThis.DragEvent,
    ): void {
      event.preventDefault()
    }

    window.addEventListener(
      'dragover',
      preventWindowFileDrop,
    )

    window.addEventListener(
      'drop',
      preventWindowFileDrop,
    )

    return () => {
      window.removeEventListener(
        'dragover',
        preventWindowFileDrop,
      )

      window.removeEventListener(
        'drop',
        preventWindowFileDrop,
      )
    }
  }, [])

  useEffect(() => {
    if (!audioBuffer) {
      return
    }

    const controller = new PlaybackController(
      audioBuffer,
      (status) => {
        setPlaybackStatus(status)

        if (status !== 'playing') {
          setCurrentTime(
            controller.getCurrentTime(),
          )
        }
      },
    )

    playbackControllerRef.current = controller

    return () => {
      playbackControllerRef.current = null
      void controller.dispose()
    }
  }, [audioBuffer])

  useEffect(() => {
    if (
      playbackStatus !== 'playing' ||
      isSeeking
    ) {
      return
    }

    const intervalId = window.setInterval(() => {
      const controller =
        playbackControllerRef.current

      if (controller) {
        setCurrentTime(
          controller.getCurrentTime(),
        )
      }
    }, 100)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [playbackStatus, isSeeking])

  function resetPlaybackInterface(): void {
    setPlaybackStatus('ready')
    setCurrentTime(0)
    setIsSeeking(false)
    setSeekPreviewTime(0)
  }

  function resetExperiment(): void {
    playbackControllerRef.current?.stop()

    setSelectedFile(null)
    setAudioBuffer(null)
    setRmsTimeline(null)
    setSpectralAnalysis(null)
    setSpectralFluxTimeline(null)
    setOnsetStrengthTimeline(null)
    setSpectralCentroidTimeline(null)
    setSpectralFlatnessTimeline(null)
    setErrorMessage(null)
    setIsDragging(false)
    resetPlaybackInterface()
    setPhase('welcome')
    setLaboratoryMode('microscope')
  }

  async function validateAndSelectFile(
    file: File,
  ): Promise<void> {
    const extension =
      getFileExtension(file.name)

    setErrorMessage(null)

    if (
      !supportedExtensions.includes(extension)
    ) {
      setSelectedFile(null)
      setAudioBuffer(null)
      setRmsTimeline(null)
      setSpectralAnalysis(null)
      setSpectralFluxTimeline(null)
      setOnsetStrengthTimeline(null)
      setSpectralCentroidTimeline(null)
      setSpectralFlatnessTimeline(null)
      setErrorMessage(
        'Unsupported audio format. Please choose WAV, MP3, FLAC, OGG, or M4A.',
      )
      setPhase('welcome')
      return
    }

    if (file.size === 0) {
      setSelectedFile(null)
      setAudioBuffer(null)
      setRmsTimeline(null)
      setSpectralAnalysis(null)
      setSpectralFluxTimeline(null)
      setOnsetStrengthTimeline(null)
      setSpectralCentroidTimeline(null)
      setSpectralFlatnessTimeline(null)
      setErrorMessage(
        'The selected file is empty.',
      )
      setPhase('welcome')
      return
    }

    playbackControllerRef.current?.stop()

    setSelectedFile(file)
    setAudioBuffer(null)
    setRmsTimeline(null)
    setSpectralAnalysis(null)
    setSpectralFluxTimeline(null)
    setOnsetStrengthTimeline(null)
    setSpectralCentroidTimeline(null)
    setSpectralFlatnessTimeline(null)
    resetPlaybackInterface()
    setPhase('loading')

    try {
  const [decodedAudio] = await Promise.all([
  decodeAudioFile(file),
  wait(700),
])

const analysedRms =
  createRmsTimeline(decodedAudio)

const analysedSpectrum =
  createSpectralAnalysis(decodedAudio)

const analysedCentroid =
  createSpectralCentroidTimeline(
    analysedSpectrum,
  )

  const analysedFlux =
  createSpectralFluxTimeline(
    analysedSpectrum,
  )

  const analysedOnsetStrength =
  createOnsetStrengthTimeline(
    analysedFlux,
  )

  const analysedFlatness =
  createSpectralFlatnessTimeline(
    analysedSpectrum,
  )

setAudioBuffer(decodedAudio)
setRmsTimeline(analysedRms)
setSpectralAnalysis(analysedSpectrum)
setSpectralCentroidTimeline(
  analysedCentroid,
)
setSpectralFluxTimeline(
  analysedFlux,
)

setSpectralFlatnessTimeline(
  analysedFlatness,
)

setOnsetStrengthTimeline(
  analysedOnsetStrength,
)

setPhase('complete')
} catch (error) {
  setSelectedFile(null)
  setAudioBuffer(null)
  setRmsTimeline(null)
  setSpectralAnalysis(null)
  setSpectralFluxTimeline(null)
  setOnsetStrengthTimeline(null)
  setSpectralCentroidTimeline(null)
  setSpectralFlatnessTimeline(null)

  setErrorMessage(
    error instanceof Error
      ? error.message
      : 'The selected file could not be decoded.',
  )

  setPhase('welcome')


  setErrorMessage(
    error instanceof Error
      ? error.message
      : 'The selected file could not be decoded.',
  )

  setPhase('welcome')
}
  }

  function handleFileSelection(
    event: ChangeEvent<HTMLInputElement>,
  ): void {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    void validateAndSelectFile(file)
    event.target.value = ''
  }

  function handleDragOver(
    event: DragEvent<HTMLLabelElement>,
  ): void {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'
    setIsDragging(true)
  }

  function handleDragLeave(
    event: DragEvent<HTMLLabelElement>,
  ): void {
    event.preventDefault()
    setIsDragging(false)
  }

  function handleDrop(
    event: DragEvent<HTMLLabelElement>,
  ): void {
    event.preventDefault()
    setIsDragging(false)

    const file =
      event.dataTransfer.files[0]

    if (!file) {
      return
    }

    void validateAndSelectFile(file)
  }

  async function handlePlay(): Promise<void> {
    const controller =
      playbackControllerRef.current

    if (!controller) {
      return
    }

    try {
      setErrorMessage(null)
      await controller.play()
    } catch {
      setErrorMessage(
        'Audio playback could not be started.',
      )
    }
  }

  function handlePause(): void {
    const controller =
      playbackControllerRef.current

    if (!controller) {
      return
    }

    controller.pause()
    setCurrentTime(controller.getCurrentTime())
  }

  function handleStop(): void {
    playbackControllerRef.current?.stop()
    setCurrentTime(0)
    setSeekPreviewTime(0)
    setIsSeeking(false)
  }

  function handleSeekStart(): void {
    setSeekPreviewTime(currentTime)
    setIsSeeking(true)
  }

  function handleSeekPreview(time: number): void {
    setSeekPreviewTime(time)
  }

  async function handleSeekCommit(
    targetTime: number,
  ): Promise<void> {
    const controller =
      playbackControllerRef.current

    if (!controller) {
      setIsSeeking(false)
      return
    }

    try {
      await controller.seek(targetTime)
      setCurrentTime(targetTime)
      setSeekPreviewTime(targetTime)
    } finally {
      setIsSeeking(false)
    }
  }

  function handleSeekCancel(): void {
    const controller =
      playbackControllerRef.current

    const restoredTime =
      controller?.getCurrentTime() ??
      currentTime

    setCurrentTime(restoredTime)
    setSeekPreviewTime(restoredTime)
    setIsSeeking(false)
  }

  if (phase === 'loading' && selectedFile) {
    return (
      <LoadingScreen
        fileName={selectedFile.name}
      />
    )
  }

  if (
    phase === 'complete' &&
    selectedFile &&
    audioBuffer
  ) {
    return (
      <AnalysisCompleteScreen
        file={selectedFile}
        audioBuffer={audioBuffer}
        onStartExploring={() =>
          setPhase('laboratory')
        }
        onStartOver={resetExperiment}
      />
    )
  }

  if (
    phase === 'laboratory' &&
selectedFile &&
audioBuffer &&
rmsTimeline &&
spectralAnalysis &&
spectralCentroidTimeline &&
spectralFluxTimeline &&
spectralFlatnessTimeline &&
onsetStrengthTimeline
  ) {
    return (
      <LaboratoryScreen
        file={selectedFile}
        audioBuffer={audioBuffer}
        rmsTimeline={rmsTimeline}
        spectralAnalysis={spectralAnalysis}
        spectralCentroidTimeline={
        spectralCentroidTimeline
        }
        spectralFluxTimeline={
        spectralFluxTimeline
        }
        spectralFlatnessTimeline={
  spectralFlatnessTimeline
}
onsetStrengthTimeline={
    onsetStrengthTimeline
  }
        laboratoryMode={laboratoryMode}
        onLaboratoryModeChange={setLaboratoryMode}
        playbackStatus={playbackStatus}
        currentTime={currentTime}
        isSeeking={isSeeking}
        seekPreviewTime={seekPreviewTime}
        onPlay={() => void handlePlay()}
        onPause={handlePause}
        onStop={handleStop}
        onSeekStart={handleSeekStart}
        onSeekPreview={handleSeekPreview}
        onSeekCommit={(time) =>
          void handleSeekCommit(time)
        }
        onSeekCancel={handleSeekCancel}
        onStartNewExperiment={resetExperiment}
        
      />
    )
  }

  return (
    <WelcomeScreen
      hasSelectedFile={selectedFile !== null}
      isDragging={isDragging}
      errorMessage={errorMessage}
      onFileSelection={handleFileSelection}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    />
  )
}

export default App