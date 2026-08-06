'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import GlobalLoading from '@/components/GlobalLoading'
import { ToastContainer } from 'react-toastify'

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
