const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export function createRoomCode(length = 5): string {
  const bytes = crypto.getRandomValues(new Uint8Array(length))
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join('')
}

export function normalizeRoomCode(code: string): string {
  return code.trim().toUpperCase().replace(/[^A-Z0-9]/g, '')
}

export function createPlayerId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `p_${Math.random().toString(36).slice(2, 10)}`
}
