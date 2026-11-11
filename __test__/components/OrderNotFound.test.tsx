import OrderNotFound from '@/components/OrderNotFound'
import { render, screen } from '@testing-library/react'
import { usePathname } from 'next/navigation'

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}))

describe('OrderNotFound', () => {
  it('says the order was not found on a regular order page', () => {
    jest.mocked(usePathname).mockReturnValue('/orders/123')

    render(<OrderNotFound />)

    expect(screen.getByText('Order Not Found')).toBeInTheDocument()
  })

  it('says there are no completed orders on the admin user-orders page', () => {
    jest.mocked(usePathname).mockReturnValue('/admin/user-orders/123')

    render(<OrderNotFound />)

    expect(screen.getByText('No Orders completed yet!')).toBeInTheDocument()
    expect(screen.queryByText('Order Not Found')).not.toBeInTheDocument()
  })
})
