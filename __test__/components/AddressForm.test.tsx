import { mockAddress } from '@/__mocks__/Address.mock'
import { mockUser } from '@/__mocks__/users.mock'
import AddressForm from '@/components/AddressForm'
import { authClient, useSession } from '@/lib/auth/auth-client'
import { AddressApi } from '@/lib/modules/addressApiClient'
import { userApi } from '@/lib/modules/userApiClient'
import { toogleModalService } from '@/lib/redux/features/modalSlice'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { toast } from 'react-toastify'

const mockDispatch = jest.fn()
const mockUseSession = useSession as jest.Mock
const mockAuthClientSession = authClient.useSession as jest.Mock
const mockRefetch = jest.fn()
const mockOnSuccess = jest.fn()
const mockCreateAddress = AddressApi.create as unknown as jest.Mock
const mockFindAddressById = AddressApi.byId as unknown as jest.Mock
const mockUpdateAddress = AddressApi.update as unknown as jest.Mock
const mockUpdateUser = userApi.update as unknown as jest.Mock

jest.mock('@/lib/auth/auth-client', () => ({
  useSession: jest.fn(),
  authClient: { useSession: jest.fn() },
}))

jest.mock('@/lib/hooks/redux.hooks', () => ({
  useAppDispatch: () => mockDispatch,
}))

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

jest.mock('@/lib/modules/addressApiClient', () => ({
  AddressApi: {
    create: jest.fn(),
    byId: jest.fn(),
    update: jest.fn(),
  },
}))

jest.mock('@/lib/modules/userApiClient', () => ({
  userApi: {
    update: jest.fn(),
  },
}))

describe('Address form component', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseSession.mockReturnValue({
      data: { user: mockUser },
      pending: false,
    })
    mockAuthClientSession.mockReturnValue({
      data: { user: mockUser },
      pending: false,
      error: null,
      refetch: mockRefetch,
    })
    mockFindAddressById.mockResolvedValue({
      res: mockAddress,
      error: undefined,
    })
    mockUpdateUser.mockResolvedValue({ res: mockUser, error: null })
    mockUpdateAddress.mockResolvedValue({ res: mockAddress, error: null })
    mockCreateAddress.mockResolvedValue({ res: mockAddress, error: null })
  })

  it('should render the AddressForm component', async () => {
    render(
      <AddressForm
        addressId=''
        onSuccess={mockOnSuccess}
      />,
    )

    expect(screen.getByLabelText('Full Name')).toBeInTheDocument()
  })

  it('should hydrate the AddressForm with address data', async () => {
    render(
      <AddressForm
        addressId='1'
        onSuccess={mockOnSuccess}
      />,
    )
    await waitFor(() => {
      expect(mockFindAddressById).toHaveBeenCalledWith('1')
      expect(screen.getByLabelText(/Full Name/i)).toHaveValue(mockAddress.name)
      expect(screen.getByLabelText(/Phone number/i)).toHaveValue(mockAddress.phone)
      expect(screen.getByLabelText(/address/i)).toHaveValue(mockAddress.address)
      expect(screen.getByLabelText(/city/i)).toHaveValue(mockAddress.city)
      expect(screen.getByLabelText(/country/i)).toHaveValue(mockAddress.country)
      expect(screen.getByLabelText(/postal code/i)).toHaveValue(mockAddress.postalCode)
    })
  })

  it('should hydrate the AddressForm whit empty values if the addres found is empty', async () => {
    mockFindAddressById.mockResolvedValue({
      res: {},
      error: undefined,
    })
    render(
      <AddressForm
        addressId='1'
        onSuccess={mockOnSuccess}
      />,
    )
    await waitFor(() => {
      expect(mockFindAddressById).toHaveBeenCalledWith('1')
      expect(screen.getByLabelText(/Full Name/i)).toHaveValue('')
      expect(screen.getByLabelText(/Phone number/i)).toHaveValue('')
      expect(screen.getByLabelText(/address/i)).toHaveValue('')
      expect(screen.getByLabelText(/city/i)).toHaveValue('')
      expect(screen.getByLabelText(/country/i)).toHaveValue('')
      expect(screen.getByLabelText(/postal code/i)).toHaveValue('')
    })
  })

  it('should not hydrate the AddressForm if the addres is not found', async () => {
    mockFindAddressById.mockResolvedValue({
      res: { status: 404, message: 'Not Found' },
      error: undefined,
    })
    render(
      <AddressForm
        addressId='1'
        onSuccess={mockOnSuccess}
      />,
    )
    await waitFor(() => {
      expect(mockFindAddressById).toHaveBeenCalledWith('1')
      expect(screen.getByLabelText(/Full Name/i)).toHaveValue('')
      expect(screen.getByLabelText(/Phone number/i)).toHaveValue('')
      expect(screen.getByLabelText(/address/i)).toHaveValue('')
      expect(screen.getByLabelText(/city/i)).toHaveValue('')
      expect(screen.getByLabelText(/country/i)).toHaveValue('')
      expect(screen.getByLabelText(/postal code/i)).toHaveValue('')
      expect(toast.error).toHaveBeenCalled()
    })
  })

  it('should not hydrate the AddressForm if an error occurred while fetching the address', async () => {
    mockFindAddressById.mockResolvedValue({
      res: { status: 500, message: 'Error' },
      error: new Error(),
    })
    render(
      <AddressForm
        addressId='1'
        onSuccess={mockOnSuccess}
      />,
    )
    await waitFor(() => {
      expect(mockFindAddressById).toHaveBeenCalledWith('1')
      expect(screen.getByLabelText(/Full Name/i)).toHaveValue('')
      expect(screen.getByLabelText(/Phone number/i)).toHaveValue('')
      expect(toast.error).toHaveBeenCalled()
    })
  })

  it('should update address if addressId is passed', async () => {
    render(
      <AddressForm
        addressId='1'
        onSuccess={mockOnSuccess}
      />,
    )
    const submitButton = screen.getByRole('button', { name: 'Save' })
    await user.click(submitButton)

    expect(mockOnSuccess).toHaveBeenCalledTimes(1)
    expect(mockUpdateAddress).toHaveBeenCalledTimes(1)
    expect(mockRefetch).toHaveBeenCalledTimes(1)
    expect(mockDispatch).toHaveBeenCalledWith(toogleModalService(false))
  })

  it('should show error toast if addres update fails', async () => {
    mockUpdateAddress.mockResolvedValue({ res: { status: 400, message: 'Error' }, error: null })
    render(
      <AddressForm
        addressId='1'
        onSuccess={mockOnSuccess}
      />,
    )
    const submitButton = screen.getByRole('button', { name: 'Save' })
    await user.click(submitButton)

    expect(mockUpdateAddress).toHaveBeenCalledTimes(1)
    expect(mockOnSuccess).toHaveBeenCalledTimes(1)
    expect(mockRefetch).toHaveBeenCalledTimes(1)
    expect(mockDispatch).toHaveBeenCalledWith(toogleModalService(false))
    expect(toast.error).toHaveBeenCalledWith('Error')
  })

  it('should show error toast if user update fails', async () => {
    mockUpdateUser.mockResolvedValue({ res: { status: 400, message: 'Error' }, error: null })
    render(
      <AddressForm
        addressId='1'
        onSuccess={mockOnSuccess}
      />,
    )
    const submitButton = screen.getByRole('button', { name: 'Save' })
    await user.click(submitButton)

    expect(mockUpdateAddress).toHaveBeenCalledTimes(1)
    expect(mockOnSuccess).toHaveBeenCalledTimes(1)
    expect(mockRefetch).toHaveBeenCalledTimes(1)
    expect(mockDispatch).toHaveBeenCalledWith(toogleModalService(false))
    expect(toast.error).toHaveBeenCalledWith('Error')
  })

  it('should not update user if user default address and current address is different', async () => {
    mockUseSession.mockReturnValue({
      data: { user: { ...mockUser, defaultAddress: '2' } },
      pending: false,
    })
    render(
      <AddressForm
        addressId='1'
        onSuccess={mockOnSuccess}
      />,
    )
    const submitButton = screen.getByRole('button', { name: 'Save' })
    await user.click(submitButton)

    expect(mockUpdateAddress).toHaveBeenCalledTimes(1)
    expect(mockOnSuccess).toHaveBeenCalledTimes(1)
    expect(mockUpdateUser).not.toHaveBeenCalled()
    expect(mockRefetch).toHaveBeenCalledTimes(1)
    expect(mockDispatch).toHaveBeenCalledWith(toogleModalService(false))
  })

  it('should call user update api whit empty user id if there is none', async () => {
    mockUseSession.mockReturnValue({
      data: { user: { ...mockUser, id: undefined } },
      pending: false,
    })
    render(
      <AddressForm
        addressId='1'
        onSuccess={mockOnSuccess}
      />,
    )
    const submitButton = screen.getByRole('button', { name: 'Save' })
    await user.click(submitButton)

    expect(mockUpdateAddress).toHaveBeenCalledTimes(1)
    expect(mockOnSuccess).toHaveBeenCalledTimes(1)
    expect(mockUpdateUser).toHaveBeenCalledWith({ id: '', defaultAddress: '1' })
    expect(mockRefetch).toHaveBeenCalledTimes(1)
    expect(mockDispatch).toHaveBeenCalledWith(toogleModalService(false))
  })

  it('should create address if addressId is not passed', async () => {
    render(
      <AddressForm
        addressId=''
        onSuccess={mockOnSuccess}
      />,
    )
    const submitButton = screen.getByRole('button', { name: 'Save' })
    await user.click(submitButton)

    expect(mockCreateAddress).toHaveBeenCalledTimes(1)
    expect(mockOnSuccess).toHaveBeenCalledTimes(1)
    expect(mockRefetch).toHaveBeenCalledTimes(1)
    expect(mockDispatch).toHaveBeenCalledWith(toogleModalService(false))
    expect(toast.error).not.toHaveBeenCalledWith('Error')
  })

  it('should not create address if creation failed', async () => {
    mockCreateAddress.mockResolvedValue({ res: { status: 400, message: 'Error' }, error: null })

    render(
      <AddressForm
        addressId=''
        onSuccess={mockOnSuccess}
      />,
    )
    const submitButton = screen.getByRole('button', { name: 'Save' })
    await user.click(submitButton)

    expect(mockCreateAddress).toHaveBeenCalledTimes(1)
    expect(mockOnSuccess).toHaveBeenCalledTimes(1)
    expect(mockRefetch).toHaveBeenCalledTimes(1)
    expect(mockDispatch).toHaveBeenCalledWith(toogleModalService(false))
    expect(toast.error).toHaveBeenCalledWith('Error')
  })

  it('should close the service modal when cancel button is clicked', async () => {
    render(
      <AddressForm
        addressId='1'
        onSuccess={mockOnSuccess}
      />,
    )
    const cancelButton = screen.getByText('Cancel')
    await user.click(cancelButton)

    expect(mockDispatch).toHaveBeenCalledWith(toogleModalService(false))
  })

  it('updates every input when the user types into them', async () => {
    const user = userEvent.setup()

    render(
      <AddressForm
        addressId='1'
        onSuccess={mockOnSuccess}
      />,
    )

    await waitFor(() => {
      expect(screen.getByLabelText(/Full Name/i)).toHaveValue(mockAddress.name)
    })

    const nameInput = screen.getByLabelText(/full name/i)
    await user.clear(nameInput)
    await user.type(nameInput, 'Jesus')
    expect(nameInput).toHaveValue('Jesus')

    const phoneInput = screen.getByLabelText(/phone number/i)
    await user.clear(phoneInput)
    await user.type(phoneInput, '12345678')
    expect(phoneInput).toHaveValue('12345678')

    const addressInput = screen.getByLabelText(/address/i)
    await user.clear(addressInput)
    await user.type(addressInput, 'Alamos 3')
    expect(addressInput).toHaveValue('Alamos 3')

    const cityInput = screen.getByLabelText(/city/i)
    await user.clear(cityInput)
    await user.type(cityInput, 'miami')
    expect(cityInput).toHaveValue('miami')

    const countryInput = screen.getByLabelText(/country/i)
    await user.clear(countryInput)
    await user.type(countryInput, 'Canada')
    expect(countryInput).toHaveValue('Canada')

    const postalCodeInput = screen.getByLabelText(/postal code/i)
    await user.clear(postalCodeInput)
    await user.type(postalCodeInput, '200001')
    expect(postalCodeInput).toHaveValue('200001')
  })

  it('toggles default address state when clicked', async () => {
    const user = userEvent.setup()

    render(
      <AddressForm
        addressId='1'
        onSuccess={mockOnSuccess}
      />,
    )

    // Wait for initial hydration if addressId is provided
    await waitFor(() => {
      expect(screen.getByLabelText(/Full Name/i)).toHaveValue(mockAddress.name)
    })

    const defaultToggle = screen.getByTestId('default-address-select-button')
    const diamondIconBefore = defaultToggle.querySelector('svg')
    const hadPrimaryClassBefore = diamondIconBefore?.classList.contains('text-primary')

    await user.click(defaultToggle)

    const diamondIconAfter = defaultToggle.querySelector('svg')
    expect(diamondIconAfter?.classList.contains('text-primary')).toBe(!hadPrimaryClassBefore)

    // Clicking a second time toggles it back
    await user.click(defaultToggle)
    const diamondIconFinal = defaultToggle.querySelector('svg')
    expect(diamondIconFinal?.classList.contains('text-primary')).toBe(hadPrimaryClassBefore)
  })
})
