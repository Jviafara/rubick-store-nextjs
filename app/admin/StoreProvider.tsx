'use client'
import { Provider } from 'react-redux'
import { useEffect } from 'react'
import { setcartItems } from '@/lib/redux/features/cartSlice'
import { store } from '@/lib/redux/store'

function HydrateStore({ children }: { children: React.ReactNode }) {
  useEffect(() => {
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
