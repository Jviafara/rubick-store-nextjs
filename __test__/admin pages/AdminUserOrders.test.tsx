import UserOrders from '@/app/admin/user-orders/[id]/page'
import { render, screen } from '@testing-library/react'

jest.mock('@/components/OrdersTable', () => ({
  __esModule: true,
  default: () => <div data-testid='orders-table' />,
}))

describe('User order list (Admin view)', () => {
  it('should render order history', () => {
    render(<UserOrders />)
    expect(screen.getByRole('heading')).toHaveTextContent('Order History')
  })
})
