import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Observer } from 'gsap/Observer'
import capsuleImg from '../../assets/Capsula.webp'
import astronautLookingAtEarth from '../../assets/astronautLookingAtEarth.webp'
import earthViewFromOrion from '../../assets/earthViewFromOrion.webp'
import overTheMoon from '../../assets/overTheMoon.webp'
import earthset from '../../assets/earthset.webp'
import backToEarth from '../../assets/backToEarth.webp'
import splashdownImg from '../../assets/splashdown.webp'
import { crewMembers } from '../../data/crew'
import { formatKilometersPerHour } from '../../utils/formatters'
import './VoidJourney.css'

gsap.registerPlugin(useGSAP, ScrollTrigger, Observer)

/** Portfolio CTAs — replace with your profiles. */
const EPILOGUE_GITHUB_HREF = 'https://github.com'
const EPILOGUE_LINKEDIN_HREF = 'https://www.linkedin.com'
const EPILOGUE_AUTHOR = 'Vitor'

/** Horizontal slide between panels (timeline proportion; scrubbed by scroll). */
const SEG_MOVE = 13

/** Smoothing for vertical scrub on pinned rail — lower = snappier scroll (less “stuck” lag). */
const RAIL_SCRUB_SMOOTH = 0.45

/** Easing on segment transitions — reads smoother than linear under scrub. */
const SEG_MOVE_EASE = 'power2.inOut'

const RAIL_PROGRESS_SHARE = 0.85

const PERSPECTIVE_BLOCKQUOTE =
  'Ao ver o nascer da Terra por trás do horizonte curvo e cinzento, a percepção é esmagadora. Todas as fronteiras, guerras, amores e histórias de bilhões de pessoas estão contidas naquele pequeno orbe brilhante, flutuando à deriva.'

function VoidJourney({ progressFillRef }) {
  const rootRef = useRef(null)
  const pinRef = useRef(null)
  const railRef = useRef(null)
  const capsuleImgRef = useRef(null)
  const ch2BgRef = useRef(null)
  const ch2PanelRef = useRef(null)
  const ch3PanelRef = useRef(null)
  const ch3ImgRef = useRef(null)
  const speedRef = useRef(null)
  const ch4PanelRef = useRef(null)
  const earthrisePanelRef = useRef(null)
  const earthriseParallaxImgRef = useRef(null)
  const ch6PanelRef = useRef(null)
  const ch7PanelRef = useRef(null)
  const ch6ImgRef = useRef(null)
  const ch7ImgRef = useRef(null)
  const epilogueRef = useRef(null)
  const epilogueRevealRef = useRef(null)

  useGSAP(
    () => {
      const root = rootRef.current
      const pin = pinRef.current
      const rail = railRef.current
      const cap = capsuleImgRef.current
      const fillEl = progressFillRef?.current

      if (!root || !pin || !rail || !cap) return undefined

      const floatTween = gsap.to(cap, {
        yPercent: -3.25,
        duration: 3.3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })

      const setProgressRail = (tlProgress) => {
        if (!fillEl) return
        gsap.set(fillEl, { scaleX: tlProgress * RAIL_PROGRESS_SHARE })
      }

      const setProgressEpilogue = (self) => {
        if (!fillEl) return
        gsap.set(fillEl, {
          scaleX: RAIL_PROGRESS_SHARE + self.progress * (1 - RAIL_PROGRESS_SHARE),
        })
      }

      const railOffsetAfterPanel = (leaveCount) => {
        const panels = gsap.utils.toArray(rail.querySelectorAll('.rail-panel'))
        let sum = 0
        for (let i = 0; i < leaveCount && i < panels.length; i += 1) {
          sum += panels[i]?.offsetWidth ?? 0
        }
        return -sum
      }

      const getTravel = () => Math.max(rail.scrollWidth - window.innerWidth, 1)

      const media = gsap.matchMedia()

      media.add('(min-width: 769px)', () => {
        ScrollTrigger.normalizeScroll(true)

        const getScrollEnd = () => {
          const panelW = () => {
            const first = rail.querySelector('.rail-panel')
            return first?.offsetWidth ?? window.innerWidth
          }
          return Math.max(
            Math.round(panelW() * 18),
            Math.round(getTravel() * 3.2),
            Math.round(window.innerHeight * 11)
          )
        }

        const refreshOnImages = () => ScrollTrigger.refresh()
        rail.querySelectorAll('img').forEach((img) => {
          img.addEventListener('load', refreshOnImages, { once: true })
          if (img.complete) refreshOnImages()
        })

        const nestedParallaxTweens = []
        let floatPauseST

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pin,
            start: 'top top',
            end: () => `+=${getScrollEnd()}`,
            pin: true,
            scrub: RAIL_SCRUB_SMOOTH,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            fastScrollEnd: true,
          },
        })

        const introPanel = root.querySelector('.rail-panel-intro')
        if (introPanel) {
          floatPauseST = ScrollTrigger.create({
            trigger: introPanel,
            containerAnimation: tl,
            start: 'left right',
            end: 'right left',
            onLeave: () => floatTween.pause(),
            onEnterBack: () => floatTween.play(),
          })
        }

        tl.eventCallback('onUpdate', () => setProgressRail(tl.progress()))

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
          { x: () => railOffsetAfterPanel(1), duration: SEG_MOVE, ease: SEG_MOVE_EASE },
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

        const ch2Title = root.querySelector('.ch2-title')
        if (ch2Title) {
          tl.from(ch2Title, { opacity: 0, y: 26, duration: 14, ease: 'power2.out' }, t + 4)
        }

        const ch2Lead = root.querySelector('.ch2-lead')
        if (ch2Lead) {
          tl.from(ch2Lead, { opacity: 0, y: 22, duration: 14, ease: 'power2.out' }, t + 12)
        }
        t += 34

        tl.to(
          rail,
          { x: () => railOffsetAfterPanel(2), duration: SEG_MOVE, ease: SEG_MOVE_EASE },
          t
        )
        t += SEG_MOVE

        const ch3CopyBits = gsap.utils.toArray(root.querySelectorAll('.rail-ch3-copy > *'))
        if (ch3CopyBits.length > 0) {
          tl.from(
            ch3CopyBits,
            { opacity: 0, y: 24, stagger: { each: 4 }, duration: 14, ease: 'power2.out' },
            t
          )
        }

        const speedProxy = { v: 0 }
        if (speedRef.current) speedRef.current.textContent = formatKilometersPerHour(0)
        tl.to(
          speedProxy,
          {
            v: 40000,
            duration: 22,
            ease: 'none',
            onUpdate: () => {
              if (speedRef.current) {
                speedRef.current.textContent = formatKilometersPerHour(Math.round(speedProxy.v))
              }
            },
          },
          t + 2
        )
        t += 34

        tl.to(
          rail,
          { x: () => railOffsetAfterPanel(3), duration: SEG_MOVE, ease: SEG_MOVE_EASE },
          t
        )
        t += SEG_MOVE

        const maskLines = gsap.utils.toArray(root.querySelectorAll('.ch4-mask-line'))
        if (maskLines.length > 0) {
          tl.from(
            maskLines,
            {
              yPercent: 110,
              stagger: 0.12,
              duration: 14,
              ease: 'power3.out',
            },
            t + 4
          )
        }

        t += 28

        tl.to(
          rail,
          { x: () => railOffsetAfterPanel(4), duration: SEG_MOVE, ease: SEG_MOVE_EASE },
          t
        )
        t += SEG_MOVE

        const earthrise = earthrisePanelRef.current
        let earthriseBeat = 26
        if (earthrise) {
          const words = gsap.utils.toArray(
            earthrise.querySelectorAll('[data-earthrise-word]')
          )
          const n = Math.max(words.length, 1)
          const staggerEach = 3.1
          const wordDur = 10
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
          { x: () => railOffsetAfterPanel(5), duration: SEG_MOVE, ease: SEG_MOVE_EASE },
          t
        )
        t += SEG_MOVE

        // Hold on Cap. VI so copy stays in view (rail must not advance to VII before this beat).
        tl.to({}, { duration: 22, ease: 'none' }, t)
        t += 22

        tl.to(
          rail,
          { x: () => railOffsetAfterPanel(6), duration: SEG_MOVE, ease: SEG_MOVE_EASE },
          t
        )
        t += SEG_MOVE

        tl.to({}, { duration: 18, ease: 'none' }, t)
        t += 18

        tl.to(
          rail,
          { x: () => -getTravel(), duration: SEG_MOVE * 1.65, ease: SEG_MOVE_EASE },
          t
        )

        const ch6Bits = gsap.utils.toArray(root.querySelectorAll('.rail-ch6-copy > *'))
        const ch7Bits = gsap.utils.toArray(root.querySelectorAll('.rail-ch7-copy > *'))
        const ch6Panel = ch6PanelRef.current
        const ch7Panel = ch7PanelRef.current

        const addChapterCopyScrub = (panelEl, bits) => {
          if (!panelEl || bits.length === 0) return
          const tw = gsap.fromTo(
            bits,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              stagger: { each: 0.12 },
              ease: 'power2.out',
              scrollTrigger: {
                trigger: panelEl,
                containerAnimation: tl,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            }
          )
          nestedParallaxTweens.push(tw)
        }

        addChapterCopyScrub(ch6Panel, ch6Bits)
        addChapterCopyScrub(ch7Panel, ch7Bits)

        const ch3Panel = ch3PanelRef.current
        const ch3Img = ch3ImgRef.current
        if (ch3Panel && ch3Img) {
          const scaleTw = gsap.fromTo(
            ch3Img,
            { scale: 1 },
            {
              scale: 1.06,
              ease: 'none',
              scrollTrigger: {
                trigger: ch3Panel,
                containerAnimation: tl,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            }
          )
          nestedParallaxTweens.push(scaleTw)
        }

        const ch2Panel = ch2PanelRef.current
        const ch2Bg = ch2BgRef.current
        addDeepParallax(ch2Panel, ch2Bg, -5, 10)

        const earthriseImg = earthriseParallaxImgRef.current
        if (earthrise && earthriseImg) {
          const ch5ScaleTw = gsap.fromTo(
            earthriseImg,
            { scale: 1 },
            {
              scale: 1.05,
              ease: 'none',
              scrollTrigger: {
                trigger: earthrise,
                containerAnimation: tl,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            }
          )
          nestedParallaxTweens.push(ch5ScaleTw)
        }

        const ch6Img = ch6ImgRef.current
        if (ch6Panel && ch6Img) {
          const scaleTw = gsap.fromTo(
            ch6Img,
            { scale: 1 },
            {
              scale: 1.05,
              ease: 'none',
              scrollTrigger: {
                trigger: ch6Panel,
                containerAnimation: tl,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            }
          )
          nestedParallaxTweens.push(scaleTw)
        }

        const ch7Img = ch7ImgRef.current
        if (ch7Panel && ch7Img) {
          const scaleTw = gsap.fromTo(
            ch7Img,
            { scale: 1 },
            {
              scale: 1.05,
              ease: 'none',
              scrollTrigger: {
                trigger: ch7Panel,
                containerAnimation: tl,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            }
          )
          nestedParallaxTweens.push(scaleTw)
        }

        const epilogue = epilogueRef.current
        const epilogueReveal = epilogueRevealRef.current
        let epilogueProgressST
        let epilogueRevealTween
        if (epilogue) {
          epilogueProgressST = ScrollTrigger.create({
            trigger: epilogue,
            start: 'top bottom',
            end: 'bottom bottom',
            onUpdate: (self) => setProgressEpilogue(self),
          })
        }
        if (epilogue && epilogueReveal) {
          epilogueRevealTween = gsap.fromTo(
            epilogueReveal,
            { opacity: 0, y: 36 },
            {
              opacity: 1,
              y: 0,
              ease: 'none',
              scrollTrigger: {
                trigger: epilogueReveal,
                start: 'top 88%',
                end: 'top 48%',
                scrub: true,
              },
            }
          )
        }

        return () => {
          ScrollTrigger.normalizeScroll(false)
          epilogueProgressST?.kill()
          epilogueRevealTween?.scrollTrigger?.kill()
          epilogueRevealTween?.kill()
          floatPauseST?.kill()
          nestedParallaxTweens.forEach((tw) => {
            tw.scrollTrigger?.kill()
            tw.kill()
          })
          nestedParallaxTweens.length = 0
          tl.scrollTrigger?.kill()
          tl.kill()
          gsap.set(rail, { clearProps: 'transform' })
        }
      })

      media.add('(max-width: 768px)', () => {
        gsap.set(rail, { clearProps: 'transform' })

        const updateMobileProgress = () => {
          if (!fillEl) return
          const docEl = document.documentElement
          const maxScroll = Math.max(0, docEl.scrollHeight - window.innerHeight)
          const t = maxScroll > 0 ? window.scrollY / maxScroll : 0
          gsap.set(fillEl, { scaleX: Math.min(1, Math.max(0, t)) })
        }

        window.addEventListener('scroll', updateMobileProgress, { passive: true })
        window.addEventListener('resize', updateMobileProgress, { passive: true })
        requestAnimationFrame(updateMobileProgress)

        const epilogueReveal = epilogueRevealRef.current
        let io
        if (epilogueReveal) {
          gsap.set(epilogueReveal, { opacity: 0, y: 28 })
          io = new IntersectionObserver(
            (entries) => {
              for (const entry of entries) {
                if (entry.isIntersecting) {
                  gsap.to(epilogueReveal, {
                    opacity: 1,
                    y: 0,
                    duration: 0.55,
                    ease: 'power2.out',
                    overwrite: true,
                  })
                }
              }
            },
            { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
          )
          io.observe(epilogueReveal)
        }

        return () => {
          window.removeEventListener('scroll', updateMobileProgress)
          window.removeEventListener('resize', updateMobileProgress)
          io?.disconnect()
        }
      })

      return () => {
        floatTween.kill()
        media.revert()
      }
    },
    { scope: rootRef }
  )

  return (
    <main ref={rootRef} className="void-journey" id="void-journey-root">
      <div ref={pinRef} className="rail-pin scroll-container">
        <div ref={railRef} className="rail horizontal-track" role="presentation">
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

          <section
            ref={ch2PanelRef}
            className="rail-panel rail-panel--void rail-panel-ch2"
            aria-label="O Fator Humano"
          >
            <img
              ref={ch2BgRef}
              className="ch2-bg"
              src={astronautLookingAtEarth}
              alt=""
              decoding="async"
            />
            <div className="ch2-overlay" aria-hidden="true" />
            <div className="ch2-foreground">
              <p className="rail-eyebrow">Capítulo II</p>
              <h2 className="rail-serif ch2-title">O Fator Humano</h2>
              <p className="rail-sans-lead ch2-lead">
                Pela primeira vez em meio século, humanos ousam romper a segurança da órbita terrestre
                baixa. O maior desafio não é a engenharia termodinâmica, mas a resiliência psicológica de
                encarar o vácuo infinito.
              </p>
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
            </div>
          </section>

          <section
            ref={ch3PanelRef}
            className="rail-panel rail-panel--void rail-ch3"
            aria-label="A Escala da Distância"
          >
            <div className="rail-ch3-grid">
              <div className="rail-ch3-copy">
                <p className="rail-eyebrow">Capítulo III</p>
                <h2 className="rail-tech-title">A Escala da Distância</h2>
                <p className="rail-tech-stat">
                  Velocidade: <span ref={speedRef} className="rail-tech-counter">0 km/h</span>
                </p>
                <p className="rail-ch3-body rail-sans-lead">
                  A Terra já não é um mundo que habitamos, mas um alvo pálido e frágil no retrovisor. O
                  conceito de dia e noite dissolveu-se na escuridão.
                </p>
              </div>
              <div className="rail-ch3-visual">
                <div className="rail-ch3-frame">
                  <img
                    ref={ch3ImgRef}
                    src={earthViewFromOrion}
                    alt="A Terra vista de longe a partir da nave Orion."
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </section>

          <section
            ref={ch4PanelRef}
            className="rail-panel rail-panel--void rail-ch4-full"
            aria-label="O Abismo Prateado"
          >
            <img
              className="rail-ch4-full__bg"
              src={overTheMoon}
              alt="Superfície lunar e espaço."
              decoding="async"
            />
            <div className="ch4-glass-card">
              <p className="rail-eyebrow">Capítulo IV</p>
              <h2 className="rail-serif ch4-title">O Abismo Prateado</h2>
              <div className="ch4-mask-stack">
                <p className="ch4-mask">
                  <span className="ch4-mask-line rail-sans-lead">
                    A injeção translunar nos traz ao lado oculto. Uma região onde nenhuma luz refletida
                    pela Terra consegue alcançar e todos os sinais vitais silenciam.
                  </span>
                </p>
                <p className="ch4-mask">
                  <span className="ch4-mask-line rail-sans-lead">
                    É o pico do isolamento humano. O verdadeiro desconhecido.
                  </span>
                </p>
              </div>
            </div>
          </section>

          <section
            ref={earthrisePanelRef}
            className="rail-panel rail-panel--void rail-ch5-split"
            aria-label="A Grande Perspectiva"
            data-panel="earthrise"
          >
            <div className="rail-ch3-grid rail-ch5-grid">
              <div className="rail-ch5-copy rail-ch5-quote-wrap">
                <p className="rail-eyebrow">Capítulo V</p>
                <blockquote className="rail-ch5-blockquote rail-serif">
                  <span className="rail-earthrise-meta">
                    {PERSPECTIVE_BLOCKQUOTE.split(/(\s+)/).map((chunk, idx) =>
                      /\s+/.test(chunk) ? (
                        <span key={idx}>{chunk}</span>
                      ) : (
                        <span key={idx} className="rail-earthrise-word" data-earthrise-word>
                          {chunk}
                        </span>
                      )
                    )}
                  </span>
                </blockquote>
              </div>
              <div className="rail-ch3-visual">
                <div className="rail-ch3-frame rail-ch5-frame">
                  <img
                    ref={earthriseParallaxImgRef}
                    src={earthset}
                    alt="Earthset — Lua em primeiro plano com a Terra no horizonte."
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </section>

          <section
            ref={ch6PanelRef}
            className="rail-panel rail-panel--void rail-ch6-split"
            aria-label="Reentrada"
          >
            <div className="rail-ch3-grid rail-ch6-grid">
              <div className="rail-ch3-copy rail-ch6-copy">
                <p className="rail-eyebrow">Capítulo VI</p>
                <h2 className="rail-tech-title">O Abraço Incandescente</h2>
                <p className="rail-ch3-body rail-sans-lead">
                  O pálido ponto azul agora preenche a janela. Após contornar o abismo, a atmosfera nos
                  recebe em um abraço incandescente de plasma e fricção.
                </p>
              </div>
              <div className="rail-ch3-visual">
                <div className="rail-ch3-frame rail-ch6-frame">
                  <img
                    ref={ch6ImgRef}
                    src={backToEarth}
                    alt="Reentrada atmosférica."
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </section>

          <section
            ref={ch7PanelRef}
            className="rail-panel rail-panel--void rail-ch7-split"
            aria-label="Splashdown"
          >
            <div className="rail-ch3-grid rail-ch7-grid">
              <div className="rail-ch3-copy rail-ch7-copy">
                <p className="rail-eyebrow">Capítulo VII</p>
                <h2 className="rail-tech-title">O Oceano</h2>
                <p className="rail-ch3-body rail-sans-lead">
                  O silêncio do espaço cede lugar ao som intenso do Pacífico. O fim desta odisseia marca
                  apenas o primeiro passo.
                </p>
              </div>
              <div className="rail-ch3-visual">
                <div className="rail-ch3-frame rail-ch7-frame">
                  <img
                    ref={ch7ImgRef}
                    src={splashdownImg}
                    alt="Cápsula espacial sendo recuperada nas águas escuras."
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <section ref={epilogueRef} className="void-epilogue" aria-label="Behind the Scenes">
        <div className="void-epilogue-veil" aria-hidden="true" />
        <div className="void-epilogue-inner">
          <div ref={epilogueRevealRef} className="void-epilogue-bts">
            <div className="void-epilogue-col void-epilogue-col--intro">
              <h2 className="void-epilogue-title void-epilogue-kicker">Behind the Scenes</h2>
              <p className="void-epilogue-subtitle">Arquitetura e Desenvolvimento</p>
              <p className="void-epilogue-credits rail-sans-lead">
                Imagens gentilmente fornecidas pelo acervo público da NASA (Missão Artemis II).
              </p>
              <p className="void-epilogue-signature">
                Conceito e Engenharia por <strong>{EPILOGUE_AUTHOR}</strong>.
              </p>
            </div>
            <div className="void-epilogue-col void-epilogue-col--stack">
              <p className="void-epilogue-stack-label">Stack</p>
              <ul className="void-epilogue-stack">
                <li>
                  <span className="void-epilogue-stack-key">Frontend</span>
                  <span className="void-epilogue-stack-val">React.js &amp; Vite</span>
                </li>
                <li>
                  <span className="void-epilogue-stack-key">Animação</span>
                  <span className="void-epilogue-stack-val">GSAP (ScrollTrigger &amp; Core)</span>
                </li>
                <li>
                  <span className="void-epilogue-stack-key">Estilização</span>
                  <span className="void-epilogue-stack-val">CSS3 Avançado &amp; Flexbox</span>
                </li>
              </ul>
              <div className="void-epilogue-cta-row">
                <a
                  className="void-epilogue-btn void-epilogue-btn--primary"
                  href={EPILOGUE_GITHUB_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver Código no GitHub
                </a>
                <a
                  className="void-epilogue-btn void-epilogue-btn--outline"
                  href={EPILOGUE_LINKEDIN_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Conectar no LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default VoidJourney
