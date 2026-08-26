'use client'

import FavoritesGrid from '@/components/FavoritesGrid'
import OrderList from '@/components/OrderList'
import UserProfileSidebar from '@/components/UserProfileSidebar'
import { useSession } from '@/lib/auth/auth-client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'
import CommingSoon from '@/components/CommingSoon'
import UserInfo from '@/components/UserInfo'
import { FullUser } from '@/lib/types'

const ProfilePageContent = () => {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const searchParams = useSearchParams()
  const activeTab = searchParams.get('tab')

  useEffect(() => {
    if (isPending) return
    if (!session?.user) {
      router.replace('/sign-in')
      return
    }
    if (!activeTab) {
      router.replace('/profile?tab=user-info')
      return
    }
  })

  if (!session?.user || isPending) return null

  return (
    <div className='w-screen max-w-[100w] min-h-[calc(100vh-76px)]  flex relative'>
      <UserProfileSidebar />
      <main className='w-full max-w-full px-4 py-8 overflow-hidden flex  justify-center'>
        {activeTab === '' && <UserInfo user={session?.user as FullUser} />}
        {activeTab === 'user-info' && <UserInfo user={session?.user as FullUser} />}
        {activeTab === 'favorites' && <FavoritesGrid />}
        {activeTab === 'orders' && <OrderList />}
        {activeTab === 'reviews' && <CommingSoon />}
      </main>
    </div>
  )
}

const ProfilePage = () => {
  return (
    <Suspense>
      <ProfilePageContent />
    </Suspense>
  )
}
export default ProfilePage
