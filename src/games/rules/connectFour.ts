import type { GameRules } from '../types'

export const C4_COLS = 7
export const C4_ROWS = 6

export type ConnectFourState = {
  /** column-major: board[col][row], row 0 is bottom */
  board: (0 | 1 | null)[][]
  turnIndex: 0 | 1
  winnerId: string | null
  isDraw: boolean
  lastDrop: { col: number; row: number } | null
}

export type ConnectFourMove = { type: 'drop'; col: number }

function emptyBoard(): (0 | 1 | null)[][] {
  return Array.from({ length: C4_COLS }, () =>
    Array.from({ length: C4_ROWS }, () => null),
  )
}

function checkWin(board: (0 | 1 | null)[][], col: number, row: number, mark: 0 | 1): boolean {
  const dirs: [number, number][] = [
    [1, 0],
    [0, 1],
    [1, 1],
    [1, -1],
  ]

  for (const [dx, dy] of dirs) {
    let count = 1
    for (const sign of [1, -1]) {
      let x = col + dx * sign
      let y = row + dy * sign
      while (
        x >= 0 &&
        x < C4_COLS &&
        y >= 0 &&
        y < C4_ROWS &&
        board[x][y] === mark
      ) {
        count += 1
        x += dx * sign
        y += dy * sign
      }
    }
    if (count >= 4) return true
  }
  return false
}

export const connectFourRules: GameRules<ConnectFourState, ConnectFourMove> = {
  createInitialState() {
    return {
      board: emptyBoard(),
      turnIndex: 0,
      winnerId: null,
      isDraw: false,
      lastDrop: null,
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
          ? 'Board full — rematch?'
          : `${players.find((p) => p.id === state.winnerId)?.nickname ?? 'Player'} wins!`,
      }
    }

    const expected = players[state.turnIndex]
    if (!expected || expected.id !== actorId) throw new Error('Not your turn')
    if (move.col < 0 || move.col >= C4_COLS) throw new Error('Invalid column')

    const colCells = state.board[move.col]
    const row = colCells.findIndex((c) => c === null)
    if (row === -1) throw new Error('Column full')

    const board = state.board.map((c) => c.slice()) as (0 | 1 | null)[][]
    const mark = state.turnIndex
    board[move.col][row] = mark

    const won = checkWin(board, move.col, row, mark)
    const isDraw = !won && board.every((c) => c.every((cell) => cell !== null))
    const winnerId = won ? expected.id : null
    const nextTurn: 0 | 1 = state.turnIndex === 0 ? 1 : 0
    const next: ConnectFourState = {
      board,
      turnIndex: won || isDraw ? state.turnIndex : nextTurn,
      winnerId,
      isDraw,
      lastDrop: { col: move.col, row },
    }
    const finished = Boolean(won || isDraw)

    return {
      state: next,
      nextPlayerId: finished ? null : players[next.turnIndex]?.id ?? null,
      finished,
      resultMessage: winnerId
        ? `${expected.nickname} connects four!`
        : isDraw
          ? 'Board full — rematch?'
          : null,
    }
  },
}
