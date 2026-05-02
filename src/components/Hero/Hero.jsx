import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import capsulaBg from '../../assets/Capsula.webp'
import './Hero.css'

gsap.registerPlugin(useGSAP, ScrollTrigger)

function Hero() {
  const container = useRef(null)

  useGSAP(
    () => {
      gsap.to('.hero-bg', {
        y: 18,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })

      gsap.to('.hero-bg', {
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    },
    { scope: container }
  )

  return (
    <section className="story-section hero-section" id="prologue" ref={container}>
      <div
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
