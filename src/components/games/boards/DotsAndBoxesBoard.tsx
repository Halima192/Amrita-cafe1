import { useMemo, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { DAB_SIZE, type DotsAndBoxesState } from '../../../games/rules/dotsAndBoxes'
import type { Player } from '../../../games/types'

type Props = {
  state: DotsAndBoxesState
  players: Player[]
  currentPlayerId: string | null
  disabled?: boolean
  onLine: (move: { type: 'h' | 'v'; row: number; col: number }) => void
}

type Edge = { type: 'h' | 'v'; row: number; col: number }

const BOX_COLORS = ['rgba(185,201,208,0.55)', 'rgba(213,140,85,0.55)']
const CELL = 64
const PAD = 24
const HIT = 14

function edgeKey(edge: Edge) {
  return `${edge.type}-${edge.row}-${edge.col}`
}

function isTaken(state: DotsAndBoxesState, edge: Edge) {
  return edge.type === 'h'
    ? Boolean(state.hLines[edge.row]?.[edge.col])
    : Boolean(state.vLines[edge.row]?.[edge.col])
}

function nearestOpenEdge(
  state: DotsAndBoxesState,
  x: number,
  y: number,
): Edge | null {
  let best: Edge | null = null
  let bestDist = Infinity

  for (let r = 0; r <= DAB_SIZE; r += 1) {
    for (let c = 0; c < DAB_SIZE; c += 1) {
      const edge: Edge = { type: 'h', row: r, col: c }
      if (isTaken(state, edge)) continue
      const x1 = PAD + c * CELL
      const x2 = x1 + CELL
      const ey = PAD + r * CELL
      const cx = Math.min(Math.max(x, x1), x2)
      const dist = Math.hypot(x - cx, y - ey)
      if (dist < bestDist) {
        bestDist = dist
        best = edge
      }
    }
  }

  for (let r = 0; r < DAB_SIZE; r += 1) {
    for (let c = 0; c <= DAB_SIZE; c += 1) {
      const edge: Edge = { type: 'v', row: r, col: c }
      if (isTaken(state, edge)) continue
      const y1 = PAD + r * CELL
      const y2 = y1 + CELL
      const ex = PAD + c * CELL
      const cy = Math.min(Math.max(y, y1), y2)
      const dist = Math.hypot(x - ex, y - cy)
      if (dist < bestDist) {
        bestDist = dist
        best = edge
      }
    }
  }

  if (!best || bestDist > HIT + 6) return null
  return best
}

export function DotsAndBoxesBoard({
  state,
  players,
  currentPlayerId,
  disabled,
  onLine,
}: Props) {
  const current = players.find((p) => p.id === currentPlayerId)
  const size = PAD * 2 + CELL * DAB_SIZE
  const [hover, setHover] = useState<Edge | null>(null)
  const [pending, setPending] = useState<string | null>(null)

  const boardSize = useMemo(() => size, [size])

  const toSvgPoint = (
    svg: SVGSVGElement,
    clientX: number,
    clientY: number,
  ) => {
    const pt = svg.createSVGPoint()
    pt.x = clientX
    pt.y = clientY
    const ctm = svg.getScreenCTM()
    if (!ctm) return null
    return pt.matrixTransform(ctm.inverse())
  }

  const handlePointer = (
    event: ReactPointerEvent<SVGSVGElement>,
    commit: boolean,
  ) => {
    if (disabled) return
    const svg = event.currentTarget
    const point = toSvgPoint(svg, event.clientX, event.clientY)
    if (!point) return
    const edge = nearestOpenEdge(state, point.x, point.y)
    setHover(edge)
    if (!commit || !edge) return
    if (pending) return
    setPending(edgeKey(edge))
    onLine(edge)
    // clear pending when parent state catches up
    window.setTimeout(() => setPending(null), 400)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-cream/80">
        <p className="font-playful text-caramel">
          {state.winnerId || state.isDraw
            ? 'Round over'
            : `${current?.nickname ?? 'Player'} — claim a line`}
        </p>
        <p>
          <span className="text-soft-blue">
            {players[0]?.nickname}: {state.scores[0]}
          </span>
          {' · '}
          <span className="text-caramel">
            {players[1]?.nickname}: {state.scores[1]}
          </span>
        </p>
      </div>

      <svg
        viewBox={`0 0 ${boardSize} ${boardSize}`}
        className="mx-auto w-full max-w-sm touch-manipulation select-none"
        role="group"
        aria-label="Dots and Boxes board"
        onPointerMove={(e) => handlePointer(e, false)}
        onPointerLeave={() => setHover(null)}
        onPointerUp={(e) => {
          e.preventDefault()
          handlePointer(e, true)
        }}
      >
        {state.boxes.map((row, r) =>
          row.map((owner, c) =>
            owner === null ? null : (
              <rect
                key={`b-${r}-${c}`}
                x={PAD + c * CELL + 4}
                y={PAD + r * CELL + 4}
                width={CELL - 8}
                height={CELL - 8}
                fill={BOX_COLORS[owner]}
                rx={10}
                pointerEvents="none"
              />
            ),
          ),
        )}

        {/* claimed lines */}
        {state.hLines.map((row, r) =>
          row.map((taken, c) =>
            taken ? (
              <line
                key={`h-${r}-${c}`}
                x1={PAD + c * CELL}
                y1={PAD + r * CELL}
                x2={PAD + c * CELL + CELL}
                y2={PAD + r * CELL}
                stroke="#D58C55"
                strokeWidth={6}
                strokeLinecap="round"
                pointerEvents="none"
              />
            ) : null,
          ),
        )}
        {state.vLines.map((row, r) =>
          row.map((taken, c) =>
            taken ? (
              <line
                key={`v-${r}-${c}`}
                x1={PAD + c * CELL}
                y1={PAD + r * CELL}
                x2={PAD + c * CELL}
                y2={PAD + r * CELL + CELL}
                stroke="#B9C9D0"
                strokeWidth={6}
                strokeLinecap="round"
                pointerEvents="none"
              />
            ) : null,
          ),
        )}

        {/* hover / pending preview on the exact edge */}
        {hover && !isTaken(state, hover) ? (
          <line
            x1={
              hover.type === 'h'
                ? PAD + hover.col * CELL
                : PAD + hover.col * CELL
            }
            y1={
              hover.type === 'h'
                ? PAD + hover.row * CELL
                : PAD + hover.row * CELL
            }
            x2={
              hover.type === 'h'
                ? PAD + hover.col * CELL + CELL
                : PAD + hover.col * CELL
            }
            y2={
              hover.type === 'h'
                ? PAD + hover.row * CELL
                : PAD + hover.row * CELL + CELL
            }
            stroke="rgba(243,232,213,0.55)"
            strokeWidth={5}
            strokeLinecap="round"
            pointerEvents="none"
          />
        ) : null}

        {Array.from({ length: DAB_SIZE + 1 }).map((_, r) =>
          Array.from({ length: DAB_SIZE + 1 }).map((_, c) => (
            <circle
              key={`d-${r}-${c}`}
              cx={PAD + c * CELL}
              cy={PAD + r * CELL}
              r={5.5}
              fill="#F3E8D5"
              pointerEvents="none"
            />
          )),
        )}
      </svg>
    </div>
  )
}
