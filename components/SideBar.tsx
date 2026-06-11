import menuConfigs from '@/lib/configs/menu.config'
import { ISidebarProps } from '@/lib/types'
import Link from 'next/link'
import { useRef } from 'react'
import { motion } from 'framer-motion'
import Logo from './Logo'

const SideBar = ({ open, toggleSidebar }: ISidebarProps) => {
  const sideNavRef = useRef(null)

  if (!open) return null
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      {/* <!-- Backdrop with Fade-In Blur --> */}
      <div
        className='absolute w-screen h-screen inset-0 z-99 backdrop-blur-xs'
        onClick={toggleSidebar}
      ></div>
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        ref={sideNavRef}
        id='sidebar'
        className='w-75 h-screen p-4 flex flex-col gap-2 fixed inset-0 z-999 bg-transparent  backdrop-blur-lg text-black md:hidden'
      >
        <Logo />
        <ul className='flex flex-col gap-2 ml-4 justify-center  text-primary text-lg'>
          {menuConfigs.main.map((item, index) => (
            <li key={index}>
              <Link
                href={item.path}
                onClick={toggleSidebar}
                className='flex max-w-max items-center gap-2 rounded-lg py-1 px-2 hover:bg-gray-400 hover:scale-105'
              >
                <item.icon size={24} />
                <h6 className='font-medium'>{item.display.toUpperCase()}</h6>
              </Link>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  )
}

export default SideBar
