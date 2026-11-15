import ProductNotFound from '@/app/(store pages)/product/[...all]/not-found'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'

const mockBack = jest.fn()
const mockRouter = useRouter as jest.Mock

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

describe('Product details page not found', () => {
  beforeEach(() => {
    mockRouter.mockReturnValue({ back: mockBack })
    jest.clearAllMocks()
  })

  it('should render not found page', () => {
    render(<ProductNotFound />)

    expect(screen.getByText('PRODUCT NOT FOUND')).toBeVisible()
  })

  it('should navigate back to the previous page when go back button is clicked', async () => {
    const user = userEvent.setup()
    render(<ProductNotFound />)

    const goBackButton = screen.getByRole('button', { name: /go back/i })
    expect(goBackButton).toBeInTheDocument()

    await user.click(goBackButton)

    expect(mockBack).toHaveBeenCalledTimes(1)
  })

  it('should navigate to home when "Back Home" is clicked', () => {
    render(<ProductNotFound />)

    const goHome = screen.getByRole('link', { name: /back home/i })
    expect(goHome).toHaveAttribute('href', '/')
  })

  it('should navigate to products list page when "Explore cubes" is clicked', () => {
    render(<ProductNotFound />)

    const goHome = screen.getByRole('link', { name: /explore cubes/i })
    expect(goHome).toHaveAttribute('href', '/products')
  })
})
