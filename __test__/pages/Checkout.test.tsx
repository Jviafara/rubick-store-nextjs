import CheckoutPage from '@/app/(store pages)/checkout/page'
import { render, screen } from '@testing-library/react'
import { useSearchParams } from 'next/navigation'

const mockDispatch = jest.fn()
const mockSPGet = jest.fn()
const mockSearchParams = useSearchParams as jest.Mock

jest.mock('@/lib/hooks/redux.hooks', () => ({
  useAppSelector: jest.fn(),
  useAppDispatch: () => mockDispatch,
}))

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}))

mockSearchParams.mockReturnValue({
  get: mockSPGet,
})

jest.mock('@/components/CheckoutSteps', () => ({
  __esModule: true,
  default: () => <div data-testid='checkout-steps' />,
}))

jest.mock('@/components/ShippingStep', () => ({
  __esModule: true,
  default: () => <div data-testid='shipping-step' />,
}))

jest.mock('@/components/PaymentStep', () => ({
  __esModule: true,
  default: () => <div data-testid='payment-step' />,
}))

jest.mock('@/components/OrderReview', () => ({
  __esModule: true,
  default: () => <div data-testid='order-review' />,
}))

describe('Checkout page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render the checkout page', () => {
    render(<CheckoutPage />)
    expect(screen.getAllByRole('heading', { name: /checkout/i }))
  })

  it('should render shipping step when searchParam is "1"', () => {
    mockSPGet.mockReturnValue('1')
    render(<CheckoutPage />)

    expect(screen.getByTestId('shipping-step')).toBeInTheDocument()
    expect(screen.queryByTestId('payment-step')).not.toBeInTheDocument()
    expect(screen.queryByTestId('order-review')).not.toBeInTheDocument()
  })

  it('should render payment step when searchParam is "2"', () => {
    mockSPGet.mockReturnValue('2')
    render(<CheckoutPage />)

    expect(screen.getByTestId('payment-step')).toBeInTheDocument()
    expect(screen.queryByTestId('shipping-step')).not.toBeInTheDocument()
    expect(screen.queryByTestId('order-review')).not.toBeInTheDocument()
  })

  it('should render order review when searchParam is "3"', () => {
    mockSPGet.mockReturnValue('3')
    render(<CheckoutPage />)

    expect(screen.getByTestId('order-review')).toBeInTheDocument()
    expect(screen.queryByTestId('shipping-step')).not.toBeInTheDocument()
    expect(screen.queryByTestId('payment-step')).not.toBeInTheDocument()
  })

  test.each([
    ['1', 'shipping-step'],
    ['2', 'payment-step'],
    ['3', 'order-review'],
  ])('renders the correct component when step searchParam is "%s"', (stepValue, expectedTestId) => {
    mockSPGet.mockImplementation(key => {
      if (key === 'step') return stepValue
      return null
    })

    render(<CheckoutPage />)

    // Assert that the appropriate step component rendered
    expect(screen.getByTestId(expectedTestId)).toBeInTheDocument()
  })
})
