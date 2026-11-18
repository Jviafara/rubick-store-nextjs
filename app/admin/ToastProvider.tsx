'use client'

import { useSession } from '@/lib/auth/auth-client'
import { FullUser } from '@/lib/types'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (isPending) return

    if (!session?.user) {
      router.replace('/sign-in')
      return
    }

    if ((session.user as FullUser)?.role !== 'admin') {
      toast.error('You are not authorized to view this page')
      router.replace('/')
      return
    }
  })

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
