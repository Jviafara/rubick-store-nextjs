'use client'
import { useEffect, useRef, useState } from 'react'
// import LogoSpinner from './LogoSpinner'
import { useAppSelector } from '@/lib/hooks/redux.hooks'
import { usePathname } from 'next/navigation'
import Logo from './Logo'

const GlobalLoading = () => {
  const { globalLoading } = useAppSelector(state => state.globalLoading)
  const pathname = usePathname()

  const [routeLoading, setRouteLoading] = useState(false)
  const previousPathname = useRef(pathname)

  useEffect(() => {
    const firstLoading = () => {
      setRouteLoading(true)

      const timeout = window.setTimeout(() => {
        setRouteLoading(false)
      }, 500)

      return () => {
        window.clearTimeout(timeout)
      }
    }
    if (pathname !== '/sign-up' && pathname !== '/sign-in') firstLoading()
  }, [pathname])

  useEffect(() => {
    if (previousPathname.current === pathname || pathname === '/sign-up' || pathname === '/sign-in') return

    previousPathname.current = pathname
    setRouteLoading(true)

    const timeout = window.setTimeout(() => {
      setRouteLoading(false)
    }, 500)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [pathname])

  const isLoading = globalLoading || routeLoading

  if (!isLoading) return null

  return (
    <div className='fixed inset-0 z-9999 backdrop-blur-lg'>
      <div className='flex flex-col items-center gap-4 absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%]'>
        <div
          aria-label='Loading...'
          role='status'
        >
          <svg
            className='h-16 w-16 animate-spin stroke-blue-500'
            viewBox='0 0 256 256'
          >
            <line
              x1='128'
              y1='32'
              x2='128'
              y2='64'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='24'
            ></line>
            <line
              x1='195.9'
              y1='60.1'
              x2='173.3'
              y2='82.7'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='24'
            ></line>
            <line
              x1='224'
              y1='128'
              x2='192'
              y2='128'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='24'
            ></line>
            <line
              x1='195.9'
              y1='195.9'
              x2='173.3'
              y2='173.3'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='24'
            ></line>
            <line
              x1='128'
              y1='224'
              x2='128'
              y2='192'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='24'
            ></line>
            <line
              x1='60.1'
              y1='195.9'
              x2='82.7'
              y2='173.3'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='24'
            ></line>
            <line
              x1='32'
              y1='128'
              x2='64'
              y2='128'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='24'
            ></line>
            <line
              x1='60.1'
              y1='60.1'
              x2='82.7'
              y2='82.7'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='24'
            ></line>
          </svg>
        </div>
        <Logo />
      </div>
    </div>
  )
}

export default GlobalLoading
