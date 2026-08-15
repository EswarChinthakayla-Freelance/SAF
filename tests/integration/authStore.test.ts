import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from '@/stores/authStore'

describe('authStore state management', () => {
  beforeEach(() => {
    useAuthStore.getState().reset()
  })

  it('initializes with default unauthenticated state', () => {
    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.session).toBeNull()
    expect(state.isAdmin).toBe(false)
  })

  it('updates state upon setting authenticated session and admin profile', () => {
    const mockUser = {
      id: 'usr-12345',
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: '2026-01-01',
    }
    const mockProfile = {
      id: 'usr-12345',
      display_name: 'Sri Anjaneya Furnitures Admin',
      avatar_url: null,
      created_at: '2026-01-01',
      updated_at: '2026-01-01',
    }

    const mockSession = {
      user: mockUser,
      access_token: 'mock-token',
      refresh_token: 'mock-refresh',
    }

    useAuthStore.getState().setSession(mockSession as any, mockProfile)

    const updated = useAuthStore.getState()
    expect(updated.user?.id).toBe('usr-12345')
    expect(updated.isAdmin).toBe(true)
    expect(updated.adminProfile?.display_name).toBe('Sri Anjaneya Furnitures Admin')
  })
})
