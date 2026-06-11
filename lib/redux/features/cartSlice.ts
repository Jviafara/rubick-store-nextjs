import { ICart, ICartItem } from '@/lib/types'
import { createSlice } from '@reduxjs/toolkit'

const initialState: ICart = {
  shippingAddress: [],
  cartItems: [],
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setShippingAddress: (state, action) => {
      localStorage.setItem('shippingAddress', JSON.stringify(action.payload))
      state.shippingAddress = action.payload
    },
    removecartItem: (state, action) => {
      const { id: productId } = action.payload
      state.cartItems = [...state.cartItems].filter(e => e._id !== productId)
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
    },
    setcartItems: (state, action) => {
      if (!action.payload) {
        localStorage.setItem('cartItems', JSON.stringify([]))
      }
      state.cartItems = action.payload
    },
    addcartItem: (state, action) => {
      const newItem = action.payload
      if (!localStorage.getItem('cartItems')) {
        state.cartItems = [newItem]
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
        return
      }

      const cartItems = JSON.parse(localStorage.getItem('cartItems') || '')

      const existItem = cartItems.find((item: ICartItem) => item._id === newItem._id)

      if (existItem) {
        const newList = cartItems.map((item: ICartItem) => (item._id === newItem._id ? newItem : item))
        state.cartItems = newList
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
      } else {
        state.cartItems = [...state.cartItems, newItem]
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
        return
      }
    },
    clearCart: state => {
      state.cartItems = []
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
    },
  },
})

export const { clearCart, setShippingAddress, setcartItems, removecartItem, addcartItem } = cartSlice.actions

export default cartSlice.reducer
