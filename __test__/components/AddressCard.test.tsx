import { mockAddress } from '@/__mocks__/Address.mock'
import { mockUser } from '@/__mocks__/users.mock'
import AddressCard from '@/components/AddressCard'
import { useSession } from '@/lib/auth/auth-client'
import { IShippingAddress } from '@/lib/types'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mockSession = useSession as jest.Mock
const mockHandleEditOpen = jest.fn()
const mockDelete = jest.fn()

const address = { ...mockAddress } as unknown as IShippingAddress

jest.mock('@/lib/auth/auth-client', () => ({
  useSession: jest.fn(),
}))

describe('Address card component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockSession.mockReturnValue({
      data: { user: mockUser },
      pending: false,
    })
  })

  it('should render the AddressCard component', () => {
    render(
      <AddressCard
        address={address}
        handleEditModalOpen={mockHandleEditOpen}
        handleDelete={mockDelete}
      />,
    )

    expect(useSession).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('heading', { name: /deliver to/i })).toBeInTheDocument()
  })

  it('should not render if address is not passed', () => {
    render(
      <AddressCard
        address={undefined}
        handleEditModalOpen={mockHandleEditOpen}
        handleDelete={mockDelete}
      />,
    )
    expect(useSession).toHaveBeenCalled()
    expect(screen.queryByRole('heading', { name: /deliver to/i })).not.toBeInTheDocument()
  })

  it('should have cyan-gradient class for default address', () => {
    render(
      <AddressCard
        address={address}
        handleEditModalOpen={mockHandleEditOpen}
        handleDelete={mockDelete}
      />,
    )
    expect(useSession).toHaveBeenCalled()
    expect(screen.getByTestId('main-container')).toHaveClass('card-gradient-cyan-magenta')
  })

  it('should have card-base class for non default addresses', () => {
    mockSession.mockReturnValue({
      data: { user: { ...mockUser, defaultAddress: '2' } },
      pending: false,
    })
    render(
      <AddressCard
        address={address}
        handleEditModalOpen={mockHandleEditOpen}
        handleDelete={mockDelete}
      />,
    )
    expect(useSession).toHaveBeenCalled()
    expect(screen.getByTestId('main-container')).toHaveClass('card-base')
  })

  it('calls handleEditModalOpen with the address ID when edit button is clicked', async () => {
    const user = userEvent.setup()

    render(
      <AddressCard
        address={address}
        handleEditModalOpen={mockHandleEditOpen}
        handleDelete={mockDelete}
      />,
    )

    const editButton = screen.getByRole('button', { name: /edit address/i })

    await user.click(editButton)
    expect(editButton).toBeInTheDocument()

    expect(mockHandleEditOpen).toHaveBeenCalledTimes(1)
    expect(mockHandleEditOpen).toHaveBeenCalledWith('1')
    expect(mockDelete).not.toHaveBeenCalledWith()
  })

  it('calls handleDelete with the address ID when delete button is clicked', async () => {
    const user = userEvent.setup()

    render(
      <AddressCard
        address={address}
        handleEditModalOpen={mockHandleEditOpen}
        handleDelete={mockDelete}
      />,
    )

    const deleteButton = screen.getByRole('button', { name: /delete address/i })
    expect(deleteButton).toBeInTheDocument()
    await user.click(deleteButton)

    expect(mockDelete).toHaveBeenCalledTimes(1)
    expect(mockDelete).toHaveBeenCalledWith('1')
    expect(mockHandleEditOpen).not.toHaveBeenCalledWith()
  })
})
