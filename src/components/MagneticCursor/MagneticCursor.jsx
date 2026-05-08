import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

import './MagneticCursor.css'

gsap.registerPlugin(useGSAP)

const POINTER_FINE = '(pointer: fine)'

export default function MagneticCursor() {
  const wrapRef = useRef(null)
  const dotRef = useRef(null)
  const [finePointer, setFinePointer] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(POINTER_FINE).matches : false
  )

  useEffect(() => {
    const mq = window.matchMedia(POINTER_FINE)
    const onChange = () => setFinePointer(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useGSAP(
    () => {
      if (!finePointer) return undefined

      const dot = dotRef.current
      if (!dot) return undefined

      const root = document.documentElement
      root.classList.add('artemis-custom-cursor-active')

      let mx = -999
      let my = -999
      let cx = mx
      let cy = my
      let dotShown = false

      const onMove = (e) => {
        mx = e.clientX
        my = e.clientY
        if (!dotShown) {
          dotShown = true
          gsap.set(dot, { opacity: 0.95 })
        }
      }

      const onLeave = () => {
        dotShown = false
        gsap.set(dot, { opacity: 0 })
      }

      window.addEventListener('mousemove', onMove, { passive: true })
      root.addEventListener('mouseleave', onLeave)

      const tick = () => {
        let tx = mx
        let ty = my

        const magneticBtns = gsap.utils.toArray('[data-artemis-magnetic]')
        let nearest = null
        let best = 50

        magneticBtns.forEach((btn) => {
          const r = btn.getBoundingClientRect()
          const bx = r.left + r.width / 2
          const by = r.top + r.height / 2
          const d = Math.hypot(mx - bx, my - by)
          if (d < best) {
            best = d
            nearest = { btn, bx, by, d }
          }
        })

        magneticBtns.forEach((btn) => {
          if (nearest && nearest.btn === btn) {
            const pull = 0.24 * (1 - nearest.d / 50)
            const dx = (mx - nearest.bx) * pull
            const dy = (my - nearest.by) * pull
            gsap.set(btn, { x: dx, y: dy })
          } else {
            gsap.set(btn, { x: 0, y: 0 })
          }
        })

        if (nearest) {
          tx = nearest.bx
          ty = nearest.by
        }

        cx += (tx - cx) * 0.31
        cy += (ty - cy) * 0.31

        const under = document.elementFromPoint(mx, my)
        const interactive = under?.closest?.('[data-artemis-cursor="interactive"]')
        const hoverScale = interactive ? 2 : 1
        const hoverOpacity = interactive ? 0.42 : 0.95

        gsap.set(dot, {
          left: cx,
          top: cy,
          scale: hoverScale,
          opacity: dotShown ? hoverOpacity : 0,
        })
      }

      gsap.ticker.add(tick)

      return () => {
        gsap.ticker.remove(tick)
        window.removeEventListener('mousemove', onMove)
        root.removeEventListener('mouseleave', onLeave)
        root.classList.remove('artemis-custom-cursor-active')
        gsap.utils.toArray('[data-artemis-magnetic]').forEach((btn) => {
          gsap.set(btn, { clearProps: 'transform' })
        })
        gsap.set(dot, { clearProps: 'left,top,scale,opacity' })
      }
    },
    { scope: wrapRef, dependencies: [finePointer], revertOnUpdate: true }
  )

  if (!finePointer) return null

  return (
    <div ref={wrapRef} className="artemis-cursor-root" aria-hidden="true">
      <div ref={dotRef} className="artemis-cursor-dot" />
    </div>
  )
}
