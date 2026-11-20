type DoodleProps = {
  className?: string
  color?: string
}

export function HeartDoodle({ className = '', color = '#D58C55' }: DoodleProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 36"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M20 32 C10 24 2 18 2 10 C2 5 6 2 10 2 C14 2 17 4 20 8 C23 4 26 2 30 2 C34 2 38 5 38 10 C38 18 30 24 20 32 Z"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

export function SparkleDoodle({ className = '', color = '#563B2D' }: DoodleProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M24 4 L26 20 L42 24 L26 28 L24 44 L22 28 L6 24 L22 20 Z"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M38 8 L39 13 L44 14 L39 15 L38 20 L37 15 L32 14 L37 13 Z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

export function BeanDoodle({ className = '', color = '#38251B' }: DoodleProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 28 40"
      fill="none"
      aria-hidden="true"
    >
      <ellipse
        cx="14"
        cy="20"
        rx="11"
        ry="17"
        fill={color}
        opacity="0.9"
      />
      <path
        d="M14 6 C10 14 10 26 14 34"
        stroke="#F3E8D5"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  )
}

export function SquiggleArrow({ className = '', color = '#D58C55' }: DoodleProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 40"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 28 C28 8 52 8 76 20 C92 28 104 24 116 16"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M104 10 L116 16 L106 26"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ControllerDoodle({ className = '', color = '#B9C9D0' }: DoodleProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 40"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M10 28 C8 16 14 8 24 8 H40 C50 8 56 16 54 28 C53 34 48 36 44 34 L38 28 H26 L20 34 C16 36 11 34 10 28 Z"
        stroke={color}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <circle cx="22" cy="20" r="2.2" fill={color} />
      <path d="M22 16 V24 M18 20 H26" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="42" cy="18" r="2" fill={color} />
      <circle cx="46" cy="22" r="2" fill={color} />
    </svg>
  )
}
