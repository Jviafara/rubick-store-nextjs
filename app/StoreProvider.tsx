'use client'
import { store } from '../lib/redux/store'
import { Provider } from 'react-redux'
import { useEffect } from 'react'
import { setShippingAddress, setcartItems } from '@/lib/redux/features/cartSlice'

function HydrateStore({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Restore shipping address from localStorage
    const savedShippingAddress = localStorage.getItem('shippingAddress')
    if (savedShippingAddress) {
      try {
        store.dispatch(setShippingAddress(JSON.parse(savedShippingAddress)))
      } catch (error) {
        console.error('Failed to restore shipping address:', error)
      }
    }

    // Restore cart items from localStorage
    const savedCartItems = localStorage.getItem('cartItems')
    if (savedCartItems) {
      try {
        store.dispatch(setcartItems(JSON.parse(savedCartItems)))
      } catch (error) {
        console.error('Failed to restore cart items:', error)
      }
    }
  }, [])

  return <>{children}</>
}

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <HydrateStore>{children}</HydrateStore>
    </Provider>
  )
}
