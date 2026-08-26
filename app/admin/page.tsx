'use client'
import { useSession } from '@/lib/auth/auth-client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const Page = () => {
  const router = useRouter()
  const { isPending } = useSession()

  useEffect(() => {
    if (isPending) return
    router.replace('/admin/dashboard')
  })
  return (
    <div className='flex justify-center'>
      <h1 className='text-4xl font-bold uppercase'>admin control</h1>
    </div>
  )
}

export default Page
