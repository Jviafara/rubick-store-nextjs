import ToastProvider from '@/app/ToastProvider'
import { setcartItems } from '@/lib/redux/features/cartSlice'
import { setFavoriteList } from '@/lib/redux/features/favoriteSlice'
import { store } from '@/lib/redux/store'
import { render, screen, waitFor } from '@testing-library/react'
import { useSession } from '@/lib/auth/auth-client'

const mockDispatch = jest.fn()
const mockFetch = jest.fn()

const mockUseSession = useSession as jest.Mock

jest.mock('@/lib/hooks/redux.hooks', () => ({
  useAppSelector: jest.fn(),
  useAppDispatch: () => mockDispatch,
}))

jest.mock('react-toastify', () => ({
  __esModule: true,
  default: () => <div data-testid='toast-container' />,
  ToastContainer: () => <div data-testid='toast-container' />,
}))

jest.mock('@/lib/auth/auth-client', () => ({
  useSession: jest.fn(),
  signIn: jest.fn(),
  signUp: jest.fn(),
  signOut: jest.fn(),
  changePassword: jest.fn(),
}))

jest.mock('@/lib/redux/features/favoriteSlice', () => ({
  setFavoriteList: jest.fn(payload => ({
    type: 'favorites/setFavoriteList',
    payload,
  })),
}))

describe('Toast Provider', () => {
  beforeEach(() => {
    localStorage.clear()
    store.dispatch(setFavoriteList(null))
    store.dispatch(setcartItems([]))
    jest.clearAllMocks()
    mockUseSession.mockReturnValue({
      data: null,
      isPending: false,
    })
    global.fetch = mockFetch
  })

  it('renders children and hydrates cart items from localStorage', async () => {
    const savedCartItems = [{ _id: 'sku-1', quantity: 2 }]
    store.dispatch(setcartItems(savedCartItems))

    render(
      <ToastProvider>
        <div>Children component</div>
      </ToastProvider>,
    )

    expect(screen.getByText('Children component')).toBeInTheDocument()

    await waitFor(() => {
      expect(store.getState().cart.cartItems).toEqual(savedCartItems)
    })
  })

  it('should fetch favorites when user is authenticated', async () => {
    const mockFavorites = [
      { id: '1', productId: 'product-1' },
      { id: '2', productId: 'product-2' },
    ]

    mockUseSession.mockReturnValue({
      data: {
        user: { id: 'user-1' },
      },
      isPending: false,
    })

    mockFetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(mockFavorites),
    })

    render(
      <ToastProvider>
        <div>Children component</div>
      </ToastProvider>,
    )

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/favorites', {
        method: 'GET',
        credentials: 'include',
      })
    })

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(setFavoriteList(mockFavorites))
    })
  })

  it('should handle errors when fetching favorites fails', async () => {
    mockUseSession.mockReturnValue({
      data: {
        user: { id: 'user-1' },
      },
      isPending: false,
    })

    const mockError = new Error('Network error')

    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})

    mockFetch.mockRejectedValueOnce(mockError)

    render(
      <ToastProvider>
        <div>Children component</div>
      </ToastProvider>,
    )

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'favorites/setFavoriteList',
          payload: null,
        }),
      )
    })

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })

    expect(consoleError).toHaveBeenCalledWith(mockError)

    consoleError.mockRestore()
  })

  it('should not fetch favorites when session has no user', () => {
    mockUseSession.mockReturnValue({
      data: null,
      isPending: false,
    })

    render(
      <ToastProvider>
        <div>Children component</div>
      </ToastProvider>,
    )

    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('should parse cart items from localStorage when items exist', async () => {
    const mockCartItems = [{ productId: 'product-1', quantity: 2 }]

    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(JSON.stringify(mockCartItems))

    render(
      <ToastProvider>
        <div>Children component</div>
      </ToastProvider>,
    )

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(setcartItems(mockCartItems))
    })
  })

  it('should parse empty cart items from localStorage when items do not exist', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null)

    render(
      <ToastProvider>
        <div>Children component</div>
      </ToastProvider>,
    )

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(setcartItems([]))
    })
  })
})
