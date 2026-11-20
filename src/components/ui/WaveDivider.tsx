type WaveDividerProps = {
  from?: string
  to?: string
  flip?: boolean
  className?: string
  variant?: 'soft' | 'deep' | 'play'
}

const paths = {
  soft: 'M0,64 C240,120 480,0 720,48 C960,96 1200,16 1440,64 L1440,128 L0,128 Z',
  deep: 'M0,80 C180,20 360,120 540,70 C720,20 900,110 1080,60 C1260,10 1350,90 1440,50 L1440,128 L0,128 Z',
  play: 'M0,40 C200,100 400,10 600,55 C800,100 1000,15 1200,70 C1320,100 1380,40 1440,55 L1440,128 L0,128 Z',
}

export function WaveDivider({
  from = '#F3E8D5',
  to = '#38251B',
  flip = false,
  className = '',
  variant = 'soft',
}: WaveDividerProps) {
  return (
    <div
      className={`relative -mb-px h-16 w-full overflow-hidden md:h-24 ${className}`}
      style={{ backgroundColor: from }}
      aria-hidden="true"
    >
      <svg
        className={`absolute inset-x-0 bottom-0 h-full w-full ${flip ? 'rotate-180' : ''}`}
        viewBox="0 0 1440 128"
        preserveAspectRatio="none"
        fill={to}
      >
        <path d={paths[variant]} />
      </svg>
    </div>
  )
}
