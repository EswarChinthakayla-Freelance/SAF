import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage'
import { AdminLoginForm } from '@/components/features/auth/AdminLoginForm'
import { useAuthStore } from '@/stores/authStore'
import * as useAuthModule from '@/hooks/useAuth'

describe('AdminLoginPage — "The Atelier Access Portal"', () => {
  beforeEach(() => {
    useAuthStore.getState().reset()
    vi.restoreAllMocks()
  })

  it('renders the complete Atelier architectural composition with brand, H1, fields, and security status', () => {
    useAuthStore.setState({ isInitialized: true, isLoading: false, user: null, isAdmin: false })

    render(
      <MemoryRouter initialEntries={['/admin/login']}>
        <AdminLoginPage />
      </MemoryRouter>
    )

    // 1. Single H1 heading
    const headings = screen.getAllByRole('heading', { level: 1 })
    expect(headings).toHaveLength(1)
    expect(headings[0]).toHaveTextContent('Enter the Atelier')

    // 2. Visible labels for fields
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Password/i, { selector: 'input' })).toBeInTheDocument()

    // 3. Primary submit button
    expect(screen.getByRole('button', { name: /Enter Admin Studio/i })).toBeInTheDocument()

    // 4. Return to website link
    expect(screen.getByRole('link', { name: /Return to Sri Anjaneya Furnitures website/i })).toBeInTheDocument()

    // 5. Security status indicator
    expect(screen.getByText(/Secure administrative access/i)).toBeInTheDocument()
  })

  it('renders a branded loading skeleton while session is initializing', () => {
    useAuthStore.setState({ isInitialized: false, isLoading: true, user: null, isAdmin: false })

    render(
      <MemoryRouter initialEntries={['/admin/login']}>
        <AdminLoginPage />
      </MemoryRouter>
    )

    expect(screen.getByText(/Resolving atelier session.../i)).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /Enter the Atelier/i })).toBeNull()
  })

  it('redirects immediately if user is already authenticated as an authorized admin', () => {
    useAuthStore.setState({
      isInitialized: true,
      isLoading: false,
      user: { id: 'admin-1', email: 'admin@saf.com' } as any,
      adminProfile: { id: 'admin-1', role: 'admin' } as any,
      isAdmin: true,
    })

    render(
      <MemoryRouter initialEntries={['/admin/login']}>
        <Routes>
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<div>Admin Control Panel Workspace</div>} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.queryByText(/Enter the Atelier/i)).toBeNull()
    expect(screen.getByText('Admin Control Panel Workspace')).toBeInTheDocument()
  })

  it('toggles password visibility with accessible label and input type change', () => {
    useAuthStore.setState({ isInitialized: true, isLoading: false, user: null, isAdmin: false })

    render(
      <MemoryRouter>
        <AdminLoginForm />
      </MemoryRouter>
    )

    const passwordInput = screen.getByPlaceholderText('••••••••••••')
    expect(passwordInput).toHaveAttribute('type', 'password')

    const toggleButton = screen.getByRole('button', { name: /Show password/i })
    expect(toggleButton).toBeInTheDocument()

    // Click to reveal password
    fireEvent.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'text')
    expect(screen.getByRole('button', { name: /Hide password/i })).toBeInTheDocument()

    // Click to hide password
    fireEvent.click(screen.getByRole('button', { name: /Hide password/i }))
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('shows client-side validation errors when submitted empty and prevents signIn call', async () => {
    const mockSignIn = vi.fn()
    vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
      user: null,
      session: null,
      adminProfile: null,
      isAdmin: false,
      isLoading: false,
      isInitialized: true,
      error: null,
      signIn: mockSignIn,
      signOut: vi.fn(),
    })

    render(
      <MemoryRouter>
        <AdminLoginForm />
      </MemoryRouter>
    )

    const submitBtn = screen.getByRole('button', { name: /Enter Admin Studio/i })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(screen.getByText('Enter a valid email address.')).toBeInTheDocument()
      expect(screen.getByText('Enter your password.')).toBeInTheDocument()
    })

    expect(mockSignIn).not.toHaveBeenCalled()
  })

  it('handles invalid credentials with calm normalized error and keeps email', async () => {
    const mockSignIn = vi.fn().mockRejectedValue(new Error('Invalid login credentials'))
    vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
      user: null,
      session: null,
      adminProfile: null,
      isAdmin: false,
      isLoading: false,
      isInitialized: true,
      error: null,
      signIn: mockSignIn,
      signOut: vi.fn(),
    })

    render(
      <MemoryRouter>
        <AdminLoginForm />
      </MemoryRouter>
    )

    const emailInput = screen.getByPlaceholderText('admin@srianjaneyafurnitures.com')
    const passwordInput = screen.getByPlaceholderText('••••••••••••')

    fireEvent.change(emailInput, { target: { value: 'admin@saf.com' } })
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })

    const submitBtn = screen.getByRole('button', { name: /Enter Admin Studio/i })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(
        screen.getByText("We couldn't verify those credentials. Check the email and password and try again.")
      ).toBeInTheDocument()
    })

    // Email is preserved in field
    expect(emailInput).toHaveValue('admin@saf.com')
  })

  it('handles network failure with appropriate descriptive error message', async () => {
    const mockSignIn = vi.fn().mockRejectedValue(new Error('Failed to fetch authentication endpoint'))
    vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
      user: null,
      session: null,
      adminProfile: null,
      isAdmin: false,
      isLoading: false,
      isInitialized: true,
      error: null,
      signIn: mockSignIn,
      signOut: vi.fn(),
    })

    render(
      <MemoryRouter>
        <AdminLoginForm />
      </MemoryRouter>
    )

    const emailInput = screen.getByPlaceholderText('admin@srianjaneyafurnitures.com')
    const passwordInput = screen.getByPlaceholderText('••••••••••••')

    fireEvent.change(emailInput, { target: { value: 'admin@saf.com' } })
    fireEvent.change(passwordInput, { target: { value: 'somepassword' } })

    fireEvent.click(screen.getByRole('button', { name: /Enter Admin Studio/i }))

    await waitFor(() => {
      expect(
        screen.getByText("We couldn't connect to the authentication service. Check your connection and try again.")
      ).toBeInTheDocument()
    })
  })

  it('handles non-admin authenticated user rejection gracefully', async () => {
    const mockSignIn = vi.fn().mockRejectedValue(
      new Error('Access denied. This account is not registered as an administrator.')
    )
    vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
      user: null,
      session: null,
      adminProfile: null,
      isAdmin: false,
      isLoading: false,
      isInitialized: true,
      error: null,
      signIn: mockSignIn,
      signOut: vi.fn(),
    })

    render(
      <MemoryRouter>
        <AdminLoginForm />
      </MemoryRouter>
    )

    const emailInput = screen.getByPlaceholderText('admin@srianjaneyafurnitures.com')
    const passwordInput = screen.getByPlaceholderText('••••••••••••')

    fireEvent.change(emailInput, { target: { value: 'patron@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'validuserpass' } })

    fireEvent.click(screen.getByRole('button', { name: /Enter Admin Studio/i }))

    await waitFor(() => {
      expect(
        screen.getByText('This account does not have administrative access.')
      ).toBeInTheDocument()
    })
  })

  it('executes successful sign in and invokes success callback', async () => {
    const mockSignIn = vi.fn().mockResolvedValue({
      user: { id: 'admin-1', email: 'admin@saf.com' },
      session: { access_token: 'xyz' },
      profile: { id: 'admin-1', role: 'admin' },
    })
    const mockSuccess = vi.fn()

    vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
      user: null,
      session: null,
      adminProfile: null,
      isAdmin: false,
      isLoading: false,
      isInitialized: true,
      error: null,
      signIn: mockSignIn,
      signOut: vi.fn(),
    })

    render(
      <MemoryRouter>
        <AdminLoginForm onSuccess={mockSuccess} />
      </MemoryRouter>
    )

    const emailInput = screen.getByPlaceholderText('admin@srianjaneyafurnitures.com')
    const passwordInput = screen.getByPlaceholderText('••••••••••••')

    fireEvent.change(emailInput, { target: { value: 'admin@saf.com' } })
    fireEvent.change(passwordInput, { target: { value: 'correctpassword' } })

    fireEvent.click(screen.getByRole('button', { name: /Enter Admin Studio/i }))

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('admin@saf.com', 'correctpassword')
      expect(mockSuccess).toHaveBeenCalled()
    })
  })
})
