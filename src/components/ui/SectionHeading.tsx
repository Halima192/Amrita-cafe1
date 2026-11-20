type SectionHeadingProps = {
  eyebrow: string
  title: string
  description?: string
  align?: 'left' | 'center'
  tone?: 'light' | 'dark'
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  tone = 'light',
  className = '',
}: SectionHeadingProps) {
  const alignClass = align === 'center' ? 'text-center items-center' : 'text-left items-start'
  const titleColor = tone === 'dark' ? 'text-cream' : 'text-chocolate'
  const descColor = tone === 'dark' ? 'text-cream/70' : 'text-coffee/75'
  const eyebrowColor = tone === 'dark' ? 'text-caramel' : 'text-coffee/65'

  return (
    <div className={`flex flex-col gap-3 ${alignClass} ${className}`}>
      <p className={`section-eyebrow ${eyebrowColor}`}>— {eyebrow} —</p>
      <h2
        className={`font-display text-3xl leading-tight font-semibold tracking-tight md:text-4xl lg:text-[2.75rem] ${titleColor} text-balance`}
      >
        {title}
      </h2>
      {description ? (
        <p className={`max-w-md text-base leading-relaxed md:text-lg ${descColor}`}>
          {description}
        </p>
      ) : null}
    </div>
  )
}
