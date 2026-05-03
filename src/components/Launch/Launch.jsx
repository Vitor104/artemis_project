import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import slsRocket from '../../assets/SLSRocket.webp'
import slsLaunching from '../../assets/SLSRocketLauching.webp'
import './Launch.css'

gsap.registerPlugin(useGSAP, ScrollTrigger)

function Launch() {
  const containerRef = useRef(null)
  const foundationSectionRef = useRef(null)
  const atmosphereLayerRef = useRef(null)
  const foundationBgRef = useRef(null)
  const ignitionSectionRef = useRef(null)
  const ignitionBgRef = useRef(null)

  useGSAP(
    () => {
      const foundationSection = foundationSectionRef.current
      const atmosphereLayer = atmosphereLayerRef.current
      const foundationBg = foundationBgRef.current
      const ignitionSection = ignitionSectionRef.current
      const ignitionBg = ignitionBgRef.current

      if (
        !foundationSection ||
        !atmosphereLayer ||
        !foundationBg ||
        !ignitionSection ||
        !ignitionBg
      ) {
        return undefined
      }

      const atmosphereTween = gsap.fromTo(
        atmosphereLayer,
        { backgroundColor: '#03040d' },
        {
          backgroundColor: '#93d3f7',
          ease: 'none',
          immediateRender: false,
          scrollTrigger: {
            trigger: foundationSection,
            start: 'top bottom',
            end: 'top 38%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )

      const foundationFadeTween = gsap.fromTo(
        foundationBg,
        { opacity: 0 },
        {
          opacity: 1,
          ease: 'none',
          immediateRender: false,
          scrollTrigger: {
            trigger: foundationSection,
            start: 'top bottom',
            end: 'top 38%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )

      const foundationParallaxTween = gsap.to(foundationBg, {
        yPercent: -18,
        ease: 'none',
        scrollTrigger: {
          trigger: foundationSection,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })

      const ignitionTween = gsap.fromTo(
        ignitionBg,
        { scale: 1, yPercent: 0 },
        {
          scale: 1.15,
          yPercent: -8,
          ease: 'none',
          scrollTrigger: {
            trigger: ignitionSection,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      )

      return () => {
        ;[
          atmosphereTween,
          foundationFadeTween,
          foundationParallaxTween,
          ignitionTween,
        ].forEach((tw) => {
          tw.scrollTrigger?.kill()
          tw.kill()
        })
      }
    },
    { scope: containerRef }
  )

  return (
    <div ref={containerRef} className="launch-root" style={{ minHeight: '200vh' }}>
      <section
        ref={foundationSectionRef}
        className="story-section launch-section foundation-section"
        id="foundation"
        style={{ minHeight: '100vh' }}
      >
        <div ref={atmosphereLayerRef} className="foundation-atmosphere-layer" aria-hidden="true" />
        <div
          ref={foundationBgRef}
          className="foundation-bg"
          style={{ backgroundImage: `url(${slsRocket})` }}
          aria-hidden="true"
        />
        <div className="story-overlay" />
        <div className="story-content">
          <h2>Cinquenta anos depois, a fundação está pronta.</h2>
        </div>
      </section>

      <section
        ref={ignitionSectionRef}
        className="story-section launch-section ignition-section"
        id="launch"
        style={{ minHeight: '100vh' }}
      >
        <div
          ref={ignitionBgRef}
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
