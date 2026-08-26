import type { Metadata } from 'next'
import '@/app/globals.css'
import StoreProvider from './StoreProvider'
import { ToastContainer } from 'react-toastify'
import ToastProvider from './ToastProvider'
import GlobalLoading from '@/components/GlobalLoading'
import AdminNavbar from '@/components/AdminNavbar'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import ThemeProvider from '../ThemeProvider'
import Modal from '@/components/Modal'
import ScrollUpButton from '@/components/ScrollUpButton'

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description:
    'Rubick Store is a e-commerce platform built with Next.js, TypeScript, and Tailwind CSS. It offers a seamless shopping experience with a modern design and robust features. Developed by Jesús Viafara',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StoreProvider>
        <ThemeProvider />
        <ToastProvider>
          <ToastContainer
            position='bottom-left'
            autoClose={1000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            pauseOnFocusLoss
            pauseOnHover
          />
          <header>
            <AdminNavbar />
          </header>
          <GlobalLoading />
          <main className='relative z-0 max-w-[100vw] overflow-clip flex items-center justify-center'>{children}</main>
          <Modal />
          {/* Scroll up button */}
          <ScrollUpButton />
        </ToastProvider>
      </StoreProvider>
    </>
  )
}
