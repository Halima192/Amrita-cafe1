export type GameId =
  | 'tic-tac-toe'
  | 'dots-and-boxes'
  | 'would-you-rather'
  | 'never-have-i-ever'

export type RoomPhase = 'lobby' | 'playing' | 'finished'

export type Player = {
  id: string
  nickname: string
  ready: boolean
  isHost: boolean
}

export type GameMeta = {
  id: GameId
  title: string
  blurb: string
  tagline: string
  accent: string
  cover: string
  minPlayers: number
  maxPlayers: number
  playersLabel: string
  paceLabel: string
}

export type RoomState = {
  code: string
  gameId: GameId
  players: Player[]
  phase: RoomPhase
  /** Seat currently expected to act (hot-seat / turn pointer) */
  currentPlayerId: string | null
  /** Opaque per-game state owned by rules modules */
  gameState: unknown
  resultMessage: string | null
  updatedAt: number
}

export type CreateRoomInput = {
  gameId: GameId
  nickname: string
}

export type JoinRoomInput = {
  code: string
  nickname: string
}

/**
 * Transport boundary for Phase 5.
 * LocalTransport implements same-device rooms today;
 * a future SupabaseRealtimeTransport can satisfy this without rewriting rules.
 */
export type RoomTransport = {
  createRoom: (input: CreateRoomInput) => Promise<RoomState>
  joinRoom: (input: JoinRoomInput) => Promise<RoomState>
  addLocalSeat: (nickname: string) => Promise<RoomState>
  leaveRoom: () => Promise<void>
  setReady: (ready: boolean) => Promise<RoomState>
  startGame: () => Promise<RoomState>
  rematch: () => Promise<RoomState>
  dispatchMove: (move: unknown) => Promise<RoomState>
  getState: () => RoomState | null
  getLocalPlayerId: () => string | null
  subscribe: (listener: (state: RoomState | null) => void) => () => void
}

export type GameRules<TState, TMove> = {
  createInitialState: (players: Player[]) => TState
  applyMove: (
    state: TState,
    move: TMove,
    actorId: string,
    players: Player[],
  ) => { state: TState; nextPlayerId: string | null; finished: boolean; resultMessage: string | null }
  getCurrentPlayerId: (state: TState, players: Player[]) => string | null
}
