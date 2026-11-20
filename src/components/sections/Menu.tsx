import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  MENU_FILTERS,
  MENU_ITEMS,
  MENU_PAGES,
  MENU_SECTIONS,
} from '../../data/menu'
import type { MenuCategoryId } from '../../types'
import { Button } from '../ui/Button'
import { SectionHeading } from '../ui/SectionHeading'
import { WaveDivider } from '../ui/WaveDivider'

export function Menu() {
  const [filter, setFilter] = useState<MenuCategoryId | 'all'>('all')
  const [fullMenuOpen, setFullMenuOpen] = useState(false)
  const [activePage, setActivePage] = useState<string | null>(null)
  const [slideIndex, setSlideIndex] = useState(0)
  const fullMenuRef = useRef<HTMLDivElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)
  const slideIndexRef = useRef(0)
  const autoplayPausedRef = useRef(false)
  const resumeTimerRef = useRef<number | null>(null)

  const activeMenuPage = MENU_PAGES.find((page) => page.id === activePage) ?? null

  const sections = useMemo(() => {
    const visibleSections =
      filter === 'all'
        ? MENU_SECTIONS
        : MENU_SECTIONS.filter((section) => section.category === filter)

    return visibleSections
      .map((section) => ({
        ...section,
        items: MENU_ITEMS.filter((item) => item.section === section.id),
      }))
      .filter((section) => section.items.length > 0)
  }, [filter])

  const openFullMenu = (nextFilter: MenuCategoryId | 'all' = filter) => {
    setFilter(nextFilter)
    setFullMenuOpen(true)
    requestAnimationFrame(() => {
      fullMenuRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const scrollToSlide = (index: number) => {
    const slider = sliderRef.current
    const card = slider?.querySelectorAll<HTMLElement>('[data-menu-slide]')[index]
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
      const card = slider.querySelector<HTMLElement>('[data-menu-slide]')
      if (!card) return
      const gap = 12
      const nextIndex = Math.round(slider.scrollLeft / (card.offsetWidth + gap))
      const clamped = Math.min(Math.max(nextIndex, 0), MENU_PAGES.length - 1)
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
    const mq = window.matchMedia('(min-width: 640px)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')

    const tick = () => {
      if (mq.matches || reduced.matches || autoplayPausedRef.current || activePage) return
      const next = (slideIndexRef.current + 1) % MENU_PAGES.length
      scrollToSlide(next)
    }

    const id = window.setInterval(tick, 3500)
    return () => window.clearInterval(id)
  }, [activePage])

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current)
    }
  }, [])

  useEffect(() => {
    if (!activePage) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActivePage(null)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [activePage])

  return (
    <section id="menu" className="relative bg-cream" aria-labelledby="menu-heading">
      <WaveDivider from="#EAD9BE" to="#F3E8D5" variant="soft" className="!bg-transparent" />

      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Our Menu"
            title="Delicious Choices for Every Mood"
            description="Browse the real Amrita boards — coffee, coolers, bites, pasta, rice bowls, sizzlers, and desserts."
            className="max-w-xl"
          />
          <span id="menu-heading" className="sr-only">
            Our Menu
          </span>
          <div className="shrink-0">
            <Button
              type="button"
              variant="primary"
              onClick={() => openFullMenu('all')}
              aria-expanded={fullMenuOpen}
              aria-controls="full-menu"
            >
              View Full Menu
              <span aria-hidden="true">→</span>
            </Button>
            <p className="mt-3 text-xs font-medium tracking-wide text-coffee/50 uppercase">
              Prices in ₹ · as served at Amrita Coffee House
            </p>
          </div>
        </div>

        {/* Mobile: one-card swipe slider · sm+: side-by-side grid */}
        <div className="mt-8 sm:mt-10">
          <div
            ref={sliderRef}
            className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:pb-0 lg:grid-cols-3 [&::-webkit-scrollbar]:hidden"
            aria-label="Menu pages"
          >
            {MENU_PAGES.map((page, index) => (
              <motion.button
                key={page.id}
                type="button"
                data-menu-slide
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.04, duration: 0.45 }}
                whileHover={{ y: -4 }}
                onClick={() => setActivePage(page.id)}
                className="group w-[82%] shrink-0 snap-start overflow-hidden rounded-xl bg-[#d6c8bc] text-left shadow-[0_10px_28px_rgba(56,37,27,0.1)] ring-1 ring-coffee/10 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel sm:w-auto sm:rounded-[1.25rem]"
                aria-label={`Open ${page.title} menu page`}
              >
                <img
                  src={page.image}
                  alt={page.title}
                  className="aspect-[3/4] max-h-[58svh] w-full object-cover object-top transition duration-500 group-hover:scale-[1.02] sm:max-h-none"
                  loading="lazy"
                />
                <div className="flex items-center justify-between gap-2 bg-foam/95 px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3">
                  <p className="font-display line-clamp-2 text-sm leading-snug font-semibold text-chocolate sm:text-base">
                    {page.title}
                  </p>
                  <span className="shrink-0 text-[0.6rem] font-semibold tracking-wide text-caramel uppercase sm:text-[0.65rem]">
                    View
                  </span>
                </div>
              </motion.button>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-center gap-3 sm:hidden">
            <p className="text-xs font-medium tracking-wide text-coffee/55">
              {slideIndex + 1} / {MENU_PAGES.length} · auto
            </p>
            <div className="flex items-center gap-1.5">
              {MENU_PAGES.map((page, index) => (
                <button
                  key={page.id}
                  type="button"
                  aria-label={`Go to ${page.title}`}
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

        <div ref={fullMenuRef} id="full-menu" className="scroll-mt-28 pt-14 md:pt-20">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-eyebrow text-coffee/65">— Full Menu —</p>
              <h3 className="font-display mt-2 text-2xl font-semibold text-chocolate md:text-3xl">
                What’s brewing & plating
              </h3>
              <p className="mt-2 max-w-xl text-sm text-coffee/70 md:text-base">
                Searchable text version of the boards above — filter by category anytime.
              </p>
            </div>
            <Button
              type="button"
              variant={fullMenuOpen ? 'soft' : 'secondary'}
              onClick={() => {
                if (fullMenuOpen) {
                  setFullMenuOpen(false)
                } else {
                  openFullMenu(filter)
                }
              }}
              aria-expanded={fullMenuOpen}
              aria-controls="menu-board"
            >
              {fullMenuOpen ? 'Hide Full Menu' : 'Show Full Menu'}
            </Button>
          </div>

          <AnimatePresence initial={false}>
            {fullMenuOpen ? (
              <motion.div
                id="menu-board"
                key="menu-board"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div
                  className="mb-8 flex flex-wrap gap-2"
                  role="tablist"
                  aria-label="Menu categories"
                >
                  {MENU_FILTERS.map((option) => {
                    const active = filter === option.id
                    return (
                      <button
                        key={option.id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setFilter(option.id)}
                        className={[
                          'inline-flex min-h-11 items-center rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel',
                          active
                            ? 'bg-coffee text-cream shadow-[0_8px_20px_rgba(86,59,45,0.22)]'
                            : 'bg-foam text-coffee ring-1 ring-coffee/10 hover:bg-soft-blue/35',
                        ].join(' ')}
                      >
                        {option.label}
                      </button>
                    )
                  })}
                </div>

                <div className="space-y-8">
                  {sections.map((section, sectionIndex) => (
                    <motion.section
                      key={section.id}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: sectionIndex * 0.04, duration: 0.35 }}
                      className="rounded-[1.75rem] bg-foam/90 p-5 shadow-[0_12px_32px_rgba(56,37,27,0.08)] ring-1 ring-coffee/8 md:p-7"
                      aria-labelledby={`section-${section.id}`}
                    >
                      <h4
                        id={`section-${section.id}`}
                        className="font-display text-2xl font-semibold text-chocolate md:text-[1.75rem]"
                      >
                        {section.label}
                      </h4>

                      <ul className="mt-5 divide-y divide-coffee/10">
                        {section.items.map((item) => (
                          <li key={item.id} className="py-3.5 first:pt-0 last:pb-0">
                            <div className="flex items-baseline justify-between gap-4">
                              <h5 className="font-sans text-base font-semibold text-chocolate md:text-[1.05rem]">
                                {item.name}
                              </h5>
                              <span className="shrink-0 text-sm font-semibold tracking-wide text-caramel md:text-base">
                                {item.price}
                              </span>
                            </div>
                            {item.description ? (
                              <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-coffee/70">
                                {item.description}
                              </p>
                            ) : null}
                          </li>
                        ))}
                      </ul>
                    </motion.section>
                  ))}
                </div>

                {sections.length === 0 ? (
                  <p className="rounded-2xl bg-foam/80 p-6 text-center text-coffee/70 ring-1 ring-coffee/8">
                    No items in this category yet.
                  </p>
                ) : null}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {activeMenuPage ? (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-chocolate/70 p-3 backdrop-blur-sm md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePage(null)}
            role="dialog"
            aria-modal="true"
            aria-label={activeMenuPage.title}
          >
            <motion.div
              className="relative max-h-[92svh] w-full max-w-3xl overflow-auto rounded-[1.25rem] bg-[#d6c8bc] shadow-[0_24px_80px_rgba(56,37,27,0.45)]"
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 8 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-coffee/10 bg-[#d6c8bc]/95 px-4 py-3 backdrop-blur-sm">
                <p className="font-display text-lg font-semibold text-chocolate">
                  {activeMenuPage.title}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="soft"
                    className="!min-h-10 !px-3 !py-2 text-sm"
                    onClick={() => {
                      setActivePage(null)
                      openFullMenu(activeMenuPage.filter)
                    }}
                  >
                    Open list
                  </Button>
                  <button
                    type="button"
                    className="grid size-10 place-items-center rounded-full bg-foam text-coffee ring-1 ring-coffee/15 transition hover:bg-cream"
                    aria-label="Close menu page"
                    onClick={() => setActivePage(null)}
                  >
                    <X className="size-5" />
                  </button>
                </div>
              </div>
              <img
                src={activeMenuPage.image}
                alt={activeMenuPage.title}
                className="w-full object-contain"
              />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  )
}
