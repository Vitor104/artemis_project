import { useEffect, useState } from 'react'
import { preloadImageUrls } from '../../data/preloadAssets'
import './LoadingScreen.css'

function decodeImage(src) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      if (img.decode) {
        img.decode().then(resolve).catch(resolve)
      } else {
        resolve()
      }
    }
    img.onerror = () => resolve()
    img.src = src
  })
}

export default function LoadingScreen({ onReady }) {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    let cancelled = false
    const urls = preloadImageUrls
    const total = urls.length

    async function run() {
      let done = 0
      await Promise.all(
        urls.map(async (src) => {
          await decodeImage(src)
          done += 1
          if (!cancelled) setPct(Math.round((done / total) * 100))
        })
      )
      if (!cancelled) {
        setPct(100)
        onReady?.()
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [onReady])

  return (
    <div className="loading-screen" role="status" aria-live="polite" aria-busy={pct < 100}>
      <div className="loading-screen__inner">
        <p className="loading-screen__label">Artemis II</p>
        <p className="loading-screen__pct">{pct}%</p>
      </div>
    </div>
  )
}
