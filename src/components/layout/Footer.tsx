import { MapPin } from 'lucide-react'
import { VISIT_INFO } from '../../data/visit'
import { Logo } from '../ui/Logo'

const links = [
  { label: 'Home', href: '#home' },
  { label: 'Menu', href: '#menu' },
  { label: 'About', href: '#about' },
  { label: 'Play Together', href: '#play' },
  { label: 'Contact', href: '#contact' },
]

function InstagramIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
    </svg>
  )
}

export function Footer() {
  return (
    <footer id="contact" className="border-t border-cream/10 bg-chocolate text-cream">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 md:px-8 md:py-14">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <Logo tone="light" />

          <nav aria-label="Footer" className="flex flex-wrap gap-x-2 gap-y-1 text-sm text-cream/75">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="inline-flex min-h-11 items-center rounded-full px-3 transition hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#contact"
              className="grid size-11 place-items-center rounded-full bg-cream/10 text-cream transition hover:bg-cream/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel"
              aria-label="Instagram (placeholder — confirm with owners)"
            >
              <InstagramIcon className="size-4" />
            </a>
            <a
              href={VISIT_INFO.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="grid size-11 place-items-center rounded-full bg-cream/10 text-cream transition hover:bg-cream/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel"
              aria-label="Open Bilimora on Google Maps (placeholder pin)"
            >
              <MapPin className="size-4" />
            </a>
            <span className="mx-1 hidden h-8 w-px bg-cream/20 sm:block" aria-hidden="true" />
            <p className="font-playful text-caramel">Good Coffee. Great Company. ♡</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-cream/10 pt-6 text-center text-sm text-cream/55 md:flex-row md:items-center md:justify-between md:text-left">
          <p>© {new Date().getFullYear()} Amrita Coffee House. All rights reserved.</p>
          <p className="text-cream/40">
            Bilimora, Gujarat · Contact details are placeholders pending owner confirmation.
          </p>
        </div>
      </div>
    </footer>
  )
}
