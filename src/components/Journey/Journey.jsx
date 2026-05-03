import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import rocketMoon from '../../assets/RocketTowardsTheMoon.webp'
import darkSide from '../../assets/darkSide.webp'
import './Journey.css'

gsap.registerPlugin(useGSAP, ScrollTrigger)

function Journey() {
  const containerRef = useRef(null)
  const pathSectionRef = useRef(null)
  const pathBgRef = useRef(null)

  useGSAP(
    () => {
      const section = pathSectionRef.current
      const pathBg = pathBgRef.current
      if (!section || !pathBg) return undefined

      const tween = gsap.to(pathBg, {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
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
    <div ref={containerRef} className="journey-root" style={{ minHeight: '100%' }}>
      <section
        ref={pathSectionRef}
        className="story-section journey-section path-section"
        id="journey"
        style={{ minHeight: '100vh' }}
      >
        <div
          ref={pathBgRef}
          className="path-bg"
          style={{ backgroundImage: `url(${rocketMoon})` }}
          aria-hidden="true"
        />
        <div className="story-overlay path-section-overlay" />
        <div className="story-content">
          <h2>O silêncio do vácuo.</h2>
          <p className="story-subtitle">Velocidade de Escape: 40.000 km/h</p>
        </div>
      </section>

      <section
        className="story-section journey-section dark-side-section"
        id="dark-side"
        style={{ minHeight: '100vh' }}
      >
        <div
          className="dark-side-sticky"
          style={{ backgroundImage: `url(${darkSide})` }}
        >
          <div className="dark-side-overlay" />
          <div className="story-content">
            <h2>Mais longe do que qualquer humano já viajou.</h2>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Journey
