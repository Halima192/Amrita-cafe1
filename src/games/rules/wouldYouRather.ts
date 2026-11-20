import type { GameRules } from '../types'

export type WyrPrompt = {
  id: string
  optionA: string
  optionB: string
}

/** Sample prompts for cafe presentation — not product copy. */
export const WYR_PROMPTS: WyrPrompt[] = [
  { id: '1', optionA: 'Pizza?', optionB: 'Burger?' },
  { id: '2', optionA: 'Always iced coffee', optionB: 'Always hot coffee' },
  { id: '3', optionA: 'Window seat', optionB: 'Cozy booth' },
  { id: '4', optionA: 'Sweet dessert first', optionB: 'Save dessert for last' },
  { id: '5', optionA: 'Board games all evening', optionB: 'One quick round then chat' },
  { id: '6', optionA: 'Extra foam', optionB: 'Extra shot' },
]

export type WouldYouRatherState = {
  promptIndex: number
  /** playerId -> 'A' | 'B' for current prompt */
  votes: Record<string, 'A' | 'B'>
  /** revealed after everyone votes */
  revealed: boolean
  /** tally history */
  history: { promptId: string; a: number; b: number }[]
  finished: boolean
}

export type WouldYouRatherMove =
  | { type: 'vote'; choice: 'A' | 'B' }
  | { type: 'next' }

function advanceAfterVotes(state: WouldYouRatherState) {
  const nextIndex = state.promptIndex + 1
  if (nextIndex >= WYR_PROMPTS.length) {
    const done: WouldYouRatherState = { ...state, finished: true, revealed: true }
    return {
      state: done,
      nextPlayerId: null as string | null,
      finished: true,
      resultMessage: 'All prompts done — rematch?',
    }
  }

  const next: WouldYouRatherState = {
    ...state,
    promptIndex: nextIndex,
    votes: {},
    revealed: false,
  }
  return {
    state: next,
    nextPlayerId: null as string | null,
    finished: false,
    resultMessage: null as string | null,
  }
}

export const wouldYouRatherRules: GameRules<WouldYouRatherState, WouldYouRatherMove> = {
  createInitialState() {
    return {
      promptIndex: 0,
      votes: {},
      revealed: false,
      history: [],
      finished: false,
    }
  },

  getCurrentPlayerId(state, players) {
    if (state.finished) return null
    const pending = players.find((p) => !state.votes[p.id])
    return pending?.id ?? players[0]?.id ?? null
  },

  applyMove(state, move, actorId, players) {
    if (state.finished) {
      return {
        state,
        nextPlayerId: null,
        finished: true,
        resultMessage: 'Round complete — rematch for more prompts!',
      }
    }

    // Legacy next — still advances if called
    if (move.type === 'next') {
      if (!state.revealed) throw new Error('Reveal votes first')
      const advanced = advanceAfterVotes(state)
      if (!advanced.finished) {
        advanced.nextPlayerId = wouldYouRatherRules.getCurrentPlayerId(
          advanced.state,
          players,
        )
      }
      return advanced
    }

    if (move.type !== 'vote') throw new Error('Unknown move')
    if (!players.some((p) => p.id === actorId)) throw new Error('Unknown player')
    if (state.votes[actorId]) throw new Error('Already voted')

    const votes = { ...state.votes, [actorId]: move.choice }
    const allVoted = players.every((p) => votes[p.id])

    if (!allVoted) {
      const next: WouldYouRatherState = {
        ...state,
        votes,
        revealed: false,
      }
      return {
        state: next,
        nextPlayerId: wouldYouRatherRules.getCurrentPlayerId(next, players),
        finished: false,
        resultMessage: null,
      }
    }

    const prompt = WYR_PROMPTS[state.promptIndex]
    const a = Object.values(votes).filter((v) => v === 'A').length
    const b = Object.values(votes).filter((v) => v === 'B').length
    const scored: WouldYouRatherState = {
      ...state,
      votes,
      revealed: true,
      history: [...state.history, { promptId: prompt.id, a, b }],
    }

    // Everyone voted → auto next prompt (no manual button)
    const advanced = advanceAfterVotes(scored)
    if (!advanced.finished) {
      advanced.nextPlayerId = wouldYouRatherRules.getCurrentPlayerId(
        advanced.state,
        players,
      )
    }
    return advanced
  },
}
