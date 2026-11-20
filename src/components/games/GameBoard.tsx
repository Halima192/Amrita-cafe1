import type { DotsAndBoxesState } from '../../games/rules/dotsAndBoxes'
import type { NeverHaveIEverState } from '../../games/rules/neverHaveIEver'
import type { TicTacToeState } from '../../games/rules/ticTacToe'
import type { WouldYouRatherState } from '../../games/rules/wouldYouRather'
import type { RoomState } from '../../games/types'
import { DotsAndBoxesBoard } from './boards/DotsAndBoxesBoard'
import { NeverHaveIEverBoard } from './boards/NeverHaveIEverBoard'
import { TicTacToeBoard } from './boards/TicTacToeBoard'
import { WouldYouRatherBoard } from './boards/WouldYouRatherBoard'

type Props = {
  room: RoomState
  localPlayerId: string | null
  busy?: boolean
  onMove: (move: unknown) => Promise<unknown>
}

export function GameBoard({ room, localPlayerId, busy, onMove }: Props) {
  const disabled = busy || room.phase === 'finished'

  if (!room.gameState) {
    return <p className="text-center text-cream/60">Loading board…</p>
  }

  if (room.gameId === 'tic-tac-toe') {
    return (
      <TicTacToeBoard
        state={room.gameState as TicTacToeState}
        players={room.players}
        currentPlayerId={room.currentPlayerId}
        disabled={disabled}
        onMove={(index) => void onMove({ type: 'place', index })}
      />
    )
  }

  if (room.gameId === 'dots-and-boxes') {
    return (
      <DotsAndBoxesBoard
        state={room.gameState as DotsAndBoxesState}
        players={room.players}
        currentPlayerId={room.currentPlayerId}
        disabled={disabled}
        onLine={(move) => void onMove(move)}
      />
    )
  }

  if (room.gameId === 'never-have-i-ever') {
    return (
      <NeverHaveIEverBoard
        state={room.gameState as NeverHaveIEverState}
        players={room.players}
        currentPlayerId={room.currentPlayerId}
        localPlayerId={localPlayerId}
        disabled={busy}
        onAnswer={(choice) => void onMove({ type: 'answer', choice })}
        onNext={() => void onMove({ type: 'next' })}
      />
    )
  }

  return (
    <WouldYouRatherBoard
      state={room.gameState as WouldYouRatherState}
      players={room.players}
      currentPlayerId={room.currentPlayerId}
      localPlayerId={localPlayerId}
      disabled={busy}
      onVote={(choice) => void onMove({ type: 'vote', choice })}
      onNext={() => void onMove({ type: 'next' })}
    />
  )
}
