import { IOrder } from '@/lib/types'
import OrderNotFound from './OrderNotFound'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAppDispatch } from '@/lib/hooks/redux.hooks'
import { setGlobalLoading } from '@/lib/redux/features/globalLoadingSlice'
import { toast } from 'react-toastify'
import { userApi } from '@/lib/modules/userApiClient'
import PaymentStatusSelector from './PaymentStatusSelector'
import ShippingStatusSelector from './ShippingStatusSelector'

const OrdersTable = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const params = useParams()

  const [orders, setOrders] = useState<IOrder[]>([])

  useEffect(() => {
    const getUser = async () => {
      dispatch(setGlobalLoading(true))
      const { res, error } = await userApi.orders(params.id as string)

      dispatch(setGlobalLoading(false))

      if (error) toast.error(res.message)

      if (res.status === 404) {
        toast.error('User not found')
        router.replace('/admin/dashboard')
        return
      }

      if (res.status === 400) {
        toast.error(res.message)
        router.replace('/admin/dashboard')
        return
      }

      setOrders(res.orders)
    }

    getUser()
  }, [dispatch, params.id, router])

  return (
    <div>
      {orders.length <= 0 ? (
        <OrderNotFound />
      ) : (
        <table className='w-full border-collapse text-left table-fixed'>
          <thead className='w-full text-center'>
            <tr className='w-full'>
              <th>Id</th>
              <th>Price</th>
              <th>Date</th>
              <th>Payment Status</th>
              <th>Shipping Status</th>
            </tr>
          </thead>
          <tbody className='w-full'>
            {orders?.map((order, index) => (
              <tr
                key={index}
                className='w-full'
              >
                <td className='uppercase font-semibold '>
                  <p className='truncate'>{order._id.toString()}</p>
                </td>
                <td>
                  <p className='font-semibold text-xl'>${order.itemsPrice + order.shippingPrice}</p>
                </td>
                <td>
                  <p className='font-semibold'>{order.createdAt!.toString().slice(0, 10)}</p>
                </td>
                <td>
                  <PaymentStatusSelector
                    order={order}
                    setOrders={setOrders}
                  />
                </td>
                <td>
                  <ShippingStatusSelector
                    order={order}
                    setOrders={setOrders}
                  />
                </td>
                <td className='flex justify-center items-center '>
                  <button
                    type='button'
                    onClick={() => router.push(`/orders/${order._id}`)}
                    className='cursor-pointer px-4 py-2 border border-gray-400 rounded-xl bg-blue-400/60 hover:bg-blue-500'
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
export default OrdersTable
