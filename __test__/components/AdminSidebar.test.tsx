import AdminSideBar from '@/components/AdminSideBar'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mockSetView = jest.fn()

describe('Admin sidebar cmoponent', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    render(
      <AdminSideBar
        mainView='order'
        setView={mockSetView}
      />,
    )
  })
  it('should render the admin sidebar component', () => {
    expect(screen.getByText(/orders list/i)).toBeInTheDocument()
    expect(screen.getByText(/users list/i)).toBeInTheDocument()
    expect(screen.getByText(/products list/i)).toBeInTheDocument()
  })

  it('mainview should have class "bg-gray-400"', () => {
    expect(screen.getByTestId('order-link')).toHaveClass('bg-gray-400')
    expect(screen.getByTestId('users-link')).not.toHaveClass('bg-gray-400')
    expect(screen.getByTestId('products-link')).not.toHaveClass('bg-gray-400')
  })

  it('mainview should change when link to another view is clicked have class "bg-gray-400"', async () => {
    const user = userEvent.setup()
    expect(screen.getByTestId('order-link')).toHaveClass('bg-gray-400')
    expect(screen.getByTestId('users-link')).not.toHaveClass('bg-gray-400')
    expect(screen.getByTestId('products-link')).not.toHaveClass('bg-gray-400')

    const usersViewLink = screen.getByTestId('users-link')
    await user.click(usersViewLink)

    expect(mockSetView).toHaveBeenCalledTimes(1)
  })
})
