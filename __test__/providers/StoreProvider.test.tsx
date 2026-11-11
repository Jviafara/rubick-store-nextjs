import StoreProvider from '@/app/StoreProvider'
import { setcartItems } from '@/lib/redux/features/cartSlice'
import { store } from '@/lib/redux/store'
import { render, screen, waitFor } from '@testing-library/react'

describe('Store Provider', () => {
  beforeEach(() => {
    localStorage.clear()
    store.dispatch(setcartItems([]))
    jest.restoreAllMocks()
  })

  it('renders children and hydrates cart items from localStorage', async () => {
    const savedCartItems = [{ _id: 'sku-1', quantity: 2 }]
    localStorage.setItem('cartItems', JSON.stringify(savedCartItems))

    render(
      <StoreProvider>
        <div>Children component</div>
      </StoreProvider>
    )

    expect(screen.getByText('Children component')).toBeInTheDocument()

    await waitFor(() => {
      expect(store.getState().cart.cartItems).toEqual(savedCartItems)
    })
  })

  it('logs and ignores invalid cart data from localStorage', async () => {
    localStorage.setItem('cartItems', '{invalid json')
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <StoreProvider>
        <div>Children component</div>
      </StoreProvider>
    )

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to restore cart items:', expect.any(Error))
    })

    expect(store.getState().cart.cartItems).toEqual([])
  })
})
