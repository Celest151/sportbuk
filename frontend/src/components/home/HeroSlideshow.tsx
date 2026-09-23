import { ArrowLeft, ArrowRight } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const slides = [
  {
    label: 'New matchday system',
    title: 'Play without limits.',
    copy: 'Match kit built for every touch, tackle, and finish.',
    action: 'Shop football',
    href: '/products',
    image: '/images/football/matchday.png',
    alt: 'Football player competing under stadium lights',
  },
  {
    label: 'Training collection',
    title: 'Own the pitch.',
    copy: 'Light layers and hard-wearing gear for high-tempo sessions.',
    action: 'Explore training gear',
    href: '/collections',
    image: '/images/football/training.png',
    alt: 'Football training session on the pitch',
  },
  {
    label: 'Goalkeeper collection',
    title: 'Defend every inch.',
    copy: 'Grip, protection, and control for the last line.',
    action: 'Shop goalkeeping',
    href: '/products?search=goalkeeper',
    image: '/images/football/goalkeeper.png',
    alt: 'Goalkeeper preparing to make a save',
  },
]

export function HeroSlideshow() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (paused || reduceMotion) return
    const timer = window.setTimeout(() => {
      setActiveSlide((current) => (current + 1) % slides.length)
    }, 3000)
    return () => window.clearTimeout(timer)
  }, [activeSlide, paused, reduceMotion])

  function move(direction: number) {
    setActiveSlide((current) => (current + direction + slides.length) % slides.length)
  }

  return (
    <section
      className="hero-carousel"
      aria-roledescription="carousel"
      aria-label="Featured football collections"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false)
      }}
    >
      <div className="hero-slides">
        {slides.map((slide, index) => (
          <article
            className={index === activeSlide ? 'hero-slide is-active' : 'hero-slide'}
            aria-hidden={index !== activeSlide}
            key={slide.title}
          >
            <img src={slide.image} alt={index === activeSlide ? slide.alt : ''} fetchPriority={index === 0 ? 'high' : 'auto'} />
            <div className="hero-scrim" />
            <div className="hero-slide-copy page-shell">
              <p className="eyebrow">{slide.label}</p>
              <h1>{slide.title}</h1>
              <p>{slide.copy}</p>
              <Link className="button button-light" to={slide.href} tabIndex={index === activeSlide ? 0 : -1}>
                {slide.action} <ArrowRight size={18} weight="bold" />
              </Link>
            </div>
          </article>
        ))}
      </div>

      <div className="hero-controls page-shell">
        <div className="hero-dots" role="group" aria-label="Choose slide">
          {slides.map((slide, index) => (
            <button
              className={index === activeSlide ? 'is-active' : ''}
              type="button"
              aria-label={`Show ${slide.title}`}
              aria-current={index === activeSlide ? 'true' : undefined}
              onClick={() => setActiveSlide(index)}
              key={slide.title}
            />
          ))}
        </div>
        <div className="hero-arrows">
          <button type="button" aria-label="Previous slide" onClick={() => move(-1)}><ArrowLeft size={21} /></button>
          <button type="button" aria-label="Next slide" onClick={() => move(1)}><ArrowRight size={21} /></button>
        </div>
      </div>
    </section>
  )
}
