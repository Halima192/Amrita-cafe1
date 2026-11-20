import { isSupabaseConfigured } from '../../lib/supabase'
import type { RoomTransport } from '../types'
import { createLocalTransport } from './localTransport'
import { createSupabaseTransport } from './supabaseTransport'

/** Uses Supabase when env keys exist; otherwise local same-device play. */
export function createRoomTransport(): RoomTransport {
  if (isSupabaseConfigured) {
    return createSupabaseTransport()
  }
  return createLocalTransport()
}

export { createLocalTransport } from './localTransport'
export { createSupabaseTransport } from './supabaseTransport'
export { isSupabaseConfigured } from '../../lib/supabase'
