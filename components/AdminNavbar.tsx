'use client'

import Link from 'next/link'
import Logo from './Logo'
import { useSession } from '@/lib/auth/auth-client'
import { useRef, useState } from 'react'
import UserMenu from './UserMenu'
import { FaUserCircle } from 'react-icons/fa'
import ThemeButton from './ThemeButton'

const AdminNavbar = () => {
  const { data: session } = useSession()

  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const clearUserMenuTimeout = () => {
    if (userMenuTimeoutRef.current) {
      clearTimeout(userMenuTimeoutRef.current)
      userMenuTimeoutRef.current = null
    }
  }

  const toggleMenu = () => {
    setUserMenuOpen(prev => {
      const next = !prev

      if (next) {
        clearUserMenuTimeout()
        userMenuTimeoutRef.current = setTimeout(() => {
          setUserMenuOpen(false)
          userMenuTimeoutRef.current = null
        }, 5000)
      } else {
        clearUserMenuTimeout()
      }

      return next
    })
  }
  return (
    <div className=' py-4 md:px-4 text-main max-w-[100vw] w-full h-19 z-50 font-plus-jakarta-sans uppercase'>
      <UserMenu
        open={userMenuOpen}
        toggleMenu={toggleMenu}
      />
      <nav className='relative flex items-center justify-between gap-0 px-4'>
        <div className='flex items-center gap-1'>
          <Link href='/'>
            <Logo />
          </Link>
        </div>
        <div className='flex gap-4 items-center'>
          <ThemeButton />
          {session?.user && (
            <div
              onClick={toggleMenu}
              className='flex gap-2 items-center hover:border border-muted px-4 py-1.5 rounded-2xl hover:bg-surface cursor-pointer'
            >
              <FaUserCircle size={24} />

              <h1 className='hidden md:inline-flex font-bold'>{session?.user?.name?.toUpperCase().split(' ')[0]}</h1>
            </div>
          )}
        </div>
      </nav>
    </div>
  )
}

export default AdminNavbar
