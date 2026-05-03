import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import capsuleImg from '../../assets/Capsula.webp'
import astronautLookingAtEarth from '../../assets/astronautLookingAtEarth.webp'
import overTheMoon from '../../assets/overTheMoon.webp'
import earthset from '../../assets/earthset.webp'
import splashdownImg from '../../assets/splashdown.webp'
import { crewMembers } from '../../data/crew'
import './VoidJourney.css'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const TIMELINE_UNITS = 100

const EARTHRISE_TEXT =
  'E, de repente, o nascer da Terra. A confirmação de que há um caminho de volta.'

function VoidJourney() {
  const rootRef = useRef(null)
  const pinRef = useRef(null)
  const railRef = useRef(null)
  const capsuleImgRef = useRef(null)
  const parallaxPlaneRef = useRef(null)
  const darkCaptionRef = useRef(null)
  const earthrisePanelRef = useRef(null)
  const epilogueRef = useRef(null)
  const epilogueVeilRef = useRef(null)

  useGSAP(
    () => {
      const root = rootRef.current
      const pin = pinRef.current
      const rail = railRef.current
      const cap = capsuleImgRef.current

      if (!root || !pin || !rail || !cap) return undefined

      const floatTween = gsap.to(cap, {
        yPercent: -3.25,
        duration: 3.3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })

      const media = gsap.matchMedia()

      media.add('(min-width: 769px)', () => {
        const parallaxPlane = parallaxPlaneRef.current
        const darkCap = darkCaptionRef.current
        const earthrise = earthrisePanelRef.current

        const getTravel = () =>
          Math.max(rail.scrollWidth - window.innerWidth, 1)

        const refreshOnImages = () => ScrollTrigger.refresh()
        rail.querySelectorAll('img').forEach((img) => {
          img.addEventListener('load', refreshOnImages, { once: true })
          if (img.complete) refreshOnImages()
        })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pin,
            start: 'top top',
            end: () => `+=${getTravel()}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        tl.to(
          rail,
          {
            x: () => -getTravel(),
            ease: 'none',
            duration: TIMELINE_UNITS,
          },
          0
        )

        tl.from(
          gsap.utils.toArray(root.querySelectorAll('.rail-intro__eyebrow')),
          { opacity: 0, y: 22, duration: 14, ease: 'power2.out' },
          0
        )
        const introTitleEl = root.querySelector('.rail-intro__title')
        if (introTitleEl) {
          tl.from(introTitleEl, { opacity: 0, y: 30, duration: 18, ease: 'power2.out' }, 6)
        }

        const introLeadEl = root.querySelector('.rail-intro__lead')
        if (introLeadEl) {
          tl.from(introLeadEl, { opacity: 0, y: 20, duration: 16, ease: 'power2.out' }, 16)
        }

        const crewImgs = gsap.utils.toArray(root.querySelectorAll('.crew-strip__portrait'))
        if (crewImgs.length > 0) {
          tl.from(
            crewImgs,
            {
              opacity: 0,
              y: 40,
              stagger: { each: 3.2 },
              duration: 12,
              ease: 'power2.out',
            },
            TIMELINE_UNITS * (1 / 5) - 6
          )
        }

        const crewManifesto = root.querySelector('.crew-strip__manifesto')
        if (crewManifesto) {
          tl.from(
            crewManifesto,
            { opacity: 0, y: 28, duration: 18, ease: 'power2.out' },
            TIMELINE_UNITS * (1 / 5) + 10
          )
        }

        if (parallaxPlane) {
          tl.fromTo(
            parallaxPlane,
            { x: '12vw' },
            { x: '-12vw', ease: 'none', duration: TIMELINE_UNITS * 0.38 },
            TIMELINE_UNITS * 0.12
          )
        }

        const perspectiveBits = gsap.utils.toArray(
          root.querySelectorAll('.rail-perspective-caption > *')
        )
        if (perspectiveBits.length > 0) {
          tl.from(
            perspectiveBits,
            { opacity: 0, y: 24, stagger: { each: 6 }, duration: 16, ease: 'power2.out' },
            TIMELINE_UNITS * (2 / 5) - 2
          )
        }

        if (darkCap) {
          tl.fromTo(
            darkCap,
            { autoAlpha: 0 },
            {
              autoAlpha: 1,
              duration: 16,
              ease: 'power3.out',
            },
            TIMELINE_UNITS * (3 / 5) - 8
          )
        }

        if (earthrise) {
          const words = gsap.utils.toArray(
            earthrise.querySelectorAll('[data-earthrise-word]')
          )
          tl.from(
            words,
            {
              opacity: 0,
              y: 24,
              stagger: { each: 3.2 },
              duration: 9,
              ease: 'power2.out',
            },
            TIMELINE_UNITS * (4 / 5) - 4
          )
        }

        const finaleBits = gsap.utils.toArray(root.querySelectorAll('.rail-finale-caption > *'))
        if (finaleBits.length > 0) {
          tl.from(
            finaleBits,
            {
              opacity: 0,
              y: 22,
              stagger: { each: 5 },
              duration: 18,
              ease: 'power2.out',
            },
            TIMELINE_UNITS * (4.5 / 5)
          )
        }

        return () => {
          tl.scrollTrigger?.kill()
          tl.kill()
        }
      })

      const epilogue = epilogueRef.current
      const veil = epilogueVeilRef.current
      let veilTween
      if (epilogue && veil) {
        veilTween = gsap.fromTo(
          veil,
          { opacity: 0 },
          {
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: epilogue,
              start: 'top 88%',
              end: 'bottom top',
              scrub: 1,
            },
          }
        )
      }

      return () => {
        floatTween.kill()
        veilTween?.scrollTrigger?.kill()
        veilTween?.kill()
        media.revert()
      }
    },
    { scope: rootRef }
  )

  return (
    <main ref={rootRef} className="void-journey" id="void-journey-root">
      <div ref={pinRef} className="rail-pin">
        <div ref={railRef} className="rail" role="presentation">
          <section className="rail-panel rail-panel--void rail-panel-intro" aria-label="O Prólogo">
            <div className="rail-panel-visual rail-panel-intro__bg" />
            <div className="rail-intro-wrap">
              <img
                ref={capsuleImgRef}
                className="rail-intro__capsule"
                src={capsuleImg}
                alt=""
                width={560}
                height={420}
                decoding="async"
              />
              <p className="rail-eyebrow rail-intro__eyebrow">Artemis II</p>
              <h1 className="rail-serif rail-intro__title">A 400.000 quilômetros de casa.</h1>
              <p className="rail-intro__lead rail-sans-lead">
                O silêncio do vácuo absoluto.
              </p>
              <p className="rail-indicator">Role para iniciar a jornada ➔</p>
            </div>
          </section>

          <section className="rail-panel rail-panel--void rail-panel-crew" aria-label="A Tripulação">
            <ul className="crew-strip">
              {crewMembers.map((m) => (
                <li key={m.id}>
                  <figure className="crew-strip__figure">
                    <img
                      className="crew-strip__portrait"
                      src={m.portrait}
                      alt={m.name}
                      width={240}
                      height={300}
                      loading="lazy"
                      decoding="async"
                    />
                    <figcaption className="crew-strip__caption">
                      {m.name}
                      <br />
                      <span style={{ fontWeight: 500 }}>{m.role}</span>
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
            <div className="rail-caption">
              <p className="rail-serif crew-strip__manifesto">
                Quatro mentes no vasto escuro. Os primeiros humanos a retornar à Lua em mais de meio
                século.
              </p>
            </div>
          </section>

          <section className="rail-panel rail-perspective" aria-label="O Pálido Ponto Azul">
            <div className="rail-panel-visual rail-panel-visual--parallax">
              <div ref={parallaxPlaneRef} className="rail-parallax-plane">
                <img
                  src={astronautLookingAtEarth}
                  alt="A Terra vista de uma nave espacial através de uma escotilha circular."
                  decoding="async"
                />
              </div>
              <div className="rail-visual-shade" />
            </div>
            <div className="rail-caption rail-perspective-caption">
              <p className="rail-serif">
                Daqui, toda a história da humanidade cabe na ponta de um dedo.
              </p>
              <p className="rail-serif" style={{ marginTop: '0.55em' }}>
                Fronteiras deixam de existir.
              </p>
            </div>
          </section>

          <section className="rail-panel rail-dark" aria-label="O Lado Oculto">
            <div className="rail-panel-visual">
              <img
                src={overTheMoon}
                alt="Superfície lunar sombreada vista do espaço."
                decoding="async"
              />
              <div className="rail-visual-shade" />
            </div>
            <div className="rail-caption rail-dark-caption" ref={darkCaptionRef}>
              <p className="rail-serif">
                O lado oculto. Onde nenhuma luz da Terra alcança, e os sinais de rádio desaparecem.
                O verdadeiro desconhecido.
              </p>
            </div>
          </section>

          <section
            ref={earthrisePanelRef}
            className="rail-panel rail-earthrise"
            aria-label="O Renascimento"
            data-panel="earthrise"
          >
            <div className="rail-panel-visual">
              <img
                src={earthset}
                alt="Lua em primeiro plano com a Terra brilhando no vacuo."
                decoding="async"
              />
              <div className="rail-visual-shade" />
            </div>
            <div className="rail-caption rail-earthrise-caption">
              <p className="rail-eyebrow" style={{ marginBottom: '0.9rem' }}>
                Earthrise
              </p>
              <div className="rail-earthrise-meta rail-serif">
                {EARTHRISE_TEXT.split(/(\s+)/).map((chunk, idx) =>
                  /\s+/.test(chunk) ? (
                    <span key={idx}>{chunk}</span>
                  ) : (
                    <span key={idx} className="rail-earthrise-word" data-earthrise-word>
                      {chunk}
                    </span>
                  )
                )}
              </div>
            </div>
          </section>

          <section className="rail-panel rail-finale" aria-label="Splashdown Noturno">
            <div className="rail-panel-visual">
              <img
                src={splashdownImg}
                alt="Cápsula espacial sendo recuperada nas águas escuras do Pacífico."
                decoding="async"
              />
            </div>
            <div className="rail-caption rail-finale-caption">
              <p className="rail-serif">
                As águas frias do Pacífico nos recebem sob o manto da noite.
              </p>
              <p className="rail-serif" style={{ marginTop: '0.56em', color: 'var(--void-soft)' }}>
                A missão foi apenas o começo.
              </p>
            </div>
          </section>
        </div>
      </div>

      <section ref={epilogueRef} className="void-epilogue" aria-label="Fim da odisseia">
        <div ref={epilogueVeilRef} className="void-epilogue-veil" />
        <div className="void-epilogue-inner">
          <blockquote className="rail-serif void-epilogue-quote">
            O vazio continuou lá fora — mas nós já não éramos mais os mesmos ao voltar ao escuro gentil da
            atmosfera.
          </blockquote>
        </div>
      </section>
    </main>
  )
}

export default VoidJourney
