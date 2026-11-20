import { motion } from 'framer-motion'
import {
  getNhieLeaderboard,
  NHIE_PROMPTS,
  type NeverHaveIEverState,
} from '../../../games/rules/neverHaveIEver'
import type { Player } from '../../../games/types'

type Props = {
  state: NeverHaveIEverState
  players: Player[]
  currentPlayerId: string | null
  localPlayerId: string | null
  disabled?: boolean
  onAnswer: (choice: 'have' | 'never') => void
  onNext: () => void
}

export function NeverHaveIEverBoard({
  state,
  players,
  currentPlayerId,
  localPlayerId,
  disabled,
  onAnswer,
}: Props) {
  const prompt = NHIE_PROMPTS[state.promptIndex]
  const voter = players.find((p) => p.id === currentPlayerId)
  const pending = players.filter((p) => !state.answers[p.id])
  const canAnswer =
    !disabled &&
    !state.finished &&
    Boolean(currentPlayerId) &&
    currentPlayerId === localPlayerId
  const leaderboard = getNhieLeaderboard(state.scores ?? {}, players)
  const topScore = leaderboard[0]?.points ?? 0

  return (
    <div className="space-y-5">
      <div className="text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-cream/45 uppercase">
          Prompt {state.promptIndex + 1} / {NHIE_PROMPTS.length}
        </p>
        <h3 className="font-playful mt-2 text-2xl text-cream md:text-3xl">
          Never have I ever…
        </h3>
        <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-cream/80 md:text-lg">
          {prompt.prompt.replace(/^Never have I ever\s+/i, '')}
        </p>
        <p className="mt-2 text-xs text-cream/45">Most “I have” answers wins</p>
      </div>

      <ul className="grid gap-2 sm:grid-cols-2">
        {leaderboard.map(({ player, points }) => {
          const isLeader = !state.finished
            ? points === topScore && topScore > 0
            : state.winnerIds?.includes(player.id)
          return (
            <li
              key={player.id}
              className={[
                'flex items-center justify-between rounded-2xl px-3 py-2.5 text-sm ring-1',
                isLeader
                  ? 'bg-caramel/20 text-cream ring-caramel/40'
                  : 'bg-cream/5 text-cream/80 ring-cream/10',
              ].join(' ')}
            >
              <span className="font-semibold">
                {player.nickname}
                {player.id === localPlayerId ? ' (you)' : ''}
              </span>
              <span className="font-playful text-caramel">
                {points} pt{points === 1 ? '' : 's'}
              </span>
            </li>
          )
        })}
      </ul>

      {!state.finished ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {(
            [
              { choice: 'have' as const, label: 'I have…', tone: 'light' },
              { choice: 'never' as const, label: 'Never have…', tone: 'dark' },
            ] as const
          ).map(({ choice, label, tone }) => (
            <motion.button
              key={choice}
              type="button"
              whileTap={canAnswer ? { scale: 0.98 } : undefined}
              disabled={!canAnswer}
              onClick={() => onAnswer(choice)}
              className={[
                'rounded-3xl px-4 py-8 text-lg font-semibold transition ring-1 enabled:hover:brightness-105',
                tone === 'light'
                  ? 'bg-cream text-coffee ring-cream/40'
                  : 'bg-coffee text-cream ring-caramel/40',
              ].join(' ')}
            >
              <span className="font-playful block text-2xl">{label}</span>
            </motion.button>
          ))}
        </div>
      ) : null}

      <div className="rounded-2xl bg-cream/5 p-4 text-sm text-cream/75 ring-1 ring-cream/10">
        {state.finished ? (
          <p className="font-playful text-lg text-caramel">
            Final score locked — most “I have” points takes it.
          </p>
        ) : (
          <p>
            {currentPlayerId === localPlayerId ? (
              'Your turn — pick honestly 👀'
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
