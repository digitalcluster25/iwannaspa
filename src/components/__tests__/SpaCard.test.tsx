import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { SpaCard } from '../SpaCard'
import { mockSpas } from '../../data/mockData'

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('SpaCard', () => {
  const mockSpa = mockSpas[0]

  it('renders spa information correctly', () => {
    renderWithRouter(<SpaCard spa={mockSpa} />)

    expect(screen.getByText(mockSpa.name)).toBeInTheDocument()
    expect(screen.getByText(mockSpa.location)).toBeInTheDocument()
    expect(screen.getByText(mockSpa.description)).toBeInTheDocument()
  })

  it('displays category badge', () => {
    renderWithRouter(<SpaCard spa={mockSpa} />)

    expect(screen.getByText('Wellness')).toBeInTheDocument()
  })

  it('shows featured badge when spa is featured', () => {
    renderWithRouter(<SpaCard spa={mockSpa} />)

    if (mockSpa.featured) {
      expect(screen.getByText('Рекомендуем')).toBeInTheDocument()
    }
  })

  it('has correct link to spa details', () => {
    renderWithRouter(<SpaCard spa={mockSpa} />)

    const link = screen.getByRole('link', { name: /подробнее/i })
    expect(link).toHaveAttribute('href', `/spa/${mockSpa.id}`)
  })
})
