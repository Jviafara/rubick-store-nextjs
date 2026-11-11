import Ratings from '@/components/Ratings'
import { render, screen } from '@testing-library/react'

// react-icons renders `size` as the svg width: full star = 14, half star = 12, empty star = 10.
const countStars = (container: HTMLElement) => ({
  full: container.querySelectorAll('svg[width="14"]').length,
  half: container.querySelectorAll('svg[width="12"]').length,
  empty: container.querySelectorAll('svg[width="10"]').length,
})

describe('Ratings', () => {
  it('shows the number of reviews, the rating and the items sold', () => {
    render(
      <Ratings
        rating={4.5}
        numReviews={12}
        totalSold={100}
      />,
    )

    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('(4.5)')).toBeInTheDocument()
    expect(screen.getByText('100 items sold!')).toBeInTheDocument()
  })

  it('caps the review count at 999+', () => {
    render(
      <Ratings
        rating={4}
        numReviews={1500}
        totalSold={10}
      />,
    )

    expect(screen.getByText('999+')).toBeInTheDocument()
    expect(screen.queryByText('1500')).not.toBeInTheDocument()
  })

  it('always renders five stars', () => {
    const { container } = render(
      <Ratings
        rating={3}
        numReviews={1}
        totalSold={1}
      />,
    )

    expect(container.querySelectorAll('svg')).toHaveLength(5)
  })

  it.each([
    [5, { full: 5, half: 0, empty: 0 }],
    [4.5, { full: 4, half: 1, empty: 0 }],
    [3.5, { full: 3, half: 1, empty: 1 }],
    [2, { full: 2, half: 0, empty: 3 }],
    [0.5, { full: 0, half: 1, empty: 4 }],
    [0, { full: 0, half: 0, empty: 5 }],
  ])('draws the right stars for a rating of %p', (rating, expected) => {
    const { container } = render(
      <Ratings
        rating={rating}
        numReviews={1}
        totalSold={1}
      />,
    )

    expect(countStars(container)).toEqual(expected)
  })

  it('highlights very low ratings in red', () => {
    const { container } = render(
      <Ratings
        rating={1}
        numReviews={1}
        totalSold={1}
      />,
    )

    expect(container.querySelector('.text-accent')).toHaveClass('text-red-500')
  })

  it('highlights excellent ratings with the primary color', () => {
    const { container } = render(
      <Ratings
        rating={4.5}
        numReviews={1}
        totalSold={1}
      />,
    )

    expect(container.querySelector('.text-accent')).toHaveClass('text-primary')
  })

  it('uses neither highlight for an average rating', () => {
    const { container } = render(
      <Ratings
        rating={3}
        numReviews={1}
        totalSold={1}
      />,
    )

    const stars = container.querySelector('.text-accent')
    expect(stars).not.toHaveClass('text-red-500')
    expect(stars).not.toHaveClass('text-primary')
  })
})
