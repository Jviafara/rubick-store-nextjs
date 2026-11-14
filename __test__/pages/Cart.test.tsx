import Cart from '@/app/(store pages)/cart/page'
import { useSession } from '@/lib/auth/auth-client'
import { render, screen } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/lib/hooks/redux.hooks'
import { mockCartItems } from '@/__mocks__/products.mock'
import userEvent from '@testing-library/user-event'
import { setModalService, toogleModalService } from '@/lib/redux/features/modalSlice'
import { mockClearCartModal } from '@/__mocks__/modalService.mock'
import { toast } from 'react-toastify'
import { ModalPositions } from '@/lib/constants'
import { clearCart, setcartItems } from '@/lib/redux/features/cartSlice'
import { store } from '@/lib/redux/store'

const mockUseSession = useSession as jest.Mock
const mockDispatch = jest.fn()
const mockPush = jest.fn()
const mockRouter = useRouter as jest.Mock
const mockUseAppSelector = useAppSelector as unknown as jest.Mock

jest.mock('@/lib/hooks/redux.hooks', () => ({
  useAppSelector: jest.fn(),
  useAppDispatch: () => mockDispatch,
}))

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

jest.mock('@/components/EmptyBanner', () => ({
  __esModule: true,
  default: () => <div data-testid='empty-banner' />,
  EmptyBanner: () => <div data-testid='empty-banner' />,
}))

jest.mock('@/components/ProductCard', () => ({
  __esModule: true,
  default: () => <div data-testid='product-card' />,
}))

jest.mock('@/lib/auth/auth-client', () => ({
  useSession: jest.fn(),
}))

mockRouter.mockReturnValue({
  push: mockPush,
})

jest.mock('@/lib/redux/features/favoriteSlice', () => ({
  setFavoriteList: jest.fn(payload => ({
    type: 'favorites/setFavoriteList',
    payload,
  })),
}))

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
  },
}))

describe('Cart page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseSession.mockReturnValue({
      data: { user: { id: 1 } },
      pending: false,
    })
    mockUseAppSelector.mockImplementation(selector =>
      selector({
        cart: { cartItems: mockCartItems },
        favoriteList: { favoriteList: [] },
      }),
    )
  })

  const buildItems = (lines: { price: number; quantity: number }[]) =>
    lines.map((line, i) => ({
      ...mockCartItems[0],
      _id: `test-item-${i}`,
      ...line,
    }))

  const setCart = (lines: { price: number; quantity: number }[]) => {
    mockUseAppSelector.mockImplementation(selector =>
      selector({
        cart: { cartItems: buildItems(lines) },
        favoriteList: { favoriteList: [] },
      }),
    )
  }

  it('Should render Cart Page', () => {
    render(<Cart />)
    expect(screen.getByText(/Your Cart/i)).toBeVisible()
    expect(screen.queryByTestId('empty-banner')).not.toBeInTheDocument()
  })

  it('Should Show empty banner when cart is empty', () => {
    mockUseAppSelector.mockImplementation(selector =>
      selector({
        cart: { cartItems: [] },
      }),
    )
    render(<Cart />)
    expect(screen.getByTestId('empty-banner')).toBeVisible()
    expect(screen.queryByTestId('product-card')).not.toBeInTheDocument()
  })

  it('should redirect unauthenticated users to sign in', async () => {
    const user = userEvent.setup()
    mockUseSession.mockReturnValue({
      data: null,
      pending: false,
    })

    render(<Cart />)
    const checkoutButton = screen.getByRole('button', { name: /proceed to Checkout/i })
    expect(checkoutButton).toBeInTheDocument()
    await user.click(checkoutButton)

    expect(mockPush).toHaveBeenCalledWith('/sign-in')
    expect(mockPush).toHaveBeenCalledTimes(1)
  })

  it('should redirect authenticated users to checkout page step=1', async () => {
    const user = userEvent.setup()

    render(<Cart />)
    const checkoutButton = screen.getByRole('button', { name: /proceed to Checkout/i })
    expect(checkoutButton).toBeInTheDocument()
    await user.click(checkoutButton)

    expect(mockPush).toHaveBeenCalledWith('/checkout?step=1')
    expect(mockPush).toHaveBeenCalledTimes(1)
  })

  it('should open clear cart confirmation modal', async () => {
    const user = userEvent.setup()

    render(<Cart />)
    const checkoutButton = screen.getByRole('button', { name: /Clear/i })
    expect(checkoutButton).toBeInTheDocument()
    await user.click(checkoutButton)

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: setModalService.type,
        payload: expect.objectContaining({
          modalOpen: true,
          header: 'Clear Cart!',
          subTitle: 'This action can not be reverted.',
          position: ModalPositions.center,

          confirmButton: expect.objectContaining({
            label: 'Clear',
            color: 'secondary',
            action: expect.any(Function),
          }),

          cancelButton: expect.objectContaining({
            label: 'cancel',
            color: 'primary',
            action: expect.any(Function),
          }),
        }),
      }),
    )
  })

  it('should clear the cart when confirming the modal', async () => {
    const user = userEvent.setup()

    render(<Cart />)

    await user.click(screen.getByRole('button', { name: /clear/i }))

    const modalAction = mockDispatch.mock.calls
      .map(([action]) => action)
      .find(action => action.type === setModalService.type)

    const confirmAction = modalAction.payload.confirmButton.action

    await user.click(screen.getByRole('button', { name: /clear/i }))

    confirmAction()

    expect(mockDispatch).toHaveBeenCalledWith(toogleModalService(false))

    expect(mockDispatch).toHaveBeenCalledWith(clearCart())

    expect(toast.success).toHaveBeenCalledWith('Cart cleared succesfully')
  })

  it('should close the modal when clicking cancel', async () => {
    const user = userEvent.setup()
    store.dispatch(setcartItems(mockCartItems))

    render(<Cart />)

    await user.click(screen.getByRole('button', { name: /clear/i }))

    const modalAction = mockDispatch.mock.calls
      .map(([action]) => action)
      .find(action => action.type === setModalService.type)

    const cancelAction = modalAction.payload.cancelButton.action

    await user.click(screen.getByRole('button', { name: /clear/i }))

    cancelAction()

    expect(mockDispatch).toHaveBeenCalledWith(toogleModalService(false))
    expect(mockDispatch).not.toHaveBeenCalledWith(clearCart())
    expect(store.getState().cart.cartItems).toEqual(mockCartItems)
  })

  // it('charges 15% shipping when subtotal is below 100', () => {
  //   setCart([{ price: 50, quantity: 1 }])
  //   render(<Cart />)

  //   expect(screen.getByText('$50')).toBeInTheDocument() // subtotal
  //   expect(screen.getByText('7.5')).toBeInTheDocument() // shipping
  //   expect(screen.getByText('$57.5')).toBeInTheDocument() // total
  //   expect(screen.queryByText(/free/i)).not.toBeInTheDocument()
  // })

  // it('adds up quantity * price across several items', () => {
  //   setCart([
  //     { price: 20, quantity: 2 }, // 40
  //     { price: 10, quantity: 3 }, // 30
  //   ])
  //   render(<Cart />)

  //   expect(screen.getByText('$70')).toBeInTheDocument()
  //   expect(screen.getByText('10.5')).toBeInTheDocument()
  //   expect(screen.getByText('$80.5')).toBeInTheDocument()
  // })

  // it('gives free shipping when subtotal is exactly 100', () => {
  //   setCart([{ price: 100, quantity: 1 }])
  //   render(<Cart />)

  //   expect(screen.getByText(/free/i)).toBeInTheDocument()
  //   // subtotal and total are both $100
  //   expect(screen.getAllByText('$100')).toHaveLength(2)
  // })

  // it('gives free shipping when subtotal is above 100', () => {
  //   setCart([{ price: 60, quantity: 2 }]) // 120
  //   render(<Cart />)

  //   expect(screen.getByText(/free/i)).toBeInTheDocument()
  //   expect(screen.getAllByText('$120')).toHaveLength(2)
  // })
})
