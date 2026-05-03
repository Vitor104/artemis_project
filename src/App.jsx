import { useRef, useState } from 'react'
import VoidJourney from './components/VoidJourney/VoidJourney'
import LoadingScreen from './components/LoadingScreen/LoadingScreen'
import ProgressBar from './components/ProgressBar/ProgressBar'
import './styles/index.css'

function App() {
  const [ready, setReady] = useState(false)
  const progressFillRef = useRef(null)

  return (
    <div className="artemis-app">
      {!ready && <LoadingScreen onReady={() => setReady(true)} />}
      {ready && (
        <>
          <ProgressBar ref={progressFillRef} />
          <VoidJourney progressFillRef={progressFillRef} />
        </>
      )}
    </div>
  )
}

export default App
