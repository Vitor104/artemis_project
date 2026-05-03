import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import splashdown from '../../assets/splashdown-capsule.webp'
import './Return.css'

gsap.registerPlugin(useGSAP, ScrollTrigger)

function Return() {
  const containerRef = useRef(null)
  const returnBgRef = useRef(null)

  useGSAP(
    () => {
      const root = containerRef.current
      const bg = returnBgRef.current
      if (!root || !bg) return undefined

      const tween = gsap.from(bg, {
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top 80%',
          end: 'top 20%',
          scrub: true,
        },
      })

      return () => {
        tween.scrollTrigger?.kill()
        tween.kill()
      }
    },
    { scope: containerRef }
  )

  return (
    <section
      className="story-section return-section"
      id="return"
      ref={containerRef}
      style={{ minHeight: '100vh' }}
    >
      <div
        ref={returnBgRef}
        className="return-bg"
        style={{ backgroundImage: `url(${splashdown})` }}
        aria-hidden="true"
      />
      <div className="story-overlay" />
      <div className="story-content">
        <h2>A missão foi apenas o começo.</h2>
      </div>
    </section>
  )
}

export default Return
