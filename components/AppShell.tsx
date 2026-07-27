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
      <div
        style={{
          backgroundImage: 'url(/assets/background.jpg)',
        }}
        className='w-screen h-full fixed bg-top-left bg-cover z-[-999]'
      />

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
