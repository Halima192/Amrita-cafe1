import { Copy, UserPlus, Users } from 'lucide-react'
import { useState } from 'react'
import { getGameMeta } from '../../games/meta'
import { isSupabaseConfigured } from '../../games/transport'
import type { RoomState } from '../../games/types'
import { Button } from '../ui/Button'

type Props = {
  room: RoomState
  localPlayerId: string | null
  busy?: boolean
  onAddSeat: (nickname: string) => Promise<unknown>
  onToggleReady: (ready: boolean) => Promise<unknown>
  onStart: () => Promise<unknown>
  onLeave: () => Promise<unknown>
}

export function LobbyPanel({
  room,
  localPlayerId,
  busy,
  onAddSeat,
  onToggleReady,
  onStart,
  onLeave,
}: Props) {
  const meta = getGameMeta(room.gameId)
  const local = room.players.find((p) => p.id === localPlayerId)
  const [seatName, setSeatName] = useState('')
  const [copied, setCopied] = useState(false)
  const canAdd = room.players.length < meta.maxPlayers
  const readyCount = room.players.filter((p) => p.ready).length

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(room.code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-3xl bg-cream/5 p-4 ring-1 ring-cream/10">
        <p className="text-xs font-semibold tracking-[0.2em] text-cream/45 uppercase">
          {isSupabaseConfigured ? 'Online room · share this code' : 'Local room · this device'}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <p className="font-playful text-3xl tracking-[0.2em] text-caramel">{room.code}</p>
          <button
            type="button"
            onClick={copyCode}
            className="inline-flex items-center gap-1.5 rounded-full bg-cream/10 px-3 py-1.5 text-xs font-semibold text-cream/80 hover:bg-cream/20"
          >
            <Copy className="size-3.5" aria-hidden="true" />
            {copied ? 'Copied' : 'Copy code'}
          </button>
        </div>
        <p className="mt-2 text-sm text-cream/65">
          {meta.title} · {meta.playersLabel}.
          {isSupabaseConfigured
            ? ' Friends open Play Together → Join room → paste this code.'
            : ' Same-device / hot-seat play.'}
        </p>
      </div>

      <div>
        <div className="mb-2 flex items-center gap-2 text-cream">
          <Users className="size-4 text-caramel" aria-hidden="true" />
          <h3 className="font-playful text-lg">Players ({room.players.length}/{meta.maxPlayers})</h3>
        </div>
        <ul className="space-y-2">
          {room.players.map((player) => (
            <li
              key={player.id}
              className="flex items-center justify-between rounded-2xl bg-coffee/50 px-3 py-2.5 ring-1 ring-cream/10"
            >
              <div>
                <p className="font-semibold text-cream">
                  {player.nickname}
                  {player.id === localPlayerId ? (
                    <span className="ml-2 text-xs font-medium text-caramel">(you)</span>
                  ) : null}
                </p>
                <p className="text-xs text-cream/50">
                  {player.isHost ? 'Host' : 'Player'}
                  {player.ready ? ' · Ready' : ' · Not ready'}
                </p>
              </div>
              <span
                className={[
                  'rounded-full px-2.5 py-1 text-[0.65rem] font-bold tracking-wide uppercase',
                  player.ready ? 'bg-caramel/25 text-caramel' : 'bg-cream/10 text-cream/50',
                ].join(' ')}
              >
                {player.ready ? 'Ready' : 'Waiting'}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-cream/45">
          {readyCount}/{room.players.length} ready
        </p>
      </div>

      {canAdd ? (
        <form
          className="space-y-2"
          onSubmit={(e) => {
            e.preventDefault()
            void onAddSeat(seatName || `Player ${room.players.length + 1}`).then(() =>
              setSeatName(''),
            )
          }}
        >
          <label className="block text-sm text-cream/70" htmlFor="seat-name">
            Add friend on this phone
          </label>
          <div className="flex gap-2">
            <input
              id="seat-name"
              value={seatName}
              onChange={(e) => setSeatName(e.target.value)}
              placeholder={`Player ${room.players.length + 1}`}
              className="min-w-0 flex-1 rounded-full border border-cream/15 bg-chocolate px-4 py-2.5 text-sm text-cream placeholder:text-cream/35 focus:border-caramel focus:outline-none"
            />
            <Button type="submit" variant="soft" disabled={busy}>
              <UserPlus className="size-4" aria-hidden="true" />
              Add
            </Button>
          </div>
          {room.players.length < meta.minPlayers ? (
            <p className="text-xs text-caramel">
              Need at least {meta.minPlayers} players before you can start.
            </p>
          ) : null}
        </form>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {local && !local.isHost ? (
          <Button
            type="button"
            variant="secondary"
            className="bg-cream text-coffee"
            disabled={busy}
            onClick={() => void onToggleReady(!local.ready)}
          >
            {local.ready ? 'Unready' : 'Ready up'}
          </Button>
        ) : null}
        {local?.isHost ? (
          <Button
            type="button"
            variant="primary"
            className="min-w-[10rem]"
            disabled={busy || room.players.length < meta.minPlayers}
            onClick={() => void onStart()}
          >
            Start game
          </Button>
        ) : (
          <p className="self-center text-xs text-cream/50">Waiting for host to start…</p>
        )}
        <Button type="button" variant="ghost" disabled={busy} onClick={() => void onLeave()}>
          Leave room
        </Button>
      </div>
    </div>
  )
}
