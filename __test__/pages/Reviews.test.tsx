import ReviewsPage from '@/app/(user pages)/reviews/page'
import { render, screen } from '@testing-library/react'

jest.mock('@/components/CommingSoon', () => ({
  __esModule: true,
  default: () => <div data-testid='comming-soon' />,
}))

describe('Reviews page', () => {
  it('should render reviews page and comming soon banner', () => {
    render(<ReviewsPage />)

    expect(screen.getByTestId('comming-soon')).toBeInTheDocument()
  })
})
