import EmptyBanner from '@/components/EmptyBanner'
import { render, screen } from '@testing-library/react'
import { FaHeart } from 'react-icons/fa'

describe('EmptyBanner', () => {
  beforeEach(() => {
    render(
      <EmptyBanner
        header='Favorites'
        Icon={FaHeart}
      />,
    )
  })

  it('shows the header label', () => {
    expect(screen.getByText('Favorites')).toBeInTheDocument()
  })

  it('explains that there is nothing here yet', () => {
    expect(screen.getByRole('heading', { level: 2, name: 'Nothing here yet' })).toBeInTheDocument()
  })

  it('links to the products page', () => {
    expect(screen.getByRole('link', { name: /shop cubes/i })).toHaveAttribute('href', '/products')
  })

  it('mentions the free shipping threshold', () => {
    expect(screen.getByText(/free shipping on orders over \$100/i)).toBeInTheDocument()
  })
})
