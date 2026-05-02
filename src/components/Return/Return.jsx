import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import splashdown from '../../assets/splashdown-capsule.webp'
import './Return.css'

gsap.registerPlugin(useGSAP, ScrollTrigger)

function Return() {
  const container = useRef(null)

  useGSAP(
    () => {
      gsap.from('.return-bg', {
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '.return-section',
          start: 'top 80%',
          end: 'top 20%',
          scrub: true,
        },
      })
    },
    { scope: container }
  )

  return (
    <section className="story-section return-section" id="return" ref={container}>
      <div
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
