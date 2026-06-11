'use client'

import { useSession } from '@/lib/auth/auth-client'
import Link from 'next/link'
import { AiOutlineSearch } from 'react-icons/ai'
import { FaUserCircle } from 'react-icons/fa'
import { HiShoppingCart } from 'react-icons/hi'
import { TiThMenuOutline } from 'react-icons/ti'
import Logo from './Logo'
import { useRef, useState } from 'react'
import UserMenu from './UserMenu'
import SideBar from './SideBar'
import { useAppSelector } from '@/lib/hooks/redux.hooks'

const Navbar = () => {
  const { data: session } = useSession()

  const { cartItems } = useAppSelector(state => state.cart)

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

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
    <div className='shadow-sm bg-gray-200/70 backdrop-blur-2xl py-4 md:px-4 text-black max-w-[100vw] w-full'>
      <SideBar
        open={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <UserMenu
        open={userMenuOpen}
        toggleMenu={toggleMenu}
      />

      <nav className='flex items-center md:justify-between gap-0 px-4'>
        <div
          onClick={toggleSidebar}
          className='md:hidden p-2 hover:scale-105 hover:shadow-lg rounded-full text-lg'
        >
          <TiThMenuOutline size={24} />
        </div>
        <Link
          href='/products'
          className='hidden md:inline-flex'
        >
          <AiOutlineSearch size={28} />
        </Link>
        <div className=' md:absolute md:top-1/2 md:left-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2'>
          <Link href='/'>
            <Logo />
          </Link>
        </div>

        <ul className='list-none flex justify-between ml-auto items-center gap-1'>
          <li className='py-2 px-1 flex items-center  hover:shadow-lg rounded-full text-lg'>
            <Link
              href='/cart'
              className='flex items-center gap-1'
            >
              <HiShoppingCart size={24} />
              {cartItems?.length > 0 && (
                <span className='bg-red-600 text-white text-xs  font-bold px-1 lg:px-1.5 py-0.5 rounded-full h-full relative -top-2 -left-3  dark:bg-red-600 dark:text-white'>
                  {cartItems.reduce((a, c) => a + c?.quantity || 0, 0)}
                </span>
              )}
            </Link>
          </li>
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

export default Navbar
