import { motion } from 'framer-motion'
import {
  WYR_PROMPTS,
  type WouldYouRatherState,
} from '../../../games/rules/wouldYouRather'
import type { Player } from '../../../games/types'

type Props = {
  state: WouldYouRatherState
  players: Player[]
  currentPlayerId: string | null
  localPlayerId: string | null
  disabled?: boolean
  onVote: (choice: 'A' | 'B') => void
  onNext: () => void
}

export function WouldYouRatherBoard({
  state,
  players,
  currentPlayerId,
  localPlayerId,
  disabled,
  onVote,
}: Props) {
  const prompt = WYR_PROMPTS[state.promptIndex]
  const voter = players.find((p) => p.id === currentPlayerId)
  const pending = players.filter((p) => !state.votes[p.id])
  const canVote =
    !disabled &&
    !state.finished &&
    Boolean(currentPlayerId) &&
    currentPlayerId === localPlayerId

  return (
    <div className="space-y-5">
      <div className="text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-cream/45 uppercase">
          Prompt {state.promptIndex + 1} / {WYR_PROMPTS.length}
        </p>
        <h3 className="font-playful mt-2 text-2xl text-cream md:text-3xl">
          Would you rather…
        </h3>
      </div>

      {!state.finished ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {(['A', 'B'] as const).map((choice) => {
            const label = choice === 'A' ? prompt.optionA : prompt.optionB

            return (
              <motion.button
                key={choice}
                type="button"
                whileTap={canVote ? { scale: 0.98 } : undefined}
                disabled={!canVote}
                onClick={() => onVote(choice)}
                className={[
                  'rounded-3xl px-4 py-8 text-lg font-semibold transition ring-1 enabled:hover:brightness-105',
                  choice === 'A'
                    ? 'bg-soft-blue/80 text-chocolate ring-soft-blue'
                    : 'bg-caramel/90 text-chocolate ring-caramel',
                ].join(' ')}
              >
                <span className="font-playful block text-2xl">{label}</span>
              </motion.button>
            )
          })}
        </div>
      ) : null}

      <div className="rounded-2xl bg-cream/5 p-4 text-sm text-cream/75 ring-1 ring-cream/10">
        {state.finished ? (
          <p className="font-playful text-caramel">All prompts done — rematch?</p>
        ) : (
          <p>
            {currentPlayerId === localPlayerId ? (
              'Your turn — pick one'
            ) : (
              <>
                Waiting on{' '}
                <span className="font-semibold text-cream">
                  {voter?.nickname ?? 'next player'}
                </span>
              </>
            )}
            {pending.length
              ? ` · still waiting: ${pending.map((p) => p.nickname).join(', ')}`
              : ''}
          </p>
        )}
      </div>
    </div>
  )
}
