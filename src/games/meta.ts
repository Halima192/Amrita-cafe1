import type { GameId, GameMeta } from './types'

export const GAMES: GameMeta[] = [
  {
    id: 'tic-tac-toe',
    title: 'Tic Tac Toe',
    blurb: 'Quick rounds across the table.',
    tagline: 'Get 3 in a row!',
    accent: '#C4A574',
    cover: '/images/games/tic-tac-toe.jpg',
    minPlayers: 2,
    maxPlayers: 2,
    playersLabel: '2 Players',
    paceLabel: 'Quick Play',
  },
  {
    id: 'never-have-i-ever',
    title: 'Never Have I Ever',
    blurb: 'Gen Z prompts — most “I have” answers wins.',
    tagline: 'Most I have points wins!',
    accent: '#E8A05A',
    cover: '/images/games/never-have-i-ever.jpg',
    minPlayers: 2,
    maxPlayers: 6,
    playersLabel: '2+ Players',
    paceLabel: 'Party Play',
  },
  {
    id: 'dots-and-boxes',
    title: 'Dots & Boxes',
    blurb: 'Claim lines. Own the square.',
    tagline: 'Claim the square!',
    accent: '#B9C9D0',
    cover: '/images/games/dots-and-boxes.jpg',
    minPlayers: 2,
    maxPlayers: 2,
    playersLabel: '2 Players',
    paceLabel: 'Quick Play',
  },
  {
    id: 'would-you-rather',
    title: 'Would You Rather?',
    blurb: 'Silly choices. Real laughs.',
    tagline: 'Pick one and laugh!',
    accent: '#E0A878',
    cover: '/images/games/would-you-rather.jpg',
    minPlayers: 2,
    maxPlayers: 6,
    playersLabel: '2+ Players',
    paceLabel: 'Party Play',
  },
]

export function getGameMeta(id: GameId): GameMeta {
  const meta = GAMES.find((g) => g.id === id)
  if (!meta) throw new Error(`Unknown game: ${id}`)
  return meta
}
