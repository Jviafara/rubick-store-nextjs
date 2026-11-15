import { mockCartItems, mockProduct } from '@/__mocks__/products.mock'
import ProductDetail from '@/app/(store pages)/product/[...all]/page'
import { useSession } from '@/lib/auth/auth-client'
import { useAppSelector } from '@/lib/hooks/redux.hooks'
import favoriteApi from '@/lib/modules/favoriteApiClient'
import { productApi } from '@/lib/modules/productsApiClient'
import { addcartItem } from '@/lib/redux/features/cartSlice'
import { addFavorite, removeFavorite } from '@/lib/redux/features/favoriteSlice'
import { IFavorite } from '@/lib/types'
import { act, createEvent, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { notFound, useParams, useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

const mockUseSession = useSession as jest.Mock
const mockUseParams = useParams as jest.Mock
const mockUseRouter = useRouter as jest.Mock
const mockPush = jest.fn()
const mockDispatch = jest.fn()
const mockUseAppSelector = useAppSelector as unknown as jest.Mock
const mockProductInfo = productApi.productInfo as unknown as jest.Mock
const mockAddFavorite = favoriteApi.add as unknown as jest.Mock
const mockRemoveFavorite = favoriteApi.remove as unknown as jest.Mock

jest.mock('@/lib/hooks/redux.hooks', () => ({
  useAppSelector: jest.fn(),
  useAppDispatch: () => mockDispatch,
}))

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
  notFound: jest.fn(),
}))

jest.mock('@/lib/auth/auth-client', () => ({
  useSession: jest.fn(),
}))

jest.mock('@/components/ImageSlide', () => ({
  __esModule: true,
  default: () => <div data-testid='image-slide' />,
}))

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

jest.mock('@/lib/modules/productsApiClient', () => ({
  productApi: {
    productInfo: jest.fn(),
  },
}))

jest.mock('@/lib/modules/favoriteApiClient', () => ({
  __esModule: true,
  default: {
    add: jest.fn(),
    remove: jest.fn(),
  },
}))

describe('Product Details Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseRouter.mockReturnValue({ push: mockPush })
    mockUseParams.mockReturnValue({ all: ['products', 'wireless-headphones'] })
    mockUseSession.mockReturnValue({ data: null })
    mockUseSession.mockReturnValue({
      data: { user: { id: 1, name: 'Jesus' } },
      pending: false,
    })
    mockUseAppSelector.mockImplementation(selector => {
      if (selector.toString().includes('favoriteList')) {
        return { favoriteList: [] }
      }
      if (selector.toString().includes('cart')) {
        return { cartItems: [] }
      }
      return {}
    })
    mockProductInfo.mockResolvedValue({
      res: mockProduct,
      error: undefined,
    })
  })

  it('renders product details successfully after loading', async () => {
    render(<ProductDetail />)

    // Wait for product information to render
    expect(await screen.findByRole('heading', { name: /Mechanical Keyboard/i })).toBeInTheDocument()
    expect(screen.getByText(/150/i)).toBeInTheDocument()
    expect(screen.getByText(/In Stock/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument()
  })

  it('should call notFound() when product does not exist or fails to load', async () => {
    // Mock productApi to return an error or empty response
    mockProductInfo.mockResolvedValue({
      res: { status: 404, message: 'Product not found' },
      error: { message: 'Product not found' },
    })

    render(<ProductDetail />)

    // Wait for the async loading effect to finish and check if notFound was triggered
    await waitFor(() => {
      expect(notFound).toHaveBeenCalled()
    })
  })

  it('allows incrementing and decrementing the product quantity', async () => {
    const user = userEvent.setup()

    render(<ProductDetail />)

    const quantityInput = await screen.findByRole('spinbutton')
    expect(quantityInput).toHaveValue(1)

    const plusButton = screen.getByTestId('increment-button')
    expect(plusButton).toBeInTheDocument()

    const minusButton = screen.getByTestId('decrement-button')
    expect(minusButton).toBeInTheDocument()

    await user.click(plusButton)
    expect(quantityInput).toHaveValue(2)

    await user.click(minusButton)
    expect(quantityInput).toHaveValue(1)
  })

  it('shuold not allows the product quantity to be less than 1', async () => {
    const user = userEvent.setup()

    render(<ProductDetail />)

    const quantityInput = await screen.findByRole('spinbutton')
    expect(quantityInput).toHaveValue(1)

    const minusButton = screen.getByTestId('decrement-button')
    expect(minusButton).toBeInTheDocument()

    await user.click(minusButton)
    expect(quantityInput).toHaveValue(1)
    expect(toast.error).toHaveBeenCalledWith('Should have at least 1 product!')
  })

  it('shuold not allows the product quantity to be more than the product stock count', async () => {
    const user = userEvent.setup()

    render(<ProductDetail />)

    const quantityInput = await screen.findByRole('spinbutton')
    expect(quantityInput).toHaveValue(1)

    fireEvent.change(quantityInput, { target: { value: mockProduct.countInStock.toString() } })

    const plusButton = screen.getByTestId('increment-button')
    expect(plusButton).toBeInTheDocument()

    await user.click(plusButton)
    expect(quantityInput).toHaveValue(mockProduct.countInStock)
    expect(toast.error).toHaveBeenCalledWith(`Only ${mockProduct.countInStock} in stock!`)
  })

  it('shows an error toast and prevents updating when quantity is less than 1', async () => {
    // 1. Mock product info fetch with a known stock count

    render(<ProductDetail />)

    // Wait for product to load
    expect(await screen.findByRole('heading', { name: mockProduct.name })).toBeInTheDocument()

    // Find the quantity input
    const quantityInput = screen.getByRole('spinbutton')

    // Attempt to change value to 0
    fireEvent.change(quantityInput, { target: { value: '0' } })

    // Verify error toast is called with the expected message
    expect(toast.error).toHaveBeenCalledWith('Should have at least 1 product!')
  })

  it('shows an error toast and prevents updating when quantity is more than count in stock', async () => {
    // 1. Mock product info fetch with a known stock count

    render(<ProductDetail />)

    // Wait for product to load
    expect(await screen.findByRole('heading', { name: mockProduct.name })).toBeInTheDocument()

    // Find the quantity input
    const quantityInput = screen.getByRole('spinbutton')

    // Attempt to change value to 0
    fireEvent.change(quantityInput, { target: { value: (mockProduct.countInStock + 1).toString() } })

    // Verify error toast is called with the expected message
    expect(toast.error).toHaveBeenCalledWith(`Only ${mockProduct.countInStock} in stock!`)
  })

  it('redirect unauthenticated users to sig-in page when favorite button is clicked', async () => {
    const user = userEvent.setup()
    mockUseSession.mockReturnValue({
      data: null,
      pending: false,
    })

    render(<ProductDetail />)

    expect(await screen.findByRole('heading', { name: /Mechanical Keyboard/i })).toBeInTheDocument()
    const favoriteButton = screen.getByTestId('favorite-button')
    expect(favoriteButton).toBeInTheDocument()

    await user.click(favoriteButton)

    expect(mockPush).toHaveBeenCalledWith('/sign-in')
    expect(mockPush).toHaveBeenCalledTimes(1)
  })

  it('allows to add product to favorite list', async () => {
    const user = userEvent.setup()

    mockAddFavorite.mockResolvedValueOnce({
      res: mockProduct,
      error: undefined,
    })

    render(<ProductDetail />)

    expect(await screen.findByRole('heading', { name: /Mechanical Keyboard/i })).toBeInTheDocument()
    const favoriteButton = screen.getByTestId('favorite-button')
    expect(favoriteButton).toBeInTheDocument()

    await user.click(favoriteButton)

    expect(favoriteApi.add).toHaveBeenCalledTimes(1)
    expect(favoriteApi.add).toHaveBeenCalledWith(mockProduct._id)

    expect(mockDispatch).toHaveBeenCalledWith(addFavorite(mockProduct))
    expect(toast.success).toHaveBeenCalledWith('Product added to favorites')
  })

  it('show error toast when failed to add product to favorite list', async () => {
    const user = userEvent.setup()

    mockAddFavorite.mockResolvedValueOnce({
      res: { status: 404, message: 'Error' },
      error: { message: 'Error' },
    })

    render(<ProductDetail />)

    expect(await screen.findByRole('heading', { name: /Mechanical Keyboard/i })).toBeInTheDocument()
    const favoriteButton = screen.getByTestId('favorite-button')
    expect(favoriteButton).toBeInTheDocument()

    await user.click(favoriteButton)

    expect(favoriteApi.add).toHaveBeenCalledTimes(1)
    expect(favoriteApi.add).toHaveBeenCalledWith(mockProduct._id)

    expect(mockDispatch).not.toHaveBeenCalledWith(addFavorite(mockProduct))
    expect(toast.error).toHaveBeenCalledWith('Error')
  })

  it('allows to remove product from favorite list', async () => {
    const user = userEvent.setup()
    mockProductInfo.mockResolvedValue({
      res: mockProduct,
      error: undefined,
    })

    mockUseAppSelector.mockImplementation(selector => {
      const state = {
        favoriteList: { favoriteList: [{ _id: 'fav_1', product: mockProduct._id }] },
        cart: { cartItems: [] },
      }
      return selector(state)
    })

    mockRemoveFavorite.mockResolvedValueOnce({
      res: mockProduct,
      error: undefined,
    })

    render(<ProductDetail />)

    expect(await screen.findByRole('heading', { name: /Mechanical Keyboard/i })).toBeInTheDocument()
    const favoriteButton = screen.getByTestId('favorite-button')
    expect(favoriteButton).toBeInTheDocument()

    await user.click(favoriteButton)

    expect(favoriteApi.remove).toHaveBeenCalledTimes(1)
    expect(favoriteApi.remove).toHaveBeenCalledWith('fav_1')

    expect(mockDispatch).toHaveBeenCalledWith(removeFavorite(mockProduct._id))
    expect(toast.success).toHaveBeenCalledWith('Product removed from favorites')
  })

  it('show error toast when failed remove product from favorite list', async () => {
    const user = userEvent.setup()

    mockUseAppSelector.mockImplementation(selector => {
      const state = {
        favoriteList: { favoriteList: [{ _id: 'fav_1', product: mockProduct._id }] },
        cart: { cartItems: [] },
      }
      return selector(state)
    })

    mockRemoveFavorite.mockResolvedValueOnce({
      res: { status: 404, message: 'Error' },
      error: { message: 'Error' },
    })

    render(<ProductDetail />)

    expect(await screen.findByRole('heading', { name: /Mechanical Keyboard/i })).toBeInTheDocument()
    const favoriteButton = screen.getByTestId('favorite-button')
    expect(favoriteButton).toBeInTheDocument()

    await user.click(favoriteButton)

    expect(favoriteApi.remove).toHaveBeenCalledTimes(1)
    expect(favoriteApi.remove).toHaveBeenCalledWith('fav_1')

    expect(mockDispatch).not.toHaveBeenCalledWith(removeFavorite(mockProduct._id))
    expect(toast.error).toHaveBeenCalledWith('Error')
  })

  it('should render not render add to cart button when product already in cart', async () => {
    mockUseAppSelector.mockImplementation(selector => {
      if (selector.toString().includes('favoriteList')) {
        return { favoriteList: [] }
      }
      if (selector.toString().includes('cart')) {
        return { cartItems: mockCartItems }
      }
      return {}
    })

    render(<ProductDetail />)

    expect(await screen.findByRole('heading', { name: /Mechanical Keyboard/i })).toBeInTheDocument()

    expect(screen.getByText('Already in Cart!')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Add to Cart/i })).not.toBeInTheDocument()
  })

  it.each(['Backspace', 'Delete'])('should prevent %s when quantity has only one digit', async key => {
    render(<ProductDetail />)

    const quantityInput = await screen.findByRole('spinbutton')

    fireEvent.change(quantityInput, {
      target: { value: '1' },
    })

    const event = createEvent.keyDown(quantityInput, { key })
    fireEvent(quantityInput, event)

    expect(event.defaultPrevented).toBe(true)
  })

  it.each(['Backspace', 'Delete'])('should allow %s when quantity has more than one digit', async key => {
    render(<ProductDetail />)

    const quantityInput = await screen.findByRole('spinbutton')

    fireEvent.change(quantityInput, {
      target: { value: '10' },
    })

    const event = createEvent.keyDown(quantityInput, { key })
    fireEvent(quantityInput, event)

    expect(event.defaultPrevented).toBe(false)
  })

  it('allows to add product to cart', async () => {
    const user = userEvent.setup()

    mockProductInfo.mockResolvedValue({
      res: { ...mockProduct, name: 'Mechanical Keyboard' },
      error: undefined,
    })

    render(<ProductDetail />)

    await act(async () => {
      await Promise.resolve()
      await Promise.resolve()
    })

    expect(await screen.findByRole('heading', { name: /Mechanical Keyboard/i })).toBeInTheDocument()
    const addToCartButton = await screen.findByRole('button', { name: /add to cart/i })
    expect(addToCartButton).toBeInTheDocument()

    await user.click(addToCartButton)

    expect(mockDispatch).toHaveBeenCalledWith(addcartItem({ ...mockProduct, quantity: 1 }))
  })

  it('exits early without calling remove API if favorite item is missing from state', async () => {
    const user = userEvent.setup()

    const trickyFavoriteList = [] as IFavorite[]
    trickyFavoriteList.some = () => true // Makes isFavorite = true
    trickyFavoriteList.find = () => undefined // Makes favorite = undefined in onRemoveFavorite

    mockUseAppSelector.mockImplementation(selector => {
      const state = {
        favoriteList: {
          favoriteList: trickyFavoriteList,
        },
        cart: { cartItems: [] },
      }
      return selector(state)
    })

    render(<ProductDetail />)

    // Wait for product to load
    expect(await screen.findByRole('heading', { name: /Mechanical Keyboard/i })).toBeInTheDocument()

    const favoriteButton = screen.getByTestId('favorite-button')
    await user.click(favoriteButton)

    // 5. Assert that favoriteApi.remove was never called due to the early return guard
    expect(favoriteApi.remove).not.toHaveBeenCalled()
    expect(favoriteApi.add).not.toHaveBeenCalled()
  })
})
