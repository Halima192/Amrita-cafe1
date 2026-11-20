import { motion } from 'framer-motion'
import { BeanDoodle, HeartDoodle, SparkleDoodle } from '../doodles/Doodles'

export function HeroCup() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[420px] lg:max-w-[480px]">
      {/* Soft table surface */}
      <div className="absolute inset-x-[8%] bottom-[6%] h-[28%] rounded-[50%] bg-gradient-to-b from-[#a57a4a]/50 to-[#6d4a2e]/40 blur-[1px]" />
      <div className="absolute inset-x-[14%] bottom-[10%] h-[18%] rounded-[50%] bg-[#8b6340]/55 shadow-[0_20px_40px_rgba(56,37,27,0.35)]" />

      {/* Floating beans */}
      {[
        { x: '8%', y: '58%', r: -28, delay: 0 },
        { x: '18%', y: '72%', r: 18, delay: 0.4 },
        { x: '72%', y: '68%', r: -12, delay: 0.2 },
        { x: '82%', y: '54%', r: 32, delay: 0.6 },
        { x: '64%', y: '78%', r: -40, delay: 0.3 },
      ].map((bean, i) => (
        <motion.div
          key={i}
          className="absolute size-7 md:size-8"
          style={{ left: bean.x, top: bean.y, rotate: bean.r }}
          animate={{ y: [0, -8, 0], rotate: [bean.r, bean.r + 8, bean.r] }}
          transition={{ duration: 3.6 + i * 0.3, repeat: Infinity, ease: 'easeInOut', delay: bean.delay }}
        >
          <BeanDoodle className="size-full drop-shadow-md" />
        </motion.div>
      ))}

      {/* Cup body */}
      <motion.div
        className="absolute inset-[18%] top-[22%] bottom-[18%]"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <svg viewBox="0 0 280 280" className="size-full drop-shadow-[0_24px_40px_rgba(56,37,27,0.35)]">
          {/* Saucer */}
          <ellipse cx="140" cy="230" rx="108" ry="22" fill="#E8D5B8" />
          <ellipse cx="140" cy="226" rx="88" ry="14" fill="#F6EBDA" />

          {/* Cup shadow inside */}
          <path
            d="M70 110 C70 90 90 78 140 78 C190 78 210 90 210 110 L200 200 C198 218 172 232 140 232 C108 232 82 218 80 200 Z"
            fill="#FFF8EE"
          />
          <path
            d="M78 112 C78 96 98 88 140 88 C182 88 202 96 202 112 L194 196 C192 210 170 222 140 222 C110 222 88 210 86 196 Z"
            fill="#F3E8D5"
          />

          {/* Coffee surface */}
          <ellipse cx="140" cy="118" rx="58" ry="18" fill="#563B2D" />
          <ellipse cx="140" cy="116" rx="52" ry="14" fill="#6B4A38" />

          {/* Latte art heart */}
          <path
            d="M140 128 C128 118 118 112 118 104 C118 98 122 94 128 94 C132 94 136 96 140 102 C144 96 148 94 152 94 C158 94 162 98 162 104 C162 112 152 118 140 128 Z"
            fill="#F3E8D5"
            opacity="0.92"
          />

          {/* Handle */}
          <path
            d="M210 120 C236 120 250 136 248 156 C246 176 230 188 208 184"
            stroke="#FFF8EE"
            strokeWidth="14"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M210 126 C228 126 238 138 236 154 C234 168 222 178 208 176"
            stroke="#E8D5B8"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />

          {/* Amrita mark on cup */}
          <text
            x="140"
            y="178"
            textAnchor="middle"
            fill="#563B2D"
            opacity="0.45"
            fontFamily="Playfair Display, Georgia, serif"
            fontSize="18"
            fontWeight="600"
          >
            Amrita
          </text>
        </svg>

        {/* Steam */}
        <div className="pointer-events-none absolute inset-x-[28%] top-[2%] flex justify-center gap-3">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="block h-16 w-1.5 rounded-full bg-gradient-to-t from-steam/0 via-steam/70 to-steam/0 md:h-20"
              style={{ marginTop: i === 1 ? 0 : 10 }}
              animate={{ y: [8, -18, 8], opacity: [0.2, 0.85, 0.2], scaleY: [0.7, 1.15, 0.7] }}
              transition={{
                duration: 2.4 + i * 0.35,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.35,
              }}
            />
          ))}
        </div>
      </motion.div>

      <motion.div
        className="absolute top-[12%] left-[6%]"
        animate={{ y: [0, -6, 0], rotate: [-8, 4, -8] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <HeartDoodle className="size-8 md:size-10" />
      </motion.div>
      <motion.div
        className="absolute top-[8%] right-[10%]"
        animate={{ rotate: [0, 12, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <SparkleDoodle className="size-10 md:size-12" color="#563B2D" />
      </motion.div>
      <motion.div
        className="absolute right-[4%] bottom-[34%]"
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      >
        <HeartDoodle className="size-6 md:size-7" color="#563B2D" />
      </motion.div>
    </div>
  )
}
