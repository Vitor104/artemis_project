import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { crewMembers } from '../../data/crew'
import './Crew.css'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const crewHeadline = 'Os 4 humanos que nos levarão de volta.'

function Crew() {
  const containerRef = useRef(null)
  const trackRef = useRef(null)
  const viewportRef = useRef(null)
  const headerRef = useRef(null)
  const eyebrowRef = useRef(null)

  useGSAP(
    () => {
      const section = containerRef.current
      const track = trackRef.current
      const viewport = viewportRef.current
      const header = headerRef.current
      const eyebrow = eyebrowRef.current
      if (!section || !track || !viewport || !header || !eyebrow) return undefined

      const media = gsap.matchMedia()

      media.add('(min-width: 960px)', () => {
        const getMovement = () => Math.max(track.scrollWidth - viewport.clientWidth, 0)

        const scrollExtra = Math.max(window.innerHeight * 0.45, 280)

        const refreshOnPortraitLoad = () => ScrollTrigger.refresh()
        track.querySelectorAll('.crew-portrait').forEach((img) => {
          img.addEventListener('load', refreshOnPortraitLoad, { once: true })
          if (img.complete) refreshOnPortraitLoad()
        })

        const words = header.querySelectorAll('.crew-word')

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${getMovement() + scrollExtra}`,
            pin: true,
            scrub: true,
            invalidateOnRefresh: true,
          },
        })

        tl.fromTo(
          eyebrow,
          { opacity: 0, x: -28 },
          { opacity: 1, x: 0, ease: 'power2.out', duration: 0.22 },
          0
        )
        tl.fromTo(
          words,
          { opacity: 0, y: 36 },
          { opacity: 1, y: 0, stagger: 0.07, ease: 'power2.out', duration: 0.32 },
          0
        )
        tl.fromTo(track, { x: 0 }, { x: () => -getMovement(), ease: 'none', duration: 1 }, 0)

        return () => tl.kill()
      })

      media.add('(max-width: 959px)', () => {
        const words = header.querySelectorAll('.crew-word')
        return gsap.fromTo(
          words,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.06,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: header,
              start: 'top 88%',
              end: 'top 55%',
              scrub: true,
            },
          }
        )
      })

      return () => media.revert()
    },
    { scope: containerRef }
  )

  return (
    <section
      className="story-section crew-section"
      id="crew"
      ref={containerRef}
      style={{ minHeight: '100vh' }}
    >
      <div ref={headerRef} className="story-content crew-header">
        <p ref={eyebrowRef} className="eyebrow">
          Meet the Crew
        </p>
        <h2 className="crew-heading">
          {crewHeadline.split(/\s+/).map((word, i) => (
            <span key={`${i}-${word}`} className="crew-word">
              {word}
            </span>
          ))}
        </h2>
      </div>

      <div ref={viewportRef} className="crew-carousel-viewport">
        <div className="crew-track" ref={trackRef}>
          {crewMembers.map((member) => (
            <article className="crew-card" key={member.id}>
              <img
                className="crew-portrait"
                src={member.portrait}
                alt={member.name}
                loading="lazy"
                width={320}
                height={300}
              />
              <h3>{member.name}</h3>
              <p>{member.role}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Crew
