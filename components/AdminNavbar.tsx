'use client'

import { useSession } from '@/lib/auth/auth-client'
import Link from 'next/link'
import { FaUserCircle } from 'react-icons/fa'
import Logo from './Logo'
import { useRef, useState } from 'react'
import UserMenu from './UserMenu'

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
    <div className='shadow-sm bg-gray-200/50 backdrop-blur-2xl py-4 md:px-4 text-black max-w-[100vw] w-full z-50'>
      <UserMenu
        open={userMenuOpen}
        toggleMenu={toggleMenu}
      />

      <nav className='flex items-center md:justify-between gap-0 px-4'>
        <div>
          <Link href='/'>
            <Logo />
          </Link>
        </div>

        <ul className='list-none flex justify-between ml-auto items-center gap-1'>
          {!session?.user && (
            <li className='p-2 hover:shadow-lg rounded-full text-lg'>
              <Link
                href='/sign-in'
                className='cursor-pointer flex items-center gap-1'
              >
                <h1>Sign In</h1>
              </Link>
            </li>
          )}
          {session?.user && (
            <li className='p-2 hover:shadow-lg rounded-full text-lg '>
              <div
                onClick={toggleMenu}
                className='flex gap-2 items-center'
              >
                <FaUserCircle size={24} />

                <h1 className='hidden md:inline-flex font-bold'>{session?.user?.name?.toUpperCase().split(' ')[0]}</h1>
              </div>
            </li>
          )}
        </ul>
      </nav>
    </div>
  )
}

export default AdminNavbar
