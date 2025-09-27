import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Header } from '../Header'

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('Header', () => {
  it('renders logo and navigation correctly', () => {
    renderWithRouter(<Header />)

    expect(screen.getByText('Iwanna')).toBeInTheDocument()
    expect(screen.getByText('Главная')).toBeInTheDocument()
    expect(screen.getByText('СПА комплексы')).toBeInTheDocument()
  })

  it('has correct navigation links', () => {
    renderWithRouter(<Header />)

    const homeLink = screen.getByRole('link', { name: /главная/i })
    const catalogLink = screen.getByRole('link', { name: /спа комплексы/i })

    expect(homeLink).toHaveAttribute('href', '/')
    expect(catalogLink).toHaveAttribute('href', '/catalog/')
  })

  it('displays logo with icon', () => {
    renderWithRouter(<Header />)

    const logoLink = screen.getByRole('link', { name: /iwanna/i })
    expect(logoLink).toBeInTheDocument()
  })
})


