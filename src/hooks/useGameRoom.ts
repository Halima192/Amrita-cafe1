import { useCallback, useEffect, useMemo, useState } from 'react'
import type { GameId, RoomState } from '../games/types'
import { createRoomTransport } from '../games/transport'

const transport = createRoomTransport()

export function useGameRoom() {
  const [room, setRoom] = useState<RoomState | null>(() => transport.getState())
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => transport.subscribe(setRoom), [])

  const run = useCallback(async <T,>(fn: () => Promise<T>) => {
    setBusy(true)
    setError(null)
    try {
      return await fn()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
      throw err
    } finally {
      setBusy(false)
    }
  }, [])

  const dispatchMove = useCallback(async (move: unknown) => {
    // Don't lock the whole board with `busy` — keeps clicks feeling instant
    setError(null)
    try {
      return await transport.dispatchMove(move)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
      throw err
    }
  }, [])

  const api = useMemo(
    () => ({
      createRoom: (gameId: GameId, nickname: string) =>
        run(() => transport.createRoom({ gameId, nickname })),
      joinRoom: (code: string, nickname: string) =>
        run(() => transport.joinRoom({ code, nickname })),
      addLocalSeat: (nickname: string) => run(() => transport.addLocalSeat(nickname)),
      leaveRoom: () => run(() => transport.leaveRoom()),
      setReady: (ready: boolean) => run(() => transport.setReady(ready)),
      startGame: () => run(() => transport.startGame()),
      rematch: () => run(() => transport.rematch()),
      dispatchMove,
      clearError: () => setError(null),
      localPlayerId: transport.getLocalPlayerId(),
    }),
    [run, room, dispatchMove],
  )

  return { room, error, busy, ...api }
}
