import type { GameRules, Player } from '../types'

/** 3x3 boxes → 4x4 dots */
export const DAB_SIZE = 3

export type DotsAndBoxesState = {
  /** horizontal lines [row][col] where row 0..SIZE, col 0..SIZE-1 */
  hLines: boolean[][]
  /** vertical lines [row][col] where row 0..SIZE-1, col 0..SIZE */
  vLines: boolean[][]
  /** box owner player index or null [row][col] */
  boxes: (0 | 1 | null)[][]
  turnIndex: 0 | 1
  scores: [number, number]
  winnerId: string | null
  isDraw: boolean
}

export type DotsAndBoxesMove =
  | { type: 'h'; row: number; col: number }
  | { type: 'v'; row: number; col: number }

function emptyState(): DotsAndBoxesState {
  const n = DAB_SIZE
  return {
    hLines: Array.from({ length: n + 1 }, () => Array.from({ length: n }, () => false)),
    vLines: Array.from({ length: n }, () => Array.from({ length: n + 1 }, () => false)),
    boxes: Array.from({ length: n }, () => Array.from({ length: n }, () => null)),
    turnIndex: 0,
    scores: [0, 0],
    winnerId: null,
    isDraw: false,
  }
}

function boxComplete(
  state: Pick<DotsAndBoxesState, 'hLines' | 'vLines'>,
  r: number,
  c: number,
): boolean {
  return (
    state.hLines[r][c] &&
    state.hLines[r + 1][c] &&
    state.vLines[r][c] &&
    state.vLines[r][c + 1]
  )
}

function finishedMessage(state: DotsAndBoxesState, players: Player[]): string {
  if (state.isDraw) return 'Tie game — rematch?'
  const winner = players.find((p) => p.id === state.winnerId)
  const high = Math.max(...state.scores)
  const low = Math.min(...state.scores)
  return `${winner?.nickname ?? 'Player'} wins ${high}–${low}!`
}

export const dotsAndBoxesRules: GameRules<DotsAndBoxesState, DotsAndBoxesMove> = {
  createInitialState() {
    return emptyState()
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
        resultMessage: finishedMessage(state, players),
      }
    }

    const expected = players[state.turnIndex]
    if (!expected || expected.id !== actorId) throw new Error('Not your turn')

    const next: DotsAndBoxesState = {
      ...state,
      hLines: state.hLines.map((r) => r.slice()),
      vLines: state.vLines.map((r) => r.slice()),
      boxes: state.boxes.map((r) => r.slice()),
      scores: [...state.scores] as [number, number],
    }

    if (move.type === 'h') {
      if (
        move.row < 0 ||
        move.row > DAB_SIZE ||
        move.col < 0 ||
        move.col >= DAB_SIZE ||
        next.hLines[move.row][move.col]
      ) {
        throw new Error('Invalid line')
      }
      next.hLines[move.row][move.col] = true
    } else {
      if (
        move.row < 0 ||
        move.row >= DAB_SIZE ||
        move.col < 0 ||
        move.col > DAB_SIZE ||
        next.vLines[move.row][move.col]
      ) {
        throw new Error('Invalid line')
      }
      next.vLines[move.row][move.col] = true
    }

    let claimed = 0
    for (let r = 0; r < DAB_SIZE; r += 1) {
      for (let c = 0; c < DAB_SIZE; c += 1) {
        if (next.boxes[r][c] === null && boxComplete(next, r, c)) {
          next.boxes[r][c] = state.turnIndex
          next.scores[state.turnIndex] += 1
          claimed += 1
        }
      }
    }

    const totalBoxes = DAB_SIZE * DAB_SIZE
    const filled = next.scores[0] + next.scores[1]
    const finished = filled === totalBoxes

    if (!finished) {
      if (claimed === 0) {
        next.turnIndex = state.turnIndex === 0 ? 1 : 0
      }
    } else if (next.scores[0] === next.scores[1]) {
      next.isDraw = true
      next.winnerId = null
    } else {
      const winIndex = next.scores[0] > next.scores[1] ? 0 : 1
      next.winnerId = players[winIndex]?.id ?? null
    }

    return {
      state: next,
      nextPlayerId: finished ? null : players[next.turnIndex]?.id ?? null,
      finished,
      resultMessage: finished ? finishedMessage(next, players) : null,
    }
  },
}
