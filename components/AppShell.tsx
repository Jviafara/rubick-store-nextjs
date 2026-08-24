'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import GlobalLoading from '@/components/GlobalLoading'
import { ToastContainer } from 'react-toastify'
import ScrollUpButton from './ScrollUpButton'
import { useEffect, useState } from 'react'
import { useWindowHeight } from '@/lib/hooks/useWindowHeight'
import Modal from './Modal'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin') ?? false

  const [scrollY, setScrollY] = useState(0)
  const innerHeight = useWindowHeight() || 1080

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (isAdminRoute) {
    return <>{children}</>
  }

  return (
    <>
      <header>
        <Navbar />
      </header>

      <GlobalLoading />

      <main className='relative z-0 max-w-[100vw] overflow-clip flex items-center justify-center'>{children}</main>

      <ToastContainer
        position='bottom-left'
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        pauseOnHover
      />

      <Modal />

      {/* Scroll up button */}
      {scrollY > innerHeight / 2 && <ScrollUpButton />}
    </>
  )
}
