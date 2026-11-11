import reducer, { addcartItem, clearCart, removecartItem, setcartItems } from '@/lib/redux/features/cartSlice'
import type { ICartItem } from '@/lib/types'

const item = (id: string, quantity = 1) => ({ _id: id, name: `Cube ${id}`, quantity }) as unknown as ICartItem

const stored = () => JSON.parse(localStorage.getItem('cartItems') ?? 'null')

describe('cartSlice', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('starts with an empty cart', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({ cartItems: [] })
  })

  describe('addcartItem', () => {
    it('adds the first item and persists it to localStorage', () => {
      const state = reducer({ cartItems: [] }, addcartItem(item('a')))

      expect(state.cartItems).toEqual([item('a')])
      expect(stored()).toEqual([item('a')])
    })

    it('appends a different item to the existing cart', () => {
      localStorage.setItem('cartItems', JSON.stringify([item('a')]))

      const state = reducer({ cartItems: [item('a')] }, addcartItem(item('b')))

      expect(state.cartItems).toEqual([item('a'), item('b')])
      expect(stored()).toEqual([item('a'), item('b')])
    })

    it('replaces an item that is already in the cart (quantity update)', () => {
      const previous = [item('a', 1), item('b', 1)]
      localStorage.setItem('cartItems', JSON.stringify(previous))

      const state = reducer({ cartItems: previous }, addcartItem(item('a', 3)))

      expect(state.cartItems).toEqual([item('a', 3), item('b', 1)])
      expect(stored()).toEqual([item('a', 3), item('b', 1)])
    })
  })

  describe('removecartItem', () => {
    it('removes the item by _id and updates localStorage', () => {
      const state = reducer({ cartItems: [item('a'), item('b')] }, removecartItem({ _id: 'a' }))

      expect(state.cartItems).toEqual([item('b')])
      expect(stored()).toEqual([item('b')])
    })

    it('leaves the cart untouched when the id is not in it', () => {
      const state = reducer({ cartItems: [item('a')] }, removecartItem({ _id: 'zzz' }))

      expect(state.cartItems).toEqual([item('a')])
    })
  })

  describe('setcartItems', () => {
    it('replaces the cart items', () => {
      const state = reducer({ cartItems: [item('a')] }, setcartItems([item('b'), item('c')]))

      expect(state.cartItems).toEqual([item('b'), item('c')])
    })
  })

  describe('clearCart', () => {
    it('empties the cart and localStorage', () => {
      localStorage.setItem('cartItems', JSON.stringify([item('a')]))

      const state = reducer({ cartItems: [item('a'), item('b')] }, clearCart())

      expect(state.cartItems).toEqual([])
      expect(stored()).toEqual([])
    })
  })
})
