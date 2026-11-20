import { motion } from 'framer-motion'
import { Coffee, Gamepad2 } from 'lucide-react'
import { BeanDoodle, HeartDoodle, SparkleDoodle } from '../doodles/Doodles'
import { Button } from '../ui/Button'
import { WaveDivider } from '../ui/WaveDivider'

export function Hero() {
  return (
    <section
      id="home"
      className="relative isolate min-h-[100svh] overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* One full-bleed cafe composition */}
      <div className="absolute inset-0 -z-20">
        <img
          src="/images/hero-scene.jpg"
          alt=""
          className="size-full object-cover object-[58%_42%] md:object-[62%_40%]"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#F7EDDC_0%,rgba(247,237,220,0.92)_18%,rgba(247,237,220,0.55)_32%,rgba(247,237,220,0.12)_46%,transparent_58%)] md:bg-[linear-gradient(92deg,#F7EDDC_0%,rgba(247,237,220,0.94)_22%,rgba(247,237,220,0.5)_36%,transparent_52%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(56,37,27,0.16)_0%,transparent_16%,transparent_78%,rgba(243,232,213,0.88)_100%)]" />
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl items-center px-5 pt-28 pb-28 md:px-8 md:pt-32">
        <div className="relative z-10 max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative inline-block pr-8 sm:pr-10">
              <h1
                id="hero-heading"
                className="font-display text-[2.35rem] leading-[1.05] font-semibold tracking-tight text-chocolate sm:text-5xl md:text-6xl lg:text-[4rem]"
              >
                Amrita
                <span className="mt-1 block text-coffee">Coffee House</span>
              </h1>
              <SparkleDoodle className="absolute top-0 right-0 size-7 opacity-70 sm:size-8 md:size-10" />
            </div>

            <p className="font-playful mt-5 text-xl text-caramel md:text-2xl">
              Sip • Relax • Play Together
            </p>

            <p className="mt-4 max-w-md text-base leading-relaxed text-coffee/80 md:text-lg">
              Great coffee, delicious bites, and now — fun games with your friends!
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href="#menu" variant="primary" className="px-6 py-3">
                <Coffee className="size-4" aria-hidden="true" />
                Explore Menu
                <span aria-hidden="true">→</span>
              </Button>
              <Button href="#play" variant="secondary" className="px-6 py-3">
                Play Together
                <Gamepad2 className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </motion.div>

          <motion.div
            className="pointer-events-none absolute top-[46%] -right-3 hidden sm:block"
            animate={{ y: [0, -6, 0], rotate: [-8, 4, -8] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
          >
            <HeartDoodle className="size-8 opacity-80" />
          </motion.div>

          {[
            { x: '78%', y: '92%', r: -24, delay: 0 },
            { x: '92%', y: '78%', r: 18, delay: 0.4 },
          ].map((bean, i) => (
            <motion.div
              key={i}
              className="pointer-events-none absolute hidden size-7 sm:block md:size-8"
              style={{ left: bean.x, top: bean.y, rotate: bean.r }}
              animate={{ y: [0, -8, 0], rotate: [bean.r, bean.r + 8, bean.r] }}
              transition={{
                duration: 3.8 + i * 0.3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: bean.delay,
              }}
              aria-hidden="true"
            >
              <BeanDoodle className="size-full drop-shadow-md" />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20">
        <WaveDivider from="transparent" to="#F3E8D5" variant="soft" className="!bg-transparent" />
      </div>
    </section>
  )
}
