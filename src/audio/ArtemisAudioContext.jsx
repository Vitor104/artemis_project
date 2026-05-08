import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import gsap from 'gsap'
import { AUDIO_URLS } from './audioUrls'
import { STORAGE_KEY_AUDIO_ENABLED } from './constants'

const ArtemisAudioContext = createContext(null)

/** Align with VoidJourney horizontal vs stacked layout. */
const MOBILE_LAYOUT_QUERY = '(max-width: 768px)'

function readStoredEnabled() {
  try {
    return window.localStorage.getItem(STORAGE_KEY_AUDIO_ENABLED) === 'true'
  } catch {
    return false
  }
}

function writeStoredEnabled(value) {
  try {
    window.localStorage.setItem(STORAGE_KEY_AUDIO_ENABLED, value ? 'true' : 'false')
  } catch {
    /* ignore quota / private mode */
  }
}

async function fetchDecode(ctx, url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error('FileLoadError')
  const raw = await res.arrayBuffer()
  return ctx.decodeAudioData(raw.slice(0))
}

export function AudioProvider({ children }) {
  const [enabled, setEnabled] = useState(() =>
    typeof window !== 'undefined' ? readStoredEnabled() : false
  )
  const [audioAvailable, setAudioAvailable] = useState(true)

  const ctxRef = useRef(null)
  const masterRef = useRef(null)
  const droneGainRef = useRef(null)
  const radioGainRef = useRef(null)
  const droneSourceRef = useRef(null)
  const buffersRef = useRef(null)
  const loadPromiseRef = useRef(null)
  const runningRef = useRef(false)
  const schedulerIdRef = useRef(null)
  const prefersReducedMotionRef = useRef(false)

  const [running, setRunning] = useState(false)
  const enabledRef = useRef(enabled)

  useEffect(() => {
    enabledRef.current = enabled
  }, [enabled])

  const isMobileLayout = useCallback(() => window.matchMedia(MOBILE_LAYOUT_QUERY).matches, [])

  const tearDownGraph = useCallback(() => {
    if (schedulerIdRef.current != null) {
      clearTimeout(schedulerIdRef.current)
      schedulerIdRef.current = null
    }
    const droneSrc = droneSourceRef.current
    if (droneSrc) {
      try {
        droneSrc.stop(0)
      } catch {
        /* already stopped */
      }
      droneSrc.disconnect()
      droneSourceRef.current = null
    }
    gsap.killTweensOf([
      masterRef.current?.gain,
      droneGainRef.current?.gain,
      radioGainRef.current?.gain,
    ].filter(Boolean))
    const m = masterRef.current
    const d = droneGainRef.current
    const r = radioGainRef.current
    if (m) {
      m.disconnect()
      masterRef.current = null
    }
    if (d) {
      d.disconnect()
      droneGainRef.current = null
    }
    if (r) {
      r.disconnect()
      radioGainRef.current = null
    }
  }, [])

  const loadBuffers = useCallback(async (ctx) => {
    if (buffersRef.current) return buffersRef.current
    if (loadPromiseRef.current) return loadPromiseRef.current

    const job = (async () => {
      const drone = await fetchDecode(ctx, AUDIO_URLS.drone)
      const radioPool = await Promise.all(AUDIO_URLS.radioPool.map((u) => fetchDecode(ctx, u)))
      const transmissions = {}
      for (const [id, url] of Object.entries(AUDIO_URLS.transmissions)) {
        transmissions[id] = await fetchDecode(ctx, url)
      }
      const buf = { drone, radioPool, transmissions }
      buffersRef.current = buf
      return buf
    })()

    loadPromiseRef.current = job
    try {
      return await job
    } finally {
      loadPromiseRef.current = null
    }
  }, [])

  const scheduleRadioBurstFnRef = useRef(() => {})

  const scheduleRadioBurst = useCallback(() => {
    scheduleRadioBurstFnRef.current()
  }, [])

  useLayoutEffect(() => {
    scheduleRadioBurstFnRef.current = () => {
      const buffers = buffersRef.current
      const ctx = ctxRef.current
      const radioGain = radioGainRef.current
      if (!buffers?.radioPool?.length || !ctx || !radioGain || !runningRef.current) return

      const delayMs = 8000 + Math.random() * 17000
      schedulerIdRef.current = window.setTimeout(() => {
        schedulerIdRef.current = null
        if (!runningRef.current || !enabledRef.current) return
        const pick = buffers.radioPool[Math.floor(Math.random() * buffers.radioPool.length)]
        try {
          const src = ctx.createBufferSource()
          src.buffer = pick
          src.connect(radioGain)
          src.start(0)
        } catch {
          /* ignore */
        }
        scheduleRadioBurstFnRef.current()
      }, delayMs)
    }
  }, [])

  const startPlayback = useCallback(async () => {
    if (!audioAvailable) return

    let ctx = ctxRef.current
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext
      if (!AC) {
        setAudioAvailable(false)
        return
      }
      ctx = new AC()
      ctxRef.current = ctx

      const onState = () => {
        if (ctx.state === 'suspended' && runningRef.current) {
          runningRef.current = false
          setRunning(false)
        }
      }
      ctx.addEventListener('statechange', onState)
    }

    try {
      await ctx.resume()
    } catch {
      /* AudioContextStateError — wait for next gesture */
      return
    }

    let buffers
    try {
      buffers = await loadBuffers(ctx)
    } catch {
      tearDownGraph()
      ctxRef.current = null
      setAudioAvailable(false)
      runningRef.current = false
      setRunning(false)
      return
    }

    tearDownGraph()

    const master = ctx.createGain()
    master.gain.value = 0
    master.connect(ctx.destination)
    masterRef.current = master

    const droneGain = ctx.createGain()
    droneGain.gain.value = 0
    droneGain.connect(master)
    droneGainRef.current = droneGain

    const radioGain = ctx.createGain()
    const mobile = isMobileLayout()
    radioGain.gain.value = 0
    radioGain.connect(master)
    radioGainRef.current = radioGain

    const targetMaster = mobile ? 0.55 : 0.85
    const fadeDur = prefersReducedMotionRef.current ? 0.05 : 1.15

    gsap.to(master.gain, {
      value: targetMaster,
      duration: fadeDur,
      ease: 'power2.out',
    })

    if (!mobile && buffers.drone) {
      const src = ctx.createBufferSource()
      src.buffer = buffers.drone
      src.loop = true
      src.connect(droneGain)
      src.start(0)
      droneSourceRef.current = src
      gsap.to(droneGain.gain, {
        value: 0.22,
        duration: fadeDur,
        ease: 'power2.out',
      })
    }

    gsap.to(radioGain.gain, {
      value: mobile ? 0.14 : 0.32,
      duration: fadeDur,
      ease: 'power2.out',
      onComplete: () => {
        if (runningRef.current) scheduleRadioBurst()
      },
    })

    runningRef.current = true
    setRunning(true)
  }, [
    audioAvailable,
    isMobileLayout,
    loadBuffers,
    scheduleRadioBurst,
    tearDownGraph,
  ])

  const stopPlayback = useCallback(() => {
    const master = masterRef.current
    const droneG = droneGainRef.current
    const radioG = radioGainRef.current
    const fadeDur = prefersReducedMotionRef.current ? 0.05 : 0.85

    if (schedulerIdRef.current != null) {
      clearTimeout(schedulerIdRef.current)
      schedulerIdRef.current = null
    }

    if (droneG) gsap.to(droneG.gain, { value: 0, duration: fadeDur, ease: 'power2.in' })
    if (radioG) gsap.to(radioG.gain, { value: 0, duration: fadeDur, ease: 'power2.in' })
    if (master)
      gsap.to(master.gain, {
        value: 0,
        duration: fadeDur,
        ease: 'power2.in',
        onComplete: () => {
          tearDownGraph()
          runningRef.current = false
          setRunning(false)
        },
      })
    else {
      tearDownGraph()
      runningRef.current = false
      setRunning(false)
    }
  }, [tearDownGraph])

  const toggle = useCallback(() => {
    if (!audioAvailable) return

    if (!enabled) {
      setEnabled(true)
      writeStoredEnabled(true)
      startPlayback()
      return
    }

    if (!runningRef.current) {
      startPlayback()
      return
    }

    stopPlayback()
    setEnabled(false)
    writeStoredEnabled(false)
  }, [audioAvailable, enabled, startPlayback, stopPlayback])

  const queueTransmission = useCallback(
    (id) => {
      const buffers = buffersRef.current
      const ctx = ctxRef.current
      const radioGain = radioGainRef.current
      const buf = buffers?.transmissions?.[id]
      if (!buf || !ctx || !radioGain || !runningRef.current) return
      try {
        const src = ctx.createBufferSource()
        src.buffer = buf
        src.connect(radioGain)
        src.start(0)
      } catch {
        /* ignore */
      }
    },
    []
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    prefersReducedMotionRef.current = mq.matches
    const h = () => {
      prefersReducedMotionRef.current = mq.matches
    }
    mq.addEventListener('change', h)
    return () => mq.removeEventListener('change', h)
  }, [])

  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === 'visible' && enabled && runningRef.current) {
        ctxRef.current?.resume().catch(() => {})
      }
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [enabled])

  useEffect(() => {
    return () => {
      stopPlayback()
      tearDownGraph()
      ctxRef.current?.close().catch(() => {})
      ctxRef.current = null
      buffersRef.current = null
    }
  }, [stopPlayback, tearDownGraph])

  const value = useMemo(
    () => ({
      enabled,
      audioAvailable,
      running,
      toggle,
      queueTransmission,
    }),
    [enabled, audioAvailable, running, toggle, queueTransmission]
  )

  return <ArtemisAudioContext.Provider value={value}>{children}</ArtemisAudioContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components -- hook colocated with AudioProvider
export function useArtemisAudio() {
  const ctx = useContext(ArtemisAudioContext)
  if (!ctx) throw new Error('useArtemisAudio must be used within AudioProvider')
  return ctx
}
