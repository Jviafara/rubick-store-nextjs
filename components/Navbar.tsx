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
import ThemeButton from './ThemeButton'
import { usePathname } from 'next/navigation'

const Navbar = () => {
  const { data: session } = useSession()
  const pathname = usePathname()
  console.log(pathname)
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
    <div className=' py-4 md:px-4 text-main max-w-[100vw] w-full z-50 font-plus-jakarta-sans uppercase'>
      <SideBar
        open={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <UserMenu
        open={userMenuOpen}
        toggleMenu={toggleMenu}
      />

      <nav className='relative flex items-center justify-between gap-0 px-4'>
        <div className='flex items-center gap-1'>
          <Link href='/'>
            <Logo />
          </Link>
          <div
            onClick={toggleSidebar}
            className='md:hidden p-2 hover:scale-105 hover:shadow-lg rounded-full text-lg'
          >
            <TiThMenuOutline size={24} />
          </div>
        </div>

        <div className='hidden md:inline-flex items-center space-x-4 absolute top-0 left-1/2 -translate-x-1/2 border-3 border-surface/70 py-0.5 px-1 rounded-full'>
          <ul className='flex items-center space-x-4'>
            <li className={`${pathname.includes('products') && 'bg-surface/90'} center-nav-li`}>
              <Link href='/products'>Cubes</Link>
            </li>
            <li className={`${pathname.includes('tutorials') && 'bg-surface/90'} center-nav-li`}>
              <Link href='/tutorials'>Tutorials</Link>
            </li>
            <li className={`${pathname.includes('timer') && 'bg-surface/90'} center-nav-li`}>
              <Link href='/timer'>Timer</Link>
            </li>
          </ul>
          <button className='cursor-pointer mr-2'>
            <AiOutlineSearch size={28} />
          </button>
        </div>

        <ul className='list-none flex justify-between items-center gap-1 font-semibold'>
          <li className='py-2 px-1 flex items-center  hover:shadow-lg rounded-full text-lg'>
            <ThemeButton />
          </li>

          <li className='py-2 px-1 flex items-center  hover:shadow-lg rounded-full text-lg'>
            <Link
              href='/cart'
              className='flex items-center gap-1'
            >
              <HiShoppingCart size={24} />
              {cartItems?.length > 0 && (
                <span className='  text-xs  font-bold px-1 lg:px-1.5 py-0.5 rounded-full h-full relative -top-2 -left-3  bg-red-600 text-white'>
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
