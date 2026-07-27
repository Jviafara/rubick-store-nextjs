'use client'

import AdminSideBar from '@/components/AdminSideBar'
import { useState } from 'react'
import { motion } from 'framer-motion'
import UserList from '@/components/UserList'

const DashBoard = () => {
  const [mainView, setMainView] = useState<string>('users')

  const setView = (state: string) => {
    setMainView(state)
  }

  return (
    <div className='grow max-w-screen w-full h-[calc(100vh-75px)] grid grid-cols-5 xl:grid-cols-6'>
      <AdminSideBar
        mainView={mainView}
        setView={setView}
      />
      <main className='w-full h-full col-span-4 xl:col-span-5 p-8'>
        {mainView === 'users' ? (
          <UserList />
        ) : (
          <motion.h1
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className='bg-red-500 h-full'
          >
            Hola {mainView}
          </motion.h1>
        )}
      </main>
    </div>
  )
}

export default DashBoard
