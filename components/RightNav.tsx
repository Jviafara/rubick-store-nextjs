import React, { useRef, useState } from 'react'
import ThemeButton from './ThemeButton'
import Link from 'next/link'
import { HiShoppingCart } from 'react-icons/hi'
import UserMenu from './UserMenu'
import { useSession } from '@/lib/auth/auth-client'
import { useAppSelector } from '@/lib/hooks/redux.hooks'
import { FaUserCircle } from 'react-icons/fa'

const RightNav = () => {
  const { data: session } = useSession()
  const { cartItems } = useAppSelector(state => state.cart)

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
    <section>
      <UserMenu
        open={userMenuOpen}
        toggleMenu={toggleMenu}
      />
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
    </section>
  )
}

export default RightNav
