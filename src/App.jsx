import { useEffect, useRef, useState } from 'react'
import { joinWaitlist } from './lib/supabase'

const asset = (file) => `${import.meta.env.BASE_URL}${file.replace(/^\//, '')}`

const CLOSE_UP_SRC = asset('close-up-bg.jpg')
const FRONT_SRC = asset('front.png')
const BACK_SRC = asset('back.png')
const LOGO_SRC = asset('logo-noir.png')
const ABOUT_SRC = asset('FINAL FANTASY - 00000001.jpg')
const INSTAGRAM_HANDLE = 'nooo.ooe'
const INSTAGRAM_URL = `https://instagram.com/${INSTAGRAM_HANDLE}`

const HOME_VIEW = 'details'

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  )
}

const PRODUCT_IMAGES = [
  FRONT_SRC,
  BACK_SRC,
  CLOSE_UP_SRC,
  ABOUT_SRC,
  asset('FINAL FANTASY - 00000012.jpg'),
  asset('FINAL FANTASY - 00000004.jpg'),
  asset('FINAL FANTASY - 00000005.jpg'),
  asset('FINAL FANTASY - 00000006.jpg'),
  asset('FINAL FANTASY - 00000007.jpg'),
  asset('FINAL FANTASY - 00000008.jpg'),
  asset('FINAL FANTASY - 00000009.jpg'),
  asset('FINAL FANTASY - 00000010.jpg'),
  asset('FINAL FANTASY - 00000011.jpg'),
]

const MARQUEE_SEQUENCE = [FRONT_SRC, BACK_SRC, FRONT_SRC, BACK_SRC, FRONT_SRC, BACK_SRC]

function ProductMedia({ src }) {
  const isJacket = src === FRONT_SRC || src === BACK_SRC
  if (isJacket) return <JacketArt src={src} />
  return <img src={src} alt="" draggable={false} />
}

function ProductPage({ email, setEmail, onSubmit, submitting, formError }) {
  const [active, setActive] = useState(0)
  const thumbsRef = useRef(null)
  const src = PRODUCT_IMAGES[active]

  // The strip scrolls vertically on desktop and horizontally on mobile. When the
  // viewport flips between the two, a leftover offset can land past the content
  // and leave the strip looking empty.
  useEffect(() => {
    const el = thumbsRef.current
    if (!el) return

    function clampScroll() {
      el.scrollTop = Math.min(el.scrollTop, el.scrollHeight - el.clientHeight)
      el.scrollLeft = Math.min(el.scrollLeft, el.scrollWidth - el.clientWidth)
    }

    window.addEventListener('resize', clampScroll)
    window.addEventListener('orientationchange', clampScroll)
    return () => {
      window.removeEventListener('resize', clampScroll)
      window.removeEventListener('orientationchange', clampScroll)
    }
  }, [])

  function scrollThumbs() {
    const el = thumbsRef.current
    if (!el) return

    const vertical = el.scrollHeight > el.clientHeight
    const max = vertical
      ? el.scrollHeight - el.clientHeight
      : el.scrollWidth - el.clientWidth
    const current = vertical ? el.scrollTop : el.scrollLeft
    const step = (vertical ? el.clientHeight : el.clientWidth) * 0.8
    const next = current + step >= max - 1 ? 0 : current + step

    el.scrollTo({ [vertical ? 'top' : 'left']: next, behavior: 'smooth' })
  }

  return (
    <div className="product-page">
      <div className="product-layout">
        <div className="product-thumbs-col">
          <div className="product-thumbs" ref={thumbsRef}>
            {PRODUCT_IMAGES.map((thumb, i) => (
              <button
                key={thumb}
                type="button"
                className={`product-thumb${i === active ? ' active' : ''}`}
                onClick={() => setActive(i)}
                aria-label={`View image ${i + 1}`}
              >
                <ProductMedia src={thumb} />
              </button>
            ))}
          </div>
          <button
            className="product-thumbs-more"
            type="button"
            onClick={scrollThumbs}
            aria-label="More images"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>

        <div
          className={`product-stage${src === FRONT_SRC || src === BACK_SRC ? ' studio' : ' look'}`}
        >
          <img
            className="product-stage-sizer"
            src={FRONT_SRC}
            alt=""
            aria-hidden="true"
            draggable={false}
          />
          <div className="product-stage-media">
            <ProductMedia src={src} />
          </div>
        </div>

        <div className="product-info">
          <h1>Stiff™ Jacket</h1>
          <p className="product-price">295 €</p>
          <div className="product-color">
            <span className="product-swatch" aria-hidden="true" />
            <span>Color: Beige</span>
          </div>
          <p className="product-material">100% cotton</p>
          <div className="product-waitlist">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSubmit()
              }}
              disabled={submitting}
            />
            <button type="button" onClick={onSubmit} disabled={submitting}>
              {submitting ? 'Joining…' : 'Join Waitlist'}
            </button>
            {formError && <p className="form-error">{formError}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

function JacketArt({ src, imgKey }) {
  return (
    <span className="jacket-art">
      <img
        className="jacket-base"
        key={imgKey ? `${imgKey}-base` : undefined}
        src={src}
        alt=""
        draggable={false}
      />
      <img
        className="jacket-warm"
        key={imgKey ? `${imgKey}-warm` : undefined}
        src={src}
        alt=""
        aria-hidden="true"
        draggable={false}
      />
    </span>
  )
}

function JacketMarquee() {
  return (
    <div className="about-marquee">
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <div className="marquee-group" key={copy}>
            {MARQUEE_SEQUENCE.map((src, i) => (
              <MarqueeCard
                key={`${copy}-${i}`}
                frontSrc={src}
                backSrc={src === FRONT_SRC ? BACK_SRC : FRONT_SRC}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function MarqueeCard({ frontSrc, backSrc }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <button
      type="button"
      className={`marquee-item${flipped ? ' flipped' : ''}`}
      onClick={() => {
        if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
        setFlipped((f) => !f)
      }}
      aria-label="Flip card"
    >
      <div className="marquee-card">
        <div className="marquee-face front">
          <JacketArt src={frontSrc} />
        </div>
        <div className="marquee-face back">
          <JacketArt src={backSrc} />
        </div>
      </div>
    </button>
  )
}

const BASE_BRIGHTNESS = 1.1
const BASE_TEMPERATURE = 0.45

function differencePercent(level) {
  return Math.max(5, 20 * Math.pow(0.93, level - 1))
}

function pickDifferenceType(level) {
  const options = ['color']
  if (level > 6) options.push('tilt')
  if (level > 12) options.push('size')
  return options[Math.floor(Math.random() * options.length)]
}

function describeOdd(odd) {
  const pct = odd.percent
  if (odd.type === 'color') return `${pct}% darker`
  if (odd.type === 'size') {
    return odd.scale < 1 ? `${pct}% smaller` : `${pct}% larger`
  }
  return `${pct}% tilted`
}

function buildOdd(level) {
  const type = pickDifferenceType(level)
  const percent = differencePercent(level)
  const pct = percent / 100

  const odd = {
    type,
    percent: Math.round(percent),
    brightness: BASE_BRIGHTNESS,
    temperature: BASE_TEMPERATURE,
    rotate: 0,
    scale: 1,
  }

  if (type === 'color') {
    odd.brightness = BASE_BRIGHTNESS * (1 - pct)
  } else if (type === 'tilt') {
    odd.rotate = (Math.random() > 0.5 ? 1 : -1) * pct * 30
  } else {
    odd.scale = Math.random() > 0.5 ? 1 + pct : 1 - pct
  }

  odd.label = describeOdd(odd)
  return odd
}

function buildRound(level) {
  const cards = [
    { id: 'f1', src: FRONT_SRC },
    { id: 'f2', src: FRONT_SRC },
    { id: 'b1', src: BACK_SRC },
    { id: 'b2', src: BACK_SRC },
  ].sort(() => Math.random() - 0.5)

  return {
    cards,
    oddIndex: Math.floor(Math.random() * 4),
    odd: buildOdd(level),
    roundId: `${Date.now()}-${Math.random()}`,
  }
}

function planFlipRound(cards, level) {
  let next = cards.map((c) => {
    const swap = Math.random() < 0.5
    return {
      id: c.id,
      src: swap
        ? c.src === FRONT_SRC
          ? BACK_SRC
          : FRONT_SRC
        : c.src,
    }
  })

  let frontCount = next.filter((c) => c.src === FRONT_SRC).length
  let guard = 0
  while (frontCount !== 2 && guard < 16) {
    const idx = Math.floor(Math.random() * next.length)
    if (frontCount > 2 && next[idx].src === FRONT_SRC) {
      next[idx] = { ...next[idx], src: BACK_SRC }
      frontCount--
    } else if (frontCount < 2 && next[idx].src === BACK_SRC) {
      next[idx] = { ...next[idx], src: FRONT_SRC }
      frontCount++
    }
    guard++
  }

  next = next.map((c, i) => ({
    ...c,
    didSwap: c.src !== cards[i].src,
  }))

  return {
    cards: next,
    oddIndex: Math.floor(Math.random() * 4),
    odd: buildOdd(level),
    roundId: `${Date.now()}-${Math.random()}`,
  }
}

function hintForLevel(level) {

}

const ROUND_SECONDS = 10
const ROUND_MS = ROUND_SECONDS * 1000

function formatTimer(ms) {
  const total = Math.max(0, ms)
  const seconds = Math.floor(total / 1000)
  const hundredths = Math.floor((total % 1000) / 10)
  return `${seconds}.${String(hundredths).padStart(2, '0')}`
}

function PlayGame({ onExit }) {
  const [started, setStarted] = useState(false)
  const [lives, setLives] = useState(3)
  const [level, setLevel] = useState(1)
  const [round, setRound] = useState(() => buildRound(1))
  const [resolved, setResolved] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [bounceId, setBounceId] = useState(null)
  const [bounceKey, setBounceKey] = useState(0)
  const [flipping, setFlipping] = useState(false)
  const [timeLeft, setTimeLeft] = useState(ROUND_MS)
  const [diffReveal, setDiffReveal] = useState(null)
  const nextRoundRef = useRef(() => {})
  const locked = useRef(false)
  const levelRef = useRef(1)
  const timerRef = useRef(null)

  levelRef.current = level

  function clearTimer() {
    if (timerRef.current) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  useEffect(() => {
    if (!started || gameOver || flipping || resolved) {
      clearTimer()
      return
    }

    setTimeLeft(ROUND_MS)
    const deadline = Date.now() + ROUND_MS
    timerRef.current = window.setInterval(() => {
      const remaining = deadline - Date.now()
      if (remaining <= 0) {
        setTimeLeft(0)
        clearTimer()
        if (locked.current) return
        locked.current = true
        window.setTimeout(() => {
          setLives((l) => {
            const next = l - 1
            if (next <= 0) {
              setGameOver(true)
              locked.current = false
              return next
            }
            nextRoundRef.current(levelRef.current)
            return next
          })
        }, 0)
        return
      }
      setTimeLeft(remaining)
    }, 16)

    return clearTimer
  }, [started, round.roundId, flipping, gameOver, resolved])

  function showFeedback(el, correct) {
    const rect = el.getBoundingClientRect()
    const id = Date.now()
    setFeedback({
      id,
      correct,
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height * 0.35,
    })
    window.setTimeout(() => {
      setFeedback((f) => (f?.id === id ? null : f))
      setBounceId(null)
    }, 400)
  }

  function nextRound(nextLevel) {
    const planned = planFlipRound(round.cards, nextLevel)

    // Start flip with no odd visible — difference is on the other side
    setResolved(false)
    setRound((prev) => ({
      ...prev,
      cards: prev.cards.map((c, i) => ({
        ...c,
        didSwap: planned.cards[i].didSwap,
      })),
      oddIndex: -1,
      pending: planned,
    }))
    setFlipping(true)
    setDiffReveal(null)

    // At edge-on, swap faces + apply odd instantly (no fade)
    window.setTimeout(() => {
      setRound(planned)
    }, 280)

    window.setTimeout(() => {
      setFlipping(false)
      locked.current = false
    }, 560)
  }

  nextRoundRef.current = nextRound

  function handlePick(event, index) {
    if (!started || gameOver || locked.current || resolved) return
    const isOdd = index === round.oddIndex
    locked.current = true
    showFeedback(event.currentTarget, isOdd)

    if (isOdd) {
      setResolved(true)
      setDiffReveal({
        id: Date.now(),
        label: round.odd.label,
        index,
      })
      window.setTimeout(() => {
        const nextLevel = level + 1
        setLevel(nextLevel)
        nextRound(nextLevel)
      }, 720)
      return
    }

    window.setTimeout(() => {
      setLives((l) => {
        const next = l - 1
        if (next <= 0) {
          setGameOver(true)
          locked.current = false
          return next
        }
        nextRound(level)
        return next
      })
    }, 160)
  }

  function restart() {
    setLives(3)
    setLevel(1)
    setRound(buildRound(1))
    setResolved(false)
    setGameOver(false)
    setFeedback(null)
    setTimeLeft(ROUND_MS)
    setDiffReveal(null)
    locked.current = false
    setStarted(true)
  }

  function startGame() {
    setTimeLeft(ROUND_MS)
    setStarted(true)
  }

  return (
    <div className="play-page">
      <div className="play-hud">
        <div className="play-stat">Level {level}</div>
        <div className="play-lives" aria-label={`${lives} lives left`}>
          {[0, 1, 2].map((i) => (
            <svg
              key={i}
              className={`life${i < lives ? ' on' : ''}`}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12.1 21.35 10.55 19.94C5.4 15.27 2 12.2 2 8.5 2 5.5 4.42 3.1 7.4 3.1c1.74 0 3.41.81 4.5 2.09 1.09-1.28 2.76-2.09 4.5-2.09C19.58 3.1 22 5.5 22 8.5c0 3.7-3.4 6.77-8.55 11.44z" />
            </svg>
          ))}
        </div>
      </div>

      <p className="play-hint">{hintForLevel(level)}</p>

      <div className={`play-board${flipping ? ' flipping' : ''}`}>
        {round.cards.map((card, index) => {
          const isOdd = index === round.oddIndex && !resolved
          const brightness = isOdd ? round.odd.brightness : BASE_BRIGHTNESS
          const temperature = isOdd
            ? round.odd.temperature ?? BASE_TEMPERATURE
            : BASE_TEMPERATURE
          const rotate = isOdd ? round.odd.rotate : 0
          const scale = isOdd ? round.odd.scale : 1

          return (
            <button
              key={card.id}
              type="button"
              className={[
                'play-card',
                resolved && index === round.oddIndex ? 'normalized' : '',
                bounceId === card.id ? 'pop' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              style={{
                '--card-brightness':
                  resolved && index === round.oddIndex
                    ? BASE_BRIGHTNESS
                    : brightness,
                '--card-temperature':
                  resolved && index === round.oddIndex
                    ? BASE_TEMPERATURE
                    : temperature,
                transform: `rotate(${rotate}deg) scale(${
                  resolved && index === round.oddIndex ? 1 : scale
                })`,
              }}
              onClick={(e) => {
                setBounceId(card.id)
                setBounceKey((k) => k + 1)
                handlePick(e, index)
              }}
              disabled={!started || gameOver || flipping}
            >
              <span className="play-card-flip">
                <JacketArt
                  src={card.src}
                  imgKey={
                    bounceId === card.id ? `tap-${bounceKey}` : card.src
                  }
                />
              </span>
              {diffReveal && diffReveal.index === index && (
                <span key={diffReveal.id} className="play-diff">
                  {diffReveal.label}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {feedback && (
        <div
          key={feedback.id}
          className="play-feedback"
          style={{ left: feedback.x, top: feedback.y }}
        >
          {feedback.correct ? '✓' : '✕'}
        </div>
      )}

      {!gameOver && started && (
        <div className={`play-timer${timeLeft <= 3000 ? ' urgent' : ''}`}>
          {formatTimer(timeLeft)}
        </div>
      )}

      {!started && (
        <div className="play-intro">
          <h3>How to play</h3>
          <p>Four jackets. One is different: darker, tilted, smaller, or bigger.</p>
          <p>Tap the odd one before the timer runs out. You have 3 lives.</p>
          <button type="button" onClick={startGame}>
            Start
          </button>
        </div>
      )}

      {gameOver && (
        <div className="play-over">
          <h3>Game Over</h3>
          <p>Level {level}</p>
          
          <div className="play-over-actions">
            <button type="button" onClick={restart}>
              Play Again
            </button>
            <button type="button" className="btn-secondary" onClick={onExit}>
              Exit
            </button>
            
          </div>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="play-over-ig"
          >
            <InstagramIcon />
            Follow us @{INSTAGRAM_HANDLE}
          </a>
        </div>
      )}
    </div>
  )
}

function App() {
  const [logoVisible, setLogoVisible] = useState(false)
  const [view, setView] = useState(HOME_VIEW)
  const [menuOpen, setMenuOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [introDone, setIntroDone] = useState(false)
  const [bgZooming, setBgZooming] = useState(false)

  useEffect(() => {
    const logoTimer = setTimeout(() => setLogoVisible(true), 400)
    const zoomTimer = setTimeout(() => {
      setBgZooming(true)
    }, 900)
    const hideBgTimer = setTimeout(() => {
      setIntroDone(true)
    }, 2200)

    return () => {
      clearTimeout(logoTimer)
      clearTimeout(zoomTimer)
      clearTimeout(hideBgTimer)
    }
  }, [])

  function openView(next) {
    setView(next)
    setMenuOpen(false)
    window.scrollTo(0, 0)
  }

  function goHome() {
    openView(HOME_VIEW)
  }

  async function submitEmail() {
    if (submitting) return
    setFormError('')
    setSubmitting(true)
    const result = await joinWaitlist(email)
    setSubmitting(false)
    if (!result.ok) {
      setFormError(result.error)
      return
    }
    setModalOpen(true)
    setEmail('')
  }

  return (
    <div className={`view-${view}`}>
      <img
        className={`logo${logoVisible ? ' visible' : ''}`}
        src={LOGO_SRC}
        alt="OUMAR"
      />

      <nav className={`top-menu${logoVisible ? ' visible' : ''}`}>
        <button type="button" onClick={() => openView('about')}>
          About
        </button>
        <button type="button" onClick={() => openView('play')}>
          Play
        </button>
      </nav>

      <button
        type="button"
        className={`hamburger${logoVisible ? ' visible' : ''}${menuOpen ? ' open' : ''}`}
        onClick={() => setMenuOpen((o) => !o)}
        aria-label="Menu"
      >
        <span />
        <span />
        <span />
      </button>

      {menuOpen && (
        <div className="mobile-menu">
          <button type="button" onClick={goHome}>Home</button>
          <button type="button" onClick={() => openView('about')}>About</button>
          <button type="button" onClick={() => openView('play')}>Play</button>
        </div>
      )}

      {!introDone && (
        <div className={`bg-stack${bgZooming ? ' zooming-out' : ''}`}>
          <div className="bg-layer close-up">
            <img src={CLOSE_UP_SRC} alt="" />
          </div>
        </div>
      )}

      {view === HOME_VIEW && (
        <ProductPage
          email={email}
          setEmail={setEmail}
          onSubmit={submitEmail}
          submitting={submitting}
          formError={formError}
        />
      )}

      {view === 'about' && (
        <div className="about-page">
          <JacketMarquee />
          <div className="about-layout">
            <div className="about-image">
              <img src={ABOUT_SRC} alt="OUMAR Farmer Jacket" />
            </div>
            <div className="about-content">
              <h1>OUMAR</h1>
              <p>
                Founded on the principle that clothing should be both timeless and
                intentional, OUMAR creates garments rooted in craftsmanship and
                modern sensibility. Each piece is designed to live beyond seasons —
                considered, minimal, and made to be worn for years.
              </p>
              <p>
                The Farmer Jacket is our debut piece: 100% cotton, collarless,
                cropped to the waist. Inspired by workwear silhouettes reimagined
                through a contemporary lens.
              </p>
              <p className="about-sig">Paris, 2026</p>
            </div>
          </div>
        </div>
      )}

      {view === 'terms' && (
        <div className="terms-page">
          <h1>Terms & Conditions</h1>
          <p className="terms-updated">Last updated: August 2026</p>

          <h2>1. Overview</h2>
          <p>
            These Terms & Conditions govern your use of the OUMAR website and
            waitlist. By submitting your email, you agree to these terms.
          </p>

          <h2>2. Waitlist</h2>
          <p>
            Joining the waitlist does not guarantee purchase availability.
            Products are subject to limited stock and will be offered on a
            first-come, first-served basis upon launch.
          </p>

          <h2>3. Privacy & Data</h2>
          <p>
            We collect your email address solely for waitlist notifications and
            product updates. We do not sell or share your personal data with
            third parties. You may request deletion of your data at any time by
            contacting us.
          </p>

          <h2>4. Intellectual Property</h2>
          <p>
            All content on this website — including images, logos, text, and
            designs — is the property of OUMAR and may not be reproduced without
            written permission.
          </p>

          <h2>5. Limitation of Liability</h2>
          <p>
            OUMAR is not liable for any damages arising from use of this website
            or reliance on information provided herein. The website is provided
            "as is" without warranties of any kind.
          </p>

          <h2>6. Changes</h2>
          <p>
            We reserve the right to modify these terms at any time. Continued use
            of the website constitutes acceptance of updated terms.
          </p>

          <h2>7. Contact</h2>
          <p>
            For questions regarding these terms, reach out via Instagram{' '}
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
              @{INSTAGRAM_HANDLE}
            </a>.
          </p>
        </div>
      )}

      {view === 'play' && <PlayGame onExit={goHome} />}

      <button className="back-btn" type="button" onClick={goHome}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Home
      </button>

      <footer className="site-footer">
        <div className="footer-inner">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-ig"
          >
            <InstagramIcon />
            @{INSTAGRAM_HANDLE}
          </a>
          <div className="footer-links">
            <button type="button" onClick={() => openView('terms')}>
              Terms & Conditions
            </button>
          </div>
          <p className="footer-copy">© 2026 OUMAR. All rights reserved.</p>
        </div>
      </footer>

      <div
        className={`modal-overlay${modalOpen ? ' active' : ''}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setModalOpen(false)
        }}
      >
        <div className="modal">
          <h3>You're In</h3>
          <p>
            We've added you to the waitlist. You'll be the first to know when we
            launch.
          </p>
          <div className="modal-actions">
          <button type="button" onClick={() => setModalOpen(false)}>
              Close
            </button>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="modal-follow"
            >
              <InstagramIcon />
              Follow us @{INSTAGRAM_HANDLE}
            </a>
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
