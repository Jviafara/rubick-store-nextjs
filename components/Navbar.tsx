'use client'

import Link from 'next/link'
import { TiThMenuOutline } from 'react-icons/ti'
import Logo from './Logo'
import SideBar from './SideBar'
import MiddleNav from './MiddleNav'
import { useState } from 'react'
import RightNav from './RightNav'

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className=' py-4 md:px-4 text-main max-w-[100vw] w-full z-50 font-plus-jakarta-sans uppercase'>
      <SideBar
        open={sidebarOpen}
        toggleSidebar={toggleSidebar}
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

        <MiddleNav />

        <RightNav />
      </nav>
    </div>
  )
}

export default Navbar
