import ProductCartCard from '@/components/ProductCartCard'
import { makeCartItem, makeFavorite } from '@/__test__/utils/factories'
import { renderWithProviders } from '@/__test__/utils/test-utils'
import { fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { toast } from 'react-toastify'

jest.mock('react-toastify', () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}))

// DOM order of the buttons inside the card: decrement, increment, remove.
const buttons = () => {
  const [decrement, increment, remove] = screen.getAllByRole('button')
  return { decrement, increment, remove }
}

const setup = (cartItemOverrides: Record<string, unknown> = {}, favoriteProductId?: string) => {
  const cartItem = makeCartItem({ quantity: 2, countInStock: 5, price: 19, ...cartItemOverrides })

  return {
    cartItem,
    user: userEvent.setup(),
    ...renderWithProviders(<ProductCartCard cartItem={cartItem} />, {
      preloadedState: {
        cart: { cartItems: [cartItem] },
        favoriteList: { favoriteList: favoriteProductId ? [makeFavorite(favoriteProductId)] : [] },
      },
    }),
  }
}

describe('ProductCartCard', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('display', () => {
    it('shows the name, category and a link to the product', () => {
      setup()

      expect(screen.getByRole('heading', { name: 'MoYu RS3M' })).toBeInTheDocument()
      expect(screen.getByText('3x3')).toBeInTheDocument()
      expect(screen.getByRole('link')).toHaveAttribute('href', '/product/slug/moyu-rs3m')
    })

    it('shows the unit price and the line total', () => {
      setup()

      expect(screen.getAllByText('$19').length).toBeGreaterThan(0)
      expect(screen.getByText('$38')).toBeInTheDocument()
    })

    it('shows the current quantity', () => {
      setup()

      expect(screen.getByRole('spinbutton')).toHaveValue(2)
    })

    it('uses the featured style when the product is a favorite', () => {
      const { container } = setup({}, 'prod-1')

      expect(container.firstChild).toHaveClass('card-gradient-featured')
    })

    it('uses the regular style when the product is not a favorite', () => {
      const { container } = setup()

      expect(container.firstChild).toHaveClass('card-base')
    })
  })

  describe('changing the quantity', () => {
    it('increments the quantity, updates the total and the cart', async () => {
      const { user, store } = setup()

      await user.click(buttons().increment)

      expect(screen.getByRole('spinbutton')).toHaveValue(3)
      expect(screen.getByText('$57')).toBeInTheDocument()
      expect(store.getState().cart.cartItems[0].quantity).toBe(3)
    })

    it('decrements the quantity, updates the total and the cart', async () => {
      const { user, store } = setup()

      await user.click(buttons().decrement)

      expect(screen.getByRole('spinbutton')).toHaveValue(1)
      expect(screen.getByText('$19', { selector: 'h1.leading-none' })).toBeInTheDocument()
      expect(store.getState().cart.cartItems[0].quantity).toBe(1)
    })

    it('does not go above the available stock', async () => {
      const { user, store } = setup({ quantity: 5, countInStock: 5 })

      await user.click(buttons().increment)

      expect(toast.error).toHaveBeenCalledWith('Only 5 in stock!')
      expect(screen.getByRole('spinbutton')).toHaveValue(5)
      expect(store.getState().cart.cartItems[0].quantity).toBe(5)
    })

    it('does not go below one unit', async () => {
      const { user, store } = setup({ quantity: 1 })

      await user.click(buttons().decrement)

      expect(toast.error).toHaveBeenCalledWith('Should have at least 1 product!')
      expect(screen.getByRole('spinbutton')).toHaveValue(1)
      expect(store.getState().cart.cartItems[0].quantity).toBe(1)
    })

    it('accepts a valid quantity typed into the input', () => {
      setup()

      fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '4' } })

      expect(screen.getByRole('spinbutton')).toHaveValue(4)
      expect(screen.getByText('$76')).toBeInTheDocument()
    })

    it('rejects a typed quantity above the stock', () => {
      setup()

      fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '9' } })

      expect(toast.error).toHaveBeenCalledWith('Only 5 in stock!')
      expect(screen.getByRole('spinbutton')).toHaveValue(2)
    })

    it('rejects a typed quantity below one', () => {
      setup()

      fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '0' } })

      expect(toast.error).toHaveBeenCalledWith('Should have at least 1 product!')
      expect(screen.getByRole('spinbutton')).toHaveValue(2)
    })
  })

  describe('removing', () => {
    it('removes the item from the cart and from localStorage', async () => {
      const { user, store } = setup()

      await user.click(buttons().remove)

      expect(store.getState().cart.cartItems).toEqual([])
      expect(JSON.parse(localStorage.getItem('cartItems') ?? 'null')).toEqual([])
    })
  })
})
