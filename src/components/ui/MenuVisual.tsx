import type { MenuVisual as MenuVisualId } from '../../types'

const accents: Record<MenuVisualId, { bg: string; accent: string }> = {
  cappuccino: { bg: '#B9C9D0', accent: '#563B2D' },
  latte: { bg: '#D8C3A5', accent: '#563B2D' },
  coldbrew: { bg: '#9BB0BA', accent: '#38251B' },
  filter: { bg: '#C9B29A', accent: '#563B2D' },
  sandwich: { bg: '#D58C55', accent: '#F3E8D5' },
  fries: { bg: '#E0B07A', accent: '#563B2D' },
  wrap: { bg: '#C4B28A', accent: '#38251B' },
  burger: { bg: '#D58C55', accent: '#F3E8D5' },
  brownie: { bg: '#6B4A38', accent: '#F3E8D5' },
  cake: { bg: '#563B2D', accent: '#D58C55' },
  cheesecake: { bg: '#E8D5B8', accent: '#D58C55' },
  parfait: { bg: '#B9C9D0', accent: '#D58C55' },
}

type Props = {
  visual: MenuVisualId
  className?: string
  label?: string
}

export function MenuVisualArt({ visual, className = '', label }: Props) {
  const palette = accents[visual]

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(160deg, ${palette.bg}88, #F3E8D5 75%)`,
      }}
      aria-hidden={label ? undefined : true}
      role={label ? 'img' : undefined}
      aria-label={label}
    >
      <svg viewBox="0 0 160 120" className="absolute inset-0 size-full opacity-95">
        {visual === 'cappuccino' || visual === 'latte' || visual === 'filter' ? (
          <>
            <ellipse cx="80" cy="88" rx="42" ry="10" fill="#C9B08A" opacity="0.55" />
            <path
              d="M52 42 h52 c6 0 10 5 10 11 v28 c0 14 -14 24 -36 24 s-36 -10 -36 -24 V53 c0 -6 4 -11 10 -11 z"
              fill="#FFF8EE"
            />
            <ellipse cx="80" cy="48" rx="28" ry="9" fill={palette.accent} />
            <path
              d="M80 54 C72 48 66 44 66 39 C66 35 69 33 73 33 C76 33 78 35 80 39 C82 35 84 33 87 33 C91 33 94 35 94 39 C94 44 88 48 80 54 Z"
              fill="#F3E8D5"
              opacity="0.9"
            />
            <path
              d="M114 50 c14 0 20 10 18 20 s-12 16 -22 14"
              stroke="#FFF8EE"
              strokeWidth="7"
              fill="none"
              strokeLinecap="round"
            />
          </>
        ) : null}

        {visual === 'coldbrew' ? (
          <>
            <rect x="58" y="28" width="44" height="64" rx="10" fill="#FFF8EE" />
            <rect x="62" y="40" width="36" height="44" rx="6" fill={palette.accent} opacity="0.85" />
            <circle cx="72" cy="52" r="3" fill="#F3E8D5" opacity="0.5" />
            <circle cx="88" cy="60" r="2.5" fill="#F3E8D5" opacity="0.45" />
            <rect x="70" y="20" width="20" height="10" rx="3" fill="#D58C55" />
          </>
        ) : null}

        {visual === 'sandwich' || visual === 'wrap' ? (
          <>
            <rect x="36" y="44" width="88" height="36" rx="12" fill="#E8D5B8" />
            <rect x="42" y="52" width="76" height="8" rx="3" fill="#7A9B6E" />
            <rect x="42" y="64" width="76" height="6" rx="3" fill="#D58C55" />
            <ellipse cx="80" cy="44" rx="44" ry="10" fill="#C9A67A" />
          </>
        ) : null}

        {visual === 'fries' ? (
          <>
            <path d="M50 88 h60 l-8 -48 h-44 z" fill="#FFF8EE" />
            {[0, 1, 2, 3, 4].map((i) => (
              <rect
                key={i}
                x={58 + i * 10}
                y={28}
                width="6"
                height="42"
                rx="3"
                fill="#D58C55"
                opacity={0.85 - i * 0.05}
              />
            ))}
          </>
        ) : null}

        {visual === 'burger' ? (
          <>
            <ellipse cx="80" cy="78" rx="40" ry="10" fill="#8B6340" opacity="0.35" />
            <path d="M42 58 h76 a8 8 0 0 1 0 14 H42 a8 8 0 0 1 0 -14 z" fill="#6B8F5A" />
            <rect x="44" y="50" width="72" height="10" rx="4" fill="#563B2D" />
            <path d="M40 50 C40 34 120 34 120 50 Z" fill="#D58C55" />
            <path d="M42 70 C42 82 118 82 118 70 Z" fill="#C9A67A" />
          </>
        ) : null}

        {visual === 'brownie' || visual === 'cake' ? (
          <>
            <rect x="44" y="48" width="72" height="40" rx="8" fill={palette.accent} />
            <rect x="44" y="40" width="72" height="14" rx="6" fill="#D58C55" />
            <circle cx="80" cy="36" r="6" fill="#F3E8D5" />
            <rect x="52" y="58" width="16" height="6" rx="2" fill="#F3E8D5" opacity="0.35" />
          </>
        ) : null}

        {visual === 'cheesecake' || visual === 'parfait' ? (
          <>
            <path d="M55 88 L68 36 h24 L105 88 Z" fill="#FFF8EE" />
            <rect x="70" y="48" width="20" height="10" fill="#D58C55" opacity="0.7" />
            <rect x="68" y="60" width="24" height="12" fill="#B9C9D0" opacity="0.8" />
            <rect x="66" y="74" width="28" height="10" fill="#E8D5B8" />
            <ellipse cx="80" cy="36" rx="14" ry="5" fill="#D58C55" />
          </>
        ) : null}
      </svg>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_45%)]" />
    </div>
  )
}
