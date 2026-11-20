import { createPlayerId, createRoomCode, normalizeRoomCode } from '../codes'
import { getGameMeta } from '../meta'
import { applyGameMove, createGameState, getTurnPlayerId, type AnyGameMove } from '../rules'
import type {
  CreateRoomInput,
  JoinRoomInput,
  Player,
  RoomState,
  RoomTransport,
} from '../types'

const STORAGE_KEY = 'amrita.localRooms.v1'

type Store = {
  rooms: Record<string, RoomState>
  /** On this device, which player id is "you" per room code */
  localSeatByCode: Record<string, string>
  activeCode: string | null
}

function loadStore(): Store {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return { rooms: {}, localSeatByCode: {}, activeCode: null }
    return JSON.parse(raw) as Store
  } catch {
    return { rooms: {}, localSeatByCode: {}, activeCode: null }
  }
}

function saveStore(store: Store) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

/**
 * Same-device / hot-seat rooms.
 * Phase 5 can replace this class with a Supabase Realtime transport
 * that still calls the pure rules in `games/rules`.
 */
export function createLocalTransport(): RoomTransport {
  let store = loadStore()
  const listeners = new Set<(state: RoomState | null) => void>()

  const emit = () => {
    const state = getState()
    listeners.forEach((l) => l(state))
  }

  const persist = () => {
    saveStore(store)
    emit()
  }

  const getState = (): RoomState | null => {
    if (!store.activeCode) return null
    return store.rooms[store.activeCode] ?? null
  }

  const requireRoom = (): RoomState => {
    const room = getState()
    if (!room) throw new Error('No active room')
    return room
  }

  const requireLocalPlayer = (room: RoomState): Player => {
    const localId = store.localSeatByCode[room.code]
    const player = room.players.find((p) => p.id === localId)
    if (!player) throw new Error('Local player missing from room')
    return player
  }

  const uniqueCode = (): string => {
    for (let i = 0; i < 20; i += 1) {
      const code = createRoomCode()
      if (!store.rooms[code]) return code
    }
    throw new Error('Could not allocate room code')
  }

  return {
    async createRoom(input: CreateRoomInput) {
      const nickname = input.nickname.trim()
      if (!nickname) throw new Error('Enter a nickname')
      getGameMeta(input.gameId)

      const code = uniqueCode()
      const host: Player = {
        id: createPlayerId(),
        nickname,
        ready: true,
        isHost: true,
      }

      const room: RoomState = {
        code,
        gameId: input.gameId,
        players: [host],
        phase: 'lobby',
        currentPlayerId: null,
        gameState: null,
        resultMessage: null,
        updatedAt: Date.now(),
      }

      store.rooms[code] = room
      store.localSeatByCode[code] = host.id
      store.activeCode = code
      persist()
      return room
    },

    async joinRoom(input: JoinRoomInput) {
      const nickname = input.nickname.trim()
      if (!nickname) throw new Error('Enter a nickname')
      const code = normalizeRoomCode(input.code)
      const room = store.rooms[code]
      if (!room) throw new Error('Room not found on this device')
      if (room.phase !== 'lobby') throw new Error('Game already started')

      const meta = getGameMeta(room.gameId)
      if (room.players.length >= meta.maxPlayers) throw new Error('Room is full')
      if (room.players.some((p) => p.nickname.toLowerCase() === nickname.toLowerCase())) {
        throw new Error('Nickname already taken in this room')
      }

      const player: Player = {
        id: createPlayerId(),
        nickname,
        ready: false,
        isHost: false,
      }
      const next: RoomState = {
        ...room,
        players: [...room.players, player],
        updatedAt: Date.now(),
      }
      store.rooms[code] = next
      store.localSeatByCode[code] = player.id
      store.activeCode = code
      persist()
      return next
    },

    /**
     * Hot-seat helper: add another local player without switching "you".
     * Host stays the controlling seat for lobby actions; turns still rotate by player id.
     */
    async addLocalSeat(nickname: string) {
      const room = requireRoom()
      if (room.phase !== 'lobby') throw new Error('Game already started')
      const meta = getGameMeta(room.gameId)
      const name = nickname.trim()
      if (!name) throw new Error('Enter a nickname')
      if (room.players.length >= meta.maxPlayers) throw new Error('Room is full')
      if (room.players.some((p) => p.nickname.toLowerCase() === name.toLowerCase())) {
        throw new Error('Nickname already taken in this room')
      }

      const player: Player = {
        id: createPlayerId(),
        nickname: name,
        ready: true,
        isHost: false,
      }
      const next: RoomState = {
        ...room,
        players: [...room.players, player],
        updatedAt: Date.now(),
      }
      store.rooms[room.code] = next
      persist()
      return next
    },

    async leaveRoom() {
      const room = getState()
      if (!room) return
      const localId = store.localSeatByCode[room.code]
      const remaining = room.players.filter((p) => p.id !== localId)

      if (remaining.length === 0) {
        delete store.rooms[room.code]
      } else {
        const nextPlayers = remaining.map((p, index) =>
          index === 0 ? { ...p, isHost: true } : { ...p, isHost: p.isHost && p.id === remaining[0].id },
        )
        // ensure only one host
        const withHost = nextPlayers.map((p, i) => ({ ...p, isHost: i === 0 }))
        store.rooms[room.code] = {
          ...room,
          players: withHost,
          phase: 'lobby',
          gameState: null,
          currentPlayerId: null,
          resultMessage: null,
          updatedAt: Date.now(),
        }
      }

      delete store.localSeatByCode[room.code]
      store.activeCode = null
      persist()
    },

    async setReady(ready: boolean) {
      const room = requireRoom()
      if (room.phase !== 'lobby') throw new Error('Already in game')
      const local = requireLocalPlayer(room)
      const next: RoomState = {
        ...room,
        players: room.players.map((p) => (p.id === local.id ? { ...p, ready } : p)),
        updatedAt: Date.now(),
      }
      store.rooms[room.code] = next
      persist()
      return next
    },

    async startGame() {
      const room = requireRoom()
      const local = requireLocalPlayer(room)
      if (!local.isHost) throw new Error('Only the host can start')
      const meta = getGameMeta(room.gameId)
      if (room.players.length < meta.minPlayers) {
        throw new Error(`Need at least ${meta.minPlayers} players`)
      }
      // Local/hot-seat: host start readies everyone at the table
      const players = room.players.map((p) => ({ ...p, ready: true }))

      const gameState = createGameState(room.gameId, players)
      const next: RoomState = {
        ...room,
        players,
        phase: 'playing',
        gameState,
        currentPlayerId: getTurnPlayerId(room.gameId, gameState, players),
        resultMessage: null,
        updatedAt: Date.now(),
      }
      store.rooms[room.code] = next
      persist()
      return next
    },

    async rematch() {
      const room = requireRoom()
      const local = requireLocalPlayer(room)
      if (!local.isHost) throw new Error('Only the host can rematch')
      const players = room.players.map((p) => ({ ...p, ready: p.isHost }))
      const gameState = createGameState(room.gameId, players)
      const next: RoomState = {
        ...room,
        players,
        phase: 'playing',
        gameState,
        currentPlayerId: getTurnPlayerId(room.gameId, gameState, players),
        resultMessage: null,
        updatedAt: Date.now(),
      }
      store.rooms[room.code] = next
      persist()
      return next
    },

    async dispatchMove(move: unknown) {
      const room = requireRoom()
      if (room.phase !== 'playing' && room.phase !== 'finished') {
        throw new Error('Game not active')
      }
      if (!room.gameState) throw new Error('Missing game state')

      // Hot-seat: actor is the current turn player (pass-the-phone), not necessarily "local seat"
      const actorId = room.currentPlayerId
      if (!actorId) throw new Error('No active turn')

      const result = applyGameMove(
        room.gameId,
        room.gameState as never,
        move as AnyGameMove,
        actorId,
        room.players,
      )

      const next: RoomState = {
        ...room,
        gameState: result.state,
        currentPlayerId: result.nextPlayerId,
        phase: result.finished ? 'finished' : 'playing',
        resultMessage: result.resultMessage,
        updatedAt: Date.now(),
      }
      store.rooms[room.code] = next
      persist()
      return next
    },

    getState,
    getLocalPlayerId() {
      const room = getState()
      if (!room) return null
      return store.localSeatByCode[room.code] ?? null
    },
    subscribe(listener) {
      listeners.add(listener)
      listener(getState())
      return () => listeners.delete(listener)
    },
  }
}
