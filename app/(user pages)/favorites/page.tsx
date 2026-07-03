'use client'
import Container from '@/components/Container'
import FavoritesGrid from '@/components/FavoritesGrid'
import { useSession } from '@/lib/auth/auth-client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const Favorites = () => {
  const router = useRouter()
  const { data: session } = useSession()
  useEffect(() => {
    if (!session?.user) router.push('/sign-in')
  })
  return (
    <div className='w-full flex flex-col items-center'>
      <Container header={'favorites'}>
        <FavoritesGrid />
      </Container>
    </div>
  )
}

export default Favorites
