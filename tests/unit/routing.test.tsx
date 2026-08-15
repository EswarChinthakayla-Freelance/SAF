import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { useAuthStore } from '@/stores/authStore'
import { ScrollToTop } from '@/components/common/ScrollToTop'

describe('Router & ProtectedRoute Architecture', () => {
  beforeEach(() => {
    useAuthStore.getState().reset()
  })

  it('renders loading state while auth session is initializing', () => {
    useAuthStore.setState({ isInitialized: false, isLoading: true })

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <ProtectedRoute>
          <div>Protected ACP Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    )

    expect(screen.getByText(/verifying authorization/i)).toBeDefined()
    expect(screen.queryByText('Protected ACP Content')).toBeNull()
  })

  it('redirects to /admin/login when user is unauthenticated', () => {
    useAuthStore.setState({ isInitialized: true, isLoading: false, user: null, isAdmin: false })

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <div>Protected ACP Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/admin/login" element={<div>Admin Login Screen</div>} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.queryByText('Protected ACP Content')).toBeNull()
    expect(screen.getByText('Admin Login Screen')).toBeDefined()
  })

  it('redirects to /admin/login when user is authenticated but not in admin_profiles (non-admin)', () => {
    useAuthStore.setState({
      isInitialized: true,
      isLoading: false,
      user: { id: 'user-123', email: 'patron@example.com' } as any,
      adminProfile: null,
      isAdmin: false,
    })

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <div>Protected ACP Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/admin/login" element={<div>Admin Login Screen</div>} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.queryByText('Protected ACP Content')).toBeNull()
    expect(screen.getByText('Admin Login Screen')).toBeDefined()
  })

  it('renders children when authenticated user is an authorized administrator', () => {
    useAuthStore.setState({
      isInitialized: true,
      isLoading: false,
      user: { id: 'admin-123', email: 'srianjaneyafurnitures@gmail.com' } as any,
      adminProfile: { id: 'admin-123', display_name: 'Master Craftsman' } as any,
      isAdmin: true,
    })

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <ProtectedRoute>
          <div>Protected ACP Workspace</div>
        </ProtectedRoute>
      </MemoryRouter>
    )

    expect(screen.getByText('Protected ACP Workspace')).toBeDefined()
  })

  it('ScrollToTop resets scroll on route change without throwing', () => {
    const scrollToSpy = vi.fn()
    window.scrollTo = scrollToSpy

    render(
      <MemoryRouter initialEntries={['/']}>
        <ScrollToTop />
      </MemoryRouter>
    )

    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'instant' })
  })
})
