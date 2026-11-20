import { motion } from 'framer-motion'
import type { TicTacToeState } from '../../../games/rules/ticTacToe'
import type { Player } from '../../../games/types'

type Props = {
  state: TicTacToeState
  players: Player[]
  currentPlayerId: string | null
  disabled?: boolean
  onMove: (index: number) => void
}

export function TicTacToeBoard({
  state,
  players,
  currentPlayerId,
  disabled,
  onMove,
}: Props) {
  const current = players.find((p) => p.id === currentPlayerId)

  return (
    <div className="space-y-4">
      <p className="font-playful text-center text-caramel">
        {state.winnerId || state.isDraw
          ? 'Round over'
          : `${current?.nickname ?? 'Player'}'s turn (${state.turnIndex === 0 ? 'X' : 'O'})`}
      </p>
      <div className="mx-auto grid max-w-xs grid-cols-3 gap-2">
        {state.board.map((cell, index) => (
          <motion.button
            key={index}
            type="button"
            whileTap={cell || disabled ? undefined : { scale: 0.96 }}
            disabled={Boolean(cell) || disabled || state.winnerId !== null || state.isDraw}
            onClick={() => onMove(index)}
            className="aspect-square rounded-2xl bg-chocolate/80 text-3xl font-bold text-cream ring-1 ring-cream/15 transition enabled:hover:bg-coffee disabled:cursor-default"
            aria-label={`Cell ${index + 1}${cell ? `, ${cell}` : ''}`}
          >
            <span style={{ color: cell === 'X' ? '#B9C9D0' : '#D58C55' }}>{cell}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
