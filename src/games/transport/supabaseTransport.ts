import type { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js'
import { getSupabase } from '../../lib/supabase'
import { createPlayerId, createRoomCode, normalizeRoomCode } from '../codes'
import { getGameMeta } from '../meta'
import { applyGameMove, createGameState, getTurnPlayerId, type AnyGameMove } from '../rules'
import type {
  CreateRoomInput,
  GameId,
  JoinRoomInput,
  Player,
  RoomPhase,
  RoomState,
  RoomTransport,
} from '../types'

const SEAT_KEY = 'amrita.supabase.localSeat.v1'

type SeatMap = Record<string, string>

type RoomRow = {
  code: string
  game_id: string
  players: Player[]
  phase: RoomPhase
  current_player_id: string | null
  game_state: unknown
  result_message: string | null
  updated_at: string
}

function loadSeats(): SeatMap {
  try {
    const raw = localStorage.getItem(SEAT_KEY)
    return raw ? (JSON.parse(raw) as SeatMap) : {}
  } catch {
    return {}
  }
}

function saveSeats(seats: SeatMap) {
  localStorage.setItem(SEAT_KEY, JSON.stringify(seats))
}

function rowToRoom(row: RoomRow): RoomState {
  return {
    code: row.code,
    gameId: row.game_id as GameId,
    players: row.players ?? [],
    phase: row.phase,
    currentPlayerId: row.current_player_id,
    gameState: row.game_state,
    resultMessage: row.result_message,
    updatedAt: new Date(row.updated_at).getTime(),
  }
}

function roomToRow(room: RoomState) {
  return {
    code: room.code,
    game_id: room.gameId,
    players: room.players,
    phase: room.phase,
    current_player_id: room.currentPlayerId,
    game_state: room.gameState,
    result_message: room.resultMessage,
    updated_at: new Date(room.updatedAt).toISOString(),
  }
}

async function fetchRoom(client: SupabaseClient, code: string): Promise<RoomState | null> {
  const { data, error } = await client
    .from('game_rooms')
    .select('*')
    .eq('code', code)
    .maybeSingle()
  if (error) throw new Error(error.message)
  if (!data) return null
  return rowToRoom(data as RoomRow)
}

async function upsertRoom(client: SupabaseClient, room: RoomState): Promise<RoomState> {
  const { data, error } = await client
    .from('game_rooms')
    .upsert(roomToRow(room), { onConflict: 'code' })
    .select('*')
    .single()
  if (error) throw new Error(error.message)
  return rowToRoom(data as RoomRow)
}

/**
 * Cross-device rooms via Supabase Realtime + Postgres.
 * Pure game rules stay in `src/games/rules`.
 */
export function createSupabaseTransport(): RoomTransport {
  const client = getSupabase()
  let activeCode: string | null = null
  let cached: RoomState | null = null
  let channel: RealtimeChannel | null = null
  const listeners = new Set<(state: RoomState | null) => void>()
  let seats = loadSeats()

  const emit = () => {
    listeners.forEach((l) => l(cached))
  }

  const setLocalSeat = (code: string, playerId: string) => {
    seats = { ...seats, [code]: playerId }
    saveSeats(seats)
  }

  const clearLocalSeat = (code: string) => {
    const next = { ...seats }
    delete next[code]
    seats = next
    saveSeats(seats)
  }

  const unsubscribeChannel = async () => {
    if (channel) {
      await client.removeChannel(channel)
      channel = null
    }
  }

  const subscribeToCode = async (code: string) => {
    await unsubscribeChannel()
    channel = client
      .channel(`game-room:${code}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_rooms',
          filter: `code=eq.${code}`,
        },
        (payload) => {
          if (payload.eventType === 'DELETE') {
            if (activeCode === code) {
              cached = null
              activeCode = null
              emit()
            }
            return
          }
          const row = payload.new as RoomRow
          if (!row?.code) return
          cached = rowToRoom(row)
          activeCode = row.code
          emit()
        },
      )
      .subscribe()
  }

  const requireRoom = async (): Promise<RoomState> => {
    if (!activeCode) throw new Error('No active room')
    const fresh = await fetchRoom(client, activeCode)
    if (!fresh) throw new Error('Room not found')
    cached = fresh
    return fresh
  }

  const requireLocalPlayer = (room: RoomState): Player => {
    const localId = seats[room.code]
    const player = room.players.find((p) => p.id === localId)
    if (!player) throw new Error('You are not seated in this room — join again')
    return player
  }

  const uniqueCode = async (): Promise<string> => {
    for (let i = 0; i < 24; i += 1) {
      const code = createRoomCode()
      const existing = await fetchRoom(client, code)
      if (!existing) return code
    }
    throw new Error('Could not allocate room code')
  }

  return {
    async createRoom(input: CreateRoomInput) {
      const nickname = input.nickname.trim()
      if (!nickname) throw new Error('Enter a nickname')
      getGameMeta(input.gameId)

      const code = await uniqueCode()
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

      cached = await upsertRoom(client, room)
      activeCode = code
      setLocalSeat(code, host.id)
      await subscribeToCode(code)
      emit()
      return cached
    },

    async joinRoom(input: JoinRoomInput) {
      const nickname = input.nickname.trim()
      if (!nickname) throw new Error('Enter a nickname')
      const code = normalizeRoomCode(input.code)
      const room = await fetchRoom(client, code)
      if (!room) throw new Error('Room not found — check the code')
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

      cached = await upsertRoom(client, next)
      activeCode = code
      setLocalSeat(code, player.id)
      await subscribeToCode(code)
      emit()
      return cached
    },

    async addLocalSeat(nickname: string) {
      const room = await requireRoom()
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
      cached = await upsertRoom(client, next)
      emit()
      return cached
    },

    async leaveRoom() {
      if (!activeCode) return
      const code = activeCode
      const room = (await fetchRoom(client, code)) ?? cached
      if (!room) {
        activeCode = null
        cached = null
        await unsubscribeChannel()
        emit()
        return
      }

      const localId = seats[code]
      const remaining = room.players.filter((p) => p.id !== localId)

      if (remaining.length === 0) {
        await client.from('game_rooms').delete().eq('code', code)
      } else {
        const withHost = remaining.map((p, i) => ({ ...p, isHost: i === 0 }))
        await upsertRoom(client, {
          ...room,
          players: withHost,
          phase: 'lobby',
          gameState: null,
          currentPlayerId: null,
          resultMessage: null,
          updatedAt: Date.now(),
        })
      }

      clearLocalSeat(code)
      activeCode = null
      cached = null
      await unsubscribeChannel()
      emit()
    },

    async setReady(ready: boolean) {
      const room = await requireRoom()
      if (room.phase !== 'lobby') throw new Error('Already in game')
      const local = requireLocalPlayer(room)
      const next: RoomState = {
        ...room,
        players: room.players.map((p) => (p.id === local.id ? { ...p, ready } : p)),
        updatedAt: Date.now(),
      }
      cached = await upsertRoom(client, next)
      emit()
      return cached
    },

    async startGame() {
      const room = await requireRoom()
      const local = requireLocalPlayer(room)
      if (!local.isHost) throw new Error('Only the host can start')
      const meta = getGameMeta(room.gameId)
      if (room.players.length < meta.minPlayers) {
        throw new Error(`Need at least ${meta.minPlayers} players`)
      }

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
      cached = await upsertRoom(client, next)
      emit()
      return cached
    },

    async rematch() {
      const room = await requireRoom()
      const local = requireLocalPlayer(room)
      if (!local.isHost) throw new Error('Only the host can rematch')
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
      cached = await upsertRoom(client, next)
      emit()
      return cached
    },

    async dispatchMove(move: unknown) {
      // Prefer in-memory room to avoid an extra network round-trip before each move
      const room =
        cached && activeCode && cached.code === activeCode
          ? cached
          : await requireRoom()

      if (room.phase !== 'playing' && room.phase !== 'finished') {
        throw new Error('Game not active')
      }
      if (!room.gameState) throw new Error('Missing game state')

      const local = requireLocalPlayer(room)
      const actorId = room.currentPlayerId
      if (!actorId) throw new Error('No active turn')
      if (local.id !== actorId) {
        throw new Error('Wait for your turn')
      }

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

      // Optimistic UI — paint instantly, then sync
      cached = next
      emit()

      try {
        cached = await upsertRoom(client, next)
        emit()
        return cached
      } catch (err) {
        // Re-fetch truth if write fails
        const fresh = await fetchRoom(client, room.code)
        cached = fresh
        emit()
        throw err
      }
    },

    getState() {
      return cached
    },

    getLocalPlayerId() {
      if (!activeCode) return null
      return seats[activeCode] ?? null
    },

    subscribe(listener) {
      listeners.add(listener)
      listener(cached)
      return () => {
        listeners.delete(listener)
      }
    },
  }
}
