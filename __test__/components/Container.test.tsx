import Container from '@/components/Container'
import { render, screen } from '@testing-library/react'

describe('Container', () => {
  it('renders its children', () => {
    render(
      <Container>
        <p>Inside the container</p>
      </Container>,
    )

    expect(screen.getByText('Inside the container')).toBeInTheDocument()
  })

  it('does not render a heading when no header is given', () => {
    render(
      <Container>
        <p>Content</p>
      </Container>,
    )

    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })

  it('renders the header', () => {
    render(
      <Container header='Best sellers'>
        <p>Content</p>
      </Container>,
    )

    expect(screen.getByRole('heading', { name: 'Best sellers' })).toBeInTheDocument()
  })

  it('renders a "See More" link when seeMore is provided', () => {
    render(
      <Container
        header='Best sellers'
        seeMore='/products?sort_by=best'
      >
        <p>Content</p>
      </Container>,
    )

    expect(screen.getByRole('link', { name: 'See More' })).toHaveAttribute('href', '/products?sort_by=best')
  })

  it('does not render a "See More" link by default', () => {
    render(
      <Container header='Best sellers'>
        <p>Content</p>
      </Container>,
    )

    expect(screen.queryByRole('link', { name: 'See More' })).not.toBeInTheDocument()
  })
})
