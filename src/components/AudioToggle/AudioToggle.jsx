import { useSyncExternalStore } from 'react'
import { useArtemisAudio } from '../../audio/ArtemisAudioContext'
import './AudioToggle.css'

const MOBILE_LAYOUT_QUERY = '(max-width: 768px)'

function subscribeMq(query, onChange) {
  const mq = window.matchMedia(query)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

function useMatchMedia(query) {
  return useSyncExternalStore(
    (onChange) => subscribeMq(query, onChange),
    () => window.matchMedia(query).matches,
    () => false
  )
}

function WaveIcon({ muted }) {
  if (muted) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M11 5 6 9H4v6h2l5 4V5Z" strokeLinejoin="round" />
        <path d="m22 9-6 6M16 9l6 6" strokeLinecap="round" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M11 5 6 9H4v6h2l5 4V5Z" strokeLinejoin="round" />
      <path
        d="M15.5 8.5c1.33 1.33 2 3 2 5s-.67 3.67-2 5M18 6c2 2 3 4.33 3 7s-1 5-3 7"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function AudioToggle() {
  const isMobileLayout = useMatchMedia(MOBILE_LAYOUT_QUERY)
  const { enabled, audioAvailable, running, toggle } = useArtemisAudio()

  if (!audioAvailable) return null

  const muted = !running
  const variant = isMobileLayout ? 'audio-toggle--mobile' : 'audio-toggle--desktop'

  return (
    <button
      type="button"
      className={`audio-toggle ${variant}${running ? ' audio-toggle--active' : ''}`}
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={
        running
          ? 'Desativar áudio imersivo'
          : enabled
            ? 'Retomar áudio imersivo'
            : 'Ativar áudio imersivo'
      }
      title={running ? 'Silenciar comunicações' : 'Ouvir comunicações'}
    >
      <span className="audio-toggle__sr">
        {running ? 'Áudio ligado' : enabled ? 'Áudio em pausa — toque para retomar' : 'Áudio desligado'}
      </span>
      <WaveIcon muted={muted} />
    </button>
  )
}
