import { motion } from 'framer-motion'
import { Clock3, MapPinned, Phone, Smile, Users } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { ABOUT_GALLERY } from '../../data/about'
import { VISIT_INFO } from '../../data/visit'
import type { AboutFeature } from '../../types'
import { BeanDoodle } from '../doodles/Doodles'
import { Button } from '../ui/Button'
import { SectionHeading } from '../ui/SectionHeading'
import { WhatsAppFab } from '../ui/WhatsAppFab'

const features: AboutFeature[] = [
  {
    id: 'coffee',
    title: 'Premium Coffee',
    description: 'Thoughtful cups — from filter classics to creamy lattes.',
    icon: 'bean',
  },
  {
    id: 'cozy',
    title: 'Cozy Ambience',
    description: 'Warm wood, soft light, and a booth made for lingering.',
    icon: 'cozy',
  },
  {
    id: 'fun',
    title: 'Fun Together',
    description: 'Games and good company between every sip and bite.',
    icon: 'fun',
  },
]

/** Fixed card size for web + mobile — do not change across breakpoints. */
const CARD_WIDTH = 280
const CARD_HEIGHT = 360
const CARD_GAP = 14

function FeatureIcon({ icon }: { icon: AboutFeature['icon'] }) {
  if (icon === 'bean') return <BeanDoodle className="size-6" color="#563B2D" />
  if (icon === 'cozy') return <Users className="size-5 text-coffee" aria-hidden="true" />
  return <Smile className="size-5 text-coffee" aria-hidden="true" />
}

function AboutGallery() {
  const [slideIndex, setSlideIndex] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)
  const slideIndexRef = useRef(0)
  const autoplayPausedRef = useRef(false)
  const resumeTimerRef = useRef<number | null>(null)

  const scrollToSlide = (index: number) => {
    const slider = sliderRef.current
    const card = slider?.querySelectorAll<HTMLElement>('[data-about-slide]')[index]
    if (!slider || !card) return
    slider.scrollTo({ left: card.offsetLeft, behavior: 'smooth' })
    slideIndexRef.current = index
    setSlideIndex(index)
  }

  const pauseAutoplay = (resumeAfterMs = 4500) => {
    autoplayPausedRef.current = true
    if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current)
    resumeTimerRef.current = window.setTimeout(() => {
      autoplayPausedRef.current = false
    }, resumeAfterMs)
  }

  useEffect(() => {
    const slider = sliderRef.current
    if (!slider) return

    const onScroll = () => {
      const nextIndex = Math.round(slider.scrollLeft / (CARD_WIDTH + CARD_GAP))
      const clamped = Math.min(Math.max(nextIndex, 0), ABOUT_GALLERY.length - 1)
      slideIndexRef.current = clamped
      setSlideIndex(clamped)
    }

    const onPointerDown = () => pauseAutoplay()

    slider.addEventListener('scroll', onScroll, { passive: true })
    slider.addEventListener('pointerdown', onPointerDown)
    return () => {
      slider.removeEventListener('scroll', onScroll)
      slider.removeEventListener('pointerdown', onPointerDown)
    }
  }, [])

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')

    const tick = () => {
      if (reduced.matches || autoplayPausedRef.current) return
      const next = (slideIndexRef.current + 1) % ABOUT_GALLERY.length
      scrollToSlide(next)
    }

    const id = window.setInterval(tick, 3500)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current)
    }
  }, [])

  return (
    <div className="w-full">
      <div
        ref={sliderRef}
        className="flex snap-x snap-mandatory gap-[14px] overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Amrita Coffee House photos"
        style={{ scrollPaddingInline: 0 }}
      >
        {ABOUT_GALLERY.map((photo) => (
          <figure
            key={photo.id}
            data-about-slide
            className="shrink-0 snap-start overflow-hidden rounded-[1.5rem] bg-foam shadow-[0_18px_44px_rgba(56,37,27,0.16)] ring-1 ring-coffee/10"
            style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
          >
            <img
              src={photo.image}
              alt={photo.title}
              className="size-full object-cover"
              loading="lazy"
              draggable={false}
            />
          </figure>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-3">
        <p className="text-xs font-medium tracking-wide text-coffee/55">
          {slideIndex + 1} / {ABOUT_GALLERY.length} · auto
        </p>
        <div className="flex items-center gap-1.5">
          {ABOUT_GALLERY.map((photo, index) => (
            <button
              key={photo.id}
              type="button"
              aria-label={`Show ${photo.title}`}
              onClick={() => {
                pauseAutoplay()
                scrollToSlide(index)
              }}
              className={[
                'h-1.5 rounded-full transition-all',
                index === slideIndex ? 'w-5 bg-coffee' : 'w-1.5 bg-coffee/25',
              ].join(' ')}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export function About() {
  return (
    <section id="about" className="relative bg-cream" aria-labelledby="about-heading">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-14">
        <motion.div
          initial={{ opacity: 0, x: -18 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55 }}
          className="relative min-w-0"
        >
          <AboutGallery />
        </motion.div>

        <div className="relative">
          <SectionHeading
            eyebrow="About Amrita"
            title="More Than Just a Cafe"
            description="Amrita Coffee House is a warm Bilimora corner for slow sips, comforting bites, and shared laughter — coffee culture with a playful spirit."
          />
          <span id="about-heading" className="sr-only">
            About Amrita
          </span>

          <p className="mt-5 max-w-xl text-sm leading-relaxed text-coffee/75 md:text-base">
            Come for the aroma, stay for the atmosphere. Soft booths, wooden textures, and a
            neon glow set the mood while friends linger over cups, plates, and a quick game
            between stories.
          </p>

          <ul className="mt-8 grid gap-4 sm:grid-cols-3">
            {features.map((feature, index) => (
              <motion.li
                key={feature.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: index * 0.06, duration: 0.4 }}
                className="rounded-2xl bg-foam/80 p-4 ring-1 ring-coffee/8"
              >
                <div className="mb-3 grid size-10 place-items-center rounded-full bg-soft-blue/40">
                  <FeatureIcon icon={feature.icon} />
                </div>
                <h3 className="font-display text-base font-semibold text-chocolate">
                  {feature.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-coffee/70">
                  {feature.description}
                </p>
              </motion.li>
            ))}
          </ul>

          <aside
            id="visit"
            className="relative mt-8 max-w-md scroll-mt-28 rounded-3xl bg-chocolate p-5 text-cream shadow-[0_18px_40px_rgba(56,37,27,0.25)]"
          >
            <p className="font-playful text-lg text-caramel">Visit us</p>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPinned className="mt-0.5 size-4 shrink-0 text-caramel" aria-hidden="true" />
                <p>
                  <span className="font-semibold">{VISIT_INFO.cafeName}</span>
                  <span className="mt-1 block text-cream/85">
                    {VISIT_INFO.addressLine}
                  </span>
                  <span className="mt-0.5 block text-cream/60">
                    {VISIT_INFO.city}, {VISIT_INFO.state}
                  </span>
                </p>
              </div>

              <div className="flex items-start gap-2">
                <Clock3 className="mt-0.5 size-4 shrink-0 text-caramel" aria-hidden="true" />
                <p>
                  {VISIT_INFO.hoursLabel}
                  <span className="mt-1 block text-cream/55">{VISIT_INFO.hoursNote}</span>
                </p>
              </div>

              <div className="flex items-start gap-2">
                <Phone className="mt-0.5 size-4 shrink-0 text-caramel" aria-hidden="true" />
                <p>
                  <a
                    href={VISIT_INFO.phoneHref}
                    className="font-semibold transition hover:text-caramel"
                  >
                    {VISIT_INFO.phone}
                  </a>
                  <span className="mt-1 block text-cream/55">{VISIT_INFO.phoneNote}</span>
                </p>
              </div>
            </div>

            <Button
              href={VISIT_INFO.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              className="mt-5 w-full bg-cream text-coffee"
            >
              {VISIT_INFO.mapsLabel}
            </Button>
          </aside>

          {/* Mobile: centered below Visit us (cream gap before Play) */}
          <div className="mt-6 mb-2 flex justify-center lg:hidden">
            <WhatsAppFab className="size-[3.75rem]" />
          </div>
        </div>
      </div>

      {/* Desktop: bottom-right of About */}
      <div className="pointer-events-none absolute right-8 bottom-6 z-10 hidden md:right-10 lg:block">
        <WhatsAppFab className="pointer-events-auto size-[4.75rem]" />
      </div>
    </section>
  )
}
