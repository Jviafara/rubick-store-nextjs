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

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description:
    'Rubick Store is a e-commerce platform built with Next.js, TypeScript, and Tailwind CSS. It offers a seamless shopping experience with a modern design and robust features. Developed by Jesús Viafara',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className='flex flex-col max-w-screen h-screen overflow-hidden'>
      <StoreProvider>
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
          <div
            style={{
              backgroundImage: 'url(/assets/background.jpg)',
            }}
            className='w-screen h-screen fixed bg-top-left bg-cover z-[-999]'
          />

          <header className='shrink-0'>
            <AdminNavbar />
          </header>

          <GlobalLoading />

          <div className='flex-1 h-[calc(100vh-50px)]'>{children}</div>
        </ToastProvider>
      </StoreProvider>
    </section>
  )
}
