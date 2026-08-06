import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans, Seaweed_Script } from 'next/font/google'
import './globals.css'
import StoreProvider from './StoreProvider'
import ToastProvider from './ToastProvider'
import AppShell from '@/components/AppShell'
import ThemeProvider from './ThemeProvider'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

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
      className={`${inter.variable} ${plusJakartaSans.variable} ${seaweedScript.variable} h-full antialiased `}
    >
      <body className='min-h-screen bg-polygon-responsive '>
        <StoreProvider>
          <ThemeProvider />
          <ToastProvider>
            <AppShell>{children}</AppShell>
          </ToastProvider>
        </StoreProvider>
      </body>
    </html>
  )
}
