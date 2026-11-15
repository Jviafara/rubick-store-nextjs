import OrderDetailsPage from '@/app/(store pages)/orders/[id]/page'
import { render, screen } from '@testing-library/react'
import { useParams } from 'next/navigation'

const mockUseParams = useParams as jest.Mock

jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
}))

jest.mock('@/components/OrderReview', () => ({
  __esModule: true,
  default: () => <div data-testid='order-review' />,
}))

describe('Order details page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render order details page', () => {
    mockUseParams.mockReturnValue({ id: 'order_1' })

    render(<OrderDetailsPage />)
    expect(screen.getByRole('heading', { name: /order/i }))
  })

  it('should navigate to order list after clicking back to orders link', () => {
    mockUseParams.mockReturnValue({ id: 'order_1' })

    render(<OrderDetailsPage />)
    expect(screen.getByRole('link', { name: /Back to orders/i })).toHaveAttribute('href', '/profile?tab=orders')
  })

  
})
