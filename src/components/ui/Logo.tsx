type LogoProps = {
  className?: string
  compact?: boolean
  tone?: 'dark' | 'light'
}

export function Logo({ className = '', compact = false, tone = 'dark' }: LogoProps) {
  const text = tone === 'light' ? 'text-cream' : 'text-coffee'
  const sub = tone === 'light' ? 'text-cream/70' : 'text-coffee/70'
  const ringOffset = tone === 'light' ? 'focus-visible:ring-offset-chocolate' : 'focus-visible:ring-offset-cream'

  return (
    <a
      href="#home"
      className={`group inline-flex min-h-11 items-center gap-2.5 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel focus-visible:ring-offset-2 ${ringOffset} ${className}`}
      aria-label="Amrita Coffee House home"
    >
      <span className="relative grid size-10 place-items-center rounded-full bg-coffee shadow-[0_6px_16px_rgba(86,59,45,0.28)]">
        <svg viewBox="0 0 40 40" className="size-7" aria-hidden="true">
          <path
            d="M12 16 H26 C28 16 29 18 29 20 V24 C29 28 26 31 22 31 H16 C12 31 9 28 9 24 V20 C9 18 10 16 12 16 Z"
            fill="#F3E8D5"
          />
          <path
            d="M29 18 H31.5 C33.5 18 35 19.5 35 21.5 C35 23.5 33.5 25 31.5 25 H29"
            stroke="#F3E8D5"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M15 11 C15 9 16 8 16 6 M20 11 C20 9 21 8 21 6 M25 11 C25 9 26 8 26 6"
            stroke="#B9C9D0"
            strokeWidth="1.6"
            strokeLinecap="round"
            className="origin-bottom transition-transform group-hover:-translate-y-0.5"
          />
        </svg>
      </span>
      {!compact ? (
        <span className="flex flex-col leading-none">
          <span className={`font-display text-lg font-semibold tracking-tight ${text}`}>
            Amrita
          </span>
          <span className={`text-[0.65rem] font-semibold tracking-[0.18em] uppercase ${sub}`}>
            Coffee House
          </span>
        </span>
      ) : null}
    </a>
  )
}
