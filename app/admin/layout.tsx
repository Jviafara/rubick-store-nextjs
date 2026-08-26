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
import { Inter, Plus_Jakarta_Sans, Seaweed_Script } from 'next/font/google'
import ThemeProvider from '../ThemeProvider'
import Modal from '@/components/Modal'
import ScrollUpButton from '@/components/ScrollUpButton'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta-sans',
  subsets: ['latin'],
})

const seaweedScript = Seaweed_Script({
  variable: '--font-seaweed-script',
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description:
    'Rubick Store is a e-commerce platform built with Next.js, TypeScript, and Tailwind CSS. It offers a seamless shopping experience with a modern design and robust features. Developed by Jesús Viafara',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className={`${inter.variable} ${plusJakartaSans.variable} ${seaweedScript.variable} h-full antialiased `}>
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
          <main className='flex-1 h-[calc(100vh-50px)]'>{children}</main>
          <Modal />
          {/* Scroll up button */}
          <ScrollUpButton />
        </ToastProvider>
      </StoreProvider>
    </section>
  )
}
