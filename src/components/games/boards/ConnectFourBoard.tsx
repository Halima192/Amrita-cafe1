import { motion } from 'framer-motion'
import { C4_COLS, C4_ROWS, type ConnectFourState } from '../../../games/rules/connectFour'
import type { Player } from '../../../games/types'

type Props = {
  state: ConnectFourState
  players: Player[]
  currentPlayerId: string | null
  disabled?: boolean
  onDrop: (col: number) => void
}

const COLORS = ['#B9C9D0', '#D58C55']

export function ConnectFourBoard({
  state,
  players,
  currentPlayerId,
  disabled,
  onDrop,
}: Props) {
  const current = players.find((p) => p.id === currentPlayerId)

  return (
    <div className="space-y-4">
      <p className="font-playful text-center text-caramel">
        {state.winnerId || state.isDraw
          ? 'Round over'
          : `${current?.nickname ?? 'Player'} — drop a disc`}
      </p>
      <div className="mx-auto w-full max-w-md overflow-hidden rounded-3xl bg-[#2a1b14] p-3 ring-1 ring-cream/10">
        <div className="mb-2 grid grid-cols-7 gap-1">
          {Array.from({ length: C4_COLS }).map((_, col) => {
            const full = state.board[col].every((c) => c !== null)
            return (
              <button
                key={col}
                type="button"
                disabled={disabled || full || Boolean(state.winnerId || state.isDraw)}
                onClick={() => onDrop(col)}
                className="rounded-full bg-cream/10 py-1 text-[0.65rem] font-semibold text-cream/70 transition enabled:hover:bg-caramel/40"
                aria-label={`Drop in column ${col + 1}`}
              >
                ▼
              </button>
            )
          })}
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: C4_ROWS }).flatMap((_, visualRow) => {
            const row = C4_ROWS - 1 - visualRow
            return Array.from({ length: C4_COLS }).map((_, col) => {
              const mark = state.board[col][row]
              const isLast =
                state.lastDrop?.col === col && state.lastDrop?.row === row
              return (
                <motion.div
                  key={`${col}-${row}`}
                  layout
                  className="aspect-square rounded-full bg-chocolate/90 ring-1 ring-cream/10"
                  style={{
                    background:
                      mark === null ? 'rgba(56,37,27,0.9)' : COLORS[mark],
                    boxShadow: isLast ? '0 0 0 2px #F3E8D5' : undefined,
                  }}
                />
              )
            })
          })}
        </div>
      </div>
    </div>
  )
}
