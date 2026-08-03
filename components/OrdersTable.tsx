import { IOrder } from '@/lib/types'
import OrderNotFound from './OrderNotFound'
import { useParams, useRouter } from 'next/navigation'
import { shippingStatus } from '@/lib/constants'
import { useEffect, useRef, useState } from 'react'
import { useAppDispatch } from '@/lib/hooks/redux.hooks'
import { setGlobalLoading } from '@/lib/redux/features/globalLoadingSlice'
import { OrdersApi } from '@/lib/modules/orderApiClient'
import { toast } from 'react-toastify'
import { userApi } from '@/lib/modules/userApiClient'
import { MdOutlineMoneyOff, MdPaid } from 'react-icons/md'
import { FcShipped } from 'react-icons/fc'
import { FiPackage } from 'react-icons/fi'
import { FaNotdef } from 'react-icons/fa6'
import { ChevronDown } from 'lucide-react'

const OrdersTable = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const params = useParams()
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const [openShippingStatusId, setOpenShippingStatusId] = useState<string | null>(null)
  const [openPaymentStatusId, setOpenPaymentStatusId] = useState<string | null>(null)

  const [orders, setOrders] = useState<IOrder[]>([])

  useEffect(() => {
    const getUser = async () => {
      dispatch(setGlobalLoading(true))
      const { res, error } = await userApi.orders(params.id as string)

      dispatch(setGlobalLoading(false))

      if (error) toast.error(res.message)
      console.log(res)

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenShippingStatusId(null)
        setOpenPaymentStatusId(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleUpdate = async (orderId: string, shippinsStatus?: string, isPaid?: boolean) => {
    dispatch(setGlobalLoading(true))
    const { res, error } = await OrdersApi.update({
      orderId,
      shippingStatus: shippinsStatus,
      isPaid,
    })

    if (res?.status || error) {
      toast.error(res?.message || 'Shipping status update failed.')
    } else {
      if (shippinsStatus !== undefined && isPaid !== undefined) {
        setOrders(prevOrders => prevOrders.map(order => (order._id.toString() === orderId ? ({ ...order, shippingStatus: shippinsStatus, isPaid } as IOrder) : order)))
      } else if (shippinsStatus !== undefined) {
        setOrders(prevOrders => prevOrders.map(order => (order._id.toString() === orderId ? ({ ...order, shippingStatus: shippinsStatus } as IOrder) : order)))
      } else if (isPaid !== undefined) {
        setOrders(prevOrders => prevOrders.map(order => (order._id.toString() === orderId ? ({ ...order, isPaid } as IOrder) : order)))
      }
      toast.success('Shipping status updated successfully!')
    }

    dispatch(setGlobalLoading(false))
    setOpenShippingStatusId(null)
    setOpenPaymentStatusId(null)
  }
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
                  <div
                    className='relative'
                    ref={openShippingStatusId === order._id.toString() ? dropdownRef : undefined}
                  >
                    <button
                      onClick={() => setOpenPaymentStatusId(openPaymentStatusId === order._id.toString() ? null : order._id.toString())}
                      className={`flex items-center gap-2 border  rounded-lg shadow-sm text-wrap px-4 py-2 status-${order.isPaid ? 'paid' : 'unpaid'}`}
                    >
                      {order.isPaid ? <MdPaid size={32} /> : <MdOutlineMoneyOff size={32} />}
                      <ChevronDown className='w-4 h-4' />
                    </button>
                    {openPaymentStatusId === order._id.toString() && (
                      <ul className='absolute left-0 mt-1 bg-white border rounded shadow-md z-50'>
                        <li
                          onClick={() => handleUpdate(order._id.toString(), undefined, true)}
                          className='flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer'
                        >
                          <MdPaid size={32} />
                          <span>Paid</span>
                        </li>
                        <li
                          onClick={() => handleUpdate(order._id.toString(), undefined, false)}
                          className='flex items-center text-nowrap gap-2 p-2 hover:bg-gray-100 cursor-pointer'
                        >
                          <MdOutlineMoneyOff size={32} />
                          <span>Waiting Payment</span>
                        </li>
                      </ul>
                    )}
                  </div>
                </td>
                <td>
                  <div
                    className='relative'
                    ref={openShippingStatusId === order._id.toString() ? dropdownRef : undefined}
                  >
                    <button
                      onClick={() => setOpenShippingStatusId(openShippingStatusId === order._id.toString() ? null : order._id.toString())}
                      className={`flex items-center gap-2 border  rounded-lg shadow-sm text-wrap px-4 py-2 status-${order.shippingStatus}`}
                    >
                      {order.shippingStatus === 'pending' ? <FaNotdef size={32} /> : order.shippingStatus === 'delivered' ? <FiPackage size={32} /> : <FcShipped size={32} />}
                      <ChevronDown className='w-4 h-4' />
                    </button>
                    {openShippingStatusId === order._id.toString() && (
                      <ul className='absolute left-0 mt-1 bg-white border rounded shadow-md z-50'>
                        {Object.values(shippingStatus).map(status => (
                          <li
                            key={status}
                            onClick={() => handleUpdate(order._id.toString(), status)}
                            className='flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer'
                          >
                            {status === 'pending' ? <FaNotdef size={32} /> : status === 'delivered' ? <FiPackage size={32} /> : <FcShipped size={32} />}
                            <span>{status}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
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
