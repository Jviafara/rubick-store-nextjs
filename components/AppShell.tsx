'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import GlobalLoading from '@/components/GlobalLoading'
import { ToastContainer } from 'react-toastify'
import ScrollUpButton from './ScrollUpButton'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin') ?? false

  if (isAdminRoute) {
    return <>{children}</>
  }

  return (
    <>
      <header>
        <Navbar />
      </header>

      <GlobalLoading />

      <main className='relative z-0'>{children}</main>

      <ToastContainer
        position='bottom-left'
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        pauseOnHover
      />

      {/* Scroll up button */}
      <ScrollUpButton />
    </>
  )
}
