import type { GameId, Player } from '../types'
import { dotsAndBoxesRules, type DotsAndBoxesMove, type DotsAndBoxesState } from './dotsAndBoxes'
import {
  neverHaveIEverRules,
  type NeverHaveIEverMove,
  type NeverHaveIEverState,
} from './neverHaveIEver'
import { ticTacToeRules, type TicTacToeMove, type TicTacToeState } from './ticTacToe'
import { wouldYouRatherRules, type WouldYouRatherMove, type WouldYouRatherState } from './wouldYouRather'

export type AnyGameState =
  | TicTacToeState
  | DotsAndBoxesState
  | WouldYouRatherState
  | NeverHaveIEverState

export type AnyGameMove =
  | TicTacToeMove
  | DotsAndBoxesMove
  | WouldYouRatherMove
  | NeverHaveIEverMove

export function createGameState(gameId: GameId, players: Player[]): AnyGameState {
  switch (gameId) {
    case 'tic-tac-toe':
      return ticTacToeRules.createInitialState(players)
    case 'dots-and-boxes':
      return dotsAndBoxesRules.createInitialState(players)
    case 'would-you-rather':
      return wouldYouRatherRules.createInitialState(players)
    case 'never-have-i-ever':
      return neverHaveIEverRules.createInitialState(players)
  }
}

export function applyGameMove(
  gameId: GameId,
  state: AnyGameState,
  move: AnyGameMove,
  actorId: string,
  players: Player[],
) {
  switch (gameId) {
    case 'tic-tac-toe':
      return ticTacToeRules.applyMove(
        state as TicTacToeState,
        move as TicTacToeMove,
        actorId,
        players,
      )
    case 'dots-and-boxes':
      return dotsAndBoxesRules.applyMove(
        state as DotsAndBoxesState,
        move as DotsAndBoxesMove,
        actorId,
        players,
      )
    case 'would-you-rather':
      return wouldYouRatherRules.applyMove(
        state as WouldYouRatherState,
        move as WouldYouRatherMove,
        actorId,
        players,
      )
    case 'never-have-i-ever':
      return neverHaveIEverRules.applyMove(
        state as NeverHaveIEverState,
        move as NeverHaveIEverMove,
        actorId,
        players,
      )
  }
}

export function getTurnPlayerId(
  gameId: GameId,
  state: AnyGameState,
  players: Player[],
): string | null {
  switch (gameId) {
    case 'tic-tac-toe':
      return ticTacToeRules.getCurrentPlayerId(state as TicTacToeState, players)
    case 'dots-and-boxes':
      return dotsAndBoxesRules.getCurrentPlayerId(state as DotsAndBoxesState, players)
    case 'would-you-rather':
      return wouldYouRatherRules.getCurrentPlayerId(state as WouldYouRatherState, players)
    case 'never-have-i-ever':
      return neverHaveIEverRules.getCurrentPlayerId(state as NeverHaveIEverState, players)
  }
}

export {
  dotsAndBoxesRules,
  neverHaveIEverRules,
  ticTacToeRules,
  wouldYouRatherRules,
}
