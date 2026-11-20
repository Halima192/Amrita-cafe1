import { motion } from 'framer-motion'
import { useState } from 'react'
import { GAMES } from '../../games/meta'
import type { GameId } from '../../games/types'
import { GameSession } from '../games/GameSession'
import { ControllerDoodle, SquiggleArrow } from '../doodles/Doodles'
import { Button } from '../ui/Button'
import { SectionHeading } from '../ui/SectionHeading'
import { WaveDivider } from '../ui/WaveDivider'

export function PlayTogether() {
  const [open, setOpen] = useState(false)
  const [gameId, setGameId] = useState<GameId | null>(null)

  const openGamesTab = () => {
    setGameId(null)
    setOpen(true)
  }

  const openGame = (id: GameId) => {
    setGameId(id)
    setOpen(true)
  }

  return (
    <section id="play" className="relative bg-chocolate" aria-labelledby="play-heading">
      <WaveDivider from="#F3E8D5" to="#38251B" variant="play" />

      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <div className="relative max-w-3xl">
          <SectionHeading
            eyebrow="Play Together"
            title="Turn Your Cafe Time Into Game Time!"
            description="Create a room, share the code, and play together — works across phones when Supabase is connected."
            tone="dark"
          />
          <span id="play-heading" className="sr-only">
            Turn Your Cafe Time Into Game Time!
          </span>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              type="button"
              variant="secondary"
              className="bg-cream text-coffee"
              onClick={openGamesTab}
            >
              Start Playing Now
              <span aria-hidden="true">→</span>
            </Button>
            <div className="relative pl-2">
              <p className="font-playful text-lg text-caramel">Scan. Play. Enjoy!</p>
              <SquiggleArrow className="mt-1 h-8 w-28" />
            </div>
          </div>
        </div>

        <div className="relative mt-10 md:mt-12">
          <ControllerDoodle className="pointer-events-none absolute -top-8 right-2 size-12 opacity-60 sm:size-14 md:right-0 md:size-16" />
          <div className="grid gap-4 sm:grid-cols-2">
            {GAMES.map((game, index) => (
              <motion.article
                key={game.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: index * 0.06, duration: 0.45 }}
                className="overflow-hidden rounded-[1.5rem] bg-coffee/40 shadow-[0_16px_40px_rgba(0,0,0,0.25)] ring-1 ring-cream/10"
              >
                <button
                  type="button"
                  onClick={() => openGame(game.id)}
                  className="group relative block w-full overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel"
                  aria-label={`Play ${game.title}`}
                >
                  <img
                    src={game.cover}
                    alt={`${game.title} — ${game.tagline}`}
                    className="aspect-[16/9] w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                </button>
              </motion.article>
            ))}
          </div>
        </div>
      </div>

      <GameSession open={open} initialGameId={gameId} onClose={() => setOpen(false)} />
    </section>
  )
}
