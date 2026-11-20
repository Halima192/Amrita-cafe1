import type { GameRules, Player } from '../types'

export type Cell = 'X' | 'O' | null
export type TicTacToeState = {
  board: Cell[]
  /** Index into players: 0 = X, 1 = O */
  turnIndex: 0 | 1
  winnerId: string | null
  isDraw: boolean
}

export type TicTacToeMove = { type: 'place'; index: number }

const WINS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

function markFor(turnIndex: 0 | 1): Cell {
  return turnIndex === 0 ? 'X' : 'O'
}

function findWinner(board: Cell[], players: Player[]): string | null {
  for (const [a, b, c] of WINS) {
    const v = board[a]
    if (v && v === board[b] && v === board[c]) {
      return v === 'X' ? players[0]?.id ?? null : players[1]?.id ?? null
    }
  }
  return null
}

export const ticTacToeRules: GameRules<TicTacToeState, TicTacToeMove> = {
  createInitialState() {
    return {
      board: Array.from({ length: 9 }, () => null),
      turnIndex: 0,
      winnerId: null,
      isDraw: false,
    }
  },

  getCurrentPlayerId(state, players) {
    if (state.winnerId || state.isDraw) return null
    return players[state.turnIndex]?.id ?? null
  },

  applyMove(state, move, actorId, players) {
    if (state.winnerId || state.isDraw) {
      return {
        state,
        nextPlayerId: null,
        finished: true,
        resultMessage: state.isDraw
          ? 'Draw — rematch?'
          : `${players.find((p) => p.id === state.winnerId)?.nickname ?? 'Player'} wins!`,
      }
    }

    const expected = players[state.turnIndex]
    if (!expected || expected.id !== actorId) {
      throw new Error('Not your turn')
    }
    if (move.index < 0 || move.index > 8 || state.board[move.index]) {
      throw new Error('Invalid cell')
    }

    const board = state.board.slice()
    board[move.index] = markFor(state.turnIndex)
    const winnerId = findWinner(board, players)
    const isDraw = !winnerId && board.every(Boolean)
    const nextTurn: 0 | 1 = state.turnIndex === 0 ? 1 : 0
    const next: TicTacToeState = {
      board,
      turnIndex: winnerId || isDraw ? state.turnIndex : nextTurn,
      winnerId,
      isDraw,
    }

    const finished = Boolean(winnerId || isDraw)
    return {
      state: next,
      nextPlayerId: finished ? null : players[next.turnIndex]?.id ?? null,
      finished,
      resultMessage: winnerId
        ? `${players.find((p) => p.id === winnerId)?.nickname ?? 'Player'} wins!`
        : isDraw
          ? 'Draw — rematch?'
          : null,
    }
  },
}
