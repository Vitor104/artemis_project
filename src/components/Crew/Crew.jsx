import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { crewMembers } from '../../data/crew'
import './Crew.css'

gsap.registerPlugin(useGSAP, ScrollTrigger)

function Crew() {
  const container = useRef(null)
  const trackRef = useRef(null)

  useGSAP(
    () => {
      const section = container.current
      const track = trackRef.current
      if (!section || !track) return undefined

      const media = gsap.matchMedia()

      media.add('(min-width: 960px)', () => {
        const movement = Math.max(track.scrollWidth - window.innerWidth, 0)

        gsap.to(track, {
          x: -movement,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: `+=${movement + window.innerHeight * 0.6}`,
            pin: true,
            scrub: true,
            invalidateOnRefresh: true,
          },
        })
      })

      return () => media.revert()
    },
    { scope: container }
  )

  return (
    <section className="story-section crew-section" id="crew" ref={container}>
      <div className="story-content crew-header">
        <p className="eyebrow">Meet the Crew</p>
        <h2>Os 4 humanos que nos levarão de volta.</h2>
      </div>

      <div className="crew-track" ref={trackRef}>
        {crewMembers.map((member) => (
          <article className="crew-card" key={member.id}>
            <img
              className="crew-portrait"
              src={member.portrait}
              alt={member.name}
              loading="lazy"
              width={320}
              height={280}
            />
            <h3>{member.name}</h3>
            <p>{member.role}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Crew
