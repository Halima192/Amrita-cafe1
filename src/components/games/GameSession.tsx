import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { GAMES, getGameMeta } from '../../games/meta'
import { isSupabaseConfigured } from '../../games/transport'
import type { GameId } from '../../games/types'
import { useGameRoom } from '../../hooks/useGameRoom'
import { Button } from '../ui/Button'
import { GameBoard } from './GameBoard'
import { LobbyPanel } from './LobbyPanel'

type Props = {
  open: boolean
  initialGameId: GameId | null
  onClose: () => void
}

export function GameSession({ open, initialGameId, onClose }: Props) {
  const {
    room,
    error,
    busy,
    createRoom,
    joinRoom,
    addLocalSeat,
    leaveRoom,
    setReady,
    startGame,
    rematch,
    dispatchMove,
    clearError,
    localPlayerId,
  } = useGameRoom()

  const [nickname, setNickname] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [mode, setMode] = useState<'create' | 'join'>('create')
  const [selectedGame, setSelectedGame] = useState<GameId | null>(initialGameId)

  useEffect(() => {
    if (open) {
      setSelectedGame(initialGameId)
      setMode('create')
      clearError()
    }
  }, [open, initialGameId, clearError])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const meta = selectedGame ? getGameMeta(selectedGame) : room ? getGameMeta(room.gameId) : null
  const showGamePicker = !room && !selectedGame

  const handleLeave = async () => {
    await leaveRoom().catch(() => undefined)
    onClose()
  }

  const heading = showGamePicker
    ? 'Choose a game'
    : meta?.title ?? 'Game lobby'

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-chocolate/70 p-3 backdrop-blur-sm sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="Play Together lobby"
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className={[
              'max-h-[92svh] w-full overflow-y-auto rounded-[1.75rem] bg-[#2a1b14] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.45)] ring-1 ring-cream/10 sm:p-6',
              showGamePicker ? 'max-w-2xl' : 'max-w-lg',
            ].join(' ')}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="font-playful text-caramel">Play Together</p>
                <h2 className="font-display text-2xl font-semibold text-cream">{heading}</h2>
                <p className="mt-1 text-xs text-cream/50">
                  {showGamePicker
                    ? isSupabaseConfigured
                      ? 'Pick a game — play across phones with a room code'
                      : 'Pick a game — local play on this device'
                    : isSupabaseConfigured
                      ? 'Online room · share the code with friends'
                      : 'Local play on this device'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => void handleLeave()}
                className="grid size-11 place-items-center rounded-full bg-cream/10 text-cream hover:bg-cream/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel"
                aria-label="Close game lobby"
              >
                <X className="size-5" />
              </button>
            </div>

            {error ? (
              <div
                className="mb-4 rounded-2xl bg-caramel/15 px-3 py-2 text-sm text-caramel ring-1 ring-caramel/30"
                role="alert"
              >
                {error}
              </div>
            ) : null}

            {showGamePicker ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {GAMES.map((game) => (
                  <button
                    key={game.id}
                    type="button"
                    onClick={() => setSelectedGame(game.id)}
                    className="group overflow-hidden rounded-2xl bg-cream/5 text-left ring-1 ring-cream/10 transition hover:ring-caramel/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel"
                  >
                    <img
                      src={game.cover}
                      alt=""
                      className="aspect-[16/9] w-full object-cover transition duration-400 group-hover:scale-[1.02]"
                    />
                    <div className="space-y-1 p-3">
                      <p className="font-display text-base font-semibold text-cream">
                        {game.title}
                      </p>
                      <p className="font-playful text-sm text-caramel">{game.tagline}</p>
                      <p className="text-[0.65rem] font-semibold tracking-wide text-cream/45 uppercase">
                        {game.playersLabel} · {game.paceLabel}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : !room ? (
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => {
                    clearError()
                    setSelectedGame(null)
                  }}
                  className="inline-flex items-center gap-1.5 text-sm text-cream/60 transition hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel"
                >
                  <ArrowLeft className="size-4" aria-hidden="true" />
                  All games
                </button>

                <div className="flex gap-2 rounded-full bg-cream/5 p-1">
                  {(['create', 'join'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => {
                        clearError()
                        setMode(m)
                      }}
                      className={[
                        'font-playful flex-1 rounded-full py-2 text-sm capitalize',
                        mode === m ? 'bg-caramel text-chocolate' : 'text-cream/70',
                      ].join(' ')}
                    >
                      {m === 'create' ? 'Create room' : 'Join room'}
                    </button>
                  ))}
                </div>

                <label className="block text-sm text-cream/70" htmlFor="nickname">
                  Your nickname
                </label>
                <input
                  id="nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="What should we call you?"
                  className="w-full rounded-full border border-cream/15 bg-chocolate px-4 py-2.5 text-sm text-cream placeholder:text-cream/35 focus:border-caramel focus:outline-none"
                />

                {mode === 'create' ? (
                  <>
                    <p className="rounded-2xl bg-cream/5 px-3 py-2 text-sm text-cream/70 ring-1 ring-cream/10">
                      {isSupabaseConfigured ? (
                        <>
                          Creating{' '}
                          <span className="font-semibold text-cream">{meta?.title}</span>. Share the
                          room code — friends can join from their phones.
                        </>
                      ) : (
                        <>
                          Same-phone play for{' '}
                          <span className="font-semibold text-cream">{meta?.title}</span>.
                          {meta?.maxPlayers === 2
                            ? ' Player 2 is added automatically.'
                            : ' Add friends in the lobby, then start.'}
                        </>
                      )}
                    </p>
                    <Button
                      type="button"
                      variant="secondary"
                      className="w-full bg-cream text-coffee"
                      disabled={busy || !nickname.trim() || !selectedGame}
                      onClick={() => {
                        if (!selectedGame || !meta) return
                        void (async () => {
                          await createRoom(selectedGame, nickname)
                          if (
                            !isSupabaseConfigured &&
                            meta.minPlayers === 2 &&
                            meta.maxPlayers === 2
                          ) {
                            await addLocalSeat('Player 2')
                            await startGame()
                          }
                        })()
                      }}
                    >
                      {isSupabaseConfigured
                        ? 'Create room'
                        : meta?.maxPlayers === 2
                          ? 'Start game'
                          : 'Create lobby'}
                    </Button>
                    {!isSupabaseConfigured ? (
                      <p className="text-xs text-cream/45">
                        Add Supabase keys in `.env` to play across different devices.
                      </p>
                    ) : null}
                  </>
                ) : (
                  <>
                    <p className="rounded-2xl bg-caramel/10 px-3 py-2 text-sm text-caramel/90 ring-1 ring-caramel/25">
                      {isSupabaseConfigured
                        ? 'Enter the host’s room code from another phone to join.'
                        : 'Without Supabase, join only works for rooms created on this same browser.'}
                    </p>
                    <label className="block text-sm text-cream/70" htmlFor="join-code">
                      Room code
                    </label>
                    <input
                      id="join-code"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                      placeholder="e.g. AB3K7"
                      maxLength={8}
                      className="w-full rounded-full border border-cream/15 bg-chocolate px-4 py-2.5 text-sm tracking-[0.2em] text-cream placeholder:text-cream/35 focus:border-caramel focus:outline-none"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      className="w-full bg-cream text-coffee"
                      disabled={busy || !nickname.trim() || !joinCode.trim()}
                      onClick={() => void joinRoom(joinCode, nickname)}
                    >
                      Join room
                    </Button>
                  </>
                )}
              </div>
            ) : room.phase === 'lobby' ? (
              <LobbyPanel
                room={room}
                localPlayerId={localPlayerId}
                busy={busy}
                onAddSeat={addLocalSeat}
                onToggleReady={setReady}
                onStart={startGame}
                onLeave={handleLeave}
              />
            ) : (
              <div className="space-y-4">
                {room.resultMessage ? (
                  <p className="font-playful rounded-2xl bg-caramel/15 px-3 py-2 text-center text-caramel ring-1 ring-caramel/25">
                    {room.resultMessage}
                  </p>
                ) : (
                  <p className="text-center text-xs text-cream/45">
                    Pass the phone · room {room.code}
                  </p>
                )}

                <GameBoard
                  room={room}
                  localPlayerId={localPlayerId}
                  busy={busy}
                  onMove={dispatchMove}
                />

                <div className="flex flex-wrap gap-2 pt-2">
                  {room.phase === 'finished' &&
                  room.players.find((p) => p.id === localPlayerId)?.isHost ? (
                    <Button
                      type="button"
                      variant="secondary"
                      className="bg-cream text-coffee"
                      disabled={busy}
                      onClick={() => void rematch()}
                    >
                      Rematch
                    </Button>
                  ) : null}
                  <Button type="button" variant="ghost" disabled={busy} onClick={() => void handleLeave()}>
                    Leave room
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
