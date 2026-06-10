import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import StoreProvider from './StoreProvider'
import { ToastContainer } from 'react-toastify'
import ToastProvider from './ToastProvider'
import Navbar from '@/components/Navbar'
import GlobalLoading from '@/components/GlobalLoading'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Rubick Store',
  description:
    'Rubick Store is a e-commerce platform built with Next.js, TypeScript, and Tailwind CSS. It offers a seamless shopping experience with a modern design and robust features. Developed by Jesús Viafara',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang='en'
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className='min-h-full flex flex-col'>
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
              className='w-screen h-full fixed bg-top-left bg-cover z-[-999]'
            />
            {/* Header */}
            <header>
              <Navbar />
            </header>

            {/* global loading */}
            <GlobalLoading />
            {/* global loading */}
            {children}
          </ToastProvider>
        </StoreProvider>
      </body>
    </html>
  )
}
