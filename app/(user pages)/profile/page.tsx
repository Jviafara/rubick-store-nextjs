'use client'

import CommingSoon from '@/components/CommingSoon'
import Container from '@/components/Container'
import FavoriteSlide from '@/components/FavoriteSlide'
import OrderList from '@/components/OrderList'
import { useSession } from '@/lib/auth/auth-client'

const ProfilePage = () => {
  const { data: session } = useSession()
  return (
    <div className='w-full flex flex-col items-center'>
      <Container>
        <h1 className='text-3xl  font-bold -my-10'>Welcome! {session?.user.name?.split(' ')[0].toLocaleUpperCase()} </h1>
      </Container>
      <Container
        header={'favorites'}
        seeMore={'/favorites'}
      >
        <FavoriteSlide />
      </Container>
      <Container header={'Reviews'}>
        <CommingSoon />
      </Container>

      <OrderList max={4} />
      {/* <UpdateForm /> */}
    </div>
  )
}

export default ProfilePage
