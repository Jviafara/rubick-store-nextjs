import NotFound from '@/app/not-found'
import { render, screen } from '@testing-library/react'

describe('Not found root page', () => {
  it('renders the Not Found', () => {
    render(<NotFound />)

    expect(screen.getByText('Page not found!')).toBeInTheDocument()
    expect(screen.getByText('Home Page')).toBeInTheDocument()
  })

  it('links to the home page', () => {
    render(<NotFound />)
    expect(screen.getByRole('link', { name: /home page/i })).toHaveAttribute('href', '/')
  })
})
