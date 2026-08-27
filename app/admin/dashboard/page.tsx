'use client'

import AdminSideBar from '@/components/AdminSideBar'
import { Suspense, useEffect } from 'react'
import UserList from '@/components/UserList'
import { useRouter, useSearchParams } from 'next/navigation'

const DashBoardContent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeTab = searchParams.get('tab')

  useEffect(() => {
    if (!activeTab) {
      router.push('?tab=users')
      return
    }
  })

  return (
    <div className='w-screen max-w-[100w] min-h-[calc(100vh-76px)] flex relative overflow-clip'>
      <AdminSideBar />
      <main className='w-full h-full px-4 py-8 overflow-x-clip flex  justify-center8'>
        {activeTab === 'users' && <UserList />}
      </main>
    </div>
  )
}

const DashBoard = () => {
  return (
    <Suspense fallback={null}>
      <DashBoardContent />
    </Suspense>
  )
}

export default DashBoard
