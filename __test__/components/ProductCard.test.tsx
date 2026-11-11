import ProductCard from '@/components/ProductCard'
import { makeCartItem, makeFavorite, makeProduct } from '@/__test__/utils/factories'
import { renderWithProviders } from '@/__test__/utils/test-utils'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { toast } from 'react-toastify'

jest.mock('react-toastify', () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}))

describe('ProductCard', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('product details', () => {
    it('shows the name as a link to the product page', () => {
      renderWithProviders(<ProductCard product={makeProduct()} />)

      expect(screen.getByRole('link', { name: 'MoYu RS3M' })).toHaveAttribute('href', '/product/slug/moyu-rs3m')
    })

    it('shows the category, price and ratings', () => {
      renderWithProviders(<ProductCard product={makeProduct()} />)

      expect(screen.getByText('3x3')).toBeInTheDocument()
      expect(screen.getByText('19')).toBeInTheDocument()
      expect(screen.getByText('(4.5)')).toBeInTheDocument()
      expect(screen.getByText('100 items sold!')).toBeInTheDocument()
    })

    it('shows the first product image', () => {
      renderWithProviders(<ProductCard product={makeProduct()} />)

      expect(screen.getByRole('img')).toHaveAttribute('src', '/images/moyu-rs3m.png')
    })
  })

  describe('adding to the cart', () => {
    it('adds the product with quantity 1 and shows a quantity badge', async () => {
      const user = userEvent.setup()
      const { store } = renderWithProviders(<ProductCard product={makeProduct()} />)

      await user.click(screen.getByRole('button'))

      expect(store.getState().cart.cartItems).toHaveLength(1)
      expect(store.getState().cart.cartItems[0]).toMatchObject({ _id: 'prod-1', quantity: 1 })
      expect(await screen.findByText('1')).toBeInTheDocument()
    })

    it('increments the quantity when the product is added again', async () => {
      const user = userEvent.setup()
      const { store } = renderWithProviders(<ProductCard product={makeProduct()} />)

      await user.click(screen.getByRole('button'))
      await user.click(screen.getByRole('button'))

      expect(store.getState().cart.cartItems).toHaveLength(1)
      expect(store.getState().cart.cartItems[0].quantity).toBe(2)
      expect(await screen.findByText('2')).toBeInTheDocument()
    })

    it('shows the quantity of a product that is already in the cart', () => {
      renderWithProviders(<ProductCard product={makeProduct()} />, {
        preloadedState: { cart: { cartItems: [makeCartItem({ quantity: 3 })] } },
      })

      expect(screen.getByText('3')).toBeInTheDocument()
    })

    it('refuses to add more than the stock and shows an error', async () => {
      const user = userEvent.setup()
      const { store } = renderWithProviders(<ProductCard product={makeProduct({ countInStock: 1 })} />, {
        preloadedState: { cart: { cartItems: [makeCartItem({ countInStock: 1, quantity: 1 })] } },
      })

      await user.click(screen.getByRole('button'))

      expect(toast.error).toHaveBeenCalledWith('Product Out of Stock')
      expect(store.getState().cart.cartItems[0].quantity).toBe(1)
    })
  })

  describe('stock', () => {
    it('shows an "Out of Stock" label and no cart button when there is no stock', () => {
      renderWithProviders(<ProductCard product={makeProduct({ countInStock: 0 })} />)

      expect(screen.getByText('Out of Stock')).toBeInTheDocument()
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    it('does not show the "Out of Stock" label when the product is available', () => {
      renderWithProviders(<ProductCard product={makeProduct()} />)

      expect(screen.queryByText('Out of Stock')).not.toBeInTheDocument()
    })
  })

  describe('favorites', () => {
    it('uses the featured style for a favorite product', () => {
      const { container } = renderWithProviders(<ProductCard product={makeProduct()} />, {
        preloadedState: { favoriteList: { favoriteList: [makeFavorite('prod-1')] } },
      })

      expect(container.firstChild).toHaveClass('card-gradient-featured')
    })

    it('uses the regular style for a product that is not a favorite', () => {
      const { container } = renderWithProviders(<ProductCard product={makeProduct()} />, {
        preloadedState: { favoriteList: { favoriteList: [makeFavorite('another-product')] } },
      })

      expect(container.firstChild).toHaveClass('card-base')
      expect(container.firstChild).not.toHaveClass('card-gradient-featured')
    })
  })
})
