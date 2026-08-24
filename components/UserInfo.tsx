import UserDetails from './UserDetails'
import { FullUser, IFullOrder, IOrder, IShippingAddress } from '@/lib/types'
import { useEffect, useState } from 'react'
import { OrdersApi } from '@/lib/modules/orderApiClient'
import { toast } from 'react-toastify'
import { getDate } from '@/lib/utils'
import { AddressApi } from '@/lib/modules/addressApiClient'
import Container from './Container'
import AdressesSlider from './AdressesSlider'
import FavoriteSlide from './FavoriteSlide'
import OrderList from './OrderList'

const UserInfo = ({ user }: { user: FullUser }) => {
  const [orders, setOrders] = useState<IFullOrder[]>([])
  const [defaultAddress, setDefaultAddress] = useState<IShippingAddress | null>(null)

  useEffect(() => {
    const getOrders = async () => {
      const { res, error } = await OrdersApi.getListUser()

      if (res.status || error) toast.error(res.message)
      if (res) {
        setOrders(res.sort((a: IOrder, b: IOrder) => getDate(b).getTime() - getDate(a).getTime()).slice(0, 8))
      }
    }
    const getDefaultAddress = async () => {
      const { res } = await AddressApi.byId(user.defaultAddress.toString() || '')
      if (!res.status) {
        setDefaultAddress(res)
      }
    }
    getOrders()
    if (user.defaultAddress) getDefaultAddress()
  }, [user])

  return (
    <div className='w-full flex flex-col lg:items-center space-y-12'>
      <UserDetails
        user={user}
        totalOrders={orders.length || 0}
        defaultAddress={defaultAddress || null}
      />

      <section className='w-full max-w-[100vw] md:w-[90%] lg:w-[85%] 2xl:w:[75%] mx-auto overflow-x-hidden flex flex-col'>
        <Container header='Adresses'>
          <AdressesSlider />
        </Container>
        <OrderList max={2} />
        <div className='w-full mt-16'>
          <Container
            header='Favorites'
            seeMore='/profile?tab=favorites'
          >
            <FavoriteSlide />
          </Container>
        </div>
      </section>
    </div>
  )
}

export default UserInfo
