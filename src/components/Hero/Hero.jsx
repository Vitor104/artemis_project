import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import capsulaBg from '../../assets/Capsula.webp'
import './Hero.css'

gsap.registerPlugin(useGSAP, ScrollTrigger)

function Hero() {
  const containerRef = useRef(null)
  const heroBgRef = useRef(null)

  useGSAP(
    () => {
      const root = containerRef.current
      const bg = heroBgRef.current
      if (!root || !bg) return undefined

      const floatTween = gsap.to(bg, {
        y: 18,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })

      const scrollTween = gsap.to(bg, {
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      return () => {
        floatTween.kill()
        scrollTween.scrollTrigger?.kill()
        scrollTween.kill()
      }
    },
    { scope: containerRef }
  )

  return (
    <section
      className="story-section hero-section"
      id="prologue"
      ref={containerRef}
      style={{ minHeight: '100vh' }}
    >
      <div
        ref={heroBgRef}
        className="hero-bg"
        style={{ backgroundImage: `url(${capsulaBg})` }}
        aria-hidden="true"
      />
      <div className="story-overlay" />
      <div className="story-content">
        <h1>O Retorno.</h1>
        <p className="story-subtitle">Role para iniciar a jornada ↓</p>
      </div>
    </section>
  )
}

export default Hero
