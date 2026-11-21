import { mockAddressList } from '@/__mocks__/Address.mock'
import { mockUser } from '@/__mocks__/users.mock'
import AdressesSlider from '@/components/AdressesSlider'
import { useSession } from '@/lib/auth/auth-client'
import { AddressApi } from '@/lib/modules/addressApiClient'
import { render, screen } from '@testing-library/react'
import { toast } from 'react-toastify'
import { IShippingAddress } from '../../lib/types'
import userEvent from '@testing-library/user-event'
import { setModalService } from '@/lib/redux/features/modalSlice'
import { ModalPositions } from '@/lib/constants'

const mockSession = useSession as jest.Mock
const mockRefetch = jest.fn()
const mockAdressesList = AddressApi.list as unknown as jest.Mock
const mockAdressesDelete = AddressApi.delete as unknown as jest.Mock
const mockDispatch = jest.fn()

jest.mock('@/lib/auth/auth-client', () => ({
  useSession: jest.fn(),
}))

jest.mock('@/lib/hooks/redux.hooks', () => ({
  useAppDispatch: () => mockDispatch,
}))

jest.mock('@/lib/modules/addressApiClient', () => ({
  AddressApi: {
    list: jest.fn(),
    delete: jest.fn(),
  },
}))

jest.mock('@/components/AutoSwiper', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid='auto-swiper'>{children}</div>,
}))

jest.mock('@/components/AddressForm', () => ({
  __esModule: true,
  default: () => <div data-testid='address-form' />,
}))

jest.mock('@/components/AddressCard', () => ({
  __esModule: true,
  default: ({
    address,
    handleEditModalOpen,
    handleDelete,
  }: {
    address?: IShippingAddress
    handleEditModalOpen: (addressId: string) => void
    handleDelete: (addressId: string) => void
  }) => (
    <div data-testid='address-card'>
      <button onClick={() => handleEditModalOpen(address?._id.toString() || '')}>edit</button>
      <button onClick={() => handleDelete(address?._id.toString() || '')}>delete</button>
    </div>
  ),
}))

jest.mock('swiper/react', () => ({
  SwiperSlide: ({ children }: { children: React.ReactNode }) => <div data-testid='swiper-slide'>{children}</div>,
}))

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

describe('Addresses slider component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockSession.mockReturnValue({
      data: { user: mockUser },
      refetch: mockRefetch,
    })
    mockAdressesList.mockResolvedValue({ res: mockAddressList, error: undefined })
  })

  it('should render the addresses slider component', async () => {
    render(<AdressesSlider />)
    expect(screen.getByRole('button', { name: /add address/i })).toBeInTheDocument()
    await expect(screen.findAllByTestId('address-card')).resolves.toHaveLength(2)
  })

  it('should show error toast if get addresses fails', async () => {
    mockAdressesList.mockResolvedValue({ res: { status: 404, message: 'Not found' }, error: undefined })
    render(<AdressesSlider />)
    await expect(screen.findByRole('button', { name: /add address/i })).resolves.toBeInTheDocument()
    expect(toast.error).toHaveBeenCalledWith('Not found')
  })

  it('should open empty modal address form', async () => {
    const user = userEvent.setup()
    render(<AdressesSlider />)

    const addAddressButton = await screen.findByRole('button', { name: /add address/i })
    await user.click(addAddressButton)
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: setModalService.type,
        payload: expect.objectContaining({
          modalOpen: true,
          header: 'Create address.',
          icon: undefined,
          position: ModalPositions.center,
          children: expect.objectContaining({
            props: expect.objectContaining({
              onSuccess: expect.any(Function),
            }),
          }),
        }),
      }),
    )
  })

  it('should open modal address form with address data', async () => {
    const user = userEvent.setup()
    render(<AdressesSlider />)

    const editAddressButtons = await screen.findAllByRole('button', { name: /edit/i })
    await user.click(editAddressButtons[0])

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: setModalService.type,
        payload: expect.objectContaining({
          modalOpen: true,
          header: 'Edit address.',
          icon: undefined,
          position: ModalPositions.center,
          children: expect.objectContaining({
            props: expect.objectContaining({
              addressId: '1',
              onSuccess: expect.any(Function),
            }),
          }),
        }),
      }),
    )
  })

  it('should delete address and refetch session', async () => {
    const user = userEvent.setup()

    mockAdressesDelete.mockResolvedValue({ res: mockAddressList, error: undefined })
    render(<AdressesSlider />)

    const deleteAddressButtons = await screen.findAllByRole('button', { name: /delete/i })
    await user.click(deleteAddressButtons[0])

    expect(mockAdressesDelete).toHaveBeenCalledTimes(1)
    expect(mockRefetch).toHaveBeenCalledTimes(1)
  })

  it('should show error toas when delete address fails and then refetch session', async () => {
    const user = userEvent.setup()

    mockAdressesDelete.mockResolvedValue({ res: { status: 404, message: 'Not found' }, error: undefined })
    render(<AdressesSlider />)

    const deleteAddressButtons = await screen.findAllByRole('button', { name: /delete/i })
    await user.click(deleteAddressButtons[0])

    expect(mockAdressesDelete).toHaveBeenCalledTimes(1)
    expect(toast.error).toHaveBeenCalledWith('Not found')
    expect(mockRefetch).toHaveBeenCalledTimes(1)
  })
})
