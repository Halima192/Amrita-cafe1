import type { GameRules, Player } from '../types'

export type NhiePrompt = {
  id: string
  prompt: string
}

/** Gen Z humor prompts — not cafe-themed. */
export const NHIE_PROMPTS: NhiePrompt[] = [
  { id: '1', prompt: 'Never have I ever left someone on read on purpose… then checked if they viewed my story.' },
  { id: '2', prompt: 'Never have I ever said “I’m outside” when I was still getting ready.' },
  { id: '3', prompt: 'Never have I ever Googled my own name like it’s a personality check.' },
  { id: '4', prompt: 'Never have I ever used “my battery died” as a full lifestyle excuse.' },
  { id: '5', prompt: 'Never have I ever started a 14-day streak… and ghosted the app on day 3.' },
  { id: '6', prompt: 'Never have I ever practiced an argument in the mirror and still lost IRL.' },
  { id: '7', prompt: 'Never have I ever said “one episode” and woke up in a different time zone.' },
  { id: '8', prompt: 'Never have I ever liked an old photo on purpose. Accidentally. Totally accidentally.' },
  { id: '9', prompt: 'Never have I ever pretended my Wi-Fi was lagging during a video call.' },
  { id: '10', prompt: 'Never have I ever screenshotted a chat just to overthink it later with friends.' },
  { id: '11', prompt: 'Never have I ever replied “haha” to something that was not funny at all.' },
  { id: '12', prompt: 'Never have I ever used a fake busy status while doing absolutely nothing.' },
]

export type NeverHaveIEverState = {
  promptIndex: number
  /** playerId -> 'have' | 'never' */
  answers: Record<string, 'have' | 'never'>
  /** Running "I have" points per player */
  scores: Record<string, number>
  revealed: boolean
  history: { promptId: string; have: number; never: number }[]
  finished: boolean
  winnerIds: string[]
}

export type NeverHaveIEverMove =
  | { type: 'answer'; choice: 'have' | 'never' }
  | { type: 'next' }

function emptyScores(players: Player[]): Record<string, number> {
  return Object.fromEntries(players.map((p) => [p.id, 0]))
}

export function getNhieLeaderboard(
  scores: Record<string, number>,
  players: Player[],
): { player: Player; points: number }[] {
  return [...players]
    .map((player) => ({ player, points: scores[player.id] ?? 0 }))
    .sort((a, b) => b.points - a.points)
}

export function getNhieWinners(
  scores: Record<string, number>,
  players: Player[],
): { winnerIds: string[]; topScore: number } {
  const board = getNhieLeaderboard(scores, players)
  const topScore = board[0]?.points ?? 0
  const winnerIds = board.filter((row) => row.points === topScore).map((row) => row.player.id)
  return { winnerIds, topScore }
}

function winnerMessage(scores: Record<string, number>, players: Player[]): string {
  const { winnerIds, topScore } = getNhieWinners(scores, players)
  const names = winnerIds
    .map((id) => players.find((p) => p.id === id)?.nickname ?? 'Player')
    .join(' & ')

  if (winnerIds.length > 1) {
    return `Tie! ${names} win with ${topScore} “I have” point${topScore === 1 ? '' : 's'}`
  }
  return `${names} wins with ${topScore} “I have” point${topScore === 1 ? '' : 's'}!`
}

export const neverHaveIEverRules: GameRules<NeverHaveIEverState, NeverHaveIEverMove> = {
  createInitialState(players) {
    return {
      promptIndex: 0,
      answers: {},
      scores: emptyScores(players),
      revealed: false,
      history: [],
      finished: false,
      winnerIds: [],
    }
  },

  getCurrentPlayerId(state, players) {
    if (state.finished) return null
    const pending = players.find((p) => !state.answers[p.id])
    return pending?.id ?? players[0]?.id ?? null
  },

  applyMove(state, move, actorId, players) {
    if (state.finished) {
      return {
        state,
        nextPlayerId: null,
        finished: true,
        resultMessage: winnerMessage(state.scores, players),
      }
    }

    // Legacy next move: advance immediately (button removed from UI)
    if (move.type === 'next') {
      return advanceAfterRound(state, players)
    }

    if (move.type !== 'answer') {
      throw new Error('Unknown move')
    }

    if (!players.some((p) => p.id === actorId)) throw new Error('Unknown player')
    if (state.answers[actorId]) throw new Error('Already answered')

    const answers = { ...state.answers, [actorId]: move.choice }
    const allAnswered = players.every((p) => answers[p.id])

    if (!allAnswered) {
      const next: NeverHaveIEverState = {
        ...state,
        answers,
        revealed: false,
      }
      return {
        state: next,
        nextPlayerId: neverHaveIEverRules.getCurrentPlayerId(next, players),
        finished: false,
        resultMessage: null,
      }
    }

    // Everyone answered → score + auto next prompt (no Next button)
    const prompt = NHIE_PROMPTS[state.promptIndex]
    const scores = { ...state.scores }
    for (const player of players) {
      if (answers[player.id] === 'have') {
        scores[player.id] = (scores[player.id] ?? 0) + 1
      }
    }

    const scored: NeverHaveIEverState = {
      ...state,
      answers,
      scores,
      revealed: true,
      history: [
        ...state.history,
        {
          promptId: prompt.id,
          have: Object.values(answers).filter((v) => v === 'have').length,
          never: Object.values(answers).filter((v) => v === 'never').length,
        },
      ],
    }

    return advanceAfterRound(scored, players)
  },
}

function advanceAfterRound(state: NeverHaveIEverState, players: Player[]) {
  const nextIndex = state.promptIndex + 1

  if (nextIndex >= NHIE_PROMPTS.length) {
    const { winnerIds } = getNhieWinners(state.scores, players)
    const done: NeverHaveIEverState = {
      ...state,
      finished: true,
      revealed: true,
      winnerIds,
    }
    return {
      state: done,
      nextPlayerId: null,
      finished: true,
      resultMessage: winnerMessage(state.scores, players),
    }
  }

  const next: NeverHaveIEverState = {
    ...state,
    promptIndex: nextIndex,
    answers: {},
    revealed: false,
  }

  return {
    state: next,
    nextPlayerId: neverHaveIEverRules.getCurrentPlayerId(next, players),
    finished: false,
    resultMessage: null,
  }
}
