import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { LoginForm } from '../login-form'

// Mock useNavigate
const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

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

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.setItem.mockClear()
  })

  it('renders login form correctly', () => {
    renderWithRouter(<LoginForm />)

    expect(screen.getByText('Login to your account')).toBeInTheDocument()
    expect(
      screen.getByText('Enter your email below to login to your account')
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /login with google/i })
    ).toBeInTheDocument()
  })

  it('shows demo access information', () => {
    renderWithRouter(<LoginForm />)

    expect(screen.getByText('Демо доступ:')).toBeInTheDocument()
    expect(screen.getByText('admin@iwanna.com')).toBeInTheDocument()
    expect(screen.getByText('admin123')).toBeInTheDocument()
  })

  it('handles form submission with correct credentials', async () => {
    renderWithRouter(<LoginForm />)

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: 'Login' })

    fireEvent.change(emailInput, { target: { value: 'admin@iwanna.com' } })
    fireEvent.change(passwordInput, { target: { value: 'admin123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'isAuthenticated',
        'true'
      )
      expect(mockNavigate).toHaveBeenCalledWith('/adminko')
    })
  })

  it('shows error for incorrect credentials', async () => {
    renderWithRouter(<LoginForm />)

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: 'Login' })

    fireEvent.change(emailInput, { target: { value: 'wrong@email.com' } })
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Неверные учетные данные')).toBeInTheDocument()
    })
  })

  it('validates required fields', async () => {
    renderWithRouter(<LoginForm />)

    const submitButton = screen.getByRole('button', { name: 'Login' })
    fireEvent.click(submitButton)

    await waitFor(
      () => {
        expect(screen.getByText('Неверные учетные данные')).toBeInTheDocument()
      },
      { timeout: 2000 }
    )
  })

  it('shows loading state during submission', async () => {
    renderWithRouter(<LoginForm />)

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: 'Login' })

    fireEvent.change(emailInput, { target: { value: 'admin@iwanna.com' } })
    fireEvent.change(passwordInput, { target: { value: 'admin123' } })
    fireEvent.click(submitButton)

    // Проверяем, что кнопка становится disabled во время загрузки
    await waitFor(() => {
      expect(submitButton).toBeDisabled()
    })
  })
})
