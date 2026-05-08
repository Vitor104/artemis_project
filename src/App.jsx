import { useRef, useState } from 'react'
import { AudioProvider } from './audio/ArtemisAudioContext'
import VoidJourney from './components/VoidJourney/VoidJourney'
import LoadingScreen from './components/LoadingScreen/LoadingScreen'
import ProgressBar from './components/ProgressBar/ProgressBar'
import AudioToggle from './components/AudioToggle/AudioToggle'
import MagneticCursor from './components/MagneticCursor/MagneticCursor'
import './styles/index.css'

function App() {
  const [ready, setReady] = useState(false)
  const progressFillRef = useRef(null)

  return (
    <div className="artemis-app">
      {!ready && <LoadingScreen onReady={() => setReady(true)} />}
      {ready && (
        <AudioProvider>
          <MagneticCursor />
          <AudioToggle />
          <ProgressBar ref={progressFillRef} />
          <VoidJourney progressFillRef={progressFillRef} />
        </AudioProvider>
      )}
    </div>
  )
}

export default App
