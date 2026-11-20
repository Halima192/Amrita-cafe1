import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, MapPin, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { NavItem } from '../../types'
import { Logo } from '../ui/Logo'

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'menu', label: 'Menu', href: '#menu' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'play', label: 'Play Together', href: '#play' },
  { id: 'contact', label: 'Contact', href: '#contact' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('home')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 18)

      const sections = navItems
        .map((item) => document.querySelector(item.href))
        .filter(Boolean) as HTMLElement[]

      const offset = window.scrollY + 120
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i]
        if (section.offsetTop <= offset) {
          setActive(section.id)
          break
        }
      }
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6 md:pt-4">
      <motion.nav
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className={[
          'mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full px-3 py-2 transition-all duration-300 md:px-4',
          scrolled
            ? 'border border-coffee/10 bg-cream/90 shadow-[0_12px_40px_rgba(56,37,27,0.12)] backdrop-blur-md'
            : 'bg-cream/55 backdrop-blur-sm',
        ].join(' ')}
        aria-label="Primary"
      >
        <Logo />

        <div className="hidden items-center rounded-full bg-soft-blue/35 p-1 lg:flex">
          {navItems.map((item) => {
            const isActive = active === item.id
            return (
              <a
                key={item.id}
                href={item.href}
                className={[
                  'relative inline-flex min-h-10 items-center rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel',
                  isActive ? 'text-cream' : 'text-coffee/80 hover:text-coffee',
                ].join(' ')}
              >
                {isActive ? (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-coffee"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                ) : null}
                <span className="relative z-10">{item.label}</span>
              </a>
            )
          })}
        </div>

        <div className="flex items-center gap-2">
          <a
            href="#visit"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-coffee/15 bg-foam/90 px-3 py-2 text-sm font-medium text-coffee shadow-sm transition hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel"
            aria-label="Bilimora location — Visit us"
          >
            <MapPin className="size-4 text-caramel" aria-hidden="true" />
            <span className="hidden sm:inline">Bilimora</span>
            <ChevronDown className="size-3.5 opacity-60" aria-hidden="true" />
          </a>

          <button
            type="button"
            className="grid size-11 place-items-center rounded-full border border-coffee/15 bg-foam text-coffee lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mx-auto mt-2 max-w-6xl overflow-hidden rounded-3xl border border-coffee/10 bg-cream/95 p-3 shadow-[0_18px_50px_rgba(56,37,27,0.16)] backdrop-blur-md lg:hidden"
          >
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={[
                    'inline-flex min-h-12 items-center rounded-2xl px-4 py-3 text-base font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel',
                    active === item.id
                      ? 'bg-coffee text-cream'
                      : 'text-coffee hover:bg-soft-blue/30',
                  ].join(' ')}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
