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

/** Horizontal slide between panels (timeline proportion; scrubbed by scroll). */
const SEG_MOVE = 13

/** Smoothing applied to vertical scrub driving the horizontal rail (seconds). */
const RAIL_SCRUB_SMOOTH = 1.35

/** Easing on segment transitions — reads smoother than linear under scrub. */
const SEG_MOVE_EASE = 'power2.inOut'

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
  const earthriseParallaxImgRef = useRef(null)
  const darkParallaxImgRef = useRef(null)
  const finaleParallaxImgRef = useRef(null)
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

        const panelW = () => {
          const first = rail.querySelector('.rail-panel')
          return first?.offsetWidth ?? window.innerWidth
        }

        const refreshOnImages = () => ScrollTrigger.refresh()
        rail.querySelectorAll('img').forEach((img) => {
          img.addEventListener('load', refreshOnImages, { once: true })
          if (img.complete) refreshOnImages()
        })

        /** Vertical pixels scrubbed across the full horizontal timeline (auto‑scaled when beats get longer). */
        const getScrollEnd = () =>
          Math.max(
            Math.round(panelW() * 17),
            Math.round(getTravel() * 3.1),
            Math.round(window.innerHeight * 10)
          )

        const nestedParallaxTweens = []

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pin,
            start: 'top top',
            end: () => `+=${getScrollEnd()}`,
            pin: true,
            scrub: RAIL_SCRUB_SMOOTH,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        const addDeepParallax = (panelEl, imgEl, fromPct, toPct) => {
          if (!panelEl || !imgEl) return
          const tween = gsap.fromTo(
            imgEl,
            { xPercent: fromPct },
            {
              xPercent: toPct,
              ease: 'none',
              scrollTrigger: {
                trigger: panelEl,
                containerAnimation: tl,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            }
          )
          nestedParallaxTweens.push(tween)
        }

        let t = 0

        tl.from(
          gsap.utils.toArray(root.querySelectorAll('.rail-intro__eyebrow')),
          { opacity: 0, y: 22, duration: 12, ease: 'power2.out' },
          t
        )
        const introTitleEl = root.querySelector('.rail-intro__title')
        if (introTitleEl) {
          tl.from(introTitleEl, { opacity: 0, y: 30, duration: 15, ease: 'power2.out' }, t + 5)
        }

        const introLeadEl = root.querySelector('.rail-intro__lead')
        if (introLeadEl) {
          tl.from(introLeadEl, { opacity: 0, y: 20, duration: 13, ease: 'power2.out' }, t + 14)
        }
        t += 30

        tl.to(
          rail,
          { x: () => -1 * panelW(), duration: SEG_MOVE, ease: SEG_MOVE_EASE },
          t
        )
        t += SEG_MOVE

        const crewImgs = gsap.utils.toArray(root.querySelectorAll('.crew-strip__portrait'))
        if (crewImgs.length > 0) {
          tl.from(
            crewImgs,
            {
              opacity: 0,
              y: 40,
              stagger: { each: 2.8 },
              duration: 11,
              ease: 'power2.out',
            },
            t
          )
        }

        const crewManifesto = root.querySelector('.crew-strip__manifesto')
        if (crewManifesto) {
          tl.from(
            crewManifesto,
            { opacity: 0, y: 28, duration: 16, ease: 'power2.out' },
            t + 14
          )
        }
        t += 34

        tl.to(
          rail,
          { x: () => -2 * panelW(), duration: SEG_MOVE, ease: SEG_MOVE_EASE },
          t
        )
        t += SEG_MOVE

        if (parallaxPlane) {
          tl.fromTo(
            parallaxPlane,
            { x: '12vw' },
            { x: '-12vw', ease: 'none', duration: 28 },
            t
          )
        }

        const perspectiveBits = gsap.utils.toArray(
          root.querySelectorAll('.rail-perspective-caption > *')
        )
        if (perspectiveBits.length > 0) {
          tl.from(
            perspectiveBits,
            { opacity: 0, y: 24, stagger: { each: 5 }, duration: 14, ease: 'power2.out' },
            t
          )
        }
        t += 32

        tl.to(
          rail,
          { x: () => -3 * panelW(), duration: SEG_MOVE, ease: SEG_MOVE_EASE },
          t
        )
        t += SEG_MOVE

        if (darkCap) {
          tl.fromTo(
            darkCap,
            { autoAlpha: 0 },
            {
              autoAlpha: 1,
              duration: 14,
              ease: 'power3.out',
            },
            t
          )
        }
        t += 20

        tl.to(
          rail,
          { x: () => -4 * panelW(), duration: SEG_MOVE, ease: SEG_MOVE_EASE },
          t
        )
        t += SEG_MOVE

        let earthriseBeat = 26
        if (earthrise) {
          const words = gsap.utils.toArray(
            earthrise.querySelectorAll('[data-earthrise-word]')
          )
          const n = Math.max(words.length, 1)
          const staggerEach = 3.1
          const wordDur = 10
          /** Last word finishes at (n-1)*staggerEach + wordDur; extra dwell so nothing jumps early. */
          earthriseBeat = (n - 1) * staggerEach + wordDur + 18
          tl.from(
            words,
            {
              opacity: 0,
              y: 24,
              stagger: { each: staggerEach },
              duration: wordDur,
              ease: 'power2.out',
            },
            t
          )
        }
        t += earthriseBeat

        tl.to(
          rail,
          { x: () => -getTravel(), duration: SEG_MOVE, ease: SEG_MOVE_EASE },
          t
        )
        t += SEG_MOVE

        const finaleBits = gsap.utils.toArray(root.querySelectorAll('.rail-finale-caption > *'))
        if (finaleBits.length > 0) {
          tl.from(
            finaleBits,
            {
              opacity: 0,
              y: 22,
              stagger: { each: 4.5 },
              duration: 16,
              ease: 'power2.out',
            },
            t
          )
        }

        const earthriseImg = earthriseParallaxImgRef.current
        const darkPanel = root.querySelector('.rail-dark')
        const finalePanel = root.querySelector('.rail-finale')
        addDeepParallax(earthrise, earthriseImg, -9, 16)
        addDeepParallax(darkPanel, darkParallaxImgRef.current, -5, 10)
        addDeepParallax(finalePanel, finaleParallaxImgRef.current, -6, 12)

        return () => {
          nestedParallaxTweens.forEach((tw) => {
            tw.scrollTrigger?.kill()
            tw.kill()
          })
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

          <section
            className="rail-panel rail-panel--void rail-panel-split rail-perspective"
            aria-label="O Pálido Ponto Azul"
          >
            <div className="rail-split__media">
              <div className="rail-media-frame rail-media-frame--parallax">
                <div className="rail-panel-visual rail-panel-visual--parallax rail-panel-visual--framed">
                  <div ref={parallaxPlaneRef} className="rail-parallax-plane">
                    <img
                      src={astronautLookingAtEarth}
                      alt="A Terra vista de uma nave espacial através de uma escotilha circular."
                      decoding="async"
                    />
                  </div>
                  <div className="rail-visual-shade" />
                </div>
              </div>
            </div>
            <div className="rail-caption rail-split__copy rail-perspective-caption">
              <p className="rail-serif">
                Daqui, toda a história da humanidade cabe na ponta de um dedo.
              </p>
              <p className="rail-serif" style={{ marginTop: '0.55em' }}>
                Fronteiras deixam de existir.
              </p>
            </div>
          </section>

          <section className="rail-panel rail-panel--void rail-panel-split rail-dark" aria-label="O Lado Oculto">
            <div className="rail-split__media">
              <div className="rail-media-frame">
                <div className="rail-panel-visual rail-panel-visual--framed">
                  <div className="rail-parallax-window">
                    <img
                      ref={darkParallaxImgRef}
                      className="rail-parallax-window__img"
                      src={overTheMoon}
                      alt="Superfície lunar sombreada vista do espaço."
                      decoding="async"
                    />
                  </div>
                  <div className="rail-visual-shade" />
                </div>
              </div>
            </div>
            <div className="rail-caption rail-split__copy rail-dark-caption" ref={darkCaptionRef}>
              <p className="rail-serif">
                O lado oculto. Onde nenhuma luz da Terra alcança, e os sinais de rádio desaparecem.
                O verdadeiro desconhecido.
              </p>
            </div>
          </section>

          <section
            ref={earthrisePanelRef}
            className="rail-panel rail-panel--void rail-panel-split rail-earthrise"
            aria-label="O Renascimento"
            data-panel="earthrise"
          >
            <div className="rail-split__media">
              <div className="rail-media-frame">
                <div className="rail-panel-visual rail-panel-visual--framed">
                  <div className="rail-parallax-window">
                    <img
                      ref={earthriseParallaxImgRef}
                      className="rail-parallax-window__img rail-parallax-window__img--earthrise"
                      src={earthset}
                      alt="Lua em primeiro plano com a Terra brilhando no vacuo."
                      decoding="async"
                    />
                  </div>
                  <div className="rail-visual-shade" />
                </div>
              </div>
            </div>
            <div className="rail-caption rail-split__copy rail-earthrise-caption">
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

          <section
            className="rail-panel rail-panel--void rail-panel-split rail-finale"
            aria-label="Splashdown Noturno"
          >
            <div className="rail-split__media">
              <div className="rail-media-frame">
                <div className="rail-panel-visual rail-panel-visual--framed">
                  <div className="rail-parallax-window">
                    <img
                      ref={finaleParallaxImgRef}
                      className="rail-parallax-window__img"
                      src={splashdownImg}
                      alt="Cápsula espacial sendo recuperada nas águas escuras do Pacífico."
                      decoding="async"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="rail-caption rail-split__copy rail-finale-caption">
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
