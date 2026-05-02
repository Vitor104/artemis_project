import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import slsRocket from '../../assets/SLSRocket.webp'
import slsLaunching from '../../assets/SLSRocketLauching.webp'
import './Launch.css'

gsap.registerPlugin(useGSAP, ScrollTrigger)

function Launch() {
  const container = useRef(null)

  useGSAP(
    () => {
      gsap.to('.foundation-bg', {
        yPercent: -18,
        ease: 'none',
        scrollTrigger: {
          trigger: '.foundation-section',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })

      gsap.fromTo(
        '.ignition-bg',
        { scale: 1, yPercent: 0 },
        {
          scale: 1.15,
          yPercent: -8,
          ease: 'none',
          scrollTrigger: {
            trigger: '.ignition-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      )
    },
    { scope: container }
  )

  return (
    <div ref={container}>
      <section className="story-section launch-section foundation-section" id="foundation">
        <div
          className="foundation-bg"
          style={{ backgroundImage: `url(${slsRocket})` }}
          aria-hidden="true"
        />
        <div className="story-overlay" />
        <div className="story-content">
          <h2>Cinquenta anos depois, a fundação está pronta.</h2>
        </div>
      </section>

      <section className="story-section launch-section ignition-section" id="launch">
        <div
          className="ignition-bg"
          style={{ backgroundImage: `url(${slsLaunching})` }}
          aria-hidden="true"
        />
        <div className="story-overlay" />
        <div className="story-content">
          <h2>A ignição que abalou a Flórida.</h2>
        </div>
      </section>
    </div>
  )
}

export default Launch
