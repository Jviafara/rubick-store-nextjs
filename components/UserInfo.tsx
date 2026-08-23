import UserDetails from './UserDetails'
import { FullUser, IFullOrder, IOrder, IShippingAddress } from '@/lib/types'
import { useEffect, useState } from 'react'
import { OrdersApi } from '@/lib/modules/orderApiClient'
import { toast } from 'react-toastify'
import { getDate } from '@/lib/utils'
import { AddressApi } from '@/lib/modules/addressApiClient'

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
      const { res, error } = await AddressApi.byId(user.defaultAddress.toString())

      if (res.status || error) toast.error(res.message)
      if (res) {
        setDefaultAddress(res)
      }
    }
    getOrders()
    if (user.defaultAddress) getDefaultAddress()
  }, [user])

  return (
    <div className='w-full flex flex-col lg:items-center'>
      <UserDetails
        user={user}
        totalOrders={orders.length || 0}
        defaultAddress={defaultAddress || null}
      />
    </div>
  )
}

export default UserInfo
