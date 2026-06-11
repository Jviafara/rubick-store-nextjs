'use client'

import { useSession } from '@/lib/auth/auth-client'
import { useAppDispatch } from '@/lib/hooks/redux.hooks'
import { setcartItems } from '@/lib/redux/features/cartSlice'
import { setFavoriteList } from '@/lib/redux/features/favoriteSlice'
import { useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const dispatch = useAppDispatch()

  useEffect(() => {
    const getCartItems = async () => {
      const item = localStorage.getItem('cartItems')
      const cartItems = item ? JSON.parse(item) : []
      dispatch(setcartItems(cartItems))
    }
    getCartItems()
  }, [dispatch])

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch('/api/favorites', {
          method: 'GET',
          credentials: 'include',
        })
        const data = await response.json()
        dispatch(setFavoriteList(data))
      } catch (err) {
        dispatch(setFavoriteList(null))
        console.error(err)
      }
    }
    if (!session?.user) return
    fetchFavorites()
  }, [dispatch, session])
  return (
    <>
      {children}
      <ToastContainer
        position='bottom-left'
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        pauseOnHover
      />
    </>
  )
}
