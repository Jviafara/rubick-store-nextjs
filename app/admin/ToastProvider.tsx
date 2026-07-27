'use client'

import { useSession } from '@/lib/auth/auth-client'
import { useAppDispatch } from '@/lib/hooks/redux.hooks'
import { setShippingAddress } from '@/lib/redux/features/cartSlice'
import { setFavoriteList } from '@/lib/redux/features/favoriteSlice'
import { UserWithRole } from '@/lib/types'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession()
  const dispatch = useAppDispatch()
  const router = useRouter()

  useEffect(() => {
    if (isPending) return

    if (!session?.user) {
      router.replace('/sign-in')
      return
    }

    if ((session.user as UserWithRole)?.role !== 'admin') {
      router.replace('/')
    }
  })

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

  useEffect(() => {
    const getShippingAddress = async () => {
      const shippingAddress = JSON.parse(localStorage.getItem('shippingAddress') || '{}')
      dispatch(setShippingAddress(shippingAddress))
    }
    getShippingAddress()
  }, [dispatch])
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
