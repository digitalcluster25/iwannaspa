import { render, screen } from '@testing-library/react'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import { AuthPage } from '../AuthPage'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('AuthPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders login form when not authenticated', () => {
    localStorageMock.getItem.mockReturnValue(null)

    render(
      <BrowserRouter>
        <AuthPage />
      </BrowserRouter>
    )

    expect(screen.getByText('Login to your account')).toBeInTheDocument()
  })

  it('redirects to admin when authenticated', () => {
    localStorageMock.getItem.mockReturnValue('true')

    render(
      <MemoryRouter initialEntries={['/auth']}>
        <AuthPage />
      </MemoryRouter>
    )

    // Should redirect, so login form should not be visible
    expect(screen.queryByText('Login to your account')).not.toBeInTheDocument()
  })

  it('redirects to correct path from location state', () => {
    localStorageMock.getItem.mockReturnValue('true')

    render(
      <MemoryRouter initialEntries={['/auth']} initialIndex={0}>
        <AuthPage />
      </MemoryRouter>
    )

    // Should redirect to /adminko by default
    expect(screen.queryByText('Login to your account')).not.toBeInTheDocument()
  })
})


