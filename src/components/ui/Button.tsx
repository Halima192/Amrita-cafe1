import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'soft'

type SharedProps = {
  children: ReactNode
  variant?: Variant
  className?: string
}

type AnchorButtonProps = SharedProps & {
  href: string
  target?: string
  rel?: string
} & Omit<HTMLMotionProps<'a'>, 'children' | 'href' | 'className'>

type NativeButtonProps = SharedProps & {
  href?: undefined
} & Omit<HTMLMotionProps<'button'>, 'children' | 'className'>

type ButtonProps = AnchorButtonProps | NativeButtonProps

const variants: Record<Variant, string> = {
  primary:
    'bg-coffee text-cream shadow-[0_10px_28px_rgba(86,59,45,0.28)] hover:bg-chocolate',
  secondary:
    'bg-cream/95 text-coffee border border-coffee/15 shadow-[0_8px_24px_rgba(56,37,27,0.1)] hover:bg-foam',
  ghost: 'bg-transparent text-cream/90 hover:bg-cream/10',
  soft: 'bg-soft-blue/40 text-chocolate hover:bg-soft-blue/60',
}

export function Button(props: ButtonProps) {
  const { children, variant = 'primary', className = '' } = props
  const classes = [
    'inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel focus-visible:ring-offset-2 focus-visible:ring-offset-cream',
    variants[variant],
    className,
  ].join(' ')

  if ('href' in props && props.href) {
    const { href, target, rel, variant: _v, className: _c, children: _ch, ...rest } =
      props as AnchorButtonProps
    return (
      <motion.a
        href={href}
        target={target}
        rel={rel}
        className={classes}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
        {...rest}
      >
        {children}
      </motion.a>
    )
  }

  const {
    type = 'button',
    variant: _v,
    className: _c,
    children: _ch,
    ...rest
  } = props as NativeButtonProps

  return (
    <motion.button
      type={type}
      className={classes}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      {...rest}
    >
      {children}
    </motion.button>
  )
}
